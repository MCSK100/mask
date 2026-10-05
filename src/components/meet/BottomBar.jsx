import {
  Mic, MicOff, Video, VideoOff, MonitorUp, Hand, Disc,
  Smile, MoreHorizontal, PhoneOff
} from "lucide-react"

function DockBtn({ onClick, label, active, off, children }) {
  return (
    <button onClick={onClick} aria-label={label} title={label} className={`classroom-dock-btn ${active ? "on" : ""} ${off ? "off" : ""}`}>
      <span className="ic">{children}</span>
      {label}
    </button>
  )
}

export function BottomBar({
  muted, cameraOff, sharing, handRaised, recording,
  onMute, onCamera, onShare, onHand, onRecord, onMore, onLeave, onReact
}) {
  return (
    <div className="flex justify-center px-2 pb-1 pt-2">
      <footer className="classroom-dock flex items-center gap-1 px-3 py-2 sm:gap-2" style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}>
        <DockBtn onClick={onMute} label="Mic" active={!muted} off={muted}>
          {muted ? <MicOff size={19} color="#E8382F" /> : <Mic size={19} color="#22B573" />}
        </DockBtn>
        <DockBtn onClick={onCamera} label="Camera" active={!cameraOff} off={cameraOff}>
          {cameraOff ? <VideoOff size={19} color="#E8382F" /> : <Video size={19} color="#22B573" />}
        </DockBtn>
        <DockBtn onClick={onShare} label="Share" active={sharing}>
          <MonitorUp size={19} color={sharing ? "#724aee" : "#1F3A5F"} />
        </DockBtn>
        <DockBtn onClick={onRecord} label="Record" active={recording}>
          <Disc size={19} color={recording ? "#E8382F" : "#1F3A5F"} />
        </DockBtn>
        <DockBtn onClick={onReact || onHand} label="React" active={handRaised}>
          {handRaised ? <Hand size={19} color="#F5B301" /> : <Smile size={19} color="#1F3A5F" />}
        </DockBtn>
        <DockBtn onClick={onMore} label="More">
          <MoreHorizontal size={19} color="#1F3A5F" />
        </DockBtn>
        <button
          onClick={onLeave} aria-label="Leave meeting"
          className="ml-2 flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white"
          style={{ background: "#E8382F", boxShadow: "0 10px 24px -10px rgba(232,56,47,.7)" }}
        >
          <PhoneOff size={16} /> Leave
        </button>
      </footer>
    </div>
  )
}
