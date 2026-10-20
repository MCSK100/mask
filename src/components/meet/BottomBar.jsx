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
          {muted ? <MicOff size={19} color="var(--os-danger)" /> : <Mic size={19} color="var(--os-success)" />}
        </DockBtn>
        <DockBtn onClick={onCamera} label="Camera" active={!cameraOff} off={cameraOff}>
          {cameraOff ? <VideoOff size={19} color="var(--os-danger)" /> : <Video size={19} color="var(--os-success)" />}
        </DockBtn>
        <DockBtn onClick={onShare} label="Share" active={sharing}>
          <MonitorUp size={19} color={sharing ? "var(--os-accent)" : "#d6dfe3"} />
        </DockBtn>
        <DockBtn onClick={onRecord} label="Record" active={recording}>
          <Disc size={19} color={recording ? "var(--os-danger)" : "#d6dfe3"} />
        </DockBtn>
        <DockBtn onClick={onReact || onHand} label="React" active={handRaised}>
          {handRaised ? <Hand size={19} color="var(--os-accent)" /> : <Smile size={19} color="#d6dfe3" />}
        </DockBtn>
        <DockBtn onClick={onMore} label="More">
          <MoreHorizontal size={19} color="#d6dfe3" />
        </DockBtn>
        <button
          onClick={onLeave} aria-label="Leave meeting"
          className="ml-2 flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white"
          style={{ background: "var(--os-danger)", boxShadow: "0 10px 24px -10px rgba(220,116,109,.42)" }}
        >
          <PhoneOff size={16} /> Leave
        </button>
      </footer>
    </div>
  )
}
