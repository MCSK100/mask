import { Users, MicOff, Crown, X } from "lucide-react"

export function ParticipantsPanel({ peers, you, isHost, onMute, onRemove, onCohost, onAdmit, waiting = [] }) {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-white p-3">
      <h3 className="mb-2 flex items-center gap-2 font-display text-[15px] font-bold text-[#14202B]"><Users size={15} /> Participants ({peers.length + 1})</h3>
      <div className="mb-2 rounded-xl border border-[#14202b12] bg-[#F1F6FA] p-2 text-sm">
        <p className="font-semibold text-[#14202B]">{you?.name} (You) {you?.isHost && "· HOST"}</p>
      </div>
      {waiting.length > 0 && isHost && (
        <div className="mb-3 rounded-xl border border-[#F0531C44] bg-[#FFF6F1] p-2">
          <p className="mb-1 text-xs font-bold text-[#14202B]">Waiting Room</p>
          {waiting.map((w) => (
            <div key={w.socketId} className="flex items-center justify-between py-1 text-sm text-[#14202B]">
              <span>{w.name}</span>
              <span className="flex gap-1">
                <button onClick={() => onAdmit(w.socketId, true)} className="rounded-full bg-[#F0531C] px-2.5 py-1 text-xs font-bold text-white">Admit</button>
                <button onClick={() => onAdmit(w.socketId, false)} className="rounded-full bg-[#F1F6FA] border px-2.5 py-1 text-xs">Reject</button>
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="space-y-1.5">
        {peers.map((p) => (
          <div key={p.socketId} className="flex items-center justify-between rounded-xl border border-[#14202b12] bg-[#F8FAFC] p-2 text-sm">
            <div className="min-w-0">
              <p className="truncate font-medium text-[#14202B]">{p.name} {p.isHost && <span className="font-bold text-[#F0531C]">· HOST</span>}{p.isCohost && " · CO-HOST"}</p>
              <p className="text-[11px] text-[#8AA6B8]">{p.muted ? "Muted" : "Mic On"} · {p.cameraOff ? "Camera Off" : "Camera On"}{p.handRaised ? " · Hand Up" : ""}</p>
            </div>
            {isHost && (
              <div className="flex shrink-0 gap-1">
                <button onClick={() => onMute(p.socketId)} className="flex items-center gap-1 rounded-full bg-white border px-2 py-1 text-[11px] font-semibold" title="Mute"><MicOff size={12} /> Mute</button>
                <button onClick={() => onCohost(p.socketId)} className="flex items-center gap-1 rounded-full bg-white border px-2 py-1 text-[11px] font-semibold" title="Co-host"><Crown size={12} /> Co-host</button>
                <button onClick={() => onRemove(p.socketId)} className="rounded-full bg-[#F0531C] px-2 py-1 text-[11px] font-bold text-white" title="Remove"><X size={12} /></button>
              </div>
            )}
          </div>
        ))}
        {peers.length === 0 && <p className="text-sm text-[#8AA6B8]">Only you here. Others will appear soon.</p>}
      </div>
    </div>
  )
}
