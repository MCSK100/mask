import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import OnlineCounter from "./OnlineCounter"
import { socket } from "../lib/socket"

export default function Navbar() {
  const [onlineCount, setOnlineCount] = useState(0)

  useEffect(() => {
    const handleOnline = (count) => setOnlineCount(Number(count) || 0)
    socket.on("online_count", handleOnline)
    return () => socket.off("online_count", handleOnline)
  }, [])

  return (
    <nav className="flex flex-wrap items-center justify-between gap-2 px-6 backdrop-blur-md sm:gap-3">
      <Link to="/" className="flex min-w-0 items-center gap-2">
        <img
src="/shadowchaty-logo.png"
alt="Shadowchaty — anonymous chat"
className=""
width={120}
          height={44}
          loading="eager"
        />
      </Link>

      <OnlineCounter count={onlineCount} />
    </nav>
  )
}