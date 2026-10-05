import { useNavigate } from "react-router-dom"
import { Home, LogIn } from "lucide-react"
import { AuroraShell } from "../components/aurora/AuroraChrome"

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <AuroraShell>
      <div style={{ minHeight: "100svh", display: "grid", placeItems: "center", padding: "120px 24px 24px", textAlign: "center" }}>
        <div className="omd-card" style={{ padding: "44px", maxWidth: "460px" }}>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "64px", fontWeight: 700, color: "#8AA6B8" }}>404</p>
          <h1 style={{ marginTop: "8px", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "32px", fontWeight: 800, textTransform: "uppercase" }}>Room not found</h1>
          <p style={{ marginTop: "8px", fontSize: "15px", color: "#4A6173" }}>The link may be expired or the code mistyped.</p>
          <div style={{ marginTop: "24px", display: "flex", gap: "10px", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/join")} className="btn"><LogIn size={15} /> Join now</button>
            <button onClick={() => navigate("/")} className="btn ghost"><Home size={15} /> Home</button>
          </div>
        </div>
      </div>
    </AuroraShell>
  )
}
