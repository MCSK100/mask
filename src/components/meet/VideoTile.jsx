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
      className={`group relative overflow-hidden rounded-[3px] border bg-black transition-all ${
        speaking ? "border-[#f72b2b]" : "border-white/20"
      } ${pinned ? "ring-2 ring-[#f72b2b]" : ""}`}
      onDoubleClick={onPin}
      title={name}
    >
      {stream && !cameraOff ? (
        <video ref={ref} autoPlay playsInline muted={isLocal} className={`h-full w-full object-cover ${sharing ? "object-contain bg-black" : ""}`} />
      ) : (
        <div className="flex h-full min-h-[140px] w-full items-center justify-center bg-supari-secondary">
          <div className="flex h-14 w-14 items-center justify-center rounded-[80px] bg-white font-display text-xl font-bold text-supari-primary">
            {(name || "?").slice(0, 1).toUpperCase()}
          </div>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/80 to-transparent px-3 pb-2 pt-6 text-xs">
        <span className="flex min-w-0 items-center gap-1.5">
          {muted ? <span aria-label="muted">🔇</span> : <span aria-label="unmuted">🎙️</span>}
          <span className="truncate font-medium text-white">{name}{isLocal ? " (You)" : ""}</span>
          {isHost && <span className="rounded-[3px] bg-white px-1.5 py-0.5 text-[10px] font-bold text-supari-primary">HOST</span>}
          {isCohost && !isHost && <span className="rounded-[3px] bg-white px-1.5 py-0.5 text-[10px] font-bold text-supari-primary">CO-HOST</span>}
          {sharing && <span className="rounded-[3px] bg-supari-primary px-1.5 py-0.5 text-[10px] font-bold text-white">SHARING</span>}
        </span>
        {speaking && <span className="h-2 w-2 animate-pulse rounded-full bg-supari-primary" />}
      </div>
      {onPin && (
        <button onClick={onPin} aria-label={pinned ? "Unpin" : "Pin"} className="absolute right-2 top-2 rounded-lg bg-black/50 px-2 py-1 text-xs text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
          {pinned ? "Unpin" : "Pin"}
        </button>
      )}
    </div>
  )
}
