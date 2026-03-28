import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import ChatBox from "../components/ChatBox"
import OnlineCounter from "../components/OnlineCounter"
import GoogleAd from "../components/GoogleAd"
import { socket } from "../lib/socket"
import CyberButton from "../components/CyberButton"
import ToastBanner from "../components/ToastBanner"

export default function Chat() {
  const navigate = useNavigate()
  const [status, setStatus] = useState("Connecting...")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [onlineCount, setOnlineCount] = useState(0)
  const [isStrangerTyping, setIsStrangerTyping] = useState(false)
  const [toast, setToast] = useState({ message: "", type: "info" })
  const disconnectedRef = useRef(false)

  useEffect(() => {
    const join = () => socket.emit("join_match", "text")
    if (socket.connected) join()
    else socket.once("connect", join)
    return () => socket.emit("leave_match")
  }, [])

  useEffect(() => {
    const onWaiting = () => setStatus("Waiting for stranger...")
    const onMatched = () => {
      setStatus("Connected to stranger")
      setMessages([])
    }
    const onMessage = (msg) => {
      const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      setMessages((prev) => [...prev, { type: "stranger", text: msg, time }])
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
    e.preventDefault()
    if (!message.trim()) return

    const text = message.trim()
    socket.emit("send_message", text)
    socket.emit("stop_typing")
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    setMessages((prev) => [...prev, { type: "me", text, time }])
    setMessage("")
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

  return (
    <div className="relative flex min-h-screen flex-col bg-gradient-to-b from-slate-950 via-slate-950 to-black p-3 text-white md:p-6">
      <ToastBanner message={toast.message} type={toast.type} />
      <div className="mx-auto grid h-[calc(100vh-1.5rem)] w-full max-w-6xl grid-rows-[auto_1fr_auto_auto] gap-2 sm:gap-3 md:h-[calc(100vh-3rem)] md:gap-4">
        <header className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-slate-900/70 p-2.5 backdrop-blur sm:gap-3 sm:p-4 md:grid-cols-[auto_1fr_auto_auto] md:gap-4 md:items-center">
          <CyberButton type="button" onClick={() => navigate("/")} className="cyber-btn--sm">
            Back
          </CyberButton>
          <h2 className="col-span-2 truncate text-center text-[11px] font-medium text-violet-300 sm:text-xs md:col-span-1 md:text-left md:text-base">
            {status}
          </h2>
          <OnlineCounter count={onlineCount} />
          <CyberButton type="button" onClick={nextStranger} className="cyber-btn--sm">
            Next Stranger
          </CyberButton>
        </header>

        <ChatBox messages={messages} loading={status !== "Connected to stranger"} />
        {isStrangerTyping && (
          <p className="px-2 text-xs text-slate-300">Stranger is typing...</p>
        )}

        <GoogleAd slot={import.meta.env.VITE_GOOGLE_AD_SLOT_CHAT} className="min-h-20" />

        <form onSubmit={sendMessage} className="grid gap-2 rounded-2xl border border-white/10 bg-slate-900/70 p-2.5 backdrop-blur sm:gap-3 sm:p-3 md:grid-cols-[1fr_auto]">
          <input
            value={message}
            onChange={(e) => onInputChange(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none ring-violet-400/40 transition focus:ring-2"
            placeholder="Type your message..."
            maxLength={500}
          />
          <CyberButton type="submit" className="cyber-btn--sm">
            Send
          </CyberButton>
        </form>
      </div>
    </div>
  )
}