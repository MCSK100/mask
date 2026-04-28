import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import ChatBox from "../components/ChatBox"
import VideoGrid from "../components/VideoGrid"
import GoogleAd from "../components/GoogleAd"
import { socket } from "../lib/socket"
import ToastBanner from "../components/ToastBanner"
import { getIceServers } from "../lib/webrtc"
import { createMaskVideoPeer } from "../lib/maskWebRTC"
import NeonAmbientBg from "../components/neon/NeonAmbientBg"
import NeonRoomNav from "../components/neon/NeonRoomNav"
import { useFakePresence } from "../hooks/useFakePresence"


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

export default function Video() {
  const navigate = useNavigate()
  const [status, setStatus] = useState("Initializing camera...")
  const [localStream, setLocalStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [onlineCount, setOnlineCount] = useState(0)
  const { count: fakeOnlineCount } = useFakePresence({ realCount: onlineCount })
  const [toast, setToast] = useState({ message: "", type: "info" })

  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [isStrangerTyping, setIsStrangerTyping] = useState(false)
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const emojiWrapRef = useRef(null)

  const peerRef = useRef(null)
  const disconnectedRef = useRef(false)
  const localStreamRef = useRef(null)
  const pendingMatchRef = useRef(null)
  const pendingSignalsRef = useRef([])
  const setupPeerRef = useRef(() => {})

  useEffect(() => {
    localStreamRef.current = localStream
    if (localStream && pendingMatchRef.current) {
      const { initiator } = pendingMatchRef.current
      pendingMatchRef.current = null
      setupPeerRef.current(initiator)
    }
  }, [localStream])

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        navigate('/')
      }
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [navigate])

  useEffect(() => {
    let mounted = true

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user' }, audio: true })
      .then((stream) => {
        if (!mounted) return
        setLocalStream(stream)
        setStatus("Connecting to stranger network...")
      })
      .catch(() => {
        setStatus("Camera or mic permission denied")
      })

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    const join = () => socket.emit("join_match", "video")
    if (socket.connected) join()
    else socket.once("connect", join)
    return () => socket.emit("leave_match")
  }, [])

  useEffect(() => {
    const cleanupPeer = () => {
      pendingSignalsRef.current = []
      if (peerRef.current) {
        try {
          peerRef.current.destroy()
        } catch {
          /* ignore */
        }
        peerRef.current = null
      }
      setRemoteStream(null)
    }

    const setupPeer = (initiator) => {
      const stream = localStreamRef.current
      if (!stream) {
        pendingMatchRef.current = { initiator }
        return
      }

      cleanupPeer()
      setStatus("Connected to stranger")

      try {
        const peer = createMaskVideoPeer({
          initiator: Boolean(initiator),
          localStream: stream,
          iceServers: getIceServers(),
          onSignal: (payload) => socket.emit("signal", payload),
          onRemoteStream: (s) => setRemoteStream(s),
          onError: (err) => {
            console.error("[webrtc]", err)
            setStatus("Connection error — try Next Stranger")
          }
        })
        peerRef.current = peer
      } catch (err) {
        console.error("[webrtc] create peer", err)
        setStatus("WebRTC failed to start — try refresh or another browser")
        return
      }

      const buffered = pendingSignalsRef.current.splice(0)
      buffered.forEach((data) => {
        try {
          void peerRef.current?.handleRemoteSignal(data)
        } catch {
          /* ignore */
        }
      })
    }

    setupPeerRef.current = setupPeer

    const onWaiting = () => setStatus("Waiting for stranger...")
    const onMatched = ({ initiator }) => {
      setupPeer(initiator)
    }
    const onSignal = (data) => {
      if (!data) return
      if (peerRef.current) {
        try {
          void peerRef.current.handleRemoteSignal(data)
        } catch {
          /* ignore */
        }
      } else {
        pendingSignalsRef.current.push(data)
      }
    }
    const onStrangerDisconnected = () => {
      setStatus("Stranger disconnected. Searching...")
      cleanupPeer()
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
    socket.on("signal", onSignal)
    socket.on("stranger_disconnected", onStrangerDisconnected)
    socket.on("receive_message", (msg) => {
      const m = messageMeta(String(msg))
      setMessages((prev) => [...prev, { type: "stranger", ...m }])
    })
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
      socket.off("signal", onSignal)
      socket.off("stranger_disconnected", onStrangerDisconnected)
      socket.off("receive_message")
      socket.off("online_count", onOnlineCount)
      socket.off("connect_error", onConnectError)
      socket.off("typing", onTyping)
      socket.off("stop_typing", onStopTyping)
      socket.off("rate_limited", onRateLimited)
      manager?.off("reconnect_attempt", onReconnectAttempt)
      cleanupPeer()
    }
  }, [])

  useEffect(() => {
    if (!toast.message) return
    const timer = setTimeout(() => setToast({ message: "", type: "info" }), 2500)
    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [localStream])

  const nextStranger = () => {
    setStatus("Finding next stranger...")
    pendingMatchRef.current = null
    pendingSignalsRef.current = []
    if (peerRef.current) {
      try {
        peerRef.current.destroy()
      } catch {
        /* ignore */
      }
      peerRef.current = null
    }
    setRemoteStream(null)
    socket.emit("next_stranger")
  }

  const connected = status === "Connected to stranger"

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

  return (
    <div className="relative min-h-dvh text-white">
      <NeonAmbientBg />

      <div className="relative z-10 flex min-h-dvh flex-col">
        <ToastBanner message={toast.message} type={toast.type} />

        <NeonRoomNav
          status={status}
          onlineCount={onlineCount}
          fakeOnlineCount={fakeOnlineCount}
          onBack={() => navigate("/")}
          onNext={nextStranger}
        />


        <div className="flex flex-1 flex-col px-3 pt-1 md:px-6 overflow-hidden">
          <div className="flex flex-1 flex-col mx-auto w-full max-w-6xl">
            <div className="flex flex-1 rounded-[1.35rem] p-[1.5px] shadow-[0_0_50px_rgba(168,85,247,0.12)]">
              <div
                className="flex flex-1 rounded-[1.25rem] p-[1px]"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(236,72,153,0.4), rgba(139,92,246,0.3), rgba(34,211,238,0.4))"
                }}
              >
                <div className="flex flex-1 flex-col rounded-[1.15rem] bg-slate-900 p-3 backdrop-blur-xl sm:p-4">
                  <VideoGrid
                    localStream={localStream}
                    remoteStream={remoteStream}
                    loading={status !== "Connected to stranger"}
                  />
                </div>
              </div>
            </div>

            <GoogleAd slot={import.meta.env.VITE_GOOGLE_AD_SLOT_VIDEO} className="min-h-20 mx-auto max-w-6xl" />

            {/* Collapsible Chat */}
            <div className="relative z-20 mx-auto w-full max-w-6xl shrink-0 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-3">
              <button 
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="w-full mb-3 p-4 rounded-xl border border-slate-600 bg-slate-800 text-white text-lg font-semibold hover:bg-slate-700 transition-all backdrop-blur-xl flex items-center justify-center gap-3"
              >
                <svg className={`w-6 h-6 transition-transform ${isChatOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>{isChatOpen ? "Hide Chat" : "Show Chat"}</span>
              </button>
              {isChatOpen && (
                <>
                  <div className="relative h-[300px] rounded-xl border border-slate-700 bg-slate-900 mb-3 p-6">
                    <section
                      className="h-full overflow-y-auto"
                      aria-label="Text chat messages"
                    >
                      <ChatBox
                        messages={messages}
                        loading={!connected}
                        strangerTyping={connected && isStrangerTyping}
                      />
                    </section>
                  </div>

                  <div ref={emojiWrapRef} className="relative mb-2">
                    {emojiOpen && (
                      <div className="absolute bottom-full left-0 right-0 z-20 mb-2 rounded-xl border border-slate-600 bg-slate-950 p-3">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
                          Quick emoji
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {QUICK_EMOJI.map((ch) => (
                            <button
                              key={ch}
                              type="button"
                              onClick={() => appendEmoji(ch)}
                              className="rounded-lg border border-slate-600 bg-slate-800 hover:bg-slate-700 p-1.5 text-xl transition"
                            >
                              {ch}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <form onSubmit={sendMessage} className="flex items-center gap-2 bg-slate-800 p-3 rounded-xl border border-slate-700">
                      <button
                        type="button"
                        onClick={() => setEmojiOpen((o) => !o)}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-600 text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition"
                        aria-label="Emoji"
                      >
                        <IconSmile />
                      </button>
                      <input
                        value={message}
                        onChange={(e) => onInputChange(e.target.value)}
                        className="flex-1 border-0 bg-transparent py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none rounded"
                        placeholder="Type a message..."
                        maxLength={500}
                        autoComplete="off"
                      />
                      <button
                        type="submit"
                        disabled={!message.trim()}
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white transition disabled:opacity-50"
                        aria-label="Send message"
                      >
                        <IconSend />
                      </button>
                    </form>
                  </div>

                  <p className="hidden sm:block text-center text-xs text-slate-500 pt-3">Press ESC to leave chat</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
