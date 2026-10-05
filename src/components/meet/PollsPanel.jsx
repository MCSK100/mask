import { useState } from "react"
import { BarChart3, Plus, XCircle } from "lucide-react"

export function PollsPanel({ poll, isHost, onCreate, onVote, onClose }) {
  const [q, setQ] = useState("")
  const [opts, setOpts] = useState(["", ""])
  const counts = {}
  if (poll) {
    Object.values(poll.votes || {}).forEach((v) => { counts[v] = (counts[v] || 0) + 1 })
  }
  const total = Object.keys(poll?.votes || {}).length

  const create = (e) => {
    e?.preventDefault()
    const options = opts.map((o) => o.trim()).filter(Boolean)
    if (!q.trim() || options.length < 2) return
    onCreate(q.trim(), options)
    setQ(""); setOpts(["", ""])
  }

  return (
    <div className="flex h-full flex-col bg-white p-3">
      {!poll ? (
        <p className="flex items-center gap-2 text-sm font-medium text-[#8AA6B8]"><BarChart3 size={15} /> No active poll yet.</p>
      ) : (
        <div className="mb-3 rounded-2xl border border-[#14202b12] bg-[#F8FAFC] p-3">
          <p className="font-semibold text-[#14202B]">{poll.question}</p>
          <p className="text-[11px] font-medium text-[#8AA6B8]">{poll.open ? "Open" : "Closed"} · {total} vote(s)</p>
          <div className="mt-2 space-y-1.5">
            {poll.options.map((o, i) => {
              const c = counts[i] || 0
              const pct = total ? Math.round((c / total) * 100) : 0
              return (
                <button key={i} disabled={!poll.open} onClick={() => onVote(i)} className="w-full rounded-xl border border-[#14202b12] bg-white p-2 text-left text-sm text-[#14202B] hover:border-[#F0531C] disabled:opacity-70">
                  <span className="flex justify-between"><span>{o}</span><span className="text-[#8AA6B8]">{c} ({pct}%)</span></span>
                  <span className="mt-1 block h-1.5 overflow-hidden rounded bg-[#F1F6FA]"><span className="block h-full bg-[#F0531C]" style={{ width: `${pct}%` }} /></span>
                </button>
              )
            })}
          </div>
          {isHost && poll.open && <button onClick={onClose} className="mt-2 flex items-center gap-1 rounded-full bg-[#F1F6FA] border px-3 py-1.5 text-xs font-bold"><XCircle size={12} /> Close poll</button>}
        </div>
      )}
      {isHost && (
        <form onSubmit={create} className="mt-auto space-y-2 border-t border-[#14202b12] pt-3">
          <p className="font-display text-[15px] font-bold text-[#14202B]">Create Poll</p>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Question" aria-label="Poll question" className="meet-input" />
          {opts.map((o, i) => (
            <input key={i} value={o} onChange={(e) => setOpts((p) => p.map((v, j) => j === i ? e.target.value : v))} placeholder={`Option ${i + 1}`} aria-label={`Option ${i + 1}`} className="meet-input" />
          ))}
          <div className="flex gap-2">
            {opts.length < 6 && <button type="button" onClick={() => setOpts((p) => [...p, ""])} className="flex items-center gap-1 rounded-full bg-[#F1F6FA] border px-3 py-1.5 text-xs font-semibold"><Plus size={12} /> Option</button>}
            <button className="rounded-full bg-[#F0531C] px-4 py-1.5 text-xs font-bold text-white">Launch</button>
          </div>
        </form>
      )}
    </div>
  )
}
