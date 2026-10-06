import { useNavigate } from "react-router-dom"
import { Video } from "lucide-react"
import "./wanna.css"

/* Shared wannathis-theme chrome for every page except the live meeting room. */

export function WannaNavbar() {
  const navigate = useNavigate()
  return (
    <div className="wz-main">
      <header className="wz-header">
        <button className="wz-brand" onClick={() => navigate("/")} aria-label="OneSpace Live home">
          <span className="wz-logo">OneSpace Live</span>
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
  return (
    <footer className="wz-footer">
      <div className="wz-fo">
        <div className="col">
          <a className="wz-logo fl" style={{ color: "#fff" }} href="/">OneSpace Live</a>
          <span style={{ color: "rgba(255,255,255,.7)" }}>Live meetings for modern teams.</span>
        </div>
        <div className="col">
          <span className="t">Product</span>
          <a className="fl" href="/create">Meetings</a>
          <a className="fl" href="/create">Classroom</a>
          <a className="fl" href="/create">Watch Party</a>
          <a className="fl" href="/blog">Blog</a>
        </div>
        <div className="col">
          <span className="t">Info</span>
          <a className="fl" href="/privacy">Privacy</a>
          <a className="fl" href="/terms">Terms</a>
          <a className="fl" href="/about">About</a>
          <a href="mailto:hello@onespace.live">Contact</a>
        </div>
      </div>
      <p className="wz-copy">© 2026 OneSpace Live · All Rights Reserved</p>
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

export function WannaBadge({ prefix = "OneSpace Live", strong = "no signup" }) {
  return (
    <span className="wz-badge">
      {prefix} <strong>{strong}</strong>
    </span>
  )
}
