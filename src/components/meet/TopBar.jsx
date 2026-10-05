import { Video, Users, Clock, Radio, UserPlus, CircleDot } from "lucide-react"

export function TopBar({ title, code, count, timer, conn, recording, live, onInvite }) {
  return (
    <header className="meet-topbar flex items-center justify-between gap-3 px-3 py-2 sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-[10px] bg-[#F0531C] text-white">
          <Video size={17} />
        </div>
        <div className="min-w-0">
          <h1 className="truncate font-display text-[15px] font-bold text-[#14202B] sm:text-base">{title || "ShadowMeet"}</h1>
          <p className="flex items-center gap-2 text-[11px] font-semibold text-[#4A6173]">
            <span className="rounded-md bg-[#F1F6FA] border border-[#14202b22] px-1.5 py-0.5 font-mono tracking-widest text-[#14202B]">{code}</span>
            <span className="flex items-center gap-1"><CircleDot size={11} color={conn === "Good" ? "#27c06b" : "#8AA6B8"} /> {conn}</span>
            <span className="flex items-center gap-1 tabular-nums"><Clock size={11} /> {timer}</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs">
        {recording && <span className="flex items-center gap-1.5 rounded-full bg-[#F0531C] px-2.5 py-1 font-bold text-white"><span className="h-2 w-2 animate-pulse rounded-full bg-white" /> REC</span>}
        {live && <span className="rounded-full bg-[#F0531C] px-2.5 py-1 font-bold text-white">LIVE</span>}
        <span className="flex items-center gap-1 rounded-full bg-[#14202B] px-2.5 py-1 font-bold text-white"><Users size={12} /> {count} Here</span>
        <button onClick={onInvite} className="aurora-btn-white hidden !py-1.5 sm:flex items-center gap-1.5"><UserPlus size={13} /> Invite</button>
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
