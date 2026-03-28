import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import Peer from "simple-peer"
import VideoGrid from "../components/VideoGrid"
import OnlineCounter from "../components/OnlineCounter"
import GoogleAd from "../components/GoogleAd"
import { socket } from "../lib/socket"
import CyberButton from "../components/CyberButton"
import ToastBanner from "../components/ToastBanner"

export default function Video() {
  const navigate = useNavigate()
  const [status, setStatus] = useState("Initializing camera...")
  const [localStream, setLocalStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [onlineCount, setOnlineCount] = useState(0)
  const [toast, setToast] = useState({ message: "", type: "info" })

  const peerRef = useRef(null)
  const disconnectedRef = useRef(false)

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
    if (!localStream) return

    const cleanupPeer = () => {
      if (peerRef.current) {
        peerRef.current.destroy()
        peerRef.current = null
      }
      setRemoteStream(null)
    }

    const onWaiting = () => setStatus("Waiting for stranger...")
    const onMatched = ({ initiator }) => {
      cleanupPeer()
      setStatus("Connected to stranger")

      const peer = new Peer({
        initiator: Boolean(initiator),
        trickle: false,
        stream: localStream
      })

      peer.on("signal", (data) => socket.emit("signal", data))
      peer.on("stream", (stream) => setRemoteStream(stream))
      peer.on("close", () => setRemoteStream(null))
      peer.on("error", () => setStatus("Connection interrupted. Finding new stranger..."))
      peerRef.current = peer
    }
    const onSignal = (data) => {
      if (peerRef.current && data) {
        peerRef.current.signal(data)
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
  }, [localStream])

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
    if (peerRef.current) {
      peerRef.current.destroy()
      peerRef.current = null
    }
    setRemoteStream(null)
    socket.emit("next_stranger")
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 via-slate-950 to-black p-3 text-white md:p-6">
      <ToastBanner message={toast.message} type={toast.type} />
      <div className="mx-auto grid h-[calc(100vh-1.5rem)] w-full max-w-6xl grid-rows-[auto_1fr_auto] gap-2 sm:gap-3 md:h-[calc(100vh-3rem)] md:gap-4">
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
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4 backdrop-blur">
          <VideoGrid localStream={localStream} remoteStream={remoteStream} loading={status !== "Connected to stranger"} />
        </div>
        <GoogleAd slot={import.meta.env.VITE_GOOGLE_AD_SLOT_VIDEO} className="min-h-20" />
      </div>
    </div>
  )
}