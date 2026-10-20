import { Link, useNavigate } from "react-router-dom"
import { Video } from "lucide-react"
import "./wanna.css"

/* Shared wannathis-theme chrome for every page except the live meeting room. */

export function WannaNavbar() {
  const navigate = useNavigate()
  return (
    <header className="wz-header wz-container">
        <button className="wz-brand" onClick={() => navigate("/")} aria-label="OneSpace Live home">
          <span className="wz-logo">OneSpace Live</span>
          <span className="wz-mark"><Video size={18} /></span>
        </button>
        <div className="wz-header-actions">
          <Link className="wz-header-join" to="/join">Join a room</Link>
          <Link className="wz-btn" to="/create">Start a room <Video size={17} /></Link>
        </div>
    </header>
  )
}

export function WannaFooter() {
  return (
    <footer className="wz-footer">
      <div className="wz-fo">
        <div className="col">
          <Link className="wz-logo fl" to="/">OneSpace Live</Link>
          <span>One simple space for meetings, classes, and collaboration.</span>
        </div>
        <div className="col">
          <span className="t">Product</span>
          <Link className="fl" to="/create">Create a room</Link>
          <Link className="fl" to="/join">Join a room</Link>
          <Link className="fl" to="/about">About</Link>
        </div>
        <div className="col">
          <span className="t">Info</span>
          <Link className="fl" to="/privacy">Privacy</Link>
          <Link className="fl" to="/terms">Terms</Link>
          <Link className="fl" to="/about">Contact</Link>
        </div>
      </div>
      <p className="wz-copy">© 2026 OneSpace Live · All Rights Reserved</p>
    </footer>
  )
}

export function WannaShell({ children }) {
  return (
    <div className="wz-shell">
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
