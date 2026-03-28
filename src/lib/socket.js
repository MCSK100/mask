import { io } from "socket.io-client"

const fallbackUrl = import.meta.env.DEV
  ? "http://localhost:5000"
  : typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:5000"

export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || fallbackUrl

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 750
})
