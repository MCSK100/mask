import { useEffect, useRef, useState } from "react"
import { Music, Play, Pause, Link2 } from "lucide-react"

/**
 * Synchronized music player (MVP).
 * Host drives { track, playing, position } via LiveKit data (sm-music).
 * Audio itself is NOT routed through LiveKit — each client streams the
 * user-provided URL locally and follows host play/pause/seek events,
 * correcting drift from host position + event timestamp.
 * No downloading of copyrighted content.
 */
export function MusicPanel({ music, isHost, onSet, onPlay, onPause, onSeek }) {
  const [url, setUrl] = useState("")
  const audioRef = useRef(null)

  useEffect(() => {
    const el = audioRef.current
    if (!el || !music?.track) return
    if (el.src !== music.track) el.src = music.track
    const target = (music.position || 0) + (music.playing && music.updatedAt ? (Date.now() - music.updatedAt) / 1000 : 0)
    try {
      if (Math.abs((el.currentTime || 0) - target) > 2.5) el.currentTime = target
      if (music.playing) el.play().catch(() => {})
      else el.pause()
    } catch { /* best-effort: ignore transient media/data errors */ }
  }, [music?.track, music?.playing, music?.updatedAt]) // eslint-disable-line react-hooks/exhaustive-deps

  const submit = (e) => {
    e?.preventDefault()
    const t = url.trim()
    if (!t) return
    onSet(t)
    setUrl("")
  }

  return (
    <div className="flex h-full flex-col bg-white p-3">
      <p className="flex items-center gap-2 text-[14px] font-bold text-[#16283A]">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#E8F3FF] text-[#0D99FF]"><Music size={16} /></span>
        Music
      </p>
      <p className="mt-0.5 pl-10 text-[12px] text-[#5B7290]">Synced playback · your own audio URLs</p>
      {isHost && (
        <form onSubmit={submit} className="mb-2 mt-3 flex gap-2">
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste audio URL…" aria-label="Audio URL" className="meet-input min-w-0 flex-1" />
          <button className="flex items-center gap-1 rounded-full bg-[#0D99FF] px-3 py-2 text-xs font-bold text-white"><Link2 size={12} /> Load</button>
        </form>
      )}
      {!music?.track ? (
        <div className="grid flex-1 place-items-center rounded-xl border border-dashed border-[#E3ECF7] bg-[#F7FAFF] p-6 text-center text-[13px] text-[#8AA6B8]">
          {isHost ? "Load an audio URL above to play together." : "Host hasn't started music yet."}
        </div>
      ) : (
        <div className="mt-2 rounded-xl bg-[#F7FAFF] p-3">
          <p className="truncate text-[13px] font-semibold text-[#16283A]">{music.track}</p>
          <audio ref={audioRef} controls className="mt-2 w-full" preload="metadata" />
          {isHost && (
            <div className="mt-2 flex gap-2">
              <button onClick={() => onPlay(audioRef.current?.currentTime || 0)} className="flex items-center gap-1 rounded-full bg-[#F1F6FA] px-3 py-1.5 text-xs font-bold"><Play size={12} /> Play</button>
              <button onClick={() => onPause(audioRef.current?.currentTime || 0)} className="flex items-center gap-1 rounded-full bg-[#F1F6FA] px-3 py-1.5 text-xs font-bold"><Pause size={12} /> Pause</button>
              <button onClick={() => onSeek(audioRef.current?.currentTime || 0)} className="rounded-full bg-[#F1F6FA] px-3 py-1.5 text-xs font-bold">Sync</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
