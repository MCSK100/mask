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
    <nav className="flex flex-wrap items-center justify-between gap-2 p-3 backdrop-blur-md sm:gap-3 sm:p-6">
      <Link to="/" className="flex min-w-0 items-center gap-2">
        <img
          src="/mask-logo.png"
          alt="Mask — anonymous chat"
          className="h-9 w-auto max-w-[min(200px,55vw)] object-contain sm:h-11"
          width={200}
          height={44}
          loading="eager"
        />
      </Link>

      <OnlineCounter count={onlineCount} />
    </nav>
  )
}