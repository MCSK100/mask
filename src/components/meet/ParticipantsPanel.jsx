import { Users, MicOff, Crown, X } from "lucide-react"

export function ParticipantsPanel({ peers, you, isHost, onMute, onRemove, onCohost, onAdmit, waiting = [] }) {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#111820] p-3 text-[#f3f1ed]">
      <h3 className="mb-2 flex items-center gap-2 font-display text-[15px] font-semibold text-[#f3f1ed]"><Users size={15} /> Participants ({peers.length + 1})</h3>
      <div className="mb-2 rounded-lg border border-[#ffffff20] bg-[#18222c] p-2 text-sm">
        <p className="font-semibold text-[#f3f1ed]">{you?.name} (You) {you?.isHost && "· HOST"}</p>
      </div>
      {waiting.length > 0 && isHost && (
        <div className="mb-3 rounded-lg border border-[#b9dceb44] bg-[#18222c] p-2">
          <p className="mb-1 text-xs font-bold text-[#f3f1ed]">Waiting Room</p>
          {waiting.map((w) => (
            <div key={w.socketId} className="flex items-center justify-between py-1 text-sm text-[#f3f1ed]">
              <span>{w.name}</span>
              <span className="flex gap-1">
                <button onClick={() => onAdmit(w.socketId, true)} className="rounded-md bg-[#b9dceb] px-2.5 py-1 text-xs font-semibold text-[#0c171e]">Admit</button>
                <button onClick={() => onAdmit(w.socketId, false)} className="rounded-md border border-[#ffffff25] bg-[#0d1319] px-2.5 py-1 text-xs text-[#f3f1ed]">Reject</button>
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="space-y-1.5">
        {peers.map((p) => (
          <div key={p.socketId} className="flex items-center justify-between rounded-lg border border-[#ffffff18] bg-[#0d1319] p-2 text-sm">
            <div className="min-w-0">
              <p className="truncate font-medium text-[#f3f1ed]">{p.name} {p.isHost && <span className="font-bold text-[#b9dceb]">· HOST</span>}{p.isCohost && " · CO-HOST"}</p>
              <p className="text-[11px] text-[#aab2ba]">{p.muted ? "Muted" : "Mic On"} · {p.cameraOff ? "Camera Off" : "Camera On"}{p.handRaised ? " · Hand Up" : ""}</p>
            </div>
            {isHost && (
              <div className="flex shrink-0 gap-1">
                <button onClick={() => onMute(p.socketId)} className="flex items-center gap-1 rounded-md border border-[#ffffff25] bg-[#18222c] px-2 py-1 text-[11px] font-semibold" title="Mute"><MicOff size={12} /> Mute</button>
                <button onClick={() => onCohost(p.socketId)} className="flex items-center gap-1 rounded-md border border-[#ffffff25] bg-[#18222c] px-2 py-1 text-[11px] font-semibold" title="Co-host"><Crown size={12} /> Co-host</button>
                <button onClick={() => onRemove(p.socketId)} className="rounded-md bg-[#dc746d] px-2 py-1 text-[11px] font-bold text-white" title="Remove"><X size={12} /></button>
              </div>
            )}
          </div>
        ))}
        {peers.length === 0 && <p className="text-sm text-[#aab2ba]">Only you here. Others will appear soon.</p>}
      </div>
    </div>
  )
}
