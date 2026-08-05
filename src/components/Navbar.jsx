import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import OnlineCounter from "./OnlineCounter"
import InstallPWA from "./InstallPWA"
import { socket } from "../lib/socket"
import { useFakePresence } from "../hooks/useFakePresence"


export default function Navbar() {
  const [onlineCount, setOnlineCount] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const { count: fakeOnlineCount } = useFakePresence({ realCount: onlineCount })

  useEffect(() => {
    const handleOnline = (count) => setOnlineCount(Number(count) || 0)
    socket.on("online_count", handleOnline)

    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()

    return () => {
      socket.off("online_count", handleOnline)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-slate-950/70 backdrop-blur-xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.8)]"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 sm:px-6 sm:gap-3">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <img
            src="/shadowchaty-logo.png"
            alt="Shadowchaty — anonymous chat"
            className="h-9 w-auto drop-shadow-[0_0_18px_rgba(168,85,247,0.35)]"
            width={120}
            height={44}
            loading="eager"
          />
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          <InstallPWA />
          <OnlineCounter count={onlineCount} fakeCount={fakeOnlineCount} />
        </div>
      </nav>
    </motion.header>
  )
}
