import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

const links = [
  { label: "Product", to: "/#features" },
  { label: "Pricing", to: "/about" },
  { label: "Docs", to: "/blog" },
  { label: "Contact", to: "/about" }
]

export function AuroraMark() {
  return (
    <span style={{ display: "grid", placeItems: "center", width: "36px", height: "36px", borderRadius: "80px", background: "#f72b2b" }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M23 7l-7 5 7 5V7z" />
        <rect x="1" y="5" width="15" height="14" rx="3" />
      </svg>
    </span>
  )
}

export default function AuroraNavbar() {
  const navigate = useNavigate()
  const go = (to) => {
    if (to.startsWith("/#")) {
      navigate("/")
      setTimeout(() => {
        document.querySelector(to.slice(1))?.scrollIntoView({ behavior: "smooth" })
      }, 80)
      return
    }
    navigate(to)
  }
  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 80px", background: "#0c090c" }}
      className="max-sm:!px-6"
    >
      <div style={{ display: "flex", alignItems: "center", gap: "48px" }}>
        <button onClick={() => navigate("/")} aria-label="ShadowMeet home" style={{ display: "flex", alignItems: "center", gap: "12px", background: "none", border: 0, cursor: "pointer" }}>
          <AuroraMark />
          <span style={{ fontSize: "22px", fontWeight: 400, fontFamily: "'Londrina Solid', sans-serif", color: "#ffffff" }}>ShadowMeet</span>
        </button>
        <div className="hidden md:flex" style={{ alignItems: "center", gap: "30px" }}>
          {links.map((l) => (
            <button
              key={l.label}
              onClick={() => go(l.to)}
              style={{ fontSize: "16px", fontWeight: 600, fontFamily: "'Karla', sans-serif", color: "#ffffff", background: "none", border: 0, cursor: "pointer" }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
      <motion.button
        onClick={() => navigate("/create")}
        whileTap={{ scale: 0.98 }}
        className="aurora-btn-dark"
        style={{ padding: "11px 24px" }}
      >
        Meet Now
      </motion.button>
    </motion.nav>
  )
}
