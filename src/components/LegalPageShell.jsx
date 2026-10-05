import { useEffect } from "react"
import { WannaShell, WannaBadge } from "./wanna/WannaChrome"

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
    <WannaShell>
      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "30px 0 20px" }}>
        <WannaBadge prefix="ShadowMeet" strong="no signup" />
        <h1 className="wz-title">{title}</h1>
        <div className="wz-card" style={{ marginTop: "22px" }}>
          <article className="wz-article" style={{ display: "grid", gap: "14px", fontSize: "15px", lineHeight: 1.7 }}>{children}</article>
        </div>
      </div>
    </WannaShell>
  )
}
