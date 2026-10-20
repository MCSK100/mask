import { useState } from "react"
import { Send } from "lucide-react"

function Avatar({ name }) {
  const ch = (name || "?").slice(0, 1).toUpperCase()
  const hues = { S: "#9fcde0", D: "#8fb8cb", A: "#8fc3a6", M: "#caa88c", E: "#c79eaa", R: "#91b8b5" }
  const bg = hues[ch] || "#819baa"
  return (
    <span className="grid h-8 w-8 flex-none place-items-center rounded-[10px] text-[12px] font-bold text-[#0c171e]" style={{ background: bg }}>
      {ch}
    </span>
  )
}

export function ChatPanel({ messages, system, onSend }) {
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
  const time = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
  return (
    <div className="flex h-full flex-col bg-[#111820] text-[#f3f1ed]">
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
        {system.map((s, i) => (
          <p key={`s${i}`} className="text-center text-[11px] font-medium text-[#aab2ba]">{s.text}</p>
        ))}
        {messages.length === 0 && (
          <div className="rounded-lg border border-[#ffffff18] bg-[#18222c] p-3 text-center text-[13px] text-[#aab2ba]">
            Chat is live. Say hello to the class.
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className="flex items-start gap-2">
            <Avatar name={m.name} />
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-[#f3f1ed]">
                {m.name} <span className="ml-1 font-medium text-[#aab2ba]">{time}</span>
                {m.isHost && <span className="ml-1 rounded-sm border border-[#ffffff25] px-1 text-[10px] font-bold text-[#b9dceb]">HOST</span>}
              </p>
              <p className="break-words text-[13px] leading-snug text-[#d0d8dc]">{m.text}</p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={submit} className="flex items-center gap-2 border-t border-[#ffffff18] p-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 500))}
          placeholder="Type a message..."
          aria-label="Chat message"
          className="min-w-0 flex-1 rounded-lg border border-[#ffffff25] bg-[#0d1319] px-3 py-2.5 text-[13px] text-[#f3f1ed] placeholder:text-[#8c9aa3] focus:border-[#b9dceb] focus:outline-none"
        />
        <button className="grid h-10 w-10 flex-none place-items-center rounded-lg bg-[#b9dceb] text-[#0c171e] hover:bg-[#d8eff8]" aria-label="Send">
          <Send size={16} />
        </button>
      </form>
    </div>
  )
}
