/**
 * Helpers for the PWA install prompt
 */

const DISMISS_KEY = "pwa_install_dismissed_at"
const DISMISS_DAYS = 7

export const IS_IOS =
  typeof navigator !== "undefined" && /iphone|ipad|ipod/i.test(navigator.userAgent)

export const IS_STANDALONE =
  typeof window !== "undefined" &&
  (window.matchMedia?.("(display-mode: standalone)").matches ||
    window.navigator.standalone === true)

export function recentlyDismissed() {
  try {
    const raw = localStorage.getItem(DISMISS_KEY)
    if (!raw) return false
    const ts = Number(raw)
    if (!ts) return false
    return Date.now() - ts < DISMISS_DAYS * 24 * 60 * 60 * 1000
  } catch {
    return false
  }
}

export function markDismissed() {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()))
  } catch {
    /* ignore */
  }
}
