import {
  Video, LayoutGrid, MonitorUp, PenTool, Play, Music, BarChart3,
  Users, Clock, MessageSquare, Radio
} from "lucide-react"

export function TopBar({
  title, code, count, timer, recording,
  activeTab, onTab,
}) {
  const tabs = [
    { id: "stage", label: "Video Stage", Icon: LayoutGrid },
    { id: "share", label: "Screen Share", Icon: MonitorUp },
    { id: "board", label: "Whiteboard", Icon: PenTool },
    { id: "watch", label: "Watch", Icon: Play },
    { id: "music", label: "Music", Icon: Music },
    { id: "polls", label: "Polls", Icon: BarChart3 },
    { id: "breakout", label: "Breakout", Icon: Users },
  ]
  return (
    <header className="flex items-center gap-3 px-3 py-2.5 sm:px-4" style={{ background: "#fff", borderBottom: "1px solid rgba(30,70,140,.1)" }}>
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="grid h-8 w-8 flex-none place-items-center rounded-[10px] bg-[#724aee] text-white">
          <Video size={16} />
        </div>
        <h1 className="truncate text-[14px] font-bold text-[#16283A]">{title || "Algebra 101"}</h1>
        <span className="hidden font-mono text-[11px] tracking-widest text-[#8AA6B8] sm:block">{code}</span>
        <span className="flex flex-none items-center gap-1 rounded-md bg-[#E8382F] px-2 py-0.5 text-[10px] font-bold tracking-wide text-white">
          <Radio size={10} /> LIVE
        </span>
        {recording && (
          <span className="flex flex-none items-center gap-1 rounded-md bg-[#16283A] px-2 py-0.5 text-[10px] font-bold text-white">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" /> REC
          </span>
        )}
      </div>

      <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto" aria-label="Stage">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onTab(id)}
            className={`classroom-tab ${activeTab === id ? "active" : ""}`}
            title={label}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </nav>

      <div className="flex flex-none items-center gap-2 text-[12px] font-semibold text-[#5B7290]">
        <span className="hidden items-center gap-1.5 tabular-nums md:flex">
          <Clock size={13} /> {timer}
        </span>
        <span className="hidden items-center gap-1 rounded-full bg-[#F1F6FA] px-2.5 py-1 lg:flex">
          <Users size={12} /> {count}
        </span>
        <button onClick={() => onTab("chat")} aria-label="Chat" className="classroom-rail-btn" style={{ width: "32px", height: "32px" }}>
          <MessageSquare size={15} />
        </button>
      </div>
    </header>
  )
}

export function formatTimer(sec) {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  const mm = String(m).padStart(2, "0")
  const ss = String(s).padStart(2, "0")
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}
