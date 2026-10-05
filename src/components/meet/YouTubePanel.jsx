import { useEffect, useRef, useState } from "react"
import { extractYouTubeId } from "../../utils/youtube"

let apiLoaded = false
function loadYTApi() {
  return new Promise((resolve) => {
    if (apiLoaded && window.YT?.Player) return resolve()
    if (document.getElementById("yt-iframe-api")) {
      const check = setInterval(() => { if (window.YT?.Player) { clearInterval(check); apiLoaded = true; resolve() } }, 200)
      return
    }
    const s = document.createElement("script")
    s.id = "yt-iframe-api"
    s.src = "https://www.youtube.com/iframe_api"
    document.body.appendChild(s)
    window.onYouTubeIframeAPIReady = () => { apiLoaded = true; resolve() }
    setTimeout(() => resolve(), 8000) // don't hang forever
  })
}

/** Synchronized YouTube: host drives state, guests follow. Real IFrame API. */
export function YouTubePanel({ yt, isHost, onSet, onPlay, onPause, onSeek }) {
  const [url, setUrl] = useState("")
  const [err, setErr] = useState(null)
  const [ready, setReady] = useState(false)
  const [needGesture, setNeedGesture] = useState(false)
  const playerRef = useRef(null)
  const holderRef = useRef(null)
  const lastVid = useRef(null)
  const suppress = useRef(false)

  useEffect(() => {
    let cancelled = false
    loadYTApi().then(() => { if (!cancelled) setReady(true) })
    return () => { cancelled = true }
  }, [])

  // (re)create player when videoId changes
  useEffect(() => {
    if (!ready || !yt?.videoId || !holderRef.current || !window.YT?.Player) return
    if (lastVid.current === yt.videoId && playerRef.current) {
      // sync play/pause/seek
      syncState()
      return
    }
    lastVid.current = yt.videoId
    try { playerRef.current?.destroy() } catch {}
    playerRef.current = new window.YT.Player(holderRef.current, {
      videoId: yt.videoId,
      playerVars: { rel: 0, modestbranding: 1 },
      events: {
        onReady: (e) => { syncState(); e.target.mute?.(); e.target.playVideo?.() },
        onStateChange: (e) => {
          if (suppress.current || !isHost) return
          // YT states: 1 playing, 2 paused
          const t = playerRef.current?.getCurrentTime?.() || 0
          if (e.data === 1) onPlay(t)
          else if (e.data === 2) onPause(t)
        },
        onError: () => setErr("This video cannot be embedded. Try another.")
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, yt?.videoId])

  const syncState = () => {
    const p = playerRef.current
    if (!p?.seekTo || !yt) return
    suppress.current = true
    try {
      const cur = p.getCurrentTime?.() || 0
      const drift = Math.abs(cur - (yt.time || 0))
      // account for elapsed while playing
      let target = yt.time || 0
      if (yt.playing && yt.updatedAt) target += (Date.now() - yt.updatedAt) / 1000
      if (drift > 2.5) p.seekTo(target, true)
      if (yt.playing) { p.playVideo?.(); setNeedGesture(false) }
      else p.pauseVideo?.()
    } catch { setNeedGesture(true) }
    setTimeout(() => { suppress.current = false }, 800)
  }

  useEffect(() => { syncState() /* follow host */ }, [yt?.playing, yt?.updatedAt]) // eslint-disable-line

  const submit = (e) => {
    e?.preventDefault()
    setErr(null)
    const id = extractYouTubeId(url)
    if (!id) { setErr("Invalid YouTube URL or ID."); return }
    onSet(id)
    setUrl("")
  }

  return (
    <div className="flex h-full flex-col p-3">
      {isHost && (
        <form onSubmit={submit} className="mb-2 flex gap-2">
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste YouTube URL…" aria-label="YouTube URL" className="aurora-input min-w-0 flex-1" />
          <button className="rounded-[80px] bg-supari-secondary px-4 text-sm font-bold text-white">Play</button>
        </form>
      )}
      {err && <p className="mb-2 text-sm font-bold text-white">{err}</p>}
      {!yt?.videoId ? (
        <div className="grid flex-1 place-items-center rounded-xl border border-dashed border-white/15 text-sm text-slate-500">
          {isHost ? "Paste a YouTube link above to watch together." : "Host hasn't started a video yet."}
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-xl bg-black">
            <div ref={holderRef} className="aspect-video w-full" />
          </div>
          {needGesture && (
            <button onClick={() => { setNeedGesture(false); syncState() }} className="aurora-btn-dark mt-2">Click To Start Synced Playback</button>
          )}
          {isHost && (
            <div className="mt-2 flex gap-2">
              <button onClick={() => onPlay(playerRef.current?.getCurrentTime?.() || 0)} className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold">Play</button>
              <button onClick={() => onPause(playerRef.current?.getCurrentTime?.() || 0)} className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold">Pause</button>
              <button onClick={() => { const t = (playerRef.current?.getCurrentTime?.() || 0) - 10; playerRef.current?.seekTo(Math.max(0, t), true); onSeek(Math.max(0, t)) }} className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold">-10s</button>
              <button onClick={() => { const t = (playerRef.current?.getCurrentTime?.() || 0) + 10; playerRef.current?.seekTo(t, true); onSeek(t) }} className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold">+10s</button>
            </div>
          )}
          <p className="mt-2 text-[11px] text-slate-500">Embedded YouTube playback — no downloading. Sync follows the host.</p>
        </>
      )}
    </div>
  )
}
