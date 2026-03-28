import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import VideoGrid from "../components/VideoGrid"
import GoogleAd from "../components/GoogleAd"
import { socket } from "../lib/socket"
import ToastBanner from "../components/ToastBanner"
import { getIceServers } from "../lib/webrtc"
import { createMaskVideoPeer } from "../lib/maskWebRTC"
import NeonAmbientBg from "../components/neon/NeonAmbientBg"
import NeonRoomNav from "../components/neon/NeonRoomNav"

export default function Video() {
  const navigate = useNavigate()
  const [status, setStatus] = useState("Initializing camera...")
  const [localStream, setLocalStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [onlineCount, setOnlineCount] = useState(0)
  const [toast, setToast] = useState({ message: "", type: "info" })

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
    let mounted = true

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
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
    socket.on("online_count", onOnlineCount)
    socket.on("connect_error", onConnectError)
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
      socket.off("online_count", onOnlineCount)
      socket.off("connect_error", onConnectError)
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

  return (
    <div className="relative min-h-dvh text-white">
      <NeonAmbientBg />

      <div className="relative z-10 flex min-h-dvh flex-col">
        <ToastBanner message={toast.message} type={toast.type} />

        <NeonRoomNav
          status={status}
          onlineCount={onlineCount}
          onBack={() => navigate("/")}
          onNext={nextStranger}
        />

        <div className="flex min-h-0 flex-1 flex-col px-3 pb-4 pt-1 md:px-6 md:pb-6">
          <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col gap-4">
            <div className="relative min-h-0 flex-1 rounded-[1.35rem] p-[1.5px] shadow-[0_0_50px_rgba(168,85,247,0.12)]">
              <div
                className="h-full min-h-[280px] rounded-[1.25rem] p-[1px] md:min-h-[320px]"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(236,72,153,0.4), rgba(139,92,246,0.3), rgba(34,211,238,0.4))"
                }}
              >
                <div className="flex h-full min-h-0 flex-col rounded-[1.15rem] bg-black/35 p-3 backdrop-blur-xl sm:p-4">
                  <VideoGrid
                    localStream={localStream}
                    remoteStream={remoteStream}
                    loading={status !== "Connected to stranger"}
                  />
                </div>
              </div>
            </div>

            <GoogleAd slot={import.meta.env.VITE_GOOGLE_AD_SLOT_VIDEO} className="min-h-20" />
          </div>
        </div>
      </div>
    </div>
  )
}
