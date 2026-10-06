import { useEffect, useState, useCallback } from "react"
import {
  IS_IOS,
  IS_STANDALONE,
  markDismissed,
  recentlyDismissed,
  setInstalledFlag,
  getInstalledFlag,
  checkForUpdates,
  registerUpdateHandlers,
  reloadForUpdate,
} from "../utils/pwaInstall"

export default function InstallPWA({ className = "" }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [installed, setInstalled] = useState(false)
  const [showIOSHint, setShowIOSHint] = useState(false)
  const [open, setOpen] = useState(false)
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    if (IS_STANDALONE) return

    const onBeforeInstall = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    const onAppInstalled = () => {
      setInstalledFlag()
      setInstalled(true)
      setDeferredPrompt(null)
      setOpen(false)
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstall)
    window.addEventListener("appinstalled", onAppInstalled)

    // Listen for new SW version taking control
    const removeHandlers = registerUpdateHandlers(() => setUpdateAvailable(true))

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall)
      window.removeEventListener("appinstalled", onAppInstalled)
      removeHandlers && removeHandlers()
    }
  }, [])

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) {
      if (IS_IOS) setShowIOSHint(true)
      return
    }
    try {
      deferredPrompt.prompt()
      const choice = await deferredPrompt.userChoice
      if (choice?.outcome === "accepted") {
        setInstalledFlag()
        setInstalled(true)
      }
    } catch {
      /* ignore */
    } finally {
      setDeferredPrompt(null)
      setOpen(false)
    }
  }, [deferredPrompt])

  const handleCheckForUpdates = useCallback(async () => {
    setChecking(true)
    try {
      const updated = await checkForUpdates()
      if (updated) setUpdateAvailable(true)
    } finally {
      setChecking(false)
    }
  }, [])

  const handleUpdate = useCallback(() => {
    reloadForUpdate()
  }, [])

  const wasInstalledBefore = getInstalledFlag()

  // If truly standalone & installed, hide the widget entirely.
  if (IS_STANDALONE || (installed && wasInstalledBefore)) return null

// Toolbar "Install" button — always visible (permanent static install button)
  if (!open && !updateAvailable) {
    return (
      <button
        type="button"
        onClick={() => {
          if (IS_IOS) setShowIOSHint(true)
          setOpen(true)
        }}
        className={`inline-flex items-center gap-1.5 rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-200 shadow-[0_0_18px_rgba(16,185,129,0.25)] backdrop-blur-md transition hover:border-emerald-300/60 hover:bg-emerald-500/20 sm:text-sm ${className}`}
        aria-label="Install OneSpace Live app"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
          <path
            d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Install App
      </button>
    )
  }

// Update available banner — centered overlay with backdrop
  if (updateAvailable && !open) {
    return (
      <div
        role="dialog"
        aria-label="Update available"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        onClick={() => setUpdateAvailable(false)}
      >
        <div
          className="relative w-full max-w-md rounded-2xl border border-cyan-400/30 bg-slate-950/95 p-4 text-sm text-slate-100 shadow-[0_0_40px_rgba(34,211,238,0.25)] backdrop-blur-xl sm:p-5"
          onClick={(e) => e.stopPropagation()}
        >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-xl">
            🔄
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold text-white">Update available</p>
            <p className="mt-1 text-xs text-slate-300 sm:text-sm">
              A new version of OneSpace Live is ready. Reload to get the latest features.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setUpdateAvailable(false)}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-white/5 hover:text-white"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setUpdateAvailable(false)}
            className="rounded-full px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            Later
          </button>
<button
            type="button"
            onClick={handleUpdate}
            className="rounded-full border border-cyan-400/50 bg-cyan-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.35)] transition hover:bg-cyan-500/30"
          >
            Update now
          </button>
        </div>
      </div>
      </div>
    )
  }

// Install dialog — centered overlay with backdrop
  return (
    <div
      role="dialog"
      aria-label="Install OneSpace Live"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={() => {
        markDismissed()
        setOpen(false)
      }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-emerald-400/30 bg-slate-950/95 p-4 text-sm text-slate-100 shadow-[0_0_40px_rgba(16,185,129,0.25)] backdrop-blur-xl sm:p-5"
        onClick={(e) => e.stopPropagation()}
      >
      <div className="flex items-start gap-3">
        <img
          src="/onespace-live-favicon.jpg"
          alt=""
          className="h-12 w-12 shrink-0 rounded-xl border border-white/10 object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold text-white">Install OneSpace Live</p>
          <p className="mt-1 text-xs text-slate-300 sm:text-sm">
            Add OneSpace Live to your home screen for one-tap meetings. No app store needed.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            markDismissed()
            setOpen(false)
          }}
          className="rounded-lg p-1 text-slate-400 transition hover:bg-white/5 hover:text-white"
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {showIOSHint ? (
        <div className="mt-3 rounded-xl border border-cyan-400/25 bg-cyan-950/40 p-3 text-xs text-cyan-100">
          On iPhone: tap{" "}
          <span className="inline-flex items-center gap-1 font-semibold">
            <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
              <path
                d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Share
          </span>{" "}
          → <span className="font-semibold">Add to Home Screen</span>.
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            markDismissed()
            setOpen(false)
          }}
          className="rounded-full px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
        >
          Not now
        </button>
        <button
          type="button"
          onClick={handleInstall}
          className="rounded-full border border-emerald-400/50 bg-emerald-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.35)] transition hover:bg-emerald-500/30"
        >
          Install
        </button>
      </div>

      {/* Manual "Check for updates" */}
      <div className="mt-3 border-t border-white/10 pt-3">
        <button
          type="button"
          onClick={handleCheckForUpdates}
          disabled={checking}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 transition hover:text-cyan-300 disabled:opacity-50"
          aria-label="Check for updates"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
            <path
              d="M4 4v5h5M20 20v-5h-5M4.58 9A8 8 0 0 1 19.4 6.6M4.6 17.4A8 8 0 0 0 19.42 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {checking ? "Checking…" : "Check for updates"}
        </button>
{updateAvailable ? (
          <span className="ml-2 text-xs font-medium text-cyan-300">✓ New version ready</span>
        ) : null}
      </div>
    </div>
    </div>
  )
}
