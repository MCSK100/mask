import { useEffect, useState } from "react"
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
      <h1 className="text-xl font-bold text-purple-300 sm:text-3xl">Mask</h1>

      <OnlineCounter count={onlineCount} />
    </nav>
  )
}