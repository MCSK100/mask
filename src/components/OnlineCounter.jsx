export default function OnlineCounter({ count = 0, fakeCount, className = "" }) {
  const displayCount = fakeCount ?? count
  const isFake = fakeCount != null

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/70 px-3 py-1 text-sm text-slate-300 ${className}`}
    >
      <span className={`inline-block h-2 w-2 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.8)] ${isFake ? 'animate-pulse bg-orange-400 shadow-[0_0_12px_rgba(251,146,60,0.8)]' : 'bg-emerald-400'}`} />
      <span className="tabular-nums">
        {isFake ? `🔥 ${displayCount} online now` : `${displayCount} online`}
      </span>
    </div>
  )
}
