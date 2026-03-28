import { useEffect } from "react"

const client = import.meta.env.VITE_GOOGLE_ADS_CLIENT

export default function GoogleAd({ slot, className = "" }) {
  useEffect(() => {
    if (!client) return

    const scriptId = "adsbygoogle-script"
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script")
      script.id = scriptId
      script.async = true
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`
      script.crossOrigin = "anonymous"
      document.head.appendChild(script)
    }

    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // Keep UI stable if ads are blocked or script not ready.
    }
  }, [])

  if (!client || !slot) return null

  return (
    <ins
      className={`adsbygoogle block overflow-hidden rounded-xl border border-white/10 bg-slate-900/60 ${className}`}
      style={{ display: "block" }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
}
