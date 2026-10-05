import { useEffect, useRef } from "react"
import { Mic, MicOff, Pin } from "lucide-react"

export function VideoTile({ name, stream, muted, cameraOff, speaking, isLocal, isHost, pinned, onPin, sharing, large }) {
  const ref = useRef(null)
  useEffect(() => {
    if (ref.current && stream) {
      ref.current.srcObject = stream
    }
  }, [stream])

  return (
    <div
      onDoubleClick={onPin}
      title={name}
      className="group relative overflow-hidden"
      style={{
        height: "100%",
        borderRadius: large ? "14px" : "12px",
        background: "#0F2233",
        border: speaking ? "2px solid #724aee" : "1px solid rgba(255,255,255,.14)",
        boxShadow: speaking ? "0 0 0 3px rgba(13,153,255,.25)" : "none",
      }}
    >
      {stream && !cameraOff ? (
        <video ref={ref} autoPlay playsInline muted={isLocal} className={`h-full w-full ${sharing ? "object-contain" : "object-cover"}`} />
      ) : (
        <div className="flex h-full min-h-[90px] w-full items-center justify-center" style={{ background: "linear-gradient(135deg,#2B4A6B,#16283A)" }}>
          <div
            className="flex items-center justify-center rounded-full font-bold text-white"
            style={{ width: large ? "72px" : "44px", height: large ? "72px" : "44px", fontSize: large ? "28px" : "18px", background: "linear-gradient(135deg,#724aee,#7C5CFF)" }}
          >
            {(name || "?").slice(0, 1).toUpperCase()}
          </div>
        </div>
      )}
      <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1">
        {muted && (
          <span className="grid h-5 w-5 place-items-center rounded-full bg-black/60">
            <MicOff size={11} color="#fff" />
          </span>
        )}
        <span className="rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
          {name}{isLocal ? " (You)" : ""}
        </span>
      </div>
      {isHost && (
        <span className="absolute left-1.5 top-1.5 rounded bg-white px-1 py-px text-[9px] font-bold text-[#5f36e0]">HOST</span>
      )}
      {sharing && (
        <span className="absolute left-1.5 bottom-1.5 rounded bg-[#724aee] px-1.5 py-px text-[9px] font-bold text-white">SHARING</span>
      )}
      {speaking && (
        <span className="absolute left-1.5 bottom-1.5 flex items-center gap-1 rounded bg-[#724aee] px-1.5 py-px text-[9px] font-bold text-white">
          <Mic size={9} /> speaking
        </span>
      )}
      {onPin && (
        <button onClick={onPin} aria-label={pinned ? "Unpin" : "Pin"} className="absolute right-1.5 top-1.5 rounded-md bg-black/50 p-1 text-white opacity-0 transition group-hover:opacity-100">
          <Pin size={12} />
        </button>
      )}
    </div>
  )
}
