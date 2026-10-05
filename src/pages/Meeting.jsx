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

  // ---------- LOBBY (Aurora) ----------
  if (lobby) {
    return (
      <div style={{ position: "relative", minHeight: "100svh", background: "#000", color: "#fff", overflow: "hidden" }}>
        <div className="aurora-glow" style={{ position: "absolute", top: "-14%", left: "50%", transform: "translateX(-50%)", width: "1000px", maxWidth: "120vw", height: "720px", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 10, margin: "0 auto", maxWidth: "1024px", padding: "130px 64px 40px", display: "grid", gap: "24px" }} className="lg:grid-cols-[1fr_340px] max-sm:!px-6">
          <div>
            <div className="aurora-badge">
              <div style={{ display: "flex" }}>{[0, 1, 2].map((i) => (<div key={i} className="aurora-avatar" style={{ marginLeft: i === 0 ? 0 : "-8px" }} />))}</div>
              <span style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.75)" }}>Code <strong style={{ color: "#fff" }}>{code}</strong>{meta?.hasPassword ? " · locked" : " · open"}</span>
            </div>
            <h1 style={{ fontFamily: "'Londrina Solid', sans-serif", fontWeight: 400, fontSize: "clamp(1.8rem, 3.4vw, 2.6rem)", marginTop: "18px" }}>{meta?.title || `Meeting ${code}`}</h1>
            {metaErr && <p role="alert" style={{ marginTop: "12px", borderRadius: "12px", background: "rgba(255,80,80,0.1)", padding: "12px", fontSize: "13px", color: "#ff9c9c" }}>{metaErr}. Ask the host for a fresh link.</p>}
            <div className="aurora-card" style={{ marginTop: "16px", overflow: "hidden" }}>
              {media.stream ? (
                <video ref={previewRef} autoPlay playsInline muted style={{ aspectRatio: "16/9", width: "100%", background: "#000", objectFit: "cover" }} />
              ) : (
                <div style={{ aspectRatio: "16/9", display: "grid", placeItems: "center", fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>{media.error || "Starting camera…"}</div>
              )}
            </div>
            {media.error && <p style={{ marginTop: "8px", fontSize: "14px", fontWeight: 600, color: "#ffffff" }}>{media.error} We Can Still Meet With Camera Off.</p>}
            <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button onClick={media.toggleMute} className="aurora-btn-dark" style={{ padding: "10px 20px" }}>{media.muted ? "Unmute" : "Mute"}</button>
              <button onClick={media.toggleCamera} className="aurora-btn-dark" style={{ padding: "10px 20px" }}>{media.cameraOff ? "Camera on" : "Camera off"}</button>
              <button onClick={() => media.start().catch(() => {})} style={{ background: "none", border: 0, color: "rgba(255,255,255,0.7)", fontSize: "14px", cursor: "pointer" }}>Retry →</button>
            </div>
          </div>
          <div className="aurora-card" style={{ height: "fit-content", padding: "20px" }}>
            <h2 style={{ fontWeight: 400, fontFamily: "'Londrina Solid', sans-serif", fontSize: "24px" }}>Ready To Join?</h2>
            <label htmlFor="lname" className="aurora-label" style={{ marginTop: "16px" }}>Your name</label>
            <input id="lname" value={name} onChange={(e) => setName(e.target.value)} placeholder="Display name" maxLength={40} className="aurora-input" />
            {meta?.hasPassword && (
              <>
                <label htmlFor="lpwd" className="aurora-label" style={{ marginTop: "12px" }}>Password</label>
                <input id="lpwd" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="aurora-input" />
              </>
            )}
            <button onClick={doJoin} disabled={!name.trim()} className="aurora-btn-dark" style={{ marginTop: "16px", width: "100%", opacity: name.trim() ? 1 : 0.5 }}>
              {hostToken ? "Start meeting" : "Join now"}
            </button>
            <p style={{ marginTop: "8px", textAlign: "center", fontSize: "11px", color: "rgba(255,255,255,0.45)" }}>Camera/mic stay in your browser until you join.</p>
            {toast && <p style={{ marginTop: "8px", textAlign: "center", fontSize: "14px", fontWeight: 700, color: "#f72b2b" }}>{toast}</p>}
          </div>
        </div>
      </div>
    )
  }

  // ---------- ROOM ----------
  if (m.status === "waiting") {
    return <div style={{ display: "grid", placeItems: "center", minHeight: "100svh", background: "#0c090c", color: "#fff", padding: "24px", textAlign: "center" }}><div><h1 style={{ fontSize: "24px", fontWeight: 400, fontFamily: "'Londrina Solid', sans-serif" }}>Waiting For The Host To Let You In…</h1><p style={{ marginTop: "8px", fontSize: "16px", fontWeight: 600, color: "#ffffff" }}>We Will Let You In Soon. Keep This Tab Open.</p><button onClick={doLeave} className="aurora-btn-dark" style={{ marginTop: "16px" }}>Leave</button></div></div>
  }
  if (m.status === "error" || m.status === "ended") {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "100svh", background: "#000", color: "#fff", padding: "24px", textAlign: "center" }}>
        <div style={{ maxWidth: "420px" }}>
          <h1 style={{ fontFamily: "'Londrina Solid', sans-serif", fontSize: "32px", fontWeight: 400 }}>{m.status === "ended" ? "Meeting Ended" : "Could Not Join"}</h1>
          <p style={{ marginTop: "8px", fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>{m.error || "Room unavailable."}</p>
          <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "14px" }}>
            <button onClick={() => navigate("/join")} className="aurora-btn-dark">Try again</button>
            <button onClick={() => navigate("/")} style={{ background: "none", border: 0, color: "rgba(255,255,255,0.7)", cursor: "pointer" }}>Home →</button>
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
    <div className="flex h-dvh flex-col bg-black text-white">
      <TopBar title={meta?.title || m.room?.title || "ShadowMeet"} code={code} count={allTiles.length} timer={formatTimer(elapsed)} conn={m.status === "joined" ? "Good" : m.status} recording={recording} onInvite={() => setInvite(true)} />
      {toast && <div className="bg-supari-primary px-4 py-1.5 text-center text-xs font-bold text-white">{toast}</div>}
      {m.locked && <div className="bg-white/5 px-4 py-1 text-center text-[11px] font-semibold text-white">Room Locked</div>}

      <div className="flex min-h-0 flex-1">
        <main className="flex min-w-0 flex-1 flex-col p-2 sm:p-3">
          <VideoGrid local={[allTiles[0]]} remotes={allTiles.slice(1)} />
          {sharing && <p className="mt-1 text-center text-xs font-bold text-white">We Are Sharing Your Screen <button onClick={toggleShare} className="ml-2 rounded-[3px] bg-supari-primary px-2 py-0.5 font-bold text-white">Stop Sharing</button></p>}
        </main>

        {sideOpen && (
          <aside className="flex w-full max-w-[340px] shrink-0 flex-col border-l-[3px] border-white bg-black max-sm:fixed max-sm:inset-y-0 max-sm:right-0 max-sm:z-40 max-sm:w-[88vw]">
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
        <div className="fixed bottom-20 left-1/2 z-40 w-[92vw] max-w-sm -translate-x-1/2 rounded-[3px] border-[3px] border-white bg-black p-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <button onClick={() => { setInvite(true); setMoreOpen(false) }} className="rounded-xl bg-white/5 p-2.5 font-semibold">📨 Invite</button>
            <button onClick={() => { m.raiseHand(!m.handRaised); }} className="rounded-xl bg-white/5 p-2.5 font-semibold">{m.handRaised ? "Lower hand" : "✋ Raise hand"}</button>
            {isHost && <button onClick={() => { m.host.muteAll(); setMoreOpen(false) }} className="rounded-xl bg-white/5 p-2.5 font-semibold">Mute all</button>}
            {isHost && <button onClick={() => { m.host.lock(!m.locked); setMoreOpen(false) }} className="rounded-xl bg-white/5 p-2.5 font-semibold">{m.locked ? "Unlock room" : "Lock room"}</button>}
            {isHost && <button onClick={() => { if (confirm("End meeting for everyone?")) m.host.end() }} className="rounded-[3px] bg-supari-primary p-2.5 font-semibold text-white">End Meeting</button>}
            <button onClick={() => { setPanel("people"); setMoreOpen(false) }} className="rounded-xl bg-white/5 p-2.5 font-semibold">👥 People</button>
          </div>
          {!isHost && <p className="mt-2 text-center text-[11px] font-semibold text-white">We Keep Host Controls With The Host.</p>}
        </div>
      )}
      {invite && <InviteDialog code={code} title={meta?.title || m.room?.title || "ShadowMeet"} onClose={() => setInvite(false)} />}
    </div>
  )
}
