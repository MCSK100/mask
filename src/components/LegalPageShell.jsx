import { useLocation } from "react-router-dom"
import { WannaShell, WannaBadge } from "./wanna/WannaChrome"
import Seo from "./Seo"

export default function LegalPageShell({ title, description, children }) {
  const { pathname } = useLocation()

  return (
    <WannaShell>
      <Seo title={`${title} | OneSpace Live`} description={description} path={pathname} />
      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "30px 0 20px" }}>
        <WannaBadge prefix="OneSpace Live" strong="no signup" />
        <h1 className="wz-title">{title}</h1>
        <div className="wz-card" style={{ marginTop: "22px" }}>
          <article className="wz-article" style={{ display: "grid", gap: "14px", fontSize: "15px", lineHeight: 1.7 }}>{children}</article>
        </div>
      </div>
    </WannaShell>
  )
}
