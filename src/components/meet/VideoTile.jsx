import { useEffect, useRef } from "react"
import { Mic, MicOff, Pin, PinOff } from "lucide-react"

export function VideoTile({ name, stream, muted, cameraOff, speaking, isLocal, isHost, isCohost, pinned, onPin, sharing }) {
  const ref = useRef(null)
  useEffect(() => {
    if (ref.current && stream) {
      ref.current.srcObject = stream
    }
  }, [stream])

  return (
    <div
      className={`meet-tile group relative overflow-hidden transition-all ${speaking ? "speaking" : ""}`}
      onDoubleClick={onPin}
      title={name}
      style={{ height: "100%" }}
    >
      {stream && !cameraOff ? (
        <video ref={ref} autoPlay playsInline muted={isLocal} className={`h-full w-full object-cover ${sharing ? "object-contain bg-[#14202B]" : ""}`} />
      ) : (
        <div className="flex h-full min-h-[140px] w-full items-center justify-center" style={{ background: "linear-gradient(135deg,#EAF3FB,#F1F6FA)" }}>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F0531C] font-display text-xl font-bold text-white">
            {(name || "?").slice(0, 1).toUpperCase()}
          </div>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 px-3 pb-2 pt-6 text-xs" style={{ background: "linear-gradient(to top, rgba(20,32,43,.75), transparent)" }}>
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-white/90">
            {muted ? <MicOff size={11} color="#F0531C" /> : <Mic size={11} color="#14202B" />}
          </span>
          <span className="truncate font-medium text-white">{name}{isLocal ? " (You)" : ""}</span>
          {isHost && <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-bold text-[#F0531C]">HOST</span>}
          {isCohost && !isHost && <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-bold text-[#0D99FF]">CO-HOST</span>}
          {sharing && <span className="rounded bg-[#F0531C] px-1.5 py-0.5 text-[10px] font-bold text-white">SHARING</span>}
        </span>
        {speaking && <span className="h-2 w-2 animate-pulse rounded-full bg-[#F0531C]" />}
      </div>
      {onPin && (
        <button onClick={onPin} aria-label={pinned ? "Unpin" : "Pin"} className="absolute right-2 top-2 flex items-center gap-1 rounded-lg bg-white/90 px-2 py-1 text-[11px] font-bold text-[#14202B] opacity-0 backdrop-blur transition group-hover:opacity-100">
          {pinned ? <PinOff size={12} /> : <Pin size={12} />} {pinned ? "Unpin" : "Pin"}
        </button>
      )}
    </div>
  )
}
