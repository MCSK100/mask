import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { socket } from "../lib/socket"
import { createMesh } from "../services/webrtc/mesh"
import { getParticipantId } from "../utils/identity"
import { sanitizeChat } from "../utils/validation"

/**
 * Central meeting-room hook: signaling + mesh WebRTC + chat/polls/yt/wb relay.
 * Media capture itself lives in useMediaDevices; this hook wires tracks to peers.
 */
export function useMeetingRoom({ code, name, password, hostToken, localStreamRef }) {
  const [status, setStatus] = useState("connecting")
  const [error, setError] = useState(null)
  const [room, setRoom] = useState(null)
  const [you, setYou] = useState(null)
  const [peers, setPeers] = useState([]) // server metadata list
  const [remoteStreams, setRemoteStreams] = useState({}) // socketId -> MediaStream
  const [connStates, setConnStates] = useState({})
  const [chat, setChat] = useState([])
  const [system, setSystem] = useState([])
  const [youtube, setYoutube] = useState({ videoId: null, playing: false, time: 0 })
  const [poll, setPoll] = useState(null)
  const [locked, setLocked] = useState(false)
  const [handRaised, setHandRaised] = useState(false)
  const [speaking, setSpeaking] = useState({})
  const meshRef = useRef(null)
  const joinedRef = useRef(false)

  const peerName = useCallback((socketId) => {
    const p = peers.find((x) => x.socketId === socketId)
    return p?.name || "Guest"
  }, [peers])

  // ---- mesh setup (once) ----
  useEffect(() => {
    const mesh = createMesh({
      socket,
      getLocalStream: () => localStreamRef?.current || new MediaStream(),
      onRemoteStream: (remoteId, s) => {
        setRemoteStreams((prev) => ({ ...prev, [remoteId]: s }))
      },
      onPeerLeft: (remoteId) => {
        setRemoteStreams((prev) => {
          const n = { ...prev }
          delete n[remoteId]
          return n
        })
      },
      onConnectionState: (remoteId, st) => setConnStates((p) => ({ ...p, [remoteId]: st }))
    })
    meshRef.current = mesh
    return () => { mesh.destroy(); meshRef.current = null }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // keep mesh tracks in sync when local stream changes
  const syncMeshStream = useCallback(() => {
    const s = localStreamRef?.current
    if (s && meshRef.current) void meshRef.current.setLocalStream(s)
  }, [localStreamRef])

  // ---- room join + socket events ----
  useEffect(() => {
    if (!code || !name) return
    joinedRef.current = false
    setStatus("connecting")
    setError(null)

    const pid = getParticipantId()
    const doJoin = () => {
      socket.emit("join_room", { code, name, password: password || "", hostToken: hostToken || null, participantId: pid })
    }
    if (socket.connected) doJoin()
    else socket.once("connect", doJoin)

    const onJoined = ({ room: r, you: y, peers: existing, youtube: yt, poll: pl, chat: history }) => {
      joinedRef.current = true
      setRoom(r)
      setYou(y)
      setStatus("joined")
      setLocked(Boolean(r.locked))
      if (yt) setYoutube(yt)
      if (pl) setPoll(pl)
      if (Array.isArray(history)) setChat(history)
      // dial existing peers as initiator
      existing?.forEach((p) => {
        try { meshRef.current?.addPeer(p.socketId, true) } catch {}
      })
      syncMeshStream()
    }
    const onJoinError = ({ error: e }) => { setStatus("error"); setError(e || "Could not join.") }
    const onWaiting = () => setStatus("waiting")
    const onPeerJoined = (p) => {
      // existing member: dial newcomer
      try { meshRef.current?.addPeer(p.socketId, true) } catch {}
    }
    const onSignal = ({ from, data }) => meshRef.current?.handleSignal(from, data)
    const onPeerLeft = ({ socketId }) => {
      meshRef.current?.removePeer(socketId)
      setPeers((prev) => prev.filter((p) => p.socketId !== socketId))
    }
    const onPeers = (list) => setPeers(list)
    const onChatMsg = (m) => setChat((prev) => [...prev.slice(-199), m])
    const onSys = ({ text }) => setSystem((prev) => [...prev.slice(-99), { text, ts: Date.now() }])
    const onChatCleared = () => setChat([])
    const onYt = (yt) => setYoutube(yt)
    const onPollState = (pl) => setPoll(pl)
    const onMedia = ({ socketId, muted, cameraOff, sharing }) => {
      setPeers((prev) => prev.map((p) => p.socketId === socketId ? { ...p, muted, cameraOff, sharing } : p))
    }
    const onSpeaking = ({ socketId, speaking: sp }) => setSpeaking((p) => ({ ...p, [socketId]: sp }))
    const onHand = ({ socketId, raised }) => {
      setPeers((prev) => prev.map((p) => p.socketId === socketId ? { ...p, handRaised: raised } : p))
    }
    const onLock = ({ locked: l }) => setLocked(l)
    const onEnded = () => { setStatus("ended"); setError("Meeting has ended.") }
    const onRemoved = () => { setStatus("ended"); setError("You were removed by the host.") }

    socket.on("room_joined", onJoined)
    socket.on("join_error", onJoinError)
    socket.on("waiting_approval", onWaiting)
    socket.on("peer_joined", onPeerJoined)
    socket.on("signal", onSignal)
    socket.on("peer_left", onPeerLeft)
    socket.on("peers", onPeers)
    socket.on("chat_message", onChatMsg)
    socket.on("system_message", onSys)
    socket.on("chat_cleared", onChatCleared)
    socket.on("yt_state", onYt)
    socket.on("poll_state", onPollState)
    socket.on("peer_media", onMedia)
    socket.on("peer_speaking", onSpeaking)
    socket.on("peer_hand", onHand)
    socket.on("room_locked", onLock)
    socket.on("meeting_ended", onEnded)
    socket.on("removed", onRemoved)

    return () => {
      socket.off("room_joined", onJoined)
      socket.off("join_error", onJoinError)
      socket.off("waiting_approval", onWaiting)
      socket.off("peer_joined", onPeerJoined)
      socket.off("signal", onSignal)
      socket.off("peer_left", onPeerLeft)
      socket.off("peers", onPeers)
      socket.off("chat_message", onChatMsg)
      socket.off("system_message", onSys)
      socket.off("chat_cleared", onChatCleared)
      socket.off("yt_state", onYt)
      socket.off("poll_state", onPollState)
      socket.off("peer_media", onMedia)
      socket.off("peer_speaking", onSpeaking)
      socket.off("peer_hand", onHand)
      socket.off("room_locked", onLock)
      socket.off("meeting_ended", onEnded)
      socket.off("removed", onRemoved)
      socket.off("connect", doJoin)
      if (joinedRef.current) socket.emit("leave_room")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, name])

  // ---- actions ----
  const emitMedia = useCallback((patch) => socket.emit("media_state", patch), [])

  const sendChat = useCallback((text) => {
    const clean = sanitizeChat(text)
    if (!clean) return
    socket.emit("chat_message", { text: clean })
  }, [])

  const sendWbOp = useCallback((op) => socket.emit("wb_op", op), [])
  const clearBoard = useCallback(() => socket.emit("wb_clear"), [])

  const ytSet = useCallback((videoId) => socket.emit("yt_set", { videoId }), [])
  const ytPlay = useCallback((time) => socket.emit("yt_play", { time }), [])
  const ytPause = useCallback((time) => socket.emit("yt_pause", { time }), [])
  const ytSeek = useCallback((time) => socket.emit("yt_seek", { time }), [])

  const pollCreate = useCallback((question, options) => socket.emit("poll_create", { question, options }), [])
  const pollVote = useCallback((option) => socket.emit("poll_vote", { option }), [])
  const pollClose = useCallback(() => socket.emit("poll_close"), [])

  const raiseHand = useCallback((raised) => {
    setHandRaised(raised)
    socket.emit("hand", { raised })
  }, [])

  const host = useMemo(() => ({
    muteAll: () => socket.emit("host_mute_all"),
    mute: (targetId) => socket.emit("host_mute", { targetId }),
    remove: (targetId) => socket.emit("host_remove", { targetId }),
    lock: (l) => socket.emit("host_lock", { locked: l }),
    waiting: (enabled) => socket.emit("host_waiting", { enabled }),
    cohost: (targetId) => socket.emit("host_cohost", { targetId }),
    end: () => socket.emit("host_end"),
    admit: (socketId) => socket.emit("waiting_admit", { socketId }),
    reject: (socketId) => socket.emit("waiting_reject", { socketId })
  }), [])

  const leave = useCallback(() => socket.emit("leave_room"), [])

  return {
    status, error, room, you, peers, remoteStreams, connStates, chat, system,
    youtube, poll, locked, handRaised, speaking, peerName,
    sendChat, sendWbOp, clearBoard,
    ytSet, ytPlay, ytPause, ytSeek,
    pollCreate, pollVote, pollClose,
    raiseHand, emitMedia, host, leave, syncMeshStream
  }
}
