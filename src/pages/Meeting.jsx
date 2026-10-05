import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { useMediaDevices } from "../hooks/useMediaDevices"
import { useMeetingRoom } from "../hooks/useMeetingRoom"
import { roomsApi } from "../services/api"
import { getHostToken } from "../utils/identity"
import { socket } from "../lib/socket"
import { FEATURES } from "../config/featureFlags"
import { extractYouTubeId } from "../utils/youtube"
import { TopBar, formatTimer } from "../components/meet/TopBar"
import { VideoGrid } from "../components/meet/VideoGrid"
import { BottomBar } from "../components/meet/BottomBar"
import { ChatPanel } from "../components/meet/ChatPanel"
import { ParticipantsPanel } from "../components/meet/ParticipantsPanel"
import { InviteDialog } from "../components/meet/InviteDialog"
import { Whiteboard } from "../components/meet/Whiteboard"
import { YouTubePanel } from "../components/meet/YouTubePanel"
import { PollsPanel } from "../components/meet/PollsPanel"

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

  const media = useMediaDevices()
  const previewRef = useRef(null)
  useEffect(() => { if (previewRef.current && media.stream) previewRef.current.srcObject = media.stream }, [media.stream, lobby])

  // fetch room metadata
  useEffect(() => {
    let alive = true
    roomsApi.get(code).then((d) => { if (alive) setMeta(d.room) }).catch((e) => { if (alive) setMetaErr(e.message) })
    return () => { alive = false }
  }, [code])

  // start preview early
  useEffect(() => {
    media.start().catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [joined, setJoined] = useState(false)
  const m = useMeetingRoom({
    code: joined ? code : null,
    name: joined ? name : null,
    password,
    hostToken,
    localStreamRef: media.streamRef
  })

  const [panel, setPanel] = useState(null) // chat|people|board|tube|polls
  const [invite, setInvite] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [recording, setRecording] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [toast, setToast] = useState(null)
  const screenTrackRef = useRef(null)
  const recRef = useRef(null)
  const recChunks = useRef([])

  useEffect(() => {
    if (!joined) return
    const t = setInterval(() => setElapsed((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [joined])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  // sync mute/cam to server
  useEffect(() => {
    if (joined) m.emitMedia({ muted: media.muted, cameraOff: media.cameraOff, sharing })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [media.muted, media.cameraOff, sharing, joined])

  // speaking detection (local)
  useEffect(() => {
    if (!joined || !media.stream) return
    let raf, ctx, analyser, data
    try {
      ctx = new AudioContext()
      const src = ctx.createMediaStreamSource(media.stream)
      analyser = ctx.createAnalyser()
      analyser.fftSize = 512
      src.connect(analyser)
      data = new Uint8Array(analyser.frequencyBinCount)
      let on = false, last = 0
      const loop = () => {
        analyser.getByteFrequencyData(data)
        const avg = data.reduce((a, b) => a + b, 0) / data.length
        const now = Date.now()
        const active = avg > 18 && !media.muted
        if (active !== on && now - last > 600) {
          on = active; last = now
          socket.emit("speaking", { speaking: on })
        }
        raf = requestAnimationFrame(loop)
      }
      loop()
    } catch {}
    return () => { try { cancelAnimationFrame(raf); ctx?.close() } catch {} }
  }, [joined, media.stream, media.muted])

  const doJoin = () => {
    if (!name.trim()) { setToast("Enter your display name."); return }
    try { sessionStorage.setItem("sm_name", name.trim()) } catch {}
    setLobby(false)
    setJoined(true)
    setTimeout(() => m.syncMeshStream(), 800)
  }

  const doLeave = () => {
    try { m.leave() } catch {}
    media.stop()
    navigate("/")
  }

  const toggleShare = async () => {
    if (sharing) {
      try { screenTrackRef.current?.stop() } catch {}
      screenTrackRef.current = null
      setSharing(false)
      // restore camera track to peers
      if (media.streamRef.current) await m.syncMeshStream()
      m.emitMedia({ sharing: false })
      return
    }
    if (!navigator.mediaDevices?.getDisplayMedia) { setToast("Screen sharing not supported in this browser."); return }
    try {
      const ds = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
      const track = ds.getVideoTracks()[0]
      screenTrackRef.current = track
      setSharing(true)
      // swap video sender track across mesh
      const mesh = m
      void mesh
      const { createMesh } = await import("../services/webrtc/mesh").catch(() => ({}))
      void createMesh
      // simplest robust path: replace tracks via existing peer connections through syncMeshStream-like manual replace
      // we reach into socket mesh via re-emit: temporarily publish screen as local stream
      const camStream = media.streamRef.current
      const screenStream = new MediaStream([track, ...(camStream?.getAudioTracks() || [])])
      // monkey-patch ref so mesh uses screen
      const prev = media.streamRef.current
      media.streamRef.current = screenStream
      await m.syncMeshStream()
      // keep preview showing screen: store prev to restore
      media.streamRef._camBackup = prev
      track.onended = async () => {
        setSharing(false)
        if (media.streamRef._camBackup) media.streamRef.current = media.streamRef._camBackup
        await m.syncMeshStream()
        m.emitMedia({ sharing: false })
      }
      m.emitMedia({ sharing: true })
    } catch {
      setToast("Screen share cancelled.")
    }
  }

  const toggleRecord = () => {
    if (recording) {
      try { recRef.current?.stop() } catch {}
      setRecording(false)
      return
    }
    const s = media.streamRef.current
    if (!s || !window.MediaRecorder) { setToast("Recording not supported here."); return }
    try {
      const rec = new MediaRecorder(s, { mimeType: MediaRecorder.isTypeSupported("video/webm") ? "video/webm" : undefined })
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

  const onChatSend = (text) => {
    // slash commands
    if (text === "/help") {
      setToast("/play <youtube-url> · /music · /clear (host)")
      return
    }
    if (text.startsWith("/play ")) {
      const id = extractYouTubeId(text.slice(6))
      if (!id) { setToast("Invalid YouTube URL."); return }
      if (!m.you?.isHost) { setToast("Only host can start playback."); return }
      m.ytSet(id)
      setPanel("tube")
      return
    }
    if (text === "/clear") { m.sendChat(text); return }
    if (text === "/music" || text === "/polls" || text === "/youtube") {
      setPanel(text === "/music" ? "tube" : text === "/polls" ? "polls" : "tube")
      return
    }
    m.sendChat(text)
  }

  // ---------- LOBBY ----------
  if (lobby) {
    return (
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8 text-white lg:grid-cols-[1fr_340px]">
        <div>
          <button onClick={() => navigate("/")} className="mb-3 text-sm text-slate-400 hover:text-white">← Home</button>
          <h1 className="font-display text-2xl font-bold">{meta?.title || `Meeting ${code}`}</h1>
          <p className="text-sm text-slate-400">Code <span className="font-mono font-bold tracking-widest text-white">{code}</span> {meta?.hasPassword && "· 🔒 password required"}</p>
          {metaErr && <p role="alert" className="mt-3 rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{metaErr}. Ask the host for a fresh link.</p>}
          <div className="mt-4 overflow-hidden rounded-3xl border border-white/10 bg-slate-950">
            {media.stream ? (
              <video ref={previewRef} autoPlay playsInline muted className="aspect-video w-full bg-black object-cover" />
            ) : (
              <div className="grid aspect-video place-items-center text-sm text-slate-500">{media.error || "Starting camera…"}</div>
            )}
          </div>
          {media.error && <p className="mt-2 text-xs text-amber-300">{media.error} You can still join with camera off.</p>}
          <div className="mt-3 flex gap-2">
            <button onClick={media.toggleMute} className={`rounded-xl px-4 py-2 text-sm font-bold ${media.muted ? "bg-red-500/20 text-red-200" : "bg-white/10"}`}>{media.muted ? "🔇 Unmute" : "🎙️ Mute"}</button>
            <button onClick={media.toggleCamera} className={`rounded-xl px-4 py-2 text-sm font-bold ${media.cameraOff ? "bg-red-500/20 text-red-200" : "bg-white/10"}`}>{media.cameraOff ? "📹 Camera on" : "🚫 Camera off"}</button>
            <button onClick={() => media.start().catch(() => {})} className="rounded-xl bg-white/10 px-4 py-2 text-sm font-bold">↻ Retry</button>
          </div>
        </div>
        <div className="h-fit rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="font-bold">Ready to join?</h2>
          <label htmlFor="lname" className="mb-1 mt-4 block text-xs font-bold uppercase tracking-wider text-slate-400">Your name</label>
          <input id="lname" value={name} onChange={(e) => setName(e.target.value)} placeholder="Display name" maxLength={40} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3" />
          {meta?.hasPassword && (
            <>
              <label htmlFor="lpwd" className="mb-1 mt-3 block text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
              <input id="lpwd" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3" />
            </>
          )}
          <button onClick={doJoin} disabled={!name.trim()} className="mt-4 w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-3.5 font-bold disabled:opacity-40">
            {hostToken ? "Start meeting" : "Join now"}
          </button>
          <p className="mt-2 text-center text-[11px] text-slate-500">Camera/mic stay in your browser until you join.</p>
          {toast && <p className="mt-2 text-center text-xs text-amber-300">{toast}</p>}
        </div>
      </div>
    )
  }

  // ---------- ROOM ----------
  if (m.status === "waiting") {
    return <div className="grid min-h-screen place-items-center p-6 text-center text-white"><div><h1 className="text-xl font-bold">Waiting for the host to let you in…</h1><p className="mt-2 text-sm text-slate-400">Keep this tab open.</p><button onClick={doLeave} className="mt-4 rounded-xl bg-white/10 px-5 py-2 text-sm font-bold">Leave</button></div></div>
  }
  if (m.status === "error" || m.status === "ended") {
    return (
      <div className="grid min-h-screen place-items-center p-6 text-center text-white">
        <div className="max-w-md">
          <h1 className="font-display text-2xl font-bold">{m.status === "ended" ? "Meeting ended" : "Could not join"}</h1>
          <p className="mt-2 text-sm text-slate-400">{m.error || "Room unavailable."}</p>
          <div className="mt-5 flex justify-center gap-2">
            <button onClick={() => navigate("/join")} className="rounded-xl bg-white/10 px-5 py-2.5 text-sm font-bold">Try another code</button>
            <button onClick={() => navigate("/")} className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-slate-900">Home</button>
          </div>
        </div>
      </div>
    )
  }

  const allTiles = [
    { id: "local", name: name || "You", stream: media.stream, muted: media.muted, cameraOff: media.cameraOff, speaking: false, isLocal: true, isHost: m.you?.isHost, sharing },
    ...m.peers.map((p) => ({
      id: p.socketId, name: p.name, stream: m.remoteStreams[p.socketId] || null,
      muted: p.muted, cameraOff: p.cameraOff, speaking: Boolean(m.speaking[p.socketId]),
      isHost: p.isHost, isCohost: p.isCohost, sharing: p.sharing
    }))
  ]
  const isHost = Boolean(m.you?.isHost)
  const sideOpen = panel !== null

  return (
    <div className="flex h-dvh flex-col bg-slate-950 text-white">
      <TopBar title={meta?.title || m.room?.title || "ShadowMeet"} code={code} count={allTiles.length} timer={formatTimer(elapsed)} conn={m.status === "joined" ? "Good" : m.status} recording={recording} onInvite={() => setInvite(true)} />
      {toast && <div className="bg-amber-400/10 px-4 py-1.5 text-center text-xs text-amber-200">{toast}</div>}
      {m.locked && <div className="bg-white/5 px-4 py-1 text-center text-[11px] text-slate-400">🔒 Room locked</div>}

      <div className="flex min-h-0 flex-1">
        <main className="flex min-w-0 flex-1 flex-col p-2 sm:p-3">
          <VideoGrid local={[allTiles[0]]} remotes={allTiles.slice(1)} />
          {sharing && <p className="mt-1 text-center text-xs text-emerald-300">You are sharing your screen <button onClick={toggleShare} className="ml-2 rounded bg-white/10 px-2 py-0.5 font-bold">Stop sharing</button></p>}
        </main>

        {sideOpen && (
          <aside className="flex w-full max-w-[340px] shrink-0 flex-col border-l border-white/10 bg-slate-900/60 max-sm:fixed max-sm:inset-y-0 max-sm:right-0 max-sm:z-40 max-sm:w-[88vw] max-sm:shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
              <p className="text-sm font-bold capitalize">{panel}</p>
              <button onClick={() => setPanel(null)} aria-label="Close panel" className="rounded-lg bg-white/10 px-2.5 py-1 text-xs">✕</button>
            </div>
            <div className="min-h-0 flex-1">
              {panel === "chat" && <ChatPanel messages={m.chat} system={m.system} me={m.you?.socketId} isHost={isHost} onSend={onChatSend} />}
              {panel === "people" && <ParticipantsPanel peers={m.peers} you={m.you} isHost={isHost} onMute={(id) => m.host.mute(id)} onRemove={(id) => m.host.remove(id)} onCohost={(id) => m.host.cohost(id)} onAdmit={(id, ok) => ok ? m.host.admit(id) : m.host.reject(id)} />}
              {panel === "board" && FEATURES.WHITEBOARD && <Whiteboard onOp={m.sendWbOp} canDraw /> }
              {panel === "tube" && FEATURES.YOUTUBE && <YouTubePanel yt={m.youtube} isHost={isHost} onSet={m.ytSet} onPlay={m.ytPlay} onPause={m.ytPause} onSeek={m.ytSeek} />}
              {panel === "polls" && FEATURES.POLLS && <PollsPanel poll={m.poll} isHost={isHost} onCreate={m.pollCreate} onVote={m.pollVote} onClose={m.pollClose} />}
            </div>
          </aside>
        )}
      </div>

      <BottomBar
        muted={media.muted} cameraOff={media.cameraOff} sharing={sharing} handRaised={m.handRaised} recording={recording}
        chatOpen={panel === "chat"} activePanel={panel}
        onMute={() => media.toggleMute()} onCamera={() => media.toggleCamera()}
        onShare={toggleShare}
        onChat={() => setPanel(panel === "chat" ? null : "chat")}
        onPeople={() => setPanel(panel === "people" ? null : "people")}
        onBoard={() => setPanel(panel === "board" ? null : "board")}
        onTube={() => setPanel(panel === "tube" ? null : "tube")}
        onPolls={() => setPanel(panel === "polls" ? null : "polls")}
        onHand={() => m.raiseHand(!m.handRaised)}
        onRecord={FEATURES.RECORDING ? toggleRecord : () => setToast("Recording is disabled by feature flag.")}
        onMore={() => setMoreOpen((o) => !o)}
        onLeave={doLeave}
      />
      {moreOpen && (
        <div className="fixed bottom-20 left-1/2 z-40 w-[92vw] max-w-sm -translate-x-1/2 rounded-2xl border border-white/10 bg-slate-900 p-3 shadow-2xl">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <button onClick={() => { setInvite(true); setMoreOpen(false) }} className="rounded-xl bg-white/5 p-2.5 font-semibold">📨 Invite</button>
            <button onClick={() => { m.raiseHand(!m.handRaised); }} className="rounded-xl bg-white/5 p-2.5 font-semibold">{m.handRaised ? "Lower hand" : "✋ Raise hand"}</button>
            {isHost && <button onClick={() => { m.host.muteAll(); setMoreOpen(false) }} className="rounded-xl bg-white/5 p-2.5 font-semibold">Mute all</button>}
            {isHost && <button onClick={() => { m.host.lock(!m.locked); setMoreOpen(false) }} className="rounded-xl bg-white/5 p-2.5 font-semibold">{m.locked ? "Unlock room" : "Lock room"}</button>}
            {isHost && <button onClick={() => { if (confirm("End meeting for everyone?")) m.host.end() }} className="rounded-xl bg-red-500/15 p-2.5 font-semibold text-red-300">End meeting</button>}
            <button onClick={() => { setPanel("people"); setMoreOpen(false) }} className="rounded-xl bg-white/5 p-2.5 font-semibold">👥 People</button>
          </div>
          {!isHost && <p className="mt-2 text-center text-[11px] text-slate-500">Host-only controls are hidden for guests.</p>}
        </div>
      )}
      {invite && <InviteDialog code={code} title={meta?.title || m.room?.title || "ShadowMeet"} onClose={() => setInvite(false)} />}
    </div>
  )
}
