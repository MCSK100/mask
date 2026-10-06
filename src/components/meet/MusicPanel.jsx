import { useEffect, useRef, useState } from "react"
import { Music, Play, Pause, Link2, Search, Loader2, Volume2 } from "lucide-react"

const APP_NAME = "onespacelive"
const API = "https://discoveryprovider.audius.co/v1"

function streamUrl(id) {
  return `${API}/tracks/${id}/stream?app_name=${APP_NAME}`
}

function fmtDuration(sec) {
  if (!sec || Number.isNaN(sec)) return ""
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${String(s).padStart(2, "0")}`
}

/**
 * Discord-style shared audio (free, no key — Audius API).
 * Host searches -> loads -> plays. Every client streams the same
 * stream URL locally and follows host play/pause/seek via LiveKit
 * data (sm-music), correcting drift from host position + timestamp.
 */
export function MusicPanel({ music, isHost, onSet, onPlay, onPause, onSeek }) {
  const [url, setUrl] = useState("")
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [searchErr, setSearchErr] = useState(null)
  const [searched, setSearched] = useState(false)
  const audioRef = useRef(null)

  // Follow host state
  useEffect(() => {
    const el = audioRef.current
    if (!el || !music?.track) return
    const src = typeof music.track === "string" ? music.track : ""
    if (src && el.src !== src) el.src = src
    const target = (music.position || 0) + (music.playing && music.updatedAt ? (Date.now() - music.updatedAt) / 1000 : 0)
    try {
      if (Math.abs((el.currentTime || 0) - target) > 2.5) el.currentTime = target
      if (music.playing) el.play().catch(() => {})
      else el.pause()
    } catch { /* best-effort */ }
  }, [music?.track, music?.playing, music?.updatedAt]) // eslint-disable-line react-hooks/exhaustive-deps

  const doSearch = async (e) => {
    e?.preventDefault()
    const q = query.trim()
    if (!q || searching) return
    setSearching(true)
    setSearchErr(null)
    setSearched(true)
    try {
      const res = await fetch(`${API}/tracks/search?query=${encodeURIComponent(q)}&limit=12&app_name=${APP_NAME}`)
      if (!res.ok) throw new Error(`Search failed (${res.status})`)
      const json = await res.json()
      setResults(Array.isArray(json?.data) ? json.data : [])
    } catch (err) {
      setSearchErr(err.message || "Search failed. Check connection and retry.")
      setResults([])
    } finally {
      setSearching(false)
    }
  }

  const playTrack = (t) => {
    if (!isHost || !t?.id) return
    onSet(streamUrl(t.id), {
      title: t.title || "Unknown track",
      artist: t.user?.name || "Audius",
      artwork: t.artwork?.["150x150"] || t.artwork?.["480x480"] || null,
    })
  }

  const submitUrl = (e) => {
    e?.preventDefault()
    const t = url.trim()
    if (!t) return
    onSet(t, { title: t.split("/").pop() || "Custom audio", artist: "Custom URL", artwork: null })
    setUrl("")
  }

  const label = music?.title || (typeof music?.track === "string" ? music.track : "Audio")

  return (
    <div className="flex h-full flex-col bg-white p-3">
      <p className="flex items-center gap-2 text-[14px] font-bold text-[#16283A]">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#f5f2ff] text-[#724aee]"><Music size={16} /></span>
        Music
      </p>
      <p className="mt-0.5 pl-10 text-[12px] text-[#5B7290]">Synced playback · search free tracks, play together</p>

      {isHost && (
        <form onSubmit={doSearch} className="mb-2 mt-3 flex gap-2">
          <div className="relative min-w-0 flex-1">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8AA6B8]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search songs, artists… (free Audius catalog)"
              aria-label="Search music"
              className="meet-input w-full pl-9"
            />
          </div>
          <button disabled={searching || !query.trim()} className="flex items-center gap-1 rounded-full bg-[#724aee] px-4 py-2 text-xs font-bold text-white disabled:opacity-50">
            {searching ? <Loader2 size={12} className="animate-spin" /> : <Search size={12} />}
            {searching ? "Loading…" : "Search"}
          </button>
        </form>
      )}

      {/* Now playing */}
      {music?.track ? (
        <div className="mb-2 rounded-xl bg-[#F7FAFF] p-3">
          <div className="flex items-center gap-2.5">
            {music.artwork ? (
              <img src={music.artwork} alt="" className="h-10 w-10 flex-none rounded-lg object-cover" />
            ) : (
              <span className="grid h-10 w-10 flex-none place-items-center rounded-lg bg-[#E3ECF7] text-[#724aee]"><Volume2 size={18} /></span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-bold text-[#16283A]">{label}</p>
              {music.artist && <p className="truncate text-[11px] text-[#8AA6B8]">{music.artist}</p>}
              <p className="flex items-center gap-1 text-[11px] font-semibold text-[#22B573]">
                <span className={`h-1.5 w-1.5 rounded-full ${music.playing ? "animate-pulse bg-[#22B573]" : "bg-[#8AA6B8]"}`} />
                {music.playing ? "Playing in room" : "Paused"}
              </p>
            </div>
          </div>
          <audio ref={audioRef} controls className="mt-2 w-full" preload="metadata" />
          {isHost && (
            <div className="mt-2 flex gap-2">
              <button onClick={() => onPlay(audioRef.current?.currentTime || 0)} className="flex items-center gap-1 rounded-full bg-[#F1F6FA] px-3 py-1.5 text-xs font-bold"><Play size={12} /> Play</button>
              <button onClick={() => onPause(audioRef.current?.currentTime || 0)} className="flex items-center gap-1 rounded-full bg-[#F1F6FA] px-3 py-1.5 text-xs font-bold"><Pause size={12} /> Pause</button>
              <button onClick={() => onSeek(audioRef.current?.currentTime || 0)} className="rounded-full bg-[#F1F6FA] px-3 py-1.5 text-xs font-bold">Sync</button>
            </div>
          )}
        </div>
      ) : (
        <audio ref={audioRef} className="hidden" preload="metadata" />
      )}

      {/* Search results (host) */}
      {isHost && (
        <div className="min-h-0 flex-1 overflow-y-auto">
          {searchErr && <p className="mb-2 rounded-xl bg-[#FDECEC] p-2.5 text-[12px] font-semibold text-[#C0392B]">{searchErr}</p>}
          {searching && (
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex animate-pulse items-center gap-2.5 rounded-xl bg-[#F7FAFF] p-2.5">
                  <div className="h-10 w-10 rounded-lg bg-[#E3ECF7]" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-2/3 rounded bg-[#E3ECF7]" />
                    <div className="h-2.5 w-1/3 rounded bg-[#E3ECF7]" />
                  </div>
                </div>
              ))}
              <p className="text-center text-[12px] font-semibold text-[#8AA6B8]">Loading tracks…</p>
            </div>
          )}
          {!searching && results.length > 0 && (
            <div className="space-y-1.5">
              {results.map((t) => (
                <button
                  key={t.id}
                  onClick={() => playTrack(t)}
                  className="flex w-full items-center gap-2.5 rounded-xl p-2 text-left hover:bg-[#F7FAFF]"
                >
                  {t.artwork?.["150x150"] ? (
                    <img src={t.artwork["150x150"]} alt="" loading="lazy" className="h-10 w-10 flex-none rounded-lg object-cover" />
                  ) : (
                    <span className="grid h-10 w-10 flex-none place-items-center rounded-lg bg-[#E3ECF7] text-[#724aee]"><Music size={16} /></span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold text-[#16283A]">{t.title}</span>
                    <span className="block truncate text-[11px] text-[#8AA6B8]">
                      {t.user?.name || "Unknown"} {t.duration ? `· ${fmtDuration(t.duration)}` : ""}
                    </span>
                  </span>
                  <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-[#724aee] text-white"><Play size={14} /></span>
                </button>
              ))}
            </div>
          )}
          {!searching && searched && results.length === 0 && !searchErr && (
            <p className="rounded-xl bg-[#F7FAFF] p-3 text-center text-[12px] text-[#8AA6B8]">No tracks found. Try another search.</p>
          )}
          {!searching && !searched && !music?.track && (
            <div className="rounded-xl border border-dashed border-[#E3ECF7] bg-[#F7FAFF] p-4 text-center text-[13px] text-[#8AA6B8]">
              Search above to load a track — tapping play starts it for everyone in the room, Discord-style.
            </div>
          )}

          {/* Custom URL fallback */}
          <form onSubmit={submitUrl} className="mt-2 flex gap-2 border-t border-[#EAF0F7] pt-2">
            <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="…or paste audio URL" aria-label="Audio URL" className="meet-input min-w-0 flex-1 text-xs" />
            <button className="flex items-center gap-1 rounded-full bg-[#F1F6FA] px-3 py-2 text-xs font-bold"><Link2 size={12} /> Load</button>
          </form>
          <p className="mt-1.5 text-[10px] leading-relaxed text-[#8AA6B8]">Free catalog by Audius (no key needed). Streams play from URL on each device — no downloading.</p>
        </div>
      )}

      {!isHost && !music?.track && (
        <div className="grid flex-1 place-items-center rounded-xl border border-dashed border-[#E3ECF7] bg-[#F7FAFF] p-6 text-center text-[13px] text-[#8AA6B8]">
          Host hasn't started music yet.
        </div>
      )}
    </div>
  )
}
