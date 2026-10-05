import { useState } from "react"
import { VideoTile } from "./VideoTile"
import { Users } from "lucide-react"

function gridClass(n) {
  if (n <= 1) return "grid-cols-1"
  if (n <= 2) return "grid-cols-1 sm:grid-cols-2"
  if (n <= 4) return "grid-cols-2"
  if (n <= 6) return "grid-cols-2 lg:grid-cols-3"
  if (n <= 9) return "grid-cols-2 lg:grid-cols-3"
  return "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
}

export function VideoGrid({ local, remotes }) {
  const [pinned, setPinned] = useState(null)
  const all = [...local, ...remotes]
  const ordered = pinned ? [...all.filter((p) => p.id === pinned), ...all.filter((p) => p.id !== pinned)] : all
  const isSingle = pinned && ordered.length > 1

  return (
    <div className={`grid flex-1 gap-3 overflow-y-auto p-1 ${isSingle ? "grid-cols-1 lg:grid-cols-[1fr_280px]" : gridClass(all.length)}`}>
      {isSingle ? (
        <>
          <div className="min-h-[320px]">
            <FullTile p={ordered[0]} onPin={() => setPinned(null)} pinned />
          </div>
          <div className="grid content-start gap-3">
            {ordered.slice(1).map((p) => (
              <div key={p.id} className="h-36"><FullTile p={p} onPin={() => setPinned(p.id)} /></div>
            ))}
          </div>
        </>
      ) : (
        ordered.map((p) => (
          <div key={p.id} className={all.length === 1 ? "min-h-[320px]" : "h-44 sm:h-52 lg:h-60"}>
            <FullTile p={p} onPin={() => setPinned(pinned === p.id ? null : p.id)} pinned={pinned === p.id} />
          </div>
        ))
      )}
      {all.length === 0 && (
        <div className="col-span-full grid place-items-center rounded-[18px] border border-[#14202b22] bg-white p-10 font-semibold text-[#4A6173]">
          <span className="flex items-center gap-2"><Users size={16} /> Waiting for others to join…</span>
        </div>
      )}
    </div>
  )
}

function FullTile({ p, onPin, pinned }) {
  return (
    <div className="h-full w-full [&>div]:h-full">
      <VideoTile {...p} pinned={pinned} onPin={onPin} />
    </div>
  )
}
