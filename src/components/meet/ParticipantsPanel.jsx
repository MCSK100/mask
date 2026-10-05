export function ParticipantsPanel({ peers, you, isHost, onMute, onRemove, onCohost, onAdmit, waiting = [] }) {
  return (
    <div className="flex h-full flex-col overflow-y-auto p-3">
      <h3 className="mb-2 text-sm font-bold text-slate-300">Participants ({peers.length + 1})</h3>
      <div className="mb-2 rounded-xl border border-white/10 bg-white/5 p-2 text-sm">
        <p className="font-semibold text-white">{you?.name} (You) {you?.isHost && "· HOST"}</p>
      </div>
      {waiting.length > 0 && isHost && (
        <div className="mb-3 rounded-xl border border-amber-400/30 bg-amber-400/10 p-2">
          <p className="mb-1 text-xs font-bold text-amber-300">Waiting room</p>
          {waiting.map((w) => (
            <div key={w.socketId} className="flex items-center justify-between py-1 text-sm">
              <span>{w.name}</span>
              <span className="flex gap-1">
                <button onClick={() => onAdmit(w.socketId, true)} className="rounded bg-emerald-500 px-2 py-0.5 text-xs font-bold">Admit</button>
                <button onClick={() => onAdmit(w.socketId, false)} className="rounded bg-white/10 px-2 py-0.5 text-xs">Reject</button>
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="space-y-1.5">
        {peers.map((p) => (
          <div key={p.socketId} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] p-2 text-sm">
            <div className="min-w-0">
              <p className="truncate font-medium text-white">{p.name} {p.isHost && <span className="text-amber-300">· HOST</span>}{p.isCohost && " · CO-HOST"}</p>
              <p className="text-[11px] text-slate-500">{p.muted ? "🔇 muted" : "🎙️"} · {p.cameraOff ? "camera off" : "camera on"}{p.handRaised ? " · ✋" : ""}</p>
            </div>
            {isHost && (
              <div className="flex shrink-0 gap-1">
                <button onClick={() => onMute(p.socketId)} className="rounded bg-white/10 px-2 py-1 text-[11px]" title="Mute">Mute</button>
                <button onClick={() => onCohost(p.socketId)} className="rounded bg-white/10 px-2 py-1 text-[11px]" title="Co-host">Co-host</button>
                <button onClick={() => onRemove(p.socketId)} className="rounded bg-red-500/20 px-2 py-1 text-[11px] text-red-300" title="Remove">✕</button>
              </div>
            )}
          </div>
        ))}
        {peers.length === 0 && <p className="text-sm text-slate-500">Only you here. Invite others to join.</p>}
      </div>
    </div>
  )
}
