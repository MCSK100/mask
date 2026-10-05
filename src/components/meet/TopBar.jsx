export function TopBar({ title, code, count, timer, conn, recording, live, onInvite }) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-white/10 bg-slate-950/70 px-3 py-2 backdrop-blur sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 font-display text-sm font-bold">SM</div>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold text-white sm:text-base">{title || "ShadowMeet"}</h1>
          <p className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono tracking-widest">{code}</span>
            <span aria-label="connection">● {conn}</span>
            <span className="tabular-nums">{timer}</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs">
        {recording && <span className="flex items-center gap-1 rounded-full bg-red-500/15 px-2.5 py-1 font-bold text-red-300"><span className="h-2 w-2 animate-pulse rounded-full bg-red-500" /> REC</span>}
        {live && <span className="rounded-full bg-red-600 px-2.5 py-1 font-bold text-white">🔴 LIVE</span>}
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-slate-200">👥 {count}</span>
        <button onClick={onInvite} className="hidden rounded-xl bg-indigo-500 px-3 py-1.5 font-semibold text-white hover:bg-indigo-400 sm:block">Invite</button>
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
