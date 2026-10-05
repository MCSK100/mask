import { useState } from "react"

export function ChatPanel({ messages, system, me, isHost, onSend }) {
  const [text, setText] = useState("")
  const submit = (e) => {
    e?.preventDefault()
    if (!text.trim()) return
    // local slash help
    if (text.trim() === "/help") {
      onSend("/help")
      setText("")
      return
    }
    onSend(text.trim())
    setText("")
  }
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {system.map((s, i) => (
          <p key={`s${i}`} className="text-center text-[11px] text-slate-500">{s.text}</p>
        ))}
        {messages.length === 0 && <p className="text-center text-sm text-slate-500">No messages yet. Say hello 👋</p>}
        {messages.map((m) => (
          <div key={m.id} className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm ${m.from === me ? "ml-auto bg-indigo-500/25 text-white" : "bg-white/5 text-slate-200"}`}>
            <p className="mb-0.5 text-[11px] font-semibold text-slate-400">{m.name} {m.isHost && <span className="text-amber-300">· HOST</span>}</p>
            <p className="break-words">{m.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={submit} className="flex gap-2 border-t border-white/10 p-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 500))}
          placeholder="Message… (/help)"
          aria-label="Chat message"
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button className="rounded-xl bg-indigo-500 px-4 text-sm font-bold text-white hover:bg-indigo-400" aria-label="Send">Send</button>
      </form>
      <p className="px-3 pb-2 text-[11px] text-slate-500">Commands: /help · /clear (host) · /play &lt;youtube-url&gt; (host)</p>
    </div>
  )
}
