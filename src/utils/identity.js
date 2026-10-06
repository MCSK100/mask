const KEY = "onespace_live_pid"

export function getParticipantId() {
  try {
    let id = sessionStorage.getItem(KEY) || localStorage.getItem(KEY)
    if (!id) {
      id = crypto.randomUUID()
      try { sessionStorage.setItem(KEY, id) } catch {}
      try { localStorage.setItem(KEY, id) } catch {}
    }
    return id
  } catch {
    return Math.random().toString(36).slice(2) + Date.now().toString(36)
  }
}

export function getHostToken(code) {
  try {
    return localStorage.getItem(`sm_host_${String(code).toUpperCase()}`) || null
  } catch { return null }
}

export function setHostToken(code, token) {
  try {
    localStorage.setItem(`sm_host_${String(code).toUpperCase()}`, token)
  } catch {}
}
