import { useState } from "react"
import { ParticipantTile } from "./ParticipantTile"
import { Users } from "lucide-react"

/**
 * ParticipantGrid — stage layout driven by LiveKit participants.
 * Screen share is prioritized: large presentation + small strip.
 * Otherwise featured speaker + strip (classroom) or uniform grid.
 */
export function ParticipantGrid({ participants, layout = "classroom" }) {
  const [pinned, setPinned] = useState(null)
  const sharing = participants.find((x) => x.screenShareEnabled)
  const ordered = pinned ? [...participants.filter((x) => x.identity === pinned), ...participants.filter((x) => x.identity !== pinned)] : participants
  const featured = sharing || ordered[0]
  const strip = (sharing ? participants.filter((x) => x.identity !== sharing.identity) : ordered.slice(1)).slice(0, 4)

  if (participants.length === 0) {
    return (
      <div className="grid h-full place-items-center rounded-[14px] border border-dashed border-white/20 p-6 text-center text-[12px] text-white/60">
        <span className="flex items-center gap-2"><Users size={15} /> Waiting for others to join…</span>
      </div>
    )
  }

  if (layout === "grid") {
    return (
      <div className="grid h-full grid-cols-2 gap-2 overflow-y-auto">
        {ordered.map((x) => (
          <div key={x.identity} className="h-44 sm:h-52">
            <ParticipantTile info={x} pinned={pinned === x.identity} onPin={() => setPinned(pinned === x.identity ? null : x.identity)} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 gap-2">
      <div className="min-w-0 flex-[1.1]">
        <div className="h-full min-h-[280px]">
          {featured && <ParticipantTile info={featured} large />}
        </div>
      </div>
      <div className="hidden w-[150px] flex-none flex-col gap-2 overflow-y-auto sm:flex">
        {strip.map((x) => (
          <div key={x.identity} className="h-[118px] flex-none">
            <ParticipantTile info={x} />
          </div>
        ))}
        {strip.length === 0 && (
          <div className="grid h-[118px] place-items-center rounded-xl border border-dashed border-white/20 text-center text-[11px] text-white/60">
            Others will<br />appear here
          </div>
        )}
      </div>
    </div>
  )
}
