export default function OnlineCounter({ count = 0, className = "" }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/70 px-3 py-1 text-sm text-slate-300 ${className}`}
    >
      <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
      <span>{count} online</span>
    </div>
  )
}