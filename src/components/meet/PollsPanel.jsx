import { useState } from "react"

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
    <div className="flex h-full flex-col p-3">
      {!poll ? (
        <p className="text-sm font-semibold text-white">No Active Poll. We Will Meet And Vote Soon.</p>
      ) : (
        <div className="mb-3 rounded-[3px] border border-white/20 bg-black p-3">
          <p className="font-semibold text-white">{poll.question}</p>
          <p className="text-[11px] text-white/60">{poll.open ? "Open" : "Closed"} · {total} vote(s)</p>
          <div className="mt-2 space-y-1.5">
            {poll.options.map((o, i) => {
              const c = counts[i] || 0
              const pct = total ? Math.round((c / total) * 100) : 0
              return (
                <button key={i} disabled={!poll.open} onClick={() => onVote(i)} className="w-full rounded-lg bg-white/5 p-2 text-left text-sm hover:bg-white/10 disabled:opacity-70">
                  <span className="flex justify-between"><span>{o}</span><span className="text-white/70">{c} ({pct}%)</span></span>
                  <span className="mt-1 block h-1.5 overflow-hidden rounded bg-white/10"><span className="block h-full bg-supari-primary" style={{ width: `${pct}%` }} /></span>
                </button>
              )
            })}
          </div>
          {isHost && poll.open && <button onClick={onClose} className="mt-2 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold">Close poll</button>}
        </div>
      )}
      {isHost && (
        <form onSubmit={create} className="mt-auto space-y-2 border-t border-white/10 pt-3">
          <p className="font-display text-base text-white">Create Poll</p>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Question" aria-label="Poll question" className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm" />
          {opts.map((o, i) => (
            <input key={i} value={o} onChange={(e) => setOpts((p) => p.map((v, j) => j === i ? e.target.value : v))} placeholder={`Option ${i + 1}`} aria-label={`Option ${i + 1}`} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm" />
          ))}
          <div className="flex gap-2">
            {opts.length < 6 && <button type="button" onClick={() => setOpts((p) => [...p, ""])} className="rounded-lg bg-white/10 px-3 py-1.5 text-xs">+ Option</button>}
            <button className="rounded-[80px] bg-supari-secondary px-3 py-1.5 text-xs font-bold text-white">Launch</button>
          </div>
        </form>
      )}
    </div>
  )
}
