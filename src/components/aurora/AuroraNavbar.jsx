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
    <span className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/5">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M23 7l-7 5 7 5V7z" />
        <rect x="1" y="5" width="15" height="14" rx="2" />
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
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "26px 44px", background: "transparent" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "44px" }}>
        <button onClick={() => navigate("/")} aria-label="ShadowMeet home" style={{ display: "flex", alignItems: "center", gap: "12px", background: "none", border: 0, cursor: "pointer" }}>
          <AuroraMark />
          <span style={{ fontSize: "15px", fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#fff", letterSpacing: "-0.01em" }}>ShadowMeet</span>
        </button>
        <div className="hidden md:flex" style={{ alignItems: "center", gap: "30px" }}>
          {links.map((l) => (
            <button
              key={l.label}
              onClick={() => go(l.to)}
              style={{ fontSize: "14px", fontWeight: 500, fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.82)", background: "none", border: 0, cursor: "pointer" }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
      <motion.button
        onClick={() => navigate("/about")}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="aurora-btn-white"
      >
        Contact Us
      </motion.button>
    </motion.nav>
  )
}
