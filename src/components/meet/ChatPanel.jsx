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
          <p key={`s${i}`} className="text-center text-[11px] text-white/60">{s.text}</p>
        ))}
        {messages.length === 0 && <p className="text-center text-sm text-white/60">No messages yet. Say hello.</p>}
        {messages.map((m) => (
          <div key={m.id} className={`max-w-[90%] rounded-[3px] px-3 py-2 text-sm ${m.from === me ? "ml-auto bg-supari-secondary text-white" : "bg-white/5 text-white"}`}>
            <p className="mb-0.5 text-[11px] font-semibold text-white/70">{m.name} {m.isHost && <span className="font-bold text-white">· HOST</span>}</p>
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
          className="min-w-0 flex-1 rounded-[3px] border border-white/20 bg-black px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-[#f72b2b]"
        />
        <button className="rounded-[80px] bg-supari-secondary px-4 text-sm font-bold text-white hover:bg-supari-primary" aria-label="Send">Send</button>
      </form>
      <p className="px-3 pb-2 text-[11px] text-white/60">Commands: /help · /clear (host) · /play &lt;youtube-url&gt; (host)</p>
    </div>
  )
}
