import {
  Mic, MicOff, Video, VideoOff, ScreenShare, PenTool, MessageSquare, Users,
  Play, BarChart3, Hand, Disc, MoreHorizontal, PhoneOff
} from "lucide-react"

const Btn = ({ active, danger, onClick, label, children, title }) => (
  <button
    onClick={onClick}
    aria-label={label}
    title={title || label}
    className={`meet-btn ${danger ? "danger" : active ? "active" : ""}`}
  >
    {children}
  </button>
)

export function BottomBar({ muted, cameraOff, sharing, handRaised, recording, onMute, onCamera, onShare, onChat, onPeople, onBoard, onTube, onPolls, onHand, onRecord, onMore, onLeave, chatOpen, activePanel }) {
  const ic = 18
  return (
    <footer className="meet-bottom px-2 py-2 sm:px-4" style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}>
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-1.5 sm:gap-2">
        <Btn onClick={onMute} label={muted ? "Unmute" : "Mute"} title="Microphone" active={!muted}>{muted ? <MicOff size={ic} /> : <Mic size={ic} />}</Btn>
        <Btn onClick={onCamera} label="Camera" title="Camera" active={!cameraOff}>{cameraOff ? <VideoOff size={ic} /> : <Video size={ic} />}</Btn>
        <Btn onClick={onShare} label="Share screen" active={sharing}><ScreenShare size={ic} /></Btn>
        <Btn onClick={onBoard} label="Whiteboard" active={activePanel === "board"}><PenTool size={ic} /></Btn>
        <Btn onClick={onChat} label="Chat" active={chatOpen || activePanel === "chat"}><MessageSquare size={ic} /></Btn>
        <Btn onClick={onPeople} label="Participants" active={activePanel === "people"}><Users size={ic} /></Btn>
        <span className="hidden items-center gap-1.5 sm:flex">
          <Btn onClick={onTube} label="Watch together" active={activePanel === "tube"}><Play size={ic} /></Btn>
          <Btn onClick={onPolls} label="Polls" active={activePanel === "polls"}><BarChart3 size={ic} /></Btn>
          <Btn onClick={onHand} label="Raise hand" active={handRaised}><Hand size={ic} /></Btn>
          <Btn onClick={onRecord} label="Record (local)" active={recording}><Disc size={ic} /></Btn>
        </span>
        <Btn onClick={onMore} label="More"><MoreHorizontal size={ic} /></Btn>
        <button onClick={onLeave} aria-label="Leave meeting" className="ml-1 flex items-center gap-2 rounded-full bg-[#F0531C] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_26px_-12px_#F0531C] hover:bg-[#D2410E]"><PhoneOff size={15} /> Leave</button>
      </div>
    </footer>
  )
}
