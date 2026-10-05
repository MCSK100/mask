import { Flame } from "lucide-react"

export default function OnlineCounter({ count = 0, fakeCount, className = "" }) {
  const displayCount = fakeCount ?? count
  const isFake = fakeCount != null

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-[#14202b22] bg-white px-3 py-1 text-sm text-[#4A6173] ${className}`}
    >
      <span className={`inline-block h-2 w-2 rounded-full ${isFake ? 'animate-pulse bg-[#F0531C]' : 'bg-emerald-500'}`} />
      <span className="flex items-center gap-1.5 tabular-nums">
        {isFake && <Flame size={13} color="#F0531C" />} {displayCount} online{isFake ? " now" : ""}
      </span>
    </div>
  )
}
