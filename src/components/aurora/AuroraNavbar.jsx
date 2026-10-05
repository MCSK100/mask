import { motion } from "framer-motion"
import { useNavigate, useLocation } from "react-router-dom"
import { Video } from "lucide-react"

const links = [
  { label: "Home", to: "/", id: "home" },
  { label: "Features", to: "/#features", id: "features" },
  { label: "Pricing", to: "/about", id: "pricing" },
  { label: "Blog", to: "/blog", id: "blog" },
  { label: "Contact", to: "/about", id: "contact" },
]

export function AuroraMark() {
  return (
    <span style={{ display: "grid", placeItems: "center", width: "32px", height: "32px", borderRadius: "9px", background: "#F0531C" }}>
      <Video size={17} color="#fff" strokeWidth={2.2} />
    </span>
  )
}

function Ruler() {
  return (
    <div className="omd-ruler" aria-hidden>
      <div className="r-logo"><b />SHADOWMEET</div>
      <div className="ticks" />
      <div className="r-zoom"><span className="dot" />100% · LIVE</div>
    </div>
  )
}

export default function AuroraNavbar() {
  const navigate = useNavigate()
  const loc = useLocation()
  const go = (to) => {
    if (to.startsWith("/#")) {
      if (loc.pathname !== "/") {
        navigate("/")
        setTimeout(() => document.querySelector(to.slice(1))?.scrollIntoView({ behavior: "smooth" }), 120)
      } else {
        document.querySelector(to.slice(1))?.scrollIntoView({ behavior: "smooth" })
      }
      return
    }
    navigate(to)
  }
  return (
    <>
      <Ruler />
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="omd-topbar"
      >
        <div className="pill status-pill">
          <span className="dot" />
          <span>available for meetings</span>
        </div>

        <nav className="pill nav-pill" aria-label="Primary">
          <button onClick={() => navigate("/")} className="nav-link hide-m" style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700 }}>
            <AuroraMark />
            <span>ShadowMeet</span>
          </button>
          {links.slice(1).map((l) => (
            <button key={l.id} onClick={() => go(l.to)} className="nav-link hide-m">
              {l.label}
            </button>
          ))}
          <button onClick={() => navigate("/create")} className="cta">Meet Now</button>
        </nav>

        <button onClick={() => navigate("/join")} className="pill mail-pill" style={{ cursor: "pointer", background: "#fff", border: "1px solid rgba(20,32,43,.13)" }}>
          <Video size={15} color="#F0531C" />
          join with code
        </button>
      </motion.div>
    </>
  )
}
