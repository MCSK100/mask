import { useEffect, useRef } from "react"

export function VideoTile({ name, stream, muted, cameraOff, speaking, isLocal, isHost, isCohost, pinned, onPin, sharing }) {
  const ref = useRef(null)
  useEffect(() => {
    if (ref.current && stream) {
      ref.current.srcObject = stream
    }
  }, [stream])

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border bg-slate-950/80 transition-all ${
        speaking ? "border-emerald-400/70 shadow-[0_0_24px_rgba(52,211,153,0.35)]" : "border-white/10"
      } ${pinned ? "ring-2 ring-indigo-400/70" : ""}`}
      onDoubleClick={onPin}
      title={name}
    >
      {stream && !cameraOff ? (
        <video ref={ref} autoPlay playsInline muted={isLocal} className={`h-full w-full object-cover ${sharing ? "object-contain bg-black" : ""}`} />
      ) : (
        <div className="flex h-full min-h-[140px] w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/20 text-xl font-bold text-indigo-200">
            {(name || "?").slice(0, 1).toUpperCase()}
          </div>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/80 to-transparent px-3 pb-2 pt-6 text-xs">
        <span className="flex min-w-0 items-center gap-1.5">
          {muted ? <span aria-label="muted">🔇</span> : <span aria-label="unmuted">🎙️</span>}
          <span className="truncate font-medium text-white">{name}{isLocal ? " (You)" : ""}</span>
          {isHost && <span className="rounded bg-amber-400/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-300">HOST</span>}
          {isCohost && !isHost && <span className="rounded bg-sky-400/20 px-1.5 py-0.5 text-[10px] font-bold text-sky-300">CO-HOST</span>}
          {sharing && <span className="rounded bg-emerald-400/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300">SHARING</span>}
        </span>
        {speaking && <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />}
      </div>
      {onPin && (
        <button onClick={onPin} aria-label={pinned ? "Unpin" : "Pin"} className="absolute right-2 top-2 rounded-lg bg-black/50 px-2 py-1 text-xs text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
          {pinned ? "Unpin" : "Pin"}
        </button>
      )}
    </div>
  )
}
