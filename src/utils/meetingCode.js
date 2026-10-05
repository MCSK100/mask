export const CODE_RE = /^[A-HJ-NP-Z2-9]{4,10}$/i

export function normalizeCode(input) {
  return String(input || "").toUpperCase().replace(/[^A-HJ-NP-Z2-9]/gi, "").trim()
}

export function isValidCode(input) {
  return CODE_RE.test(normalizeCode(input))
}

export function meetingLink(code) {
  const base = typeof window !== "undefined" ? window.location.origin : ""
  return `${base}/meet/${normalizeCode(code)}`
}

export function shortId() {
  try {
    return crypto.randomUUID().slice(0, 8)
  } catch {
    return Math.random().toString(36).slice(2, 10).toUpperCase()
  }
}
