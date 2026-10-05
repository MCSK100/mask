import { useState } from "react"
import { Send } from "lucide-react"

export function ChatPanel({ messages, system, me, isHost, onSend }) {
  const [text, setText] = useState("")
  const submit = (e) => {
    e?.preventDefault()
    if (!text.trim()) return
    if (text.trim() === "/help") {
      onSend("/help")
      setText("")
      return
    }
    onSend(text.trim())
    setText("")
  }
  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {system.map((s, i) => (
          <p key={`s${i}`} className="text-center text-[11px] font-medium text-[#8AA6B8]">{s.text}</p>
        ))}
        {messages.length === 0 && <p className="text-center text-sm text-[#8AA6B8]">No messages yet. Say hello.</p>}
        {messages.map((m) => (
          <div key={m.id} className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm ${m.from === me ? "ml-auto bg-[#F0531C] text-white" : "bg-[#F1F6FA] text-[#14202B] border border-[#14202b12]"}`}>
            <p className="mb-0.5 text-[11px] font-semibold opacity-80">{m.name} {m.isHost && <span className="font-bold">· HOST</span>}</p>
            <p className="break-words">{m.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={submit} className="flex gap-2 border-t border-[#14202b12] p-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 500))}
          placeholder="Message… (/help)"
          aria-label="Chat message"
          className="meet-input min-w-0 flex-1"
        />
        <button className="flex items-center gap-1.5 rounded-full bg-[#F0531C] px-4 text-sm font-bold text-white hover:bg-[#D2410E]" aria-label="Send"><Send size={14} /> Send</button>
      </form>
      <p className="px-3 pb-2 text-[11px] text-[#8AA6B8]">Commands: /help · /clear (host) · /play &lt;youtube-url&gt; (host)</p>
    </div>
  )
}
