import { useEffect, useRef } from "react"
import { Track } from "livekit-client"
import { Mic, MicOff, Pin, MonitorUp, Signal } from "lucide-react"

/**
 * ParticipantTile — renders a LiveKit participant's camera/screen + audio.
 * Uses track attach/detach (no manual WebRTC). Shows name, camera/mic,
 * speaking, connection quality. Screen share gets priority treatment.
 */
export function ParticipantTile({ info, large, onPin, pinned }) {
  const videoRef = useRef(null)
  const audioRef = useRef(null)
  const p = info?.participant

  const screenPub = p
    ? [...p.getTrackPublications().values()].find((t) => t.source === Track.Source.ScreenShare && t.track)
    : null
  const camPub = p
    ? [...p.getTrackPublications().values()].find((t) => t.source === Track.Source.Camera)
    : null
  const micPub = p
    ? [...p.getTrackPublications().values()].find((t) => t.source === Track.Source.Microphone)
    : null

  const videoTrack = screenPub?.track || camPub?.track || null
  const hasVideo = Boolean(videoTrack) && (screenPub ? !screenPub.isMuted : info?.cameraEnabled)

  useEffect(() => {
    const el = videoRef.current
    if (el && videoTrack) {
      try {
        videoTrack.attach(el)
      } catch { /* best-effort: ignore transient media/data errors */ }
      return () => {
        try {
          videoTrack.detach(el)
        } catch { /* best-effort: ignore transient media/data errors */ }
      }
    }
  }, [videoTrack])

  useEffect(() => {
    const track = micPub?.track
    const el = audioRef.current
    if (!track || !el) return
    if (info?.isLocal) return // never play back local mic
    try {
      track.attach(el)
    } catch { /* best-effort: ignore transient media/data errors */ }
    return () => {
      try {
        track.detach(el)
      } catch { /* best-effort: ignore transient media/data errors */ }
    }
  }, [micPub, info?.isLocal])

  const qualityColor =
    info?.connectionQuality === "excellent"
      ? "#22B573"
      : info?.connectionQuality === "good"
        ? "#724aee"
        : info?.connectionQuality === "poor"
          ? "#F5B301"
          : "#8AA6B8"

  return (
    <div
      onDoubleClick={onPin}
      title={info?.name}
      className="group relative overflow-hidden"
      style={{
        height: "100%",
        borderRadius: large ? "14px" : "12px",
        background: "#0F2233",
        border: info?.isSpeaking ? "2px solid #724aee" : "1px solid rgba(255,255,255,.14)",
        boxShadow: info?.isSpeaking ? "0 0 0 3px rgba(13,153,255,.25)" : "none",
      }}
    >
      {hasVideo ? (
        <video ref={videoRef} autoPlay playsInline muted={info?.isLocal} className={`h-full w-full ${screenPub ? "object-contain" : "object-cover"}`} />
      ) : (
        <div className="flex h-full min-h-[90px] w-full items-center justify-center" style={{ background: "linear-gradient(135deg,#2B4A6B,#16283A)" }}>
          <div
            className="flex items-center justify-center rounded-full font-bold text-white"
            style={{ width: large ? "72px" : "44px", height: large ? "72px" : "44px", fontSize: large ? "28px" : "18px", background: "linear-gradient(135deg,#724aee,#7C5CFF)" }}
          >
            {(info?.name || "?").slice(0, 1).toUpperCase()}
          </div>
        </div>
      )}
      {!info?.isLocal && <audio ref={audioRef} autoPlay />}
      <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1">
        {!info?.micEnabled && (
          <span className="grid h-5 w-5 place-items-center rounded-full bg-black/60">
            <MicOff size={11} color="#fff" />
          </span>
        )}
        <span className="rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
          {info?.name}{info?.isLocal ? " (You)" : ""}
        </span>
      </div>
      {info?.role === "host" && (
        <span className="absolute left-1.5 top-1.5 rounded bg-white px-1 py-px text-[9px] font-bold text-[#5f36e0]">HOST</span>
      )}
      {info?.screenShareEnabled && (
        <span className="absolute left-1.5 bottom-1.5 flex items-center gap-1 rounded bg-[#724aee] px-1.5 py-px text-[9px] font-bold text-white">
          <MonitorUp size={9} /> SHARING
        </span>
      )}
      {info?.isSpeaking && (
        <span className="absolute left-1.5 bottom-1.5 flex items-center gap-1 rounded bg-[#724aee] px-1.5 py-px text-[9px] font-bold text-white">
          <Mic size={9} /> speaking
        </span>
      )}
      <span className="absolute right-1.5 top-1.5 flex items-center gap-1 rounded bg-black/50 px-1.5 py-0.5 text-[9px] font-bold text-white" title={`Connection: ${info?.connectionQuality || "unknown"}`}>
        <Signal size={9} color={qualityColor} /> {info?.connectionQuality || ""}
      </span>
      {onPin && (
        <button onClick={onPin} aria-label={pinned ? "Unpin" : "Pin"} className="absolute left-1/2 top-1.5 -translate-x-1/2 rounded-md bg-black/50 p-1 text-white opacity-0 transition group-hover:opacity-100">
          <Pin size={12} />
        </button>
      )}
    </div>
  )
}
