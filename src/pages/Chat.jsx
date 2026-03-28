import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import ChatBox from "../components/ChatBox"
import GoogleAd from "../components/GoogleAd"
import { socket } from "../lib/socket"
import ToastBanner from "../components/ToastBanner"
import NeonAmbientBg from "../components/neon/NeonAmbientBg"
import NeonRoomNav from "../components/neon/NeonRoomNav"

const QUICK_EMOJI = ["😀", "😂", "❤️", "🔥", "👍", "🎉", "😮", "🙏", "✨", "💬"]

function IconSend(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden {...props}>
      <path
        d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconMic() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
      <path
        d="M12 14a3 3 0 003-3V5a3 3 0 10-6 0v6a3 3 0 003 3zM19 10v1a7 7 0 01-14 0v-1M12 19v3M8 22h8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconSmile() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path
        d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function messageMeta(text) {
  const now = new Date()
  return {
    id: `${now.getTime()}-${Math.random().toString(36).slice(2, 9)}`,
    time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    isoTime: now.toISOString(),
    text
  }
}

export default function Chat() {
  const navigate = useNavigate()
  const [status, setStatus] = useState("Connecting...")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [onlineCount, setOnlineCount] = useState(0)
  const [isStrangerTyping, setIsStrangerTyping] = useState(false)
  const [toast, setToast] = useState({ message: "", type: "info" })
  const [emojiOpen, setEmojiOpen] = useState(false)
  const disconnectedRef = useRef(false)
  const emojiWrapRef = useRef(null)

  useEffect(() => {
    const join = () => socket.emit("join_match", "text")
    if (socket.connected) join()
    else socket.once("connect", join)
    return () => socket.emit("leave_match")
  }, [])

  useEffect(() => {
    const onDocDown = (e) => {
      if (!emojiWrapRef.current?.contains(e.target)) setEmojiOpen(false)
    }
    document.addEventListener("mousedown", onDocDown)
    return () => document.removeEventListener("mousedown", onDocDown)
  }, [])

  useEffect(() => {
    const onWaiting = () => setStatus("Waiting for stranger...")
    const onMatched = () => {
      setStatus("Connected to stranger")
      setMessages([])
    }
    const onMessage = (msg) => {
      const m = messageMeta(String(msg))
      setMessages((prev) => [...prev, { type: "stranger", ...m }])
    }
    const onDisconnect = () => {
      setStatus("Stranger disconnected. Reconnecting...")
      setMessages([])
    }
    const onOnlineCount = (count) => setOnlineCount(Number(count) || 0)
    const onConnect = () => {
      socket.emit("request_online_count")
      if (disconnectedRef.current) {
        setToast({ message: "Reconnected", type: "success" })
        disconnectedRef.current = false
      }
    }
    const onConnectError = () => {
      setStatus("Server unreachable. Check backend URL.")
      setToast({ message: "Reconnecting to server...", type: "error" })
    }
    const onTyping = () => setIsStrangerTyping(true)
    const onStopTyping = () => setIsStrangerTyping(false)
    const onServerDisconnect = () => {
      disconnectedRef.current = true
      setToast({ message: "Connection lost. Reconnecting...", type: "error" })
    }
    const onRateLimited = ({ reason }) => {
      setToast({ message: reason || "Too many actions. Slow down.", type: "error" })
    }

    const manager = socket.io
    const onReconnectAttempt = () => setToast({ message: "Trying to reconnect...", type: "info" })

    socket.on("connect", onConnect)
    socket.on("disconnect", onServerDisconnect)
    socket.on("waiting", onWaiting)
    socket.on("matched", onMatched)
    socket.on("receive_message", onMessage)
    socket.on("stranger_disconnected", onDisconnect)
    socket.on("online_count", onOnlineCount)
    socket.on("connect_error", onConnectError)
    socket.on("typing", onTyping)
    socket.on("stop_typing", onStopTyping)
    socket.on("rate_limited", onRateLimited)
    manager?.on("reconnect_attempt", onReconnectAttempt)
    socket.emit("request_online_count")

    return () => {
      socket.off("connect", onConnect)
      socket.off("disconnect", onServerDisconnect)
      socket.off("waiting", onWaiting)
      socket.off("matched", onMatched)
      socket.off("receive_message", onMessage)
      socket.off("stranger_disconnected", onDisconnect)
      socket.off("online_count", onOnlineCount)
      socket.off("connect_error", onConnectError)
      socket.off("typing", onTyping)
      socket.off("stop_typing", onStopTyping)
      socket.off("rate_limited", onRateLimited)
      manager?.off("reconnect_attempt", onReconnectAttempt)
    }
  }, [])

  useEffect(() => {
    if (!toast.message) return
    const timer = setTimeout(() => setToast({ message: "", type: "info" }), 2500)
    return () => clearTimeout(timer)
  }, [toast])

  const sendMessage = (e) => {
    e?.preventDefault?.()
    if (!message.trim()) return

    const text = message.trim()
    socket.emit("send_message", text)
    socket.emit("stop_typing")
    const m = messageMeta(text)
    setMessages((prev) => [...prev, { type: "me", ...m }])
    setMessage("")
    setEmojiOpen(false)
  }

  const nextStranger = () => {
    setStatus("Finding next stranger...")
    setMessages([])
    setIsStrangerTyping(false)
    socket.emit("next_stranger")
  }

  const onInputChange = (value) => {
    setMessage(value)
    if (!value.trim()) {
      socket.emit("stop_typing")
      return
    }
    socket.emit("typing")
  }

  const appendEmoji = (ch) => {
    setMessage((prev) => (prev + ch).slice(0, 500))
    setEmojiOpen(false)
  }

  const connected = status === "Connected to stranger"

  return (
    <div className="fixed inset-0 z-0 flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden text-white">
      <NeonAmbientBg />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <ToastBanner message={toast.message} type={toast.type} />

        <NeonRoomNav
          status={status}
          onlineCount={onlineCount}
          onBack={() => navigate("/")}
          onNext={nextStranger}
        />

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 pt-2 md:px-6 md:pt-3">
          <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col">
            <div className="relative min-h-0 flex-1 rounded-[1.35rem] p-[1.5px] shadow-[0_0_50px_rgba(168,85,247,0.12)]">
              <div
                className="h-full min-h-0 rounded-[1.25rem] p-[1px]"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(236,72,153,0.45), rgba(139,92,246,0.35), rgba(34,211,238,0.45))"
                }}
              >
                <section
                  className="chat-scrollbar-neon flex h-full max-h-full min-h-0 flex-col overflow-y-auto overscroll-contain rounded-[1.15rem] bg-black/40 px-4 py-4 backdrop-blur-xl sm:px-5 sm:py-5 md:px-6 md:py-6"
                  aria-label="Chat messages"
                >
                  <ChatBox
                    messages={messages}
                    loading={!connected}
                    strangerTyping={connected && isStrangerTyping}
                  />
                </section>
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-cyan-500/10 bg-black/50 shadow-[0_-12px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-3">
          <div className="mx-auto w-full max-w-6xl space-y-3 px-3 md:px-6">
            <GoogleAd slot={import.meta.env.VITE_GOOGLE_AD_SLOT_CHAT} className="min-h-16" />

            <div ref={emojiWrapRef} className="relative">
              {emojiOpen && (
                <div className="absolute bottom-full left-0 right-0 z-20 mb-2 rounded-2xl border border-fuchsia-500/25 bg-slate-950/95 p-3 shadow-neon-magenta backdrop-blur-xl">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-fuchsia-300/80">
                    Quick emoji
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_EMOJI.map((ch) => (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => appendEmoji(ch)}
                        className="rounded-xl border border-white/10 bg-white/5 px-2 py-1.5 text-xl transition hover:border-fuchsia-400/40 hover:bg-fuchsia-950/40"
                      >
                        {ch}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <form onSubmit={sendMessage} className="flex flex-wrap items-stretch gap-2 sm:flex-nowrap sm:items-center sm:gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-full border border-cyan-400/30 bg-black/55 px-2 py-2 shadow-[inset_0_0_24px_rgba(56,189,248,0.08),0_0_24px_rgba(56,189,248,0.08)] backdrop-blur-md sm:gap-2 sm:px-3">
                  <button
                    type="button"
                    onClick={() => setEmojiOpen((o) => !o)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-fuchsia-500/30 text-fuchsia-200/90 shadow-[0_0_16px_rgba(217,70,239,0.2)] transition hover:border-fuchsia-400/50 hover:bg-fuchsia-950/40"
                    aria-label="Emoji"
                  >
                    <IconSmile />
                  </button>
                  <input
                    value={message}
                    onChange={(e) => onInputChange(e.target.value)}
                    className="min-w-0 flex-1 border-0 bg-transparent py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-0 sm:text-base"
                    placeholder="Type a message..."
                    maxLength={500}
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    title="Voice note (coming soon)"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan-400/35 text-cyan-200/90 opacity-70 shadow-[0_0_16px_rgba(34,211,238,0.15)] transition hover:border-cyan-300/50 hover:bg-cyan-950/40"
                    aria-label="Microphone"
                    disabled
                  >
                    <IconMic />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-fuchsia-400/40 bg-gradient-to-br from-fuchsia-600 via-purple-600 to-violet-700 text-white shadow-neon-magenta transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Send message"
                >
                  <IconSend />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
