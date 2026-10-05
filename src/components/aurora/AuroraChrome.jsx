import { useNavigate } from "react-router-dom"
import AuroraNavbar from "./AuroraNavbar"

const socials = [
  { label: "X", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
  { label: "LinkedIn", path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.554V9h3.565v11.452z" },
  { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" }
]

export function AuroraSocials() {
  return (
    <div style={{ display: "flex", gap: "12px" }}>
      {socials.map((s) => (
        <a
          key={s.label}
          href="#"
          aria-label={s.label}
          onClick={(e) => e.preventDefault()}
          style={{ width: "36px", height: "36px", borderRadius: "80px", background: "#000000", border: "3px solid #ffffff", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d={s.path} /></svg>
        </a>
      ))}
    </div>
  )
}

export function AuroraShell({ children, showFooter = true }) {
  return (
    <div className="sup-page" style={{ position: "relative", width: "100%", minHeight: "100svh", overflow: "hidden" }}>
      <AuroraNavbar />
      <div style={{ position: "relative", zIndex: 10 }}>{children}</div>
      {showFooter && <AuroraFooter />}
    </div>
  )
}

export function AuroraFooter() {
  const navigate = useNavigate()
  return (
    <footer style={{ position: "relative", zIndex: 10, padding: "48px 80px", display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "center", justifyContent: "space-between", borderTop: "3px solid #ffffff", background: "#000000" }} className="max-sm:!px-6">
      <AuroraSocials />
      <div style={{ display: "flex", gap: "24px", alignItems: "center", fontSize: "16px", fontWeight: 600, color: "#ffffff", fontFamily: "'Karla', sans-serif" }}>
        <span>© 2026 ShadowMeet</span>
        <button onClick={() => navigate("/privacy")} style={{ background: "none", border: 0, color: "inherit", cursor: "pointer", fontWeight: 600 }}>Privacy</button>
        <button onClick={() => navigate("/terms")} style={{ background: "none", border: 0, color: "inherit", cursor: "pointer", fontWeight: 600 }}>Terms</button>
        <button onClick={() => navigate("/about")} style={{ background: "none", border: 0, color: "inherit", cursor: "pointer", fontWeight: 600 }}>About</button>
      </div>
    </footer>
  )
}

export function AuroraBadge({ strong = "Free To Start", prefix = "We Keep It Simple," }) {
  return (
    <div className="aurora-badge">
      <div style={{ display: "flex" }}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="aurora-avatar" style={{ marginLeft: i === 0 ? 0 : "-9px" }} />
        ))}
      </div>
      <span style={{ fontSize: "16px", fontWeight: 600, color: "#ffffff", fontFamily: "'Karla', sans-serif" }}>
        {prefix} <strong style={{ color: "#f72b2b", fontWeight: 700 }}>{strong}</strong>
      </span>
    </div>
  )
}
