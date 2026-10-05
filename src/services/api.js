import { SOCKET_URL } from "../lib/socket"
import { getApiBase } from "../lib/livekit"

// VITE_API_URL wins; falls back to legacy VITE_SOCKET_URL for backward compat.
const API_BASE = (getApiBase() || import.meta.env.VITE_SOCKET_URL || SOCKET_URL || "").replace(/\/$/, "")

async function req(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`)
    err.status = res.status
    err.code = data.code || null
    err.data = data
    throw err
  }
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

/** LiveKit-backed meetings API (primary). Backend owns metadata + tokens. */
export const meetingsApi = {
  /** POST /api/meetings { title, hostName, scheduledAt, durationMin, password, roomType } */
  create(payload) {
    return req("/api/meetings", { method: "POST", body: JSON.stringify(payload) })
  },
  /** GET /api/meetings/:code — public metadata. */
  get(code) {
    return req(`/api/meetings/${encodeURIComponent(code)}`)
  },
  /**
   * POST /api/meetings/join { code, name, password, hostToken? }
   * -> { token, serverUrl, roomId, role, participantId } | { status:'waiting' }
   */
  join({ code, name, password, hostToken }) {
    return req("/api/meetings/join", {
      method: "POST",
      body: JSON.stringify({ code, name, password: password || "", hostToken: hostToken || null })
    })
  },
  /** Validated host operations (server-verified hostToken, never frontend-only). */
  hostAction(code, action, body = {}, hostToken) {
    return req(`/api/meetings/${encodeURIComponent(code)}/host/${encodeURIComponent(action)}`, {
      method: "POST",
      headers: hostToken ? { "x-host-token": hostToken } : {},
      body: JSON.stringify({ ...body, hostToken })
    })
  },
  admit(code, participantId, hostToken, extra = {}) {
    return req(`/api/meetings/${encodeURIComponent(code)}/admit`, {
      method: "POST",
      headers: hostToken ? { "x-host-token": hostToken } : {},
      body: JSON.stringify({ participantId, hostToken, ...extra })
    })
  },
  waiting(code, hostToken) {
    return req(`/api/meetings/${encodeURIComponent(code)}/waiting`, {
      headers: hostToken ? { "x-host-token": hostToken } : {}
    })
  },
  livekitHealth() {
    return req("/api/livekit/health")
  }
}
