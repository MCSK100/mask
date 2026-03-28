import { io } from "socket.io-client"

// Dev: local backend. Prod: set VITE_SOCKET_URL to your Socket.IO host (e.g. Render), not the Vercel URL.
const devUrl = "http://localhost:5000"
const envUrl = import.meta.env.VITE_SOCKET_URL

export const SOCKET_URL = import.meta.env.DEV
  ? envUrl || devUrl
  : envUrl || (typeof window !== "undefined" ? window.location.origin : devUrl)

if (import.meta.env.PROD && typeof window !== "undefined" && !envUrl) {
  console.warn(
    "[Mask] Set VITE_SOCKET_URL in Vercel to your backend (e.g. https://your-api.onrender.com). " +
      "Otherwise signaling connects to this page’s origin and chat/video will fail."
  )
}

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 750
})
