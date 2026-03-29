import { Link } from "react-router-dom"
import OnlineCounter from "../OnlineCounter"

const navLink =
  "text-xs text-slate-400 transition hover:text-cyan-300 sm:text-sm focus:outline-none focus-visible:text-cyan-200 focus-visible:ring-2 focus-visible:ring-cyan-400/40 rounded px-1"

export default function NeonRoomNav({
  status,
  onlineCount,
  onBack,
  onNext,
  nextLabel = "Next Stranger"
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/35 shadow-[0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-2xl safe-pt">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-2 py-2 xs:px-3 xs:py-3 sm:px-4 sm:py-3 md:px-6 md:py-3">
        <div className="flex min-w-0 flex-1 items-center gap-1.5 xs:gap-2 sm:gap-4 md:flex-none">
          <Link
            to="/"
            className="group flex shrink-0 items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/50 rounded-lg"
          >
            <span
              className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 via-purple-600 to-cyan-400 p-[1.5px] shadow-neon-magenta xs:h-9 xs:w-9 sm:h-10 sm:w-10"
              aria-hidden
            >
              <span className="flex h-full w-full items-center justify-center rounded-full bg-black/80 text-lg xs:text-xl">
                🎭
              </span>
            </span>
            <span className="bg-gradient-to-r from-fuchsia-300 via-cyan-200 to-violet-300 bg-clip-text text-base font-bold tracking-tight text-transparent drop-shadow-[0_0_12px_rgba(232,121,249,0.5)] xs:text-lg sm:text-xl md:text-2xl [text-size-adjust:none]">
              mask
            </span>
          </Link>

          <button
            type="button"
            onClick={onBack}
            className="shrink-0 rounded-xl border border-white/15 bg-white/5 px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-300 backdrop-blur-sm transition hover:border-cyan-400/40 hover:bg-cyan-950/30 hover:text-cyan-200 xs:text-xs xs:px-3 xs:py-2 sm:text-sm"
          >
            ← Back
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-3">
          <OnlineCounter
            count={onlineCount}
            className="border-cyan-500/25 bg-slate-950/50 text-xs text-cyan-100/90 shadow-[0_0_20px_rgba(34,211,238,0.12)] backdrop-blur-md xs:text-sm sm:text-base"
          />
          <button
            type="button"
            onClick={onNext}
            className="rounded-xl border border-fuchsia-500/40 bg-fuchsia-950/40 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wide text-fuchsia-100 shadow-[0_0_20px_rgba(217,70,239,0.25)] transition hover:border-fuchsia-400/60 hover:bg-fuchsia-900/50 xs:text-xs xs:px-3 xs:py-2 sm:text-sm sm:px-4"
          >
            {nextLabel}
          </button>
        </div>
      </div>

      <p className="border-t border-white/5 px-2 py-1.5 text-center text-xs leading-snug text-cyan-200/85 xs:px-3 xs:text-sm sm:px-6 sm:text-sm md:text-base flex items-center justify-center h-10 xs:h-12">
        <span className="truncate max-w-[280px]">{status}</span>
      </p>
    </header>
  )
}
