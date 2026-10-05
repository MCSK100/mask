import { useNavigate } from "react-router-dom"
import { Home, LogIn } from "lucide-react"
import { WannaShell } from "../components/wanna/WannaChrome"

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <WannaShell>
      <div style={{ display: "grid", placeItems: "center", padding: "60px 24px", textAlign: "center" }}>
        <div className="wz-card" style={{ padding: "44px", maxWidth: "460px" }}>
          <p style={{ fontSize: "64px", fontWeight: 500, letterSpacing: "-2px", margin: 0 }}>404</p>
          <h1 style={{ marginTop: "8px", fontSize: "32px", fontWeight: 500, letterSpacing: "-1px" }}>Room not found</h1>
          <p style={{ marginTop: "8px", fontSize: "16px", color: "rgba(0,0,0,.6)" }}>The link may be expired or the code mistyped.</p>
          <div style={{ marginTop: "24px", display: "flex", gap: "10px", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/join")} className="wz-btn"><LogIn size={18} color="#fff" /> Join now</button>
            <button onClick={() => navigate("/")} className="wz-btn light"><Home size={18} /> Home</button>
          </div>
        </div>
      </div>
    </WannaShell>
  )
}
