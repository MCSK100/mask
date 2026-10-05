const Btn = ({ active, danger, onClick, label, children, title }) => (
  <button
    onClick={onClick}
    aria-label={label}
    title={title || label}
    className={`flex h-11 w-11 items-center justify-center rounded-full border text-lg transition sm:h-12 sm:w-12 ${
      danger ? "border-red-500/40 bg-red-500/15 text-red-300 hover:bg-red-500/25"
      : active ? "border-emerald-400/50 bg-emerald-500/25 text-white"
      : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
    }`}
  >
    {children}
  </button>
)

export function BottomBar({ muted, cameraOff, sharing, handRaised, recording, onMute, onCamera, onShare, onChat, onPeople, onBoard, onTube, onPolls, onHand, onRecord, onMore, onLeave, chatOpen, activePanel }) {
  return (
    <footer className="border-t border-white/10 bg-black/85 px-2 py-2 backdrop-blur sm:px-4" style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}>
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-1.5 sm:gap-2">
        <Btn onClick={onMute} label={muted ? "Unmute" : "Mute"} title="Microphone" active={!muted}>{muted ? "🔇" : "🎙️"}</Btn>
        <Btn onClick={onCamera} label="Camera" title="Camera" active={!cameraOff}>{cameraOff ? "🚫" : "📹"}</Btn>
        <Btn onClick={onShare} label="Share screen" active={sharing}>🖥️</Btn>
        <Btn onClick={onBoard} label="Whiteboard" active={activePanel === "board"}>✏️</Btn>
        <Btn onClick={onChat} label="Chat" active={chatOpen || activePanel === "chat"}>💬</Btn>
        <Btn onClick={onPeople} label="Participants" active={activePanel === "people"}>👥</Btn>
        <span className="hidden items-center gap-1.5 sm:flex">
          <Btn onClick={onTube} label="Watch together" active={activePanel === "tube"}>▶️</Btn>
          <Btn onClick={onPolls} label="Polls" active={activePanel === "polls"}>📊</Btn>
          <Btn onClick={onHand} label="Raise hand" active={handRaised}>✋</Btn>
          <Btn onClick={onRecord} label="Record (local)" active={recording}>⏺️</Btn>
        </span>
        <Btn onClick={onMore} label="More">⋯</Btn>
        <button onClick={onLeave} aria-label="Leave meeting" className="ml-1 rounded-full bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-500">Leave</button>
      </div>
    </footer>
  )
}
