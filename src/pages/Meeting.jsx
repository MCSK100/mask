import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { useMediaDevices } from "../hooks/useMediaDevices"
import { useLiveKitRoom } from "../hooks/useLiveKitRoom"
import { roomsApi, meetingsApi } from "../services/api"
import { getHostToken, getParticipantId } from "../utils/identity"
import { FEATURES } from "../config/featureFlags"
import { extractYouTubeId } from "../utils/youtube"
import { TOPICS, decodeData, sanitizeMessage, getLivekitUrl, friendlyMediaError } from "../lib/livekit"
import {
  chatMessage, reactionMessage, handMessage, whiteboardOp,
  pollCreated, pollVote as pollVoteMsg, youtubeState, hostCommand, REACTIONS
} from "../lib/realtime"
import { TopBar, formatTimer } from "../components/meet/TopBar"
import { BottomBar } from "../components/meet/BottomBar"
import { ChatPanel } from "../components/meet/ChatPanel"
import { ParticipantsPanel } from "../components/meet/ParticipantsPanel"
import { InviteDialog } from "../components/meet/InviteDialog"
import { Whiteboard } from "../components/meet/Whiteboard"
import { YouTubePanel } from "../components/meet/YouTubePanel"
import { PollsPanel } from "../components/meet/PollsPanel"
import { MusicPanel } from "../components/meet/MusicPanel"
import { ParticipantTile } from "../components/livekit/ParticipantTile"
import { ParticipantGrid } from "../components/livekit/ParticipantGrid"
import { WannaShell, WannaBadge } from "../components/wanna/WannaChrome"
import {
  Mic, MicOff, Video as VideoIcon, VideoOff, LogIn, Lock, Users, UserPlus, Hand, ShieldCheck, PhoneOff, X,
  MonitorUp, RotateCcw, BarChart3, MessageSquare, CircleHelp, Send, ChevronRight,
  ClipboardList, HandMetal, Music as MusicIcon
} from "lucide-react"

const REACTION_GLYPH = {
  "thumbs-up": "👍", heart: "❤️", laugh: "😂", clap: "👏", party: "🎉", hand: "✋",
}

export default function Meeting() {
  const { roomId } = useParams()
  const code = (roomId || "").toUpperCase()
  const [qp] = useSearchParams()
  const navigate = useNavigate()

  const [lobby, setLobby] = useState(true)
  const [name, setName] = useState(() => qp.get("name") || (() => { try { return sessionStorage.getItem("sm_name") || "" } catch { return "" } }))
  const [password, setPassword] = useState(() => qp.get("pwd") || "")
  const [meta, setMeta] = useState(null)
  const [metaErr, setMetaErr] = useState(null)
  const hostToken = useMemo(() => getHostToken(code), [code])

  // Pre-join preview only — real camera, not a placeholder. LiveKit owns devices in-room.
  const media = useMediaDevices()
  const previewRef = useRef(null)
  useEffect(() => { if (previewRef.current && media.stream) previewRef.current.srcObject = media.stream }, [media.stream, lobby])

  // Meeting metadata (new API first, legacy fallback for title display)
  useEffect(() => {
    let alive = true
    meetingsApi.get(code)
      .then((d) => { if (alive) { setMeta({ title: d.meeting?.title, hasPassword: d.meeting?.hasPassword }) } })
      .catch(() => {
        roomsApi.get(code)
          .then((d) => { if (alive) setMeta(d.room) })
          .catch((e) => { if (alive) setMetaErr(e.message) })
      })
    return () => { alive = false }
  }, [code])

  // start preview early
  useEffect(() => {
    media.start().catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // media-server health snapshot so misconfiguration shows in the lobby
  // before the user tries to join (token/signal failures are env issues).
  useEffect(() => {
    let alive = true
    meetingsApi.livekitHealth()
      .then((d) => { if (alive) setMediaHealth(d) })
      .catch(() => { if (alive) setMediaHealth({ configured: false, unreachable: true }) })
    return () => { alive = false }
  }, [])

  // ---------- LiveKit session state ----------
  const [joined, setJoined] = useState(false)
  const [joining, setJoining] = useState(false)
  const [waiting, setWaiting] = useState(false)
  const [creds, setCreds] = useState(null) // { token, serverUrl, roomId, role, participantId }
  const [mediaHealth, setMediaHealth] = useState(null) // /api/livekit/health snapshot
  const [role, setRole] = useState("participant")
  const [joinErr, setJoinErr] = useState(null)

  const [panel, setPanel] = useState(null) // chat|people|board|tube|polls|music (mobile drawer)
  const [activeTab, setActiveTab] = useState("board")
  const [rightTab, setRightTab] = useState("chat")
  const [invite, setInvite] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [showReactions, setShowReactions] = useState(false)
  const [recording, setRecording] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [toast, setToast] = useState(null)
  const [classroomMode, setClassroomMode] = useState(true)
  const [locked, setLocked] = useState(false)
  const [whiteboardEnabled, setWhiteboardEnabled] = useState(true)
  const [allowUnmute, setAllowUnmute] = useState(true)
  const [allowVideo, setAllowVideo] = useState(true)
  const [ended, setEnded] = useState(null)
  const [waitingList, setWaitingList] = useState([])

  const [chat, setChat] = useState([])
  const [system, setSystem] = useState([])
  const [poll, setPoll] = useState(null)
  const [youtube, setYoutube] = useState({ videoId: null, playing: false, time: 0, updatedAt: Date.now() })
  const [music, setMusic] = useState({ track: null, playing: false, position: 0, updatedAt: Date.now() })
  const [hands, setHands] = useState({}) // identity -> { name, raised }
  const [handRaised, setHandRaised] = useState(false)
  const [reactions, setReactions] = useState([])

  const recRef = useRef(null)
  const recChunks = useRef([])
  const credsRef = useRef(null)
  const lkRef = useRef(null)
  const wbSeq = useRef(0)
  const [wbOps, setWbOps] = useState([])

  // All mounted whiteboard canvases stay in sync (desktop + mobile drawer)
  // via the wbOps state array — each instance applies new ops as they arrive.
  const applyWbRemote = useCallback((msg) => {
    const seq = wbSeq.current++
    setWbOps((prev) => [...prev.slice(-499), { ...msg, _seq: seq }])
  }, [])
  const roleRef = useRef("participant")
  roleRef.current = role

  const pushSystem = useCallback((text) => {
    setSystem((prev) => [...prev.slice(-99), { text, ts: Date.now() }])
  }, [])

  const flashReaction = useCallback((r) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    setReactions((prev) => [...prev.slice(-11), { ...r, id }])
    setTimeout(() => setReactions((prev) => prev.filter((x) => x.id !== id)), 2600)
  }, [])

  // ---------- LiveKit data handler ----------
  const handleData = useCallback(({ payload, participant, topic }) => {
    const msg = decodeData(payload)
    if (!msg || typeof msg !== "object") return
    const senderId = participant?.identity || msg.senderId || "unknown"
    let senderRole = "participant"
    try {
      const md = participant?.metadata ? JSON.parse(participant.metadata) : null
      if (md?.role) senderRole = md.role
    } catch {}
    const senderIsHost = senderRole === "host" || senderRole === "cohost"
    const senderName = msg.senderName || senderId

    switch (topic) {
      case TOPICS.CHAT: {
        if (msg.type !== "chat") return
        const clean = sanitizeMessage(msg.message, 1000)
        if (!clean) return
        setChat((prev) => [...prev.slice(-199), {
          id: `${msg.timestamp || Date.now()}-${senderId}`,
          name: String(msg.senderName || senderName).slice(0, 40),
          text: clean,
          from: senderId,
          isHost: senderIsHost,
        }])
        break
      }
      case TOPICS.REACTION: {
        if (msg.type !== "reaction" || !REACTIONS.includes(msg.kind)) return
        flashReaction({ kind: msg.kind, name: senderName })
        break
      }
      case TOPICS.HAND: {
        if (msg.type !== "raise-hand") return
        setHands((prev) => ({ ...prev, [senderId]: { name: senderName, raised: Boolean(msg.raised) } }))
        break
      }
      case TOPICS.POLL: {
        if (msg.type === "poll-created") {
          if (!senderIsHost) return
          setPoll({ pollId: msg.pollId, question: msg.question, options: msg.options, votes: {}, open: true })
          pushSystem(`${senderName} started a poll.`)
        } else if (msg.type === "poll-vote") {
          setPoll((prev) => {
            if (!prev || !prev.open || msg.pollId !== prev.pollId) return prev
            return { ...prev, votes: { ...prev.votes, [senderId]: msg.optionId } }
          })
        } else if (msg.type === "poll-close") {
          if (!senderIsHost) return
          setPoll((prev) => (prev && msg.pollId === prev.pollId ? { ...prev, open: false } : prev))
        }
        break
      }
      case TOPICS.WHITEBOARD: {
        if (!whiteboardEnabled && !senderIsHost) return
        applyWbRemote(msg)
        break
      }
      case TOPICS.YOUTUBE: {
        if (msg.type !== "youtube" || !senderIsHost) return
        setYoutube({ videoId: msg.videoId, playing: msg.playing, time: msg.position, updatedAt: msg.timestamp || Date.now() })
        break
      }
      case TOPICS.MUSIC: {
        if (msg.type !== "music" || !senderIsHost) return
        setMusic({ track: msg.track, playing: msg.playing, position: msg.position || 0, updatedAt: msg.timestamp || Date.now() })
        break
      }
      case TOPICS.CLASSROOM: {
        if (msg.type !== "classroom" || !senderIsHost) return
        setClassroomMode(Boolean(msg.classroomMode))
        break
      }
      case TOPICS.HOST: {
        if (msg.type !== "host" || !senderIsHost) return
        const localId = credsRef.current?.participantId
        if (msg.action === "mute" && msg.targetId === localId) {
          lkRef.current?.setMicrophoneEnabled(false).catch(() => {})
          pushSystem("Host muted you.")
        } else if (msg.action === "mute-all" && roleRef.current === "participant") {
          lkRef.current?.setMicrophoneEnabled(false).catch(() => {})
          pushSystem("Host muted everyone.")
        } else if (msg.action === "remove" && msg.targetId === localId) {
          setEnded("You were removed by the host.")
          lkRef.current?.disconnect().catch(() => {})
        } else if (msg.action === "lock") {
          setLocked(Boolean(msg.value))
        } else if (msg.action === "whiteboard") {
          setWhiteboardEnabled(Boolean(msg.value))
        } else if (msg.action === "allow-media") {
          if (typeof msg.value?.allowUnmute === "boolean") setAllowUnmute(msg.value.allowUnmute)
          if (typeof msg.value?.allowVideo === "boolean") setAllowVideo(msg.value.allowVideo)
        } else if (msg.action === "classroom") {
          setClassroomMode(Boolean(msg.value))
        } else if (msg.action === "cohost" && msg.targetId === localId) {
          setRole("cohost")
          pushSystem("You are now a co-host.")
        } else if (msg.action === "lower-hand" && msg.targetId === localId) {
          setHandRaised(false)
        } else if (msg.action === "end") {
          setEnded("Meeting has ended.")
          lkRef.current?.disconnect().catch(() => {})
        }
        if (msg.action === "lower-hand" && msg.targetId) {
          setHands((prev) => ({ ...prev, [msg.targetId]: { name: prev[msg.targetId]?.name || "Guest", raised: false } }))
        }
        break
      }
      default:
        break
    }
  }, [whiteboardEnabled, pushSystem, flashReaction, applyWbRemote])

  const lk = useLiveKitRoom({
    serverUrl: creds?.serverUrl || null,
    token: creds?.token || null,
    audio: !media.muted,
    video: !media.cameraOff,
    onData: handleData,
  })
  credsRef.current = creds
  lkRef.current = lk

  const isHost = role === "host" || role === "cohost"

  useEffect(() => {
    if (!joined) return
    const t = setInterval(() => setElapsed((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [joined])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(t)
  }, [toast])

  // Host polls the backend waiting room
  useEffect(() => {
    if (!joined || role !== "host") return
    let alive = true
    const tick = async () => {
      try {
        const d = await meetingsApi.waiting(code, hostToken)
        if (alive) setWaitingList(d.waiting || [])
      } catch {}
    }
    tick()
    const t = setInterval(tick, 5000)
    return () => { alive = false; clearInterval(t) }
  }, [joined, role, code, hostToken])

  // ---------- join ----------
  const doJoin = async () => {
    if (!name.trim()) { setToast("Enter your display name."); return }
    if (!getLivekitUrl()) {
      setToast("VITE_LIVEKIT_URL is not set. Media server is not configured.")
      return
    }
    try { sessionStorage.setItem("sm_name", name.trim()) } catch {}
    setJoining(true)
    setJoinErr(null)
    try {
      let data
      try {
        data = await meetingsApi.join({
          code, name: name.trim(), password: password || "",
          hostToken: hostToken || null, participantId: getParticipantId(),
        })
      } catch (e) {
        if (e?.status === 404) {
          // Legacy link from the retired mesh system — cannot join via LiveKit.
          try { await roomsApi.get(code) } catch {}
          throw new Error("This link uses the retired meeting system. Ask the host for a new link.")
        }
        throw e
      }
      if (data.status === "waiting") {
        setWaiting(true)
        setJoinErr(null)
        return
      }
      setCreds({ token: data.token, serverUrl: data.serverUrl, roomId: data.roomId, role: data.role || "participant", participantId: data.participantId })
      setRole(data.role || "participant")
      if (data.settings) {
        setWhiteboardEnabled(data.settings.whiteboardEnabled !== false)
        setAllowUnmute(data.settings.allowUnmute !== false)
        setAllowVideo(data.settings.allowVideo !== false)
        if (typeof data.settings.classroomMode === "boolean") setClassroomMode(data.settings.classroomMode)
      }
      try { media.stop() } catch {}
      setWaiting(false)
      setLobby(false)
      setJoined(true)
      pushSystem(`${name.trim()} joined.`)
    } catch (e) {
      if (e?.code === "LIVEKIT_NOT_CONFIGURED" || e?.status === 503) {
        setJoinErr("Media server is not configured yet. Ask the host to set LIVEKIT_URL, LIVEKIT_API_KEY and LIVEKIT_API_SECRET on the backend.")
      } else {
        setJoinErr(e.message)
      }
    } finally { setJoining(false) }
  }

  const doLeave = async () => {
    try { await lkRef.current?.disconnect() } catch {}
    try { recRef.current?.stop() } catch {}
    try { media.stop() } catch {}
    navigate("/")
  }

  // ---------- media controls (LiveKit) ----------
  const toggleMute = async () => {
    if (lk.micEnabled && !allowUnmute && !isHost) { setToast("Host has disabled microphones."); return }
    try { await lk.setMicrophoneEnabled(!lk.micEnabled) } catch { setToast("Microphone unavailable.") }
  }
  const toggleCamera = async () => {
    if (lk.cameraEnabled && !allowVideo && !isHost) { setToast("Host has disabled cameras."); return }
    if (!lk.cameraEnabled && !allowVideo && !isHost) { setToast("Host has disabled cameras."); return }
    try { await lk.setCameraEnabled(!lk.cameraEnabled) } catch { setToast("Camera unavailable.") }
  }
  const toggleShare = async () => {
    try {
      await lk.setScreenShareEnabled(!lk.screenShareEnabled)
    } catch {
      setToast("Screen share was cancelled or is unsupported.")
    }
  }

  // Local recording (MVP). Architecture is Egress-ready: swap for LiveKit
  // Egress MP4/WebM later without touching the meeting system.
  const toggleRecord = () => {
    if (recording) {
      try { recRef.current?.stop() } catch {}
      setRecording(false)
      return
    }
    if (!FEATURES.RECORDING) { setToast("Recording is disabled by feature flag."); return }
    const track = lk.room?.localParticipant?.getTrackPublications?.()
    const vt = track ? [...track.values()].find((t) => t.videoTrack) : null
    const msTrack = vt?.videoTrack?.mediaStreamTrack
    if (!msTrack || !window.MediaRecorder) { setToast("Recording is not available (no local camera track)."); return }
    try {
      const stream = new MediaStream([msTrack])
      const rec = new MediaRecorder(stream, { mimeType: MediaRecorder.isTypeSupported("video/webm") ? "video/webm" : undefined })
      recChunks.current = []
      rec.ondataavailable = (e) => { if (e.data.size) recChunks.current.push(e.data) }
      rec.onstop = () => {
        const blob = new Blob(recChunks.current, { type: "video/webm" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url; a.download = `shadowmeet-${code}-local.webm`; a.click()
        setTimeout(() => URL.revokeObjectURL(url), 5000)
        setToast("Recording saved locally.")
      }
      rec.start()
      recRef.current = rec
      setRecording(true)
      setToast("Recording… saves to your device when stopped.")
    } catch { setToast("Could not start recording.") }
  }

  // ---------- realtime actions (LiveKit data) ----------
  const sendData = useCallback(async (obj, topic, reliable = true) => {
    try {
      await lkRef.current?.publishData(obj, { topic, reliable })
    } catch {
      setToast("Sending too fast. Slow down.")
    }
  }, [])

  const onChatSend = (text) => {
    const t = String(text || "")
    if (t === "/help") { setToast("/play <youtube-url> · /music · /polls · /youtube"); return }
    if (t.startsWith("/play ")) {
      const id = extractYouTubeId(t.slice(6))
      if (!id) { setToast("Invalid YouTube URL."); return }
      if (!isHost) { setToast("Only host can start playback."); return }
      ytSet(id)
      setActiveTab("docs"); setPanel("tube")
      return
    }
    if (t === "/music" || t === "/polls" || t === "/youtube") {
      setActiveTab(t === "/polls" ? "polls" : "docs")
      setPanel(t === "/polls" ? "polls" : "tube")
      return
    }
    const msg = chatMessage({ senderId: credsRef.current?.participantId, senderName: name.trim(), message: t })
    if (!msg) return
    setChat((prev) => [...prev.slice(-199), { id: `${msg.timestamp}-local`, name: name.trim(), text: msg.message, from: msg.senderId, isHost }])
    sendData(msg, TOPICS.CHAT)
  }

  const sendWbOp = (op) => {
    const valid = whiteboardOp(op)
    if (!valid) return
    if (!whiteboardEnabled && !isHost) { setToast("Drawing is disabled by the host."); return }
    sendData({ type: "whiteboard", ...valid }, TOPICS.WHITEBOARD)
  }

  const ytSet = (videoId) => {
    if (!isHost) { setToast("Only host can start playback."); return }
    const st = { videoId, playing: true, position: 0 }
    setYoutube({ ...st, updatedAt: Date.now() })
    sendData(youtubeState(st), TOPICS.YOUTUBE)
  }
  const ytPlay = (time) => {
    if (!isHost) return
    setYoutube((y) => ({ ...y, playing: true, time, updatedAt: Date.now() }))
    sendData(youtubeState({ videoId: youtube.videoId, playing: true, position: time }), TOPICS.YOUTUBE)
  }
  const ytPause = (time) => {
    if (!isHost) return
    setYoutube((y) => ({ ...y, playing: false, time, updatedAt: Date.now() }))
    sendData(youtubeState({ videoId: youtube.videoId, playing: false, position: time }), TOPICS.YOUTUBE)
  }
  const ytSeek = (time) => {
    if (!isHost) return
    setYoutube((y) => ({ ...y, time, updatedAt: Date.now() }))
    sendData(youtubeState({ videoId: youtube.videoId, playing: youtube.playing, position: time }), TOPICS.YOUTUBE)
  }

  const musicSet = (track) => {
    if (!isHost) return
    setMusic({ track, playing: true, position: 0, updatedAt: Date.now() })
    sendData({ type: "music", track, playing: true, position: 0, timestamp: Date.now() }, TOPICS.MUSIC)
  }
  const musicPlay = (position) => {
    if (!isHost) return
    setMusic((m) => ({ ...m, playing: true, position, updatedAt: Date.now() }))
    sendData({ type: "music", track: music.track, playing: true, position, timestamp: Date.now() }, TOPICS.MUSIC)
  }
  const musicPause = (position) => {
    if (!isHost) return
    setMusic((m) => ({ ...m, playing: false, position, updatedAt: Date.now() }))
    sendData({ type: "music", track: music.track, playing: false, position, timestamp: Date.now() }, TOPICS.MUSIC)
  }
  const musicSeek = (position) => {
    if (!isHost) return
    setMusic((m) => ({ ...m, position, updatedAt: Date.now() }))
    sendData({ type: "music", track: music.track, playing: music.playing, position, timestamp: Date.now() }, TOPICS.MUSIC)
  }

  const pollCreate = (question, options) => {
    if (!isHost) { setToast("Only host can create polls."); return }
    const msg = pollCreated({ pollId: crypto.randomUUID(), question, options })
    if (!msg) return
    setPoll({ pollId: msg.pollId, question: msg.question, options: msg.options, votes: {}, open: true })
    sendData(msg, TOPICS.POLL)
  }
  const pollVote = (option) => {
    if (!poll || !poll.open) return
    setPoll((prev) => ({ ...prev, votes: { ...prev.votes, [credsRef.current?.participantId]: option } }))
    const msg = pollVoteMsg({ pollId: poll.pollId, optionId: option })
    if (msg) sendData(msg, TOPICS.POLL)
  }
  const pollClose = () => {
    if (!isHost || !poll) return
    setPoll((prev) => ({ ...prev, open: false }))
    sendData({ type: "poll-close", pollId: poll.pollId, timestamp: Date.now() }, TOPICS.POLL)
  }

  const raiseHand = (raised) => {
    setHandRaised(raised)
    setHands((prev) => ({ ...prev, [credsRef.current?.participantId]: { name: name.trim() || "You", raised } }))
    const msg = handMessage({ senderId: credsRef.current?.participantId, senderName: name.trim(), raised })
    if (msg) sendData(msg, TOPICS.HAND)
  }

  const sendReaction = (kind) => {
    const msg = reactionMessage({ senderId: credsRef.current?.participantId, senderName: name.trim(), kind })
    if (!msg) return
    flashReaction({ kind, name: name.trim() })
    sendData(msg, TOPICS.REACTION, false)
    setShowReactions(false)
  }

  // ---------- host controls (backend-verified + LiveKit command) ----------
  const hostCmd = async (action, body = {}, msg = null) => {
    if (!isHost) return
    try { await meetingsApi.hostAction(code, action, body, hostToken) } catch (e) { setToast(e.message); return }
    if (msg) sendData(msg, TOPICS.HOST)
  }
  const hostMute = (targetId) => {
    hostCmd("mute", { targetId }, hostCommand({ action: "mute", targetId }))
  }
  const hostMuteAll = () => {
    hostCmd("mute-all", {}, hostCommand({ action: "mute-all" }))
    setToast("Mute request sent to everyone.")
  }
  const hostRemove = (targetId) => {
    hostCmd("remove", { targetId }, hostCommand({ action: "remove", targetId }))
  }
  const hostCohost = (targetId) => {
    hostCmd("cohost", { participantId: targetId }, hostCommand({ action: "cohost", targetId }))
  }
  const hostLock = (value) => {
    setLocked(value)
    hostCmd("lock", { locked: value }, hostCommand({ action: "lock", value }))
  }
  const hostWaiting = (enabled) => {
    hostCmd("waiting", { enabled })
  }
  const hostSettings = (patch, broadcast = null) => {
    if (patch.whiteboardEnabled !== undefined) setWhiteboardEnabled(patch.whiteboardEnabled)
    if (patch.allowUnmute !== undefined) setAllowUnmute(patch.allowUnmute)
    if (patch.allowVideo !== undefined) setAllowVideo(patch.allowVideo)
    if (patch.classroomMode !== undefined) setClassroomMode(patch.classroomMode)
    hostCmd("settings", patch, broadcast)
  }
  const hostEnd = async () => {
    if (!confirm("End meeting for everyone?")) return
    try { await meetingsApi.hostAction(code, "end", {}, hostToken) } catch {}
    sendData(hostCommand({ action: "end" }), TOPICS.HOST)
    setEnded("Meeting has ended.")
    try { await lkRef.current?.disconnect() } catch {}
  }
  const admitGuest = async (participantId, ok) => {
    try {
      await meetingsApi.admit(code, participantId, hostToken)
      setWaitingList((prev) => prev.filter((w) => w.participantId !== participantId))
      if (!ok) setToast("Guest removed from queue.")
    } catch (e) { setToast(e.message) }
  }

  // ---------- LOBBY ----------
  if (lobby) {
    return (
      <WannaShell>
        <div style={{ maxWidth: "1024px", margin: "0 auto", padding: "30px 0 20px" }}>
          <WannaBadge prefix="Code" strong={`${code}${meta?.hasPassword ? " · locked" : " · open"}`} />
          <h1 className="wz-title">{meta?.title || `Meeting ${code}`}</h1>
          <p className="wz-sub">Check your camera and mic, then join. Everything stays in your browser until you join.</p>
          {metaErr && <p role="alert" className="wz-alert" style={{ marginTop: "14px" }}>{metaErr}. Ask the host for a fresh link.</p>}
          {mediaHealth && !mediaHealth.configured && (
            <p role="alert" className="wz-alert" style={{ marginTop: "14px" }}>
              Live media server is not reachable or not configured
              {mediaHealth.unreachable ? " (backend API unreachable — check VITE_API_URL)." : " (backend LIVEKIT_* env missing)."}
              {" "}Meetings can't start until the backend sets LIVEKIT_URL, LIVEKIT_API_KEY and LIVEKIT_API_SECRET from the same LiveKit project.
            </p>
          )}
          <div className="wz-lobby-grid">
            <div>
              <div className="wz-stage">
                <div className="wz-stage-top">
                  <span className="wz-live">PREVIEW</span>
                  <span style={{ color: "rgba(255,255,255,.65)" }}>16 : 9 · live preview</span>
                </div>
                {media.stream ? (
                  <video ref={previewRef} autoPlay playsInline muted />
                ) : (
                  <div className="wz-stage-fallback">{media.error || "Starting camera…"}</div>
                )}
              </div>
              {media.error && <p style={{ marginTop: "8px", fontSize: "13px", fontWeight: 600, color: "rgba(0,0,0,.55)" }}>{media.error} You can still join with camera off.</p>}
              <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                <button onClick={media.toggleMute} className="wz-chip">{media.muted ? <MicOff size={14} /> : <Mic size={14} />} {media.muted ? "Unmute" : "Mute"}</button>
                <button onClick={media.toggleCamera} className="wz-chip">{media.cameraOff ? <VideoIcon size={14} /> : <VideoOff size={14} />} {media.cameraOff ? "Camera on" : "Camera off"}</button>
                <button onClick={() => media.start().catch(() => {})} className="wz-link"><RotateCcw size={13} /> Retry</button>
              </div>
              {(media.devices.audio.length > 1 || media.devices.video.length > 1) && (
                <div style={{ marginTop: "10px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {media.devices.audio.length > 1 && (
                    <select aria-label="Microphone" onChange={(e) => media.start({ video: true, audio: { deviceId: { exact: e.target.value } } }).catch(() => {})} className="wz-input" style={{ maxWidth: "240px", fontSize: "13px", minHeight: "44px" }}>
                      {media.devices.audio.map((d, i) => (<option key={d.deviceId || i} value={d.deviceId}>{d.label || `Microphone ${i + 1}`}</option>))}
                    </select>
                  )}
                  {media.devices.video.length > 1 && (
                    <select aria-label="Camera" onChange={(e) => media.start({ video: { deviceId: { exact: e.target.value } }, audio: true }).catch(() => {})} className="wz-input" style={{ maxWidth: "240px", fontSize: "13px", minHeight: "44px" }}>
                      {media.devices.video.map((d, i) => (<option key={d.deviceId || i} value={d.deviceId}>{d.label || `Camera ${i + 1}`}</option>))}
                    </select>
                  )}
                </div>
              )}
            </div>
            <div className="wz-card">
              <h2 style={{ fontSize: "24px", fontWeight: 500, letterSpacing: "-1px", margin: 0 }}>Ready to join?</h2>
              <p style={{ fontSize: "13px", color: "rgba(0,0,0,.55)", marginTop: "4px" }}>Camera and mic stay in your browser until you join.</p>
              <label htmlFor="lname" className="wz-label" style={{ marginTop: "16px" }}>Your name</label>
              <input id="lname" value={name} onChange={(e) => setName(e.target.value)} placeholder="Display name" maxLength={40} className="wz-input" />
              {meta?.hasPassword && (
                <>
                  <label htmlFor="lpwd" className="wz-label" style={{ marginTop: "12px" }}><Lock size={11} style={{ display: "inline" }} /> Password</label>
                  <input id="lpwd" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="wz-input" />
                </>
              )}
              <button onClick={doJoin} disabled={!name.trim() || joining} className="wz-btn big" style={{ marginTop: "16px", width: "100%" }}>
                <LogIn size={18} color="#fff" /> {joining ? "Joining…" : hostToken ? "Start meeting" : "Join now"}
              </button>
              <p style={{ marginTop: "10px", textAlign: "center", fontSize: "12px", color: "rgba(0,0,0,.55)", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}><ShieldCheck size={12} /> Private by design · no signup</p>
              {waiting && (
                <div style={{ marginTop: "12px", borderRadius: "8px", background: "#f5f2ff", border: "2px solid #000", padding: "12px", textAlign: "center" }}>
                  <p style={{ fontSize: "13px", fontWeight: 500, margin: 0 }}>Waiting for the host to let you in…</p>
                  <button onClick={doJoin} disabled={joining} className="wz-link" style={{ marginTop: "8px" }}>Retry now</button>
                </div>
              )}
              {joinErr && <p role="alert" className="wz-alert" style={{ marginTop: "8px", textAlign: "center" }}>{friendlyMediaError(joinErr)}</p>}
              {toast && <p style={{ marginTop: "8px", textAlign: "center", fontSize: "13px", fontWeight: 500 }}>{toast}</p>}
            </div>
          </div>
        </div>
      </WannaShell>
    )
  }

  // ---------- WAITING / ERROR / ENDED ----------
  if (waiting && !joined) {
    return (
      <WannaShell>
        <div style={{ maxWidth: "480px", margin: "40px auto", padding: "10px 0 20px" }}>
          <div className="wz-card" style={{ textAlign: "center", padding: "36px" }}>
            <WannaBadge prefix="Waiting" strong="for host" />
            <h1 className="wz-title" style={{ textAlign: "center" }}>Waiting for host…</h1>
            <p className="wz-sub" style={{ textAlign: "center", margin: "12px auto 0" }}>Keep this tab open. The host sees “{name} wants to join.”</p>
            <div style={{ marginTop: "18px", display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={doJoin} disabled={joining} className="wz-btn"><RotateCcw size={16} /> {joining ? "Checking…" : "Retry"}</button>
              <button onClick={() => { setWaiting(false); navigate("/") }} className="wz-chip"><PhoneOff size={14} /> Leave</button>
            </div>
            {joinErr && <p role="alert" className="wz-alert" style={{ marginTop: "12px" }}>{friendlyMediaError(joinErr)}</p>}
          </div>
        </div>
      </WannaShell>
    )
  }
  if (ended || lk.error) {
    return (
      <WannaShell>
        <div style={{ maxWidth: "480px", margin: "40px auto", padding: "10px 0 20px" }}>
          <div className="wz-card" style={{ textAlign: "center", padding: "36px" }}>
            <h1 className="wz-title" style={{ textAlign: "center", marginTop: 0 }}>{ended ? "Meeting ended" : "Could not join"}</h1>
            <p className="wz-sub" style={{ textAlign: "center", margin: "12px auto 0" }}>{ended || friendlyMediaError(lk.error) || "Room unavailable."}</p>
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
              <button onClick={() => navigate("/join")} className="wz-btn">Try again</button>
              <button onClick={() => navigate("/")} className="wz-link">Home</button>
            </div>
          </div>
        </div>
      </WannaShell>
    )
  }

  // ---------- ROOM (classroom UI over LiveKit) ----------
  const participants = lk.participants
  const presentCount = participants.length
  const remotes = participants.filter((x) => !x.isLocal)
  const featured = participants[0]
  const strip = participants.slice(1, 5)
  const raisedList = [
    ...(handRaised ? [{ name: name || "You", self: true }] : []),
    ...Object.entries(hands).filter(([, h]) => h.raised).map(([id, h]) => ({ name: id === creds?.participantId ? (name || "You") : h.name })),
  ]
  const peers = remotes.map((x) => ({
    socketId: x.identity,
    name: x.name,
    isHost: x.role === "host",
    isCohost: x.role === "cohost",
    muted: !x.micEnabled,
    cameraOff: !x.cameraEnabled,
    sharing: x.screenShareEnabled,
    handRaised: Boolean(hands[x.identity]?.raised),
  }))
  const pollTotal = Object.keys(poll?.votes || {}).length
  const qaMessages = chat.filter((c) => c.text.includes("?"))
  const connLabel = lk.connectionState === "connected" ? "Excellent" : lk.connectionState === "reconnecting" ? "Reconnecting" : lk.connectionState === "connecting" ? "Connecting" : "Poor"

  const handleTab = (id) => {
    setActiveTab(id)
    if (id === "stage") setPanel(null)
    else if (id === "share") { toggleShare(); setPanel(null) }
    else if (id === "board") setPanel("board")
    else if (id === "docs") setPanel("tube")
    else if (id === "polls") setPanel("polls")
    else if (id === "breakout") { setPanel("people"); setRightTab("people") }
    else if (id === "chat") { setPanel("chat"); setRightTab("chat") }
  }

  return (
    <div className="classroom-bg flex h-dvh flex-col overflow-hidden" style={{ position: "relative" }}>
      <div className="classroom-dots pointer-events-none absolute left-[8%] top-[6%] h-28 w-40 opacity-60" />
      <div className="classroom-dots pointer-events-none absolute bottom-[10%] right-[4%] h-32 w-44 opacity-50" />
      <div className="pointer-events-none absolute -left-24 top-1/3 h-96 w-96 rounded-full bg-white/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-white/60 blur-3xl" />

      {toast && <div className="relative z-30 bg-[#16283A] px-4 py-1.5 text-center text-xs font-bold text-white">{toast}</div>}
      {lk.connectionState === "reconnecting" && <div className="relative z-30 bg-[#F5B301] px-4 py-1.5 text-center text-xs font-bold text-[#16283A]">Reconnecting… LiveKit is restoring your media automatically.</div>}
      {locked && <div className="relative z-30 flex items-center justify-center gap-1.5 bg-[#16283A] px-4 py-1 text-center text-[11px] font-semibold text-white"><Lock size={11} /> Room Locked</div>}

      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1440px] flex-1 gap-3 p-2 sm:p-3">
        {/* LEFT rail */}
        <div className="hidden w-[212px] flex-none flex-col gap-3 overflow-y-auto xl:flex">
          <div className="classroom-float p-3">
            <p className="flex items-center gap-2 text-[13px] font-bold text-[#16283A]">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#E8F3FF] text-[#0D99FF]"><Users size={16} /></span>
              Breakout Rooms
            </p>
            <div className="mt-2 space-y-1.5">
              {["Room 1", "Room 2", "Room 3", "Room 4"].map((r, i) => (
                <div key={r} className="flex items-center justify-between rounded-xl bg-[#F7FAFF] px-2.5 py-2 text-[12px]">
                  <span className="flex items-center gap-2 font-semibold text-[#33475F]">
                    <span className="h-2 w-2 rounded-full" style={{ background: ["#0D99FF", "#22B573", "#7C5CFF", "#F5A3A3"][i] }} />
                    {r}
                  </span>
                  <span className="text-[#8AA6B8]">{Math.max(1, Math.floor(Math.max(presentCount, 1) / 4))} students</span>
                </div>
              ))}
            </div>
          </div>

          <div className="classroom-float p-3">
            <p className="flex items-center gap-2 text-[13px] font-bold text-[#16283A]">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#E8F3FF] text-[#0D99FF]"><BarChart3 size={16} /></span>
              Attendance
            </p>
            <p className="mt-2 text-[22px] font-bold text-[#16283A]">{presentCount} <span className="text-[13px] font-semibold text-[#8AA6B8]">present · {connLabel}</span></p>
            <div className="mt-1.5 flex items-center">
              {participants.slice(0, 3).map((t) => (
                <span key={t.identity} className="grid h-8 w-8 place-items-center rounded-full border-2 border-white text-[11px] font-bold text-white" style={{ background: "linear-gradient(135deg,#0D99FF,#7C5CFF)", marginLeft: "-6px" }}>
                  {(t.name || "?").slice(0, 1).toUpperCase()}
                </span>
              ))}
              {presentCount > 3 && (
                <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-[#E8F3FF] text-[10px] font-bold text-[#0B5ED7]" style={{ marginLeft: "-6px" }}>
                  +{presentCount - 3}
                </span>
              )}
            </div>
          </div>

          <div className="classroom-float p-3">
            <p className="flex items-center gap-2 text-[13px] font-bold text-[#16283A]">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#E8F3FF] text-[#0D99FF]"><Hand size={16} /></span>
              Raise Hand
            </p>
            <div className="mt-2 space-y-1.5">
              {raisedList.length === 0 && <p className="text-[12px] text-[#8AA6B8]">No hands up right now.</p>}
              {raisedList.slice(0, 4).map((h, i) => (
                <div key={`${h.name}-${i}`} className="flex items-center justify-between rounded-xl bg-[#F7FAFF] px-2.5 py-2 text-[12px] font-semibold text-[#33475F]">
                  <span className="flex items-center gap-2">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-[#E3ECF7] text-[10px] font-bold text-[#33475F]">
                      {(h.name || "?").slice(0, 1).toUpperCase()}
                    </span>
                    {h.name}
                  </span>
                  <HandMetal size={15} color="#F5B301" />
                </div>
              ))}
            </div>
            <button onClick={() => raiseHand(!handRaised)} className="mt-2 w-full rounded-xl bg-[#0D99FF] py-2 text-[12px] font-bold text-white hover:bg-[#0B7ED7]">
              {handRaised ? "Lower hand" : "Raise hand"}
            </button>
          </div>
        </div>

        {/* CENTER */}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="hidden justify-center gap-3 lg:flex">
            <div className="classroom-float flex items-center gap-2.5 px-4 py-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#E8F3FF] text-[#0D99FF]"><MonitorUp size={18} /></span>
              <span>
                <span className="block text-[13px] font-bold text-[#16283A]">Screen Share</span>
                <span className="block text-[12px] text-[#5B7290]">Share your screen with one click</span>
              </span>
              <button onClick={toggleShare} className="ml-2 rounded-full bg-[#0D99FF] px-3 py-1.5 text-[11px] font-bold text-white">
                {lk.screenShareEnabled ? "Stop" : "Share"}
              </button>
            </div>
            <div className="classroom-float w-[300px] px-4 py-2.5">
              <p className="flex items-center gap-2 text-[13px] font-bold text-[#16283A]">
                <BarChart3 size={15} color="#0D99FF" /> Polls & Quizzes
              </p>
              {poll ? (
                <div className="mt-1">
                  <p className="truncate text-[12px] font-semibold text-[#33475F]">{poll.question}</p>
                  <p className="text-[11px] text-[#8AA6B8]">{pollTotal} vote(s) · {poll.open ? "open" : "closed"}</p>
                </div>
              ) : (
                <p className="mt-0.5 text-[12px] text-[#5B7290]">Get instant feedback <button onClick={() => handleTab("polls")} className="font-bold text-[#0D99FF]">Launch a poll</button></p>
              )}
            </div>
          </div>

          <div className="classroom-window flex min-h-0 flex-1 flex-col">
            <TopBar
              title={meta?.title || "Algebra 101"} code={code} count={presentCount}
              timer={formatTimer(elapsed)}
              recording={recording}
              activeTab={activeTab} onTab={handleTab}
            />
            <div className="flex min-h-0 flex-1" style={{ background: "#16283A" }}>
              <div className="flex min-w-0 flex-1 gap-2 p-2 sm:p-2.5">
                {!classroomMode ? (
                  <div className="min-w-0 flex-1">
                    <ParticipantGrid participants={participants} layout="grid" />
                  </div>
                ) : (
                  <>
                    <div className="min-w-0 flex-[1.1]">
                      <div className="relative h-full min-h-[280px]">
                        {featured ? <ParticipantTile info={featured} large /> : (
                          <div className="grid h-full place-items-center rounded-[14px] border border-dashed border-white/20 text-[12px] text-white/60">
                            {lk.connectionState === "connected" ? "Waiting for media…" : "Connecting…"}
                          </div>
                        )}
                        {reactions.length > 0 && (
                          <div className="pointer-events-none absolute left-2 top-2 flex flex-col gap-1">
                            {reactions.slice(-4).map((r) => (
                              <span key={r.id} className="rounded-full bg-black/55 px-2.5 py-1 text-[13px] text-white backdrop-blur">
                                {REACTION_GLYPH[r.kind] || ""} {r.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex min-w-0 flex-[1.4] flex-col overflow-hidden rounded-[14px] bg-white">
                      {activeTab === "docs" && FEATURES.YOUTUBE ? (
                        <YouTubePanel yt={youtube} isHost={isHost} onSet={ytSet} onPlay={ytPlay} onPause={ytPause} onSeek={ytSeek} />
                      ) : activeTab === "polls" && FEATURES.POLLS ? (
                        <PollsPanel poll={poll} isHost={isHost} onCreate={pollCreate} onVote={pollVote} onClose={pollClose} />
                      ) : activeTab === "music" && FEATURES.MUSIC ? (
                        <MusicPanel music={music} isHost={isHost} onSet={musicSet} onPlay={musicPlay} onPause={musicPause} onSeek={musicSeek} />
                      ) : FEATURES.WHITEBOARD ? (
                        <Whiteboard remoteOps={wbOps} onOp={sendWbOp} canDraw={whiteboardEnabled || isHost} />
                      ) : (
                        <div className="grid h-full place-items-center p-6 text-sm text-[#8AA6B8]">Whiteboard is disabled.</div>
                      )}
                    </div>
                    <div className="hidden w-[150px] flex-none flex-col gap-2 overflow-y-auto sm:flex">
                      {strip.map((x) => (
                        <div key={x.identity} className="h-[118px] flex-none">
                          <ParticipantTile info={x} />
                        </div>
                      ))}
                      {strip.length === 0 && (
                        <div className="grid h-[118px] place-items-center rounded-xl border border-dashed border-white/20 text-center text-[11px] text-white/60">
                          Others will<br />appear here
                        </div>
                      )}
                      {lk.screenShareEnabled && (
                        <button onClick={toggleShare} className="rounded-xl bg-[#E8382F] py-2 text-[11px] font-bold text-white">Stop Sharing</button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <BottomBar
            muted={!lk.micEnabled} cameraOff={!lk.cameraEnabled} sharing={lk.screenShareEnabled} handRaised={handRaised} recording={recording}
            onMute={toggleMute} onCamera={toggleCamera}
            onShare={toggleShare}
            onHand={() => raiseHand(!handRaised)}
            onReact={() => setShowReactions((s) => !s)}
            onRecord={toggleRecord}
            onMore={() => setMoreOpen((o) => !o)}
            onLeave={doLeave}
          />
          {showReactions && (
            <div className="mx-auto flex gap-1.5 rounded-2xl border border-[#E3ECF7] bg-white px-3 py-2 shadow-xl">
              {REACTIONS.map((k) => (
                <button key={k} onClick={() => sendReaction(k)} className="rounded-xl px-2.5 py-1.5 text-xl hover:bg-[#F1F6FA]" aria-label={`Send ${k}`}>
                  {REACTION_GLYPH[k]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT panel */}
        <div className="hidden w-[300px] flex-none lg:block">
          <div className="classroom-float flex h-full min-h-0 flex-col overflow-hidden">
            <div className="flex items-center gap-1 border-b border-[#EAF0F7] p-2">
              {[
                { id: "chat", label: "Chat", Icon: MessageSquare },
                { id: "qa", label: "Q&A", Icon: CircleHelp },
                { id: "people", label: "People", Icon: Users },
              ].map(({ id, label, Icon }) => (
                <button
                  key={id} onClick={() => setRightTab(id)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-[12px] font-bold ${rightTab === id ? "bg-[#16283A] text-white" : "text-[#5B7290] hover:bg-[#F1F6FA]"}`}
                >
                  <Icon size={13} /> {label}
                </button>
              ))}
              <button onClick={() => setInvite(true)} aria-label="Invite" className="rounded-xl p-2 text-[#5B7290] hover:bg-[#F1F6FA]">
                <ChevronRight size={15} />
              </button>
            </div>
            <div className="min-h-0 flex-1">
              {rightTab === "chat" && <ChatPanel messages={chat} system={system} onSend={onChatSend} />}
              {rightTab === "qa" && (
                <div className="flex h-full flex-col bg-white p-3">
                  <p className="text-[12px] font-bold text-[#16283A]">Questions ({qaMessages.length})</p>
                  <div className="mt-2 min-h-0 flex-1 space-y-2.5 overflow-y-auto">
                    {qaMessages.length === 0 && <p className="rounded-xl bg-[#F4F8FF] p-3 text-[13px] text-[#5B7290]">No questions yet. End a message with ? to ask.</p>}
                    {qaMessages.map((q) => (
                      <div key={q.id} className="rounded-xl bg-[#F7FAFF] p-2.5 text-[13px] text-[#33475F]">
                        <p className="font-bold text-[#16283A]">{q.name}</p>
                        <p>{q.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {rightTab === "people" && (
                <ParticipantsPanel peers={peers} you={{ name: name.trim(), isHost }} isHost={isHost}
                  onMute={hostMute} onRemove={hostRemove} onCohost={hostCohost}
                  onAdmit={(pid, ok) => admitGuest(pid, ok)} waiting={waitingList.map((w) => ({ socketId: w.participantId, name: w.displayName }))} />
              )}
            </div>
          </div>
        </div>
      </div>

      {panel !== null && (
        <div className="fixed inset-y-0 right-0 z-40 flex w-[88vw] max-w-[340px] flex-col bg-white shadow-2xl lg:hidden">
          <div className="flex items-center justify-between border-b border-[#EAF0F7] px-3 py-2">
            <p className="text-sm font-bold capitalize text-[#16283A]">{panel}</p>
            <button onClick={() => setPanel(null)} aria-label="Close panel" className="classroom-rail-btn" style={{ height: "30px", width: "30px" }}><X size={14} /></button>
          </div>
          <div className="min-h-0 flex-1">
            {panel === "chat" && <ChatPanel messages={chat} system={system} onSend={onChatSend} />}
            {panel === "people" && (
              <ParticipantsPanel peers={peers} you={{ name: name.trim(), isHost }} isHost={isHost}
                onMute={hostMute} onRemove={hostRemove} onCohost={hostCohost}
                onAdmit={(pid, ok) => admitGuest(pid, ok)} waiting={waitingList.map((w) => ({ socketId: w.participantId, name: w.displayName }))} />
            )}
            {panel === "board" && FEATURES.WHITEBOARD && <Whiteboard remoteOps={wbOps} onOp={sendWbOp} canDraw={whiteboardEnabled || isHost} />}
            {panel === "tube" && FEATURES.YOUTUBE && <YouTubePanel yt={youtube} isHost={isHost} onSet={ytSet} onPlay={ytPlay} onPause={ytPause} onSeek={ytSeek} />}
            {panel === "polls" && FEATURES.POLLS && <PollsPanel poll={poll} isHost={isHost} onCreate={pollCreate} onVote={pollVote} onClose={pollClose} />}
            {panel === "music" && FEATURES.MUSIC && <MusicPanel music={music} isHost={isHost} onSet={musicSet} onPlay={musicPlay} onPause={musicPause} onSeek={musicSeek} />}
          </div>
        </div>
      )}

      {moreOpen && (
        <div className="fixed bottom-24 left-1/2 z-40 w-[92vw] max-w-sm -translate-x-1/2 rounded-[18px] border border-[#E3ECF7] bg-white p-3 shadow-2xl">
          <div className="grid grid-cols-2 gap-2 text-sm text-[#16283A]">
            <button onClick={() => { setInvite(true); setMoreOpen(false) }} className="flex items-center justify-center gap-1.5 rounded-xl bg-[#F1F6FA] p-2.5 font-semibold"><UserPlus size={14} /> Invite</button>
            <button onClick={() => { setPanel("chat"); setRightTab("chat"); setMoreOpen(false) }} className="flex items-center justify-center gap-1.5 rounded-xl bg-[#F1F6FA] p-2.5 font-semibold"><MessageSquare size={14} /> Chat</button>
            <button onClick={() => { setActiveTab("docs"); setPanel("tube"); setMoreOpen(false) }} className="flex items-center justify-center gap-1.5 rounded-xl bg-[#F1F6FA] p-2.5 font-semibold"><ClipboardList size={14} /> Documents</button>
            <button onClick={() => { setActiveTab("music"); setPanel("music"); setMoreOpen(false) }} className="flex items-center justify-center gap-1.5 rounded-xl bg-[#F1F6FA] p-2.5 font-semibold"><MusicIcon size={14} /> Music</button>
            <button onClick={() => { raiseHand(!handRaised); setMoreOpen(false) }} className="flex items-center justify-center gap-1.5 rounded-xl bg-[#F1F6FA] p-2.5 font-semibold"><Hand size={14} /> {handRaised ? "Lower hand" : "Raise hand"}</button>
            {isHost && (
              <button onClick={() => { const v = !classroomMode; hostSettings({ classroomMode: v }, { type: "classroom", classroomMode: v }); setMoreOpen(false) }} className="rounded-xl bg-[#F1F6FA] p-2.5 font-semibold">{classroomMode ? "Meeting mode" : "Classroom mode"}</button>
            )}
            {isHost && <button onClick={() => { hostMuteAll(); setMoreOpen(false) }} className="rounded-xl bg-[#F1F6FA] p-2.5 font-semibold">Mute all</button>}
            {isHost && <button onClick={() => { hostLock(!locked); setMoreOpen(false) }} className="rounded-xl bg-[#F1F6FA] p-2.5 font-semibold">{locked ? "Unlock room" : "Lock room"}</button>}
            {isHost && <button onClick={() => { hostWaiting(true); setToast("Waiting room enabled."); setMoreOpen(false) }} className="rounded-xl bg-[#F1F6FA] p-2.5 font-semibold">Waiting room</button>}
            {isHost && <button onClick={() => { hostSettings({ whiteboardEnabled: !whiteboardEnabled }, hostCommand({ action: "whiteboard", value: !whiteboardEnabled })); setMoreOpen(false) }} className="rounded-xl bg-[#F1F6FA] p-2.5 font-semibold">{whiteboardEnabled ? "Lock board" : "Unlock board"}</button>}
            {isHost && <button onClick={() => { hostEnd(); setMoreOpen(false) }} className="rounded-xl bg-[#E8382F] p-2.5 font-semibold text-white">End Meeting</button>}
            <button onClick={() => { setInvite(true); setMoreOpen(false) }} className="flex items-center justify-center gap-1.5 rounded-xl bg-[#0D99FF] p-2.5 font-semibold text-white"><Send size={14} /> Invite link</button>
          </div>
          {!FEATURES.STREAMING && <p className="mt-2 text-center text-[11px] font-semibold text-[#8AA6B8]">Live streaming is not configured yet.</p>}
        </div>
      )}
      {invite && <InviteDialog code={code} title={meta?.title || "ShadowMeet"} onClose={() => setInvite(false)} />}
    </div>
  )
}
