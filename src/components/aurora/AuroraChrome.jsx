import { useNavigate } from "react-router-dom"
import { Video, Globe, AtSign, Share2, MessageCircle, ArrowUpRight, Zap } from "lucide-react"
import AuroraNavbar from "./AuroraNavbar"

export function Sky() {
  return (
    <>
      <div className="omd-sky" aria-hidden>
        <div className="omd-cloud" style={{ top: "9%", width: "440px", height: "210px", opacity: 0.95, animation: "omd-drift 70s linear infinite" }} />
        <div className="omd-cloud" style={{ top: "28%", width: "300px", height: "110px", opacity: 0.6, animation: "omd-drift 96s linear infinite", animationDelay: "-52s" }} />
        <div className="omd-cloud" style={{ top: "52%", width: "400px", height: "190px", opacity: 0.7, animation: "omd-drift 80s linear infinite", animationDelay: "-30s" }} />
        <div className="omd-cloud" style={{ top: "72%", width: "280px", height: "130px", opacity: 0.5, animation: "omd-drift 110s linear infinite", animationDelay: "-60s" }} />
      </div>
      <div className="omd-grain" aria-hidden />
    </>
  )
}

export function AuroraSocials() {
  const socials = [
    { label: "Website", Icon: Globe },
    { label: "Social", Icon: AtSign },
    { label: "Share", Icon: Share2 },
    { label: "Chat", Icon: MessageCircle },
  ]
  return (
    <div style={{ display: "flex", gap: "10px" }}>
      {socials.map(({ label, Icon }) => (
        <a
          key={label}
          href="#"
          aria-label={label}
          onClick={(e) => e.preventDefault()}
          style={{ width: "36px", height: "36px", borderRadius: "999px", background: "#fff", border: "1px solid rgba(20,32,43,.13)", display: "flex", alignItems: "center", justifyContent: "center", color: "#14202B" }}
        >
          <Icon size={15} />
        </a>
      ))}
    </div>
  )
}

export function AuroraShell({ children, showFooter = true }) {
  return (
    <div className="sup-page" style={{ position: "relative", width: "100%", minHeight: "100svh", overflow: "clip" }}>
      <Sky />
      <AuroraNavbar />
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
      {showFooter && <AuroraFooter />}
    </div>
  )
}

export function AuroraFooter() {
  const navigate = useNavigate()
  return (
    <footer style={{ position: "relative", zIndex: 2, marginTop: "40px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 34px 34px" }}>
        <div className="omd-card" style={{ padding: "28px 30px", display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ display: "grid", placeItems: "center", width: "36px", height: "36px", borderRadius: "10px", background: "#F0531C" }}>
              <Video size={18} color="#fff" />
            </span>
            <div>
              <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: "17px", lineHeight: 1 }}>OneSpace Live</p>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: "#8AA6B8" }}>© 2026 · made for modern teams</p>
            </div>
          </div>
          <AuroraSocials />
          <div style={{ display: "flex", gap: "18px", alignItems: "center", fontSize: "14px", fontWeight: 600 }}>
            <button onClick={() => navigate("/privacy")} style={{ background: "none", border: 0, cursor: "pointer", fontWeight: 600 }}>Privacy</button>
            <button onClick={() => navigate("/terms")} style={{ background: "none", border: 0, cursor: "pointer", fontWeight: 600 }}>Terms</button>
            <button onClick={() => navigate("/about")} style={{ background: "none", border: 0, cursor: "pointer", fontWeight: 600 }}>About</button>
            <button onClick={() => navigate("/create")} className="btn" style={{ padding: "10px 18px", fontSize: "13px" }}>
              <Zap size={14} /> Meet Now <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export function AuroraBadge({ strong = "Free to start", prefix = "No signup ·" }) {
  return (
    <div className="aurora-badge">
      <div style={{ display: "flex" }}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="aurora-avatar" style={{ marginLeft: i === 0 ? 0 : "-9px" }} />
        ))}
      </div>
      <span style={{ fontSize: "14px", fontWeight: 500, color: "#4A6173" }}>
        {prefix} <strong style={{ color: "#14202B", fontWeight: 700 }}>{strong}</strong>
      </span>
    </div>
  )
}

export function SectionTab({ icon: Icon, label }) {
  return (
    <span className="tab">
      {Icon ? <Icon size={12} /> : null}
      {label}
    </span>
  )
}
