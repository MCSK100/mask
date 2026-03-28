const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
require("dotenv").config()

const app = express()

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : "*"

app.use(helmet())
app.use(express.json())
app.use(
  cors({
    origin: allowedOrigins
  })
)
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 200
  })
)

app.get("/health", (_, res) => {
  res.json({ ok: true })
})

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: allowedOrigins
  }
})

const waitingUsers = []
const RATE_LIMITS = {
  send_message: { windowMs: 10_000, max: 8, reason: "Message rate limit exceeded. Please slow down." },
  typing: { windowMs: 4_000, max: 20, reason: "Typing events too frequent. Please slow down." },
  next_stranger: { windowMs: 15_000, max: 4, reason: "Too many skips. Please wait a moment." }
}

const sanitizeMessage = (input) => {
  if (typeof input !== "string") return ""
  const withoutControls = input.replace(/[\u0000-\u001f\u007f]/g, "")
  const singleSpaced = withoutControls.replace(/\s+/g, " ").trim()
  return singleSpaced.slice(0, 500)
}

const isSocketRateLimited = (socket, action) => {
  const rule = RATE_LIMITS[action]
  if (!rule) return false

  const now = Date.now()
  const bucket = socket.rateBuckets[action] || []
  const active = bucket.filter((timestamp) => now - timestamp <= rule.windowMs)

  if (active.length >= rule.max) {
    socket.emit("rate_limited", { action, reason: rule.reason })
    socket.rateBuckets[action] = active
    return true
  }

  active.push(now)
  socket.rateBuckets[action] = active
  return false
}

const emitOnlineCount = () => {
  io.emit("online_count", io.engine.clientsCount)
}

const removeFromQueue = (socketId) => {
  const index = waitingUsers.findIndex((socket) => socket.id === socketId)
  if (index >= 0) {
    waitingUsers.splice(index, 1)
  }
}

const enqueueUser = (socket) => {
  removeFromQueue(socket.id)
  socket.partner = null
  waitingUsers.push(socket)
  socket.emit("waiting")
}

const endPairing = (socket) => {
  if (!socket.partner) return

  const partnerSocket = io.sockets.sockets.get(socket.partner)
  const partnerId = socket.partner

  socket.partner = null
  if (partnerSocket) {
    partnerSocket.partner = null
    partnerSocket.emit("stranger_disconnected")
    enqueueUser(partnerSocket)
    tryMatch()
  } else if (partnerId) {
    io.to(partnerId).emit("stranger_disconnected")
  }
}

const tryMatch = () => {
  while (waitingUsers.length >= 2) {
    const user1 = waitingUsers.shift()
    const user2 = waitingUsers.shift()

    if (!user1?.connected || !user2?.connected) continue

    user1.partner = user2.id
    user2.partner = user1.id

    // First user initiates WebRTC offer, second user answers.
    user1.emit("matched", { initiator: true })
    user2.emit("matched", { initiator: false })
  }
}

io.on("connection", (socket) => {
  socket.partner = null
  socket.rateBuckets = {}
  enqueueUser(socket)
  tryMatch()
  socket.emit("online_count", io.engine.clientsCount)
  emitOnlineCount()

  socket.on("send_message", (msg) => {
    if (!socket.partner || isSocketRateLimited(socket, "send_message")) return
    const clean = sanitizeMessage(msg)
    if (!clean) return
    io.to(socket.partner).emit("receive_message", clean)
  })

  socket.on("typing", () => {
    if (!socket.partner || isSocketRateLimited(socket, "typing")) return
    io.to(socket.partner).emit("typing")
  })

  socket.on("stop_typing", () => {
    if (!socket.partner) return
    io.to(socket.partner).emit("stop_typing")
  })

  socket.on("signal", (signalData) => {
    if (!socket.partner || !signalData) return
    io.to(socket.partner).emit("signal", signalData)
  })

  socket.on("next_stranger", () => {
    if (isSocketRateLimited(socket, "next_stranger")) return
    removeFromQueue(socket.id)
    endPairing(socket)
    enqueueUser(socket)
    tryMatch()
    emitOnlineCount()
  })

  socket.on("request_online_count", () => {
    socket.emit("online_count", io.engine.clientsCount)
  })

  socket.on("disconnect", () => {
    removeFromQueue(socket.id)
    endPairing(socket)
    emitOnlineCount()
  })
})

const PORT = Number(process.env.PORT || 5000)
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})