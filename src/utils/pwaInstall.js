/**
 * Helpers for the PWA install prompt + update flow
 */

const DISMISS_KEY = "pwa_install_dismissed_at"
const DISMISS_DAYS = 7
const INSTALLED_KEY = "pwa_installed"

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

/** Mark the app as installed (persisted) */
export function setInstalledFlag() {
  try {
    localStorage.setItem(INSTALLED_KEY, "true")
  } catch {
    /* ignore */
  }
}

/** Check whether the app has been installed before */
export function getInstalledFlag() {
  try {
    return localStorage.getItem(INSTALLED_KEY) === "true"
  } catch {
    return false
  }
}

/**
 * Check for a new SW update.
 * @returns {Promise<boolean>} true if a new version was found and activated
 */
export async function checkForUpdates() {
  try {
    if (!("serviceWorker" in navigator)) return false

    const reg = await navigator.serviceWorker.getRegistration()
    if (!reg) return false

    // If there's a waiting worker, activate it now.
    if (reg.waiting) {
      reg.waiting.postMessage({ type: "SKIP_WAITING" })
      return true
    }

    // Otherwise, attempt an update check.
    const updated = await reg.update()
    if (updated?.waiting) {
      updated.waiting.postMessage({ type: "SKIP_WAITING" })
      return true
    }

    return false
  } catch {
    return false
  }
}

/**
 * Register update listeners:
 * - When a new SW takes control, fires onUpdateAvailable.
 * - When a skipWaiting message arrives, reloads the page.
 * @param {() => void} onUpdateAvailable
 */
export function registerUpdateHandlers(onUpdateAvailable) {
  if (!("serviceWorker" in navigator)) return () => {}

  const onControllerChange = () => {
    onUpdateAvailable && onUpdateAvailable()
  }

  const onMessage = (event) => {
    if (event.data && event.data.type === "NEW_VERSION") {
      onUpdateAvailable && onUpdateAvailable()
    }
  }

  navigator.serviceWorker.addEventListener("controllerchange", onControllerChange)
  navigator.serviceWorker.addEventListener("message", onMessage)

  return () => {
    navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange)
    navigator.serviceWorker.removeEventListener("message", onMessage)
  }
}

/** Force reload to apply a new service worker version */
export function reloadForUpdate() {
  try {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg?.waiting) reg.waiting.postMessage({ type: "SKIP_WAITING" })
      })
    }
  } catch {
    /* ignore */
  }
  // Give the SW a moment to take control, then reload.
  setTimeout(() => window.location.reload(), 300)
}
