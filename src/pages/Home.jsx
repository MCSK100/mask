import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { normalizeCode } from "../utils/meetingCode"
import AuroraNavbar from "../components/aurora/AuroraNavbar"
import { AuroraBadge, AuroraFooter, AuroraSocials } from "../components/aurora/AuroraChrome"

function MockRoom() {
  const tiles = [
    { n: "Aarav · Host", host: true },
    { n: "Mia" },
    { n: "Leo" },
    { n: "Zara" }
  ]
  return (
    <div className="aurora-card" style={{ overflow: "hidden", padding: "12px", boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 4px 8px", fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><span style={{ width: "8px", height: "8px", borderRadius: "999px", background: "#10b981", display: "inline-block" }} /> React Beginners · RX82KP · 04:12</span>
        <span>4 here</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        {tiles.map((t) => (
          <div key={t.n} style={{ position: "relative", height: "112px", borderRadius: "14px", overflow: "hidden", background: "linear-gradient(135deg, rgba(16,185,129,0.22), rgba(4,120,87,0.12))", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: "22px", fontWeight: 700, color: "rgba(255,255,255,0.85)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.n.slice(0, 1)}</div>
            <div style={{ position: "absolute", bottom: "6px", left: "6px", borderRadius: "8px", background: "rgba(0,0,0,0.6)", padding: "2px 6px", fontSize: "10px", color: "#fff" }}>{t.n}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: "8px", marginTop: "8px" }}>
        <div style={{ borderRadius: "14px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", padding: "8px" }}>
          <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", color: "rgba(255,255,255,0.6)" }}>WHITEBOARD · LIVE</p>
          <svg viewBox="0 0 200 60" style={{ marginTop: "4px", height: "48px", width: "100%" }}><path d="M5 50 Q 40 5 70 30 T 130 25 T 195 40" stroke="#10b981" strokeWidth="3" fill="none" strokeLinecap="round" /><circle cx="150" cy="18" r="8" stroke="#10b981" fill="none" strokeWidth="3" opacity="0.6" /></svg>
        </div>
        <div style={{ borderRadius: "14px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", padding: "8px", fontSize: "10px", color: "rgba(255,255,255,0.7)" }}>
          <p style={{ fontWeight: 700, color: "#fff" }}>Chat</p>
          <p style={{ marginTop: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Mia: this is clear</p>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>Leo: +1</p>
        </div>
      </div>
    </div>
  )
}

const FEATURES = [
  ["Live Video", "Adaptive grid for 1 to 16+ people with speaker glow."],
  ["Screen Share", "Present a tab, window, or full screen in one click."],
  ["Whiteboard", "Draw together in real time, export as PNG."],
  ["Watch Together", "Host-synced YouTube parties with shared control."],
  ["Polls", "Live questions with instant results for classes."],
  ["Private by Design", "Codes, passwords, locks, and host controls."]
]

export default function Home() {
  const navigate = useNavigate()
  const [code, setCode] = useState("")
  const quickJoin = (e) => {
    e?.preventDefault()
    const c = normalizeCode(code)
    if (c) navigate(`/meet/${c}`)
  }

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100svh", background: "#000", color: "#fff", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.10)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.13) 0%, transparent 22%, transparent 60%, rgba(0,0,0,0.19) 100%)", pointerEvents: "none" }} />
      <div className="aurora-glow" style={{ position: "absolute", top: "-14%", left: "50%", transform: "translateX(-50%)", width: "1000px", maxWidth: "120vw", height: "720px", pointerEvents: "none" }} />
      <AuroraNavbar />

      {/* Hero — left-anchored, 24vh / 64px */}
      <section style={{ position: "relative", width: "100%", minHeight: "100svh", overflow: "hidden" }}>
        <div style={{ position: "relative", zIndex: 10, display: "grid", gap: "40px", minHeight: "100svh", paddingTop: "24vh", paddingLeft: "64px", paddingRight: "24px", paddingBottom: "90px", maxWidth: "1400px" }} className="lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}>
              <AuroraBadge prefix="No signup" strong="free to start" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, fontSize: "clamp(2.4rem, 4.6vw, 4.1rem)", lineHeight: 1.08, letterSpacing: "-0.02em", color: "#fff", marginTop: "22px", maxWidth: "560px" }}
            >
              Your Meeting Room.<br />Your Classroom.<br />Your Space.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.42, ease: "easeOut" }}
              style={{ marginTop: "16px", fontSize: "15px", lineHeight: 1.6, color: "rgba(255,255,255,0.6)", fontFamily: "'Inter', sans-serif", maxWidth: "340px" }}
            >
              Meet, teach, and watch together — no account, no downloads.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.58, ease: "easeOut" }}
              style={{ display: "flex", alignItems: "center", gap: "14px", marginTop: "30px" }}
            >
              <motion.button
                onClick={() => navigate("/create")}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="aurora-btn-dark"
              >
                Get Started
              </motion.button>
              <motion.button
                onClick={() => navigate("/join")}
                aria-label="Join a meeting"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                style={{ width: "44px", height: "44px", borderRadius: "999px", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", cursor: "pointer" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z" /></svg>
              </motion.button>
            </motion.div>
            <form onSubmit={quickJoin} style={{ marginTop: "22px", display: "flex", gap: "8px", maxWidth: "340px" }}>
              <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Enter code" aria-label="Meeting code" maxLength={10} className="aurora-input" style={{ fontFamily: "monospace", letterSpacing: "0.2em", textAlign: "center" }} />
              <button className="aurora-btn-dark" style={{ padding: "12px 20px", whiteSpace: "nowrap" }}>Join</button>
            </form>
          </div>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.7 }} style={{ maxWidth: "560px", width: "100%" }}>
            <MockRoom />
          </motion.div>
        </div>
        <div style={{ position: "absolute", bottom: "34px", left: "64px", zIndex: 10 }} className="hidden sm:block">
          <AuroraSocials />
        </div>
      </section>

      {/* Features — bento rhythm, single accent */}
      <section id="features" style={{ position: "relative", zIndex: 10, padding: "40px 64px 20px", maxWidth: "1400px" }} className="max-sm:!px-6">
        <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "28px", fontWeight: 600, letterSpacing: "-0.02em" }}>Everything for meet, teach, play</h2>
        <div style={{ display: "grid", gap: "12px", marginTop: "20px", gridTemplateColumns: "1.2fr 1fr 1fr" }} className="max-lg:!grid-cols-1 max-xl:!grid-cols-2">
          {FEATURES.map(([title, desc], i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="aurora-card"
              style={{ padding: i === 0 ? "28px" : "22px", background: i === 0 ? "linear-gradient(135deg, rgba(16,185,129,0.16), rgba(255,255,255,0.03))" : undefined }}
            >
              <div style={{ width: "34px", height: "34px", borderRadius: "999px", background: "linear-gradient(135deg, #10b981, #047857)", display: "grid", placeItems: "center", fontSize: "15px", color: "#fff" }}>{String(i + 1).padStart(2, "0")}</div>
              <h3 style={{ marginTop: "12px", fontSize: "16px", fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</h3>
              <p style={{ marginTop: "6px", fontSize: "14px", lineHeight: 1.6, color: "rgba(255,255,255,0.6)" }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section style={{ position: "relative", zIndex: 10, padding: "40px 64px 70px", maxWidth: "1400px" }} className="max-sm:!px-6">
        <div className="aurora-card" style={{ padding: "40px", textAlign: "left", display: "grid", gap: "20px" }}>
          <div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 500, letterSpacing: "-0.02em" }}>Start a meeting in seconds.</h2>
            <p style={{ marginTop: "10px", fontSize: "15px", color: "rgba(255,255,255,0.6)", maxWidth: "420px" }}>One link for meetings, classes, and watch parties. Free-first, P2P for small rooms.</p>
          </div>
          <div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/create")} className="aurora-btn-white">Create Meeting</button>
            <button onClick={() => navigate("/join")} className="aurora-btn-dark">Join with code</button>
          </div>
        </div>
      </section>
      <AuroraFooter />
    </div>
  )
}
