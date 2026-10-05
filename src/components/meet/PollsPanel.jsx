import { useState } from "react"
import { BarChart3, Plus, Check, X } from "lucide-react"

export function PollsPanel({ poll, isHost, onCreate, onVote, onClose, preview }) {
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
      <p className="flex items-center gap-2 text-[14px] font-bold text-[#16283A]">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#f5f2ff] text-[#724aee]">
          <BarChart3 size={16} />
        </span>
        Polls & Quizzes
      </p>
      <p className="mt-0.5 pl-10 text-[12px] text-[#5B7290]">Get instant feedback</p>

      {!poll ? (
        <div className="mt-3 rounded-xl bg-[#F4F8FF] p-3 text-[13px] text-[#5B7290]">
          {isHost ? "Create a poll below to quiz the class." : "No active poll. The host will launch one soon."}
        </div>
      ) : (
        <div className="mt-3">
          <p className="text-[13px] font-bold text-[#16283A]">{poll.question}</p>
          <p className="text-[11px] font-medium text-[#8AA6B8]">{poll.open ? "Open" : "Closed"} · {total} vote(s)</p>
          <div className="mt-2 space-y-1.5">
            {poll.options.map((o, i) => {
              const c = counts[i] || 0
              const pct = total ? Math.round((c / total) * 100) : 0
              const lead = pct >= 50
              return (
                <button
                  key={i} disabled={!poll.open} onClick={() => onVote(i)}
                  className="w-full rounded-xl border p-2 text-left text-[13px] disabled:cursor-default"
                  style={{
                    borderColor: lead ? "#724aee55" : "#E3ECF7",
                    background: lead ? "#f5f2ff" : "#F7FAFF",
                    color: "#16283A",
                  }}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5">
                      {lead ? <Check size={13} color="#724aee" /> : <span className="h-3 w-3 rounded-full border border-[#C4D3E6]" />}
                      {o}
                    </span>
                    <span className="font-bold text-[#5B7290]">{pct}%</span>
                  </span>
                  <span className="mt-1.5 block h-1.5 overflow-hidden rounded bg-white">
                    <span className="block h-full rounded" style={{ width: `${pct}%`, background: "#724aee" }} />
                  </span>
                </button>
              )
            })}
          </div>
          {isHost && poll.open && (
            <button onClick={onClose} className="mt-2 flex items-center gap-1 rounded-full bg-[#F1F6FA] px-3 py-1.5 text-xs font-bold text-[#33475F]">
              <X size={12} /> Close poll
            </button>
          )}
        </div>
      )}
      {isHost && !preview && (
        <form onSubmit={create} className="mt-auto space-y-2 border-t border-[#EAF0F7] pt-3">
          <p className="text-[13px] font-bold text-[#16283A]">Create Poll</p>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Which formula is correct?" aria-label="Poll question" className="w-full rounded-xl border border-[#E3ECF7] bg-[#F7FAFF] px-3 py-2 text-[13px]" />
          {opts.map((o, i) => (
            <input key={i} value={o} onChange={(e) => setOpts((p) => p.map((v, j) => j === i ? e.target.value : v))} placeholder={`Option ${i + 1}`} aria-label={`Option ${i + 1}`} className="w-full rounded-xl border border-[#E3ECF7] bg-[#F7FAFF] px-3 py-2 text-[13px]" />
          ))}
          <div className="flex gap-2">
            {opts.length < 6 && <button type="button" onClick={() => setOpts((p) => [...p, ""])} className="flex items-center gap-1 rounded-full bg-[#F1F6FA] px-3 py-1.5 text-xs font-semibold"><Plus size={12} /> Option</button>}
            <button className="rounded-full bg-[#724aee] px-4 py-1.5 text-xs font-bold text-white">Launch</button>
          </div>
        </form>
      )}
    </div>
  )
}
