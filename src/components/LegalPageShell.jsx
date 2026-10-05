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
      <main style={{ paddingTop: "150px", paddingLeft: "34px", paddingRight: "34px", maxWidth: "820px", margin: "0 auto" }}>
        <AuroraBadge prefix="ShadowMeet" strong="no signup" />
        <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: "clamp(2rem,4vw,3rem)", letterSpacing: "-0.03em", marginTop: "18px", textTransform: "uppercase", color: "#14202B" }}>{title}</h1>
        <div className="omd-card" style={{ marginTop: "20px", padding: "28px", borderRadius: "18px" }}>
          <article style={{ display: "grid", gap: "14px", fontSize: "15px", lineHeight: 1.7, color: "#4A6173" }}>{children}</article>
        </div>
        <div style={{ height: "40px" }} />
      </main>
    </AuroraShell>
  )
}
