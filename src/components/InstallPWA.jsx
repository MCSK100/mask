import { useEffect, useState, useCallback } from "react"
import { IS_IOS, IS_STANDALONE, markDismissed } from "../utils/pwaInstall"

export default function InstallPWA({ className = "" }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [installed, setInstalled] = useState(false)
  const [showIOSHint, setShowIOSHint] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (IS_STANDALONE) return

    const onBeforeInstall = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    const onAppInstalled = () => {
      setInstalled(true)
      setDeferredPrompt(null)
      setOpen(false)
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstall)
    window.addEventListener("appinstalled", onAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall)
      window.removeEventListener("appinstalled", onAppInstalled)
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
        setInstalled(true)
      }
    } catch {
      /* ignore */
    } finally {
      setDeferredPrompt(null)
      setOpen(false)
    }
  }, [deferredPrompt])

  if (IS_STANDALONE || installed) return null

  const shouldRenderButton = Boolean(deferredPrompt) || IS_IOS
  if (!shouldRenderButton) return null

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          if (IS_IOS) setShowIOSHint(true)
          setOpen(true)
        }}
        className={`inline-flex items-center gap-1.5 rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-200 shadow-[0_0_18px_rgba(16,185,129,0.25)] backdrop-blur-md transition hover:border-emerald-300/60 hover:bg-emerald-500/20 sm:text-sm ${className}`}
        aria-label="Install Shadowchaty app"
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

  return (
    <div
      role="dialog"
      aria-label="Install Shadowchaty"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md rounded-2xl border border-emerald-400/30 bg-slate-950/95 p-4 text-sm text-slate-100 shadow-[0_0_40px_rgba(16,185,129,0.25)] backdrop-blur-xl sm:bottom-6 sm:p-5"
    >
      <div className="flex items-start gap-3">
        <img
          src="/shadowchaty-favicon.jpg"
          alt=""
          className="h-12 w-12 shrink-0 rounded-xl border border-white/10 object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold text-white">Install Shadowchaty</p>
          <p className="mt-1 text-xs text-slate-300 sm:text-sm">
            Add Shadowchaty to your home screen for one-tap anonymous chat. No app store needed.
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
    </div>
  )
}
