import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { normalizeCode } from "../utils/meetingCode"
import { roomsApi } from "../services/api"
import { AuroraShell, AuroraBadge } from "../components/aurora/AuroraChrome"

export default function JoinMeeting() {
  const navigate = useNavigate()
  const [code, setCode] = useState("")
  const [name, setName] = useState(() => { try { return sessionStorage.getItem("sm_name") || "" } catch { return "" } })
  const [password, setPassword] = useState("")
  const [err, setErr] = useState(null)
  const [busy, setBusy] = useState(false)

  const join = async (e) => {
    e?.preventDefault()
    setErr(null)
    const c = normalizeCode(code)
    if (!c) { setErr("Enter the meeting code."); return }
    if (!name.trim()) { setErr("Enter your display name."); return }
    setBusy(true)
    try {
      await roomsApi.validate(c, password)
      try { sessionStorage.setItem("sm_name", name.trim()) } catch {}
      navigate(`/meet/${c}?name=${encodeURIComponent(name.trim())}${password ? `&pwd=${encodeURIComponent(password)}` : ""}`)
    } catch (e2) {
      setErr(e2.message)
    } finally { setBusy(false) }
  }

  return (
    <AuroraShell>
      <div style={{ paddingTop: "24vh", paddingLeft: "64px", paddingRight: "24px", maxWidth: "560px" }} className="max-sm:!px-6">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <AuroraBadge prefix="No account" strong="just a code" />
        </motion.div>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1, letterSpacing: "-0.02em", marginTop: "22px" }}>Join a meeting</h1>
        <p style={{ marginTop: "12px", fontSize: "15px", color: "rgba(255,255,255,0.6)", maxWidth: "340px" }}>Enter the code your host shared with you.</p>
        <form onSubmit={join} className="aurora-card" style={{ marginTop: "24px", padding: "24px", display: "grid", gap: "14px" }}>
          <div>
            <label htmlFor="jcode" className="aurora-label">Meeting code</label>
            <input id="jcode" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="AB7K92" maxLength={10} className="aurora-input" style={{ fontFamily: "monospace", textAlign: "center", fontSize: "20px", letterSpacing: "0.3em" }} />
          </div>
          <div>
            <label htmlFor="jname" className="aurora-label">Your name</label>
            <input id="jname" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Santhosh" maxLength={40} className="aurora-input" />
          </div>
          <div>
            <label htmlFor="jpass" className="aurora-label">Password (if required)</label>
            <input id="jpass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Optional" className="aurora-input" />
          </div>
          {err && <p role="alert" style={{ borderRadius: "12px", background: "rgba(255,80,80,0.1)", padding: "12px", fontSize: "13px", color: "#ff9c9c" }}>{err}</p>}
          <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
            <motion.button disabled={busy} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="aurora-btn-dark">{busy ? "Checking…" : "Get Started"}</motion.button>
            <button type="button" onClick={() => navigate("/create")} style={{ background: "none", border: 0, color: "rgba(255,255,255,0.7)", fontSize: "14px", cursor: "pointer" }}>Create instead →</button>
          </div>
        </form>
        <div style={{ height: "60px" }} />
      </div>
    </AuroraShell>
  )
}
