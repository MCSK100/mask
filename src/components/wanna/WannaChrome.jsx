import { useNavigate } from "react-router-dom"
import { Video } from "lucide-react"
import "./wanna.css"

/* Shared wannathis-theme chrome for every page except the live meeting room. */

export function WannaNavbar() {
  const navigate = useNavigate()
  return (
    <div className="wz-main">
      <header className="wz-header">
        <button className="wz-brand" onClick={() => navigate("/")} aria-label="ShadowMeet home">
          <span className="wz-logo">ShadowMeet</span>
          <span className="wz-by">by</span>
          <span className="wz-mark"><Video size={18} /></span>
        </button>
        <button className="wz-btn" onClick={() => navigate("/create")}>
          Meet Now <Video size={18} color="#fff" />
        </button>
      </header>
    </div>
  )
}

export function WannaFooter() {
  const navigate = useNavigate()
  return (
    <footer className="wz-footer">
      <div className="wz-fo">
        <div className="col">
          <button className="wz-logo fl" style={{ color: "#fff" }} onClick={() => navigate("/")}>ShadowMeet</button>
          <span style={{ color: "rgba(255,255,255,.7)" }}>Live meetings for modern teams.</span>
        </div>
        <div className="col">
          <span className="t">Product</span>
          <button className="fl" onClick={() => navigate("/create")}>Meetings</button>
          <button className="fl" onClick={() => navigate("/create")}>Classroom</button>
          <button className="fl" onClick={() => navigate("/create")}>Watch Party</button>
          <button className="fl" onClick={() => navigate("/blog")}>Blog</button>
        </div>
        <div className="col">
          <span className="t">Info</span>
          <button className="fl" onClick={() => navigate("/privacy")}>Privacy</button>
          <button className="fl" onClick={() => navigate("/terms")}>Terms</button>
          <button className="fl" onClick={() => navigate("/about")}>About</button>
          <a href="mailto:hello@shadowmeet.app">Contact</a>
        </div>
      </div>
      <p className="wz-copy">© 2026 ShadowMeet · All Rights Reserved</p>
    </footer>
  )
}

export function WannaShell({ children }) {
  return (
    <div className="wz-">
      <WannaNavbar />
      <main className="wz-main" style={{ paddingBottom: "20px" }}>{children}</main>
      <WannaFooter />
    </div>
  )
}

export function WannaBadge({ prefix = "ShadowMeet", strong = "no signup" }) {
  return (
    <span className="wz-badge">
      {prefix} <strong>{strong}</strong>
    </span>
  )
}
