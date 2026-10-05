import { SOCKET_URL } from "../lib/socket"

const API_BASE = (import.meta.env.VITE_SOCKET_URL || SOCKET_URL || "").replace(/\/$/, "")

async function req(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}

export const roomsApi = {
  create(payload) {
    return req("/api/rooms", { method: "POST", body: JSON.stringify(payload) })
  },
  get(code) {
    return req(`/api/rooms/${encodeURIComponent(code)}`)
  },
  validate(code, password) {
    return req(`/api/rooms/${encodeURIComponent(code)}/validate`, {
      method: "POST",
      body: JSON.stringify({ password: password || "" })
    })
  }
}
