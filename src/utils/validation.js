import { normalizeCode } from "./meetingCode"

export function validateName(name) {
  const n = String(name || "").trim()
  if (n.length < 1) return "Enter your display name."
  if (n.length > 40) return "Name must be under 40 characters."
  return null
}

export function validateCode(code) {
  const c = normalizeCode(code)
  if (!c) return "Enter the meeting code."
  if (c.length < 4 || c.length > 10) return "Meeting code looks invalid."
  return null
}

export function sanitizeChat(text) {
  return String(text || "").replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, 500)
}

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]))
}
