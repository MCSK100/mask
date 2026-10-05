import { useNavigate } from "react-router-dom"
import { AuroraShell } from "../components/aurora/AuroraChrome"

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <AuroraShell>
      <div style={{ minHeight: "100svh", display: "grid", placeItems: "center", padding: "24px", textAlign: "center" }}>
        <div>
          <p style={{ fontFamily: "monospace", fontSize: "64px", fontWeight: 700, color: "rgba(255,255,255,0.2)" }}>404</p>
          <h1 style={{ marginTop: "8px", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "28px", fontWeight: 500 }}>Room not found</h1>
          <p style={{ marginTop: "8px", fontSize: "15px", color: "rgba(255,255,255,0.6)" }}>The link may be expired or the code mistyped.</p>
          <div style={{ marginTop: "24px", display: "flex", gap: "14px", justifyContent: "center", alignItems: "center" }}>
            <button onClick={() => navigate("/join")} className="aurora-btn-dark">Get Started</button>
            <button onClick={() => navigate("/")} style={{ background: "none", border: 0, color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: "14px" }}>Home →</button>
          </div>
        </div>
      </div>
    </AuroraShell>
  )
}
