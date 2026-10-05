export function extractYouTubeId(input) {
  if (!input) return null
  const s = String(input).trim()
  // bare 11-char id
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s
  try {
    const u = new URL(s)
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.slice(1).split(/[?/]/)[0]
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null
    }
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v")
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v
      const m = u.pathname.match(/\/(embed|shorts|live)\/([a-zA-Z0-9_-]{11})/)
      if (m) return m[2]
    }
  } catch { /* not a url */ }
  return null
}
