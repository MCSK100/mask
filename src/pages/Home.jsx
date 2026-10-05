import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { normalizeCode } from "../utils/meetingCode"
import AuroraNavbar from "../components/aurora/AuroraNavbar"
import { AuroraBadge, AuroraFooter, AuroraSocials } from "../components/aurora/AuroraChrome"

// note: preview below is a real miniature of the meeting UI, not a fake screenshot.
function MockRoom() {
  const tiles = [
    { n: "Aarav · Host" },
    { n: "Mia" },
    { n: "Leo" },
    { n: "Zara" }
  ]
  return (
    <div className="aurora-card" style={{ overflow: "hidden", padding: "24px", background: "#000000" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "15px", fontSize: "16px", fontWeight: 600, color: "#ffffff" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "12px" }}><span style={{ width: "12px", height: "12px", borderRadius: "80px", background: "#f72b2b", display: "inline-block" }} /> React Beginners · RX82KP</span>
        <span>4 Here</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {tiles.map((t) => (
          <div key={t.n} style={{ position: "relative", height: "120px", borderRadius: "3px", overflow: "hidden", background: "#cb3e42", border: "3px solid #ffffff" }}>
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: "28px", fontWeight: 400, color: "#ffffff", fontFamily: "'Londrina Solid', sans-serif" }}>{t.n.slice(0, 1)}</div>
            <div style={{ position: "absolute", bottom: "6px", left: "6px", borderRadius: "3px", background: "#0c090c", padding: "3px 9px", fontSize: "14px", fontWeight: 600, color: "#ffffff" }}>{t.n}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: "12px", marginTop: "12px" }}>
        <div style={{ borderRadius: "3px", border: "3px solid #ffffff", background: "#0c090c", padding: "12px" }}>
          <p style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff" }}>Whiteboard · Live</p>
          <svg viewBox="0 0 200 60" style={{ marginTop: "6px", height: "48px", width: "100%" }}><path d="M5 50 Q 40 5 70 30 T 130 25 T 195 40" stroke="#f72b2b" strokeWidth="4" fill="none" strokeLinecap="round" /><circle cx="150" cy="18" r="8" stroke="#f72b2b" fill="none" strokeWidth="4" /></svg>
        </div>
        <div style={{ borderRadius: "3px", border: "3px solid #ffffff", background: "#0c090c", padding: "12px", fontSize: "14px", fontWeight: 600, color: "#ffffff" }}>
          <p style={{ fontWeight: 700 }}>Chat</p>
          <p style={{ marginTop: "6px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Mia: All Clear</p>
          <p>Leo: Plus One</p>
        </div>
      </div>
    </div>
  )
}

const FEATURES = [
  ["Live Video", "We Keep Every Face Big And Bright."],
  ["Screen Share", "We Share Tabs And Screens In One Click."],
  ["Whiteboard", "We Draw Together And Save Our Work."],
  ["Watch Together", "We Press Play At The Same Time."],
  ["Polls", "We Ask And We Answer In Seconds."],
  ["Private By Design", "We Guard Every Room With Codes."]
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
    <div className="sup-page" style={{ position: "relative", width: "100%", minHeight: "100svh", overflow: "hidden" }}>
      <AuroraNavbar />

      {/* Hero — left anchored, Title Case, we-only voice */}
      <section style={{ position: "relative", width: "100%" }}>
        <div style={{ position: "relative", zIndex: 10, display: "grid", gap: "48px", paddingTop: "240px", paddingLeft: "80px", paddingRight: "80px", paddingBottom: "128px", maxWidth: "1400px" }} className="lg:grid-cols-[1.05fr_0.95fr] lg:items-start max-sm:!px-6 max-sm:!pt-40">
          <div>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
              <AuroraBadge prefix="We Keep It Simple," strong="Free To Start" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}
              style={{ fontFamily: "'Londrina Solid', sans-serif", fontWeight: 900, fontSize: "clamp(3rem, 6vw, 5.5rem)", lineHeight: 1.05, color: "#ffffff", marginTop: "24px", maxWidth: "560px" }}
            >
              Your Meeting Room. Your Classroom. Your Space.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}
              style={{ marginTop: "24px", fontSize: "18px", lineHeight: 1.6, color: "#ffffff", fontFamily: "'Karla', sans-serif", fontWeight: 600, maxWidth: "420px" }}
            >
              We Bring Meetings, Classes, And Watch Parties Together. No Accounts. No Downloads.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}
              style={{ display: "flex", alignItems: "center", gap: "15px", marginTop: "30px", flexWrap: "wrap" }}
            >
              <motion.button
                onClick={() => navigate("/create")}
                whileTap={{ scale: 0.98 }}
                className="aurora-btn-dark"
              >
                Meet Now
              </motion.button>
              <motion.button
                onClick={() => navigate("/join")}
                whileTap={{ scale: 0.98 }}
                className="aurora-btn-ghost sup-btn-ghost"
                style={{ background: "transparent", color: "#ffffff", fontWeight: 600, fontSize: "16px", padding: "14px 28px", borderRadius: "80px", border: "3px solid #ffffff", cursor: "pointer" }}
              >
                Meet With Code
              </motion.button>
            </motion.div>
            <form onSubmit={quickJoin} style={{ marginTop: "24px", display: "flex", gap: "12px", maxWidth: "420px" }}>
              <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Enter Code" aria-label="Meeting code" maxLength={10} className="aurora-input" style={{ fontFamily: "monospace", letterSpacing: "0.2em", textAlign: "center" }} />
              <button className="aurora-btn-dark" style={{ padding: "12px 24px", whiteSpace: "nowrap" }}>Meet</button>
            </form>
          </div>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.3 }} style={{ maxWidth: "560px", width: "100%" }}>
            <MockRoom />
          </motion.div>
        </div>
        <div style={{ position: "absolute", bottom: "48px", left: "80px", zIndex: 10 }} className="hidden sm:block">
          <AuroraSocials />
        </div>
      </section>

      {/* Features — flat cards, one accent */}
      <section id="features" style={{ position: "relative", zIndex: 10, padding: "80px", paddingTop: "128px", maxWidth: "1400px" }} className="max-sm:!px-6">
        <h2 style={{ fontFamily: "'Londrina Solid', sans-serif", fontWeight: 400, fontSize: "40px", color: "#ffffff" }}>We Cover All Of It</h2>
        <div style={{ display: "grid", gap: "24px", marginTop: "48px", gridTemplateColumns: "1.2fr 1fr 1fr" }} className="max-lg:!grid-cols-1 max-xl:!grid-cols-2">
          {FEATURES.map(([title, desc], i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.3, delay: (i % 3) * 0.1 }}
              className="aurora-card"
              style={{ padding: "30px", background: i === 0 ? "#f72b2b" : "#000000", borderColor: "#ffffff" }}
            >
              <div style={{ width: "36px", height: "36px", borderRadius: "80px", background: i === 0 ? "#ffffff" : "#f72b2b", display: "grid", placeItems: "center", fontSize: "16px", fontWeight: 700, color: i === 0 ? "#f72b2b" : "#ffffff" }}>{String(i + 1).padStart(2, "0")}</div>
              <h3 style={{ marginTop: "18px", fontSize: "24px", fontWeight: 400, fontFamily: "'Londrina Solid', sans-serif", color: "#ffffff" }}>{title}</h3>
              <p style={{ marginTop: "12px", fontSize: "16px", fontWeight: 600, lineHeight: 1.6, color: "#ffffff" }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section style={{ position: "relative", zIndex: 10, padding: "80px", maxWidth: "1400px" }} className="max-sm:!px-6">
        <div className="aurora-card" style={{ padding: "80px", display: "grid", gap: "30px", background: "#f72b2b", borderColor: "#f72b2b" }}>
          <div>
            <h2 style={{ fontFamily: "'Londrina Solid', sans-serif", fontWeight: 900, fontSize: "clamp(2.5rem, 4vw, 4rem)", lineHeight: 1.05, color: "#ffffff" }}>Meet All Together Now.</h2>
            <p style={{ marginTop: "18px", fontSize: "18px", fontWeight: 600, color: "#ffffff", maxWidth: "480px" }}>We Give Every Team And Class One Simple Link. We Stay Free First.</p>
          </div>
          <div style={{ display: "flex", gap: "15px", alignItems: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/create")} className="aurora-btn-white">Meet Now</button>
            <button onClick={() => navigate("/join")} style={{ background: "transparent", color: "#ffffff", fontWeight: 700, fontSize: "16px", padding: "14px 28px", borderRadius: "80px", border: "3px solid #ffffff", cursor: "pointer" }}>Meet With Code</button>
          </div>
        </div>
      </section>
      <AuroraFooter />
    </div>
  )
}
