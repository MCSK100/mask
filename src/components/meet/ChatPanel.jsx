import { useState } from "react"
import { Send } from "lucide-react"

function Avatar({ name }) {
  const ch = (name || "?").slice(0, 1).toUpperCase()
  const hues = { S: "#7C5CFF", D: "#0D99FF", A: "#22B573", M: "#F0531C", E: "#E8389F", R: "#0EA5A5" }
  const bg = hues[ch] || "#3D5A80"
  return (
    <span className="grid h-8 w-8 flex-none place-items-center rounded-full text-[12px] font-bold text-white" style={{ background: bg }}>
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
    <div className="flex h-full flex-col bg-white">
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
        {system.map((s, i) => (
          <p key={`s${i}`} className="text-center text-[11px] font-medium text-[#8AA6B8]">{s.text}</p>
        ))}
        {messages.length === 0 && (
          <div className="rounded-xl bg-[#F4F8FF] p-3 text-center text-[13px] text-[#5B7290]">
            Chat is live. Say hello to the class.
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className="flex items-start gap-2">
            <Avatar name={m.name} />
            <div className="min-w-0">
              <p className="text-[12px] font-bold text-[#16283A]">
                {m.name} <span className="ml-1 font-medium text-[#8AA6B8]">{time}</span>
                {m.isHost && <span className="ml-1 rounded bg-[#E8F3FF] px-1 text-[10px] font-bold text-[#0B5ED7]">HOST</span>}
              </p>
              <p className="break-words text-[13px] leading-snug text-[#33475F]">{m.text}</p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={submit} className="flex items-center gap-2 border-t border-[#EAF0F7] p-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 500))}
          placeholder="Type a message..."
          aria-label="Chat message"
          className="min-w-0 flex-1 rounded-xl border border-[#E3ECF7] bg-[#F7FAFF] px-3 py-2.5 text-[13px] text-[#16283A] placeholder:text-[#8AA6B8] focus:border-[#0D99FF] focus:outline-none"
        />
        <button className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-[#0D99FF] text-white hover:bg-[#0B7ED7]" aria-label="Send">
          <Send size={16} />
        </button>
      </form>
    </div>
  )
}
