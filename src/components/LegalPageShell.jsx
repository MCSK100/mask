import { useEffect } from "react"
import { AuroraShell, AuroraBadge } from "./aurora/AuroraChrome"

const defaultTitle = "ShadowMeet — Meet. Teach. Share. Play. Together."

export default function LegalPageShell({ title, description, children }) {
  useEffect(() => {
    document.title = `${title} | ShadowMeet`
    const meta = document.querySelector('meta[name="description"]')
    const prev = meta?.getAttribute("content")
    if (meta && description) meta.setAttribute("content", description)
    return () => {
      document.title = defaultTitle
      if (meta && prev) meta.setAttribute("content", prev)
    }
  }, [title, description])

  return (
    <AuroraShell>
      <main style={{ paddingTop: "130px", paddingLeft: "64px", paddingRight: "24px", maxWidth: "820px" }} className="max-sm:!px-6">
        <AuroraBadge prefix="ShadowMeet" strong="no signup" />
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, fontSize: "clamp(1.8rem, 3.4vw, 2.6rem)", letterSpacing: "-0.02em", marginTop: "18px" }}>{title}</h1>
        <article style={{ marginTop: "20px", display: "grid", gap: "14px", fontSize: "15px", lineHeight: 1.7, color: "rgba(255,255,255,0.7)" }}>{children}</article>
        <div style={{ height: "40px" }} />
      </main>
    </AuroraShell>
  )
}
