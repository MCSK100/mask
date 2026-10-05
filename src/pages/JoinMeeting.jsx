import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { KeyRound, User, Lock, ArrowRight, LogIn } from "lucide-react"
import { normalizeCode } from "../utils/meetingCode"
import { roomsApi, meetingsApi } from "../services/api"
import { AuroraShell, AuroraBadge, SectionTab } from "../components/aurora/AuroraChrome"

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
      // Primary: LiveKit meetings metadata; fallback: legacy mesh validation.
      try {
        await meetingsApi.get(c)
      } catch (e) {
        if (e?.status === 404) await roomsApi.validate(c, password)
        else if (e?.status === 410 || e?.status === 403 || e?.status === 401) throw e
        else {
          try { await roomsApi.validate(c, password) } catch { throw e }
        }
      }
      try { sessionStorage.setItem("sm_name", name.trim()) } catch {}
      navigate(`/meet/${c}?name=${encodeURIComponent(name.trim())}${password ? `&pwd=${encodeURIComponent(password)}` : ""}`)
    } catch (e2) {
      setErr(e2.message)
    } finally { setBusy(false) }
  }

  return (
    <AuroraShell>
      <div style={{ paddingTop: "150px", paddingLeft: "34px", paddingRight: "34px", maxWidth: "600px", margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <AuroraBadge prefix="No account" strong="just a code" />
        </motion.div>
        <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: "clamp(2.4rem,5vw,4rem)", lineHeight: 0.95, letterSpacing: "-0.03em", marginTop: "18px", textTransform: "uppercase" }}>
          Join a<br />meeting<span style={{ color: "#F0531C" }}>.</span>
        </h1>
        <p style={{ marginTop: "12px", fontSize: "16px", color: "#4A6173", maxWidth: "380px" }}>Enter the code your host shared. You will be in within seconds.</p>
        <form onSubmit={join} style={{ marginTop: "22px" }}>
          <SectionTab icon={KeyRound} label="join-room.fig" />
          <div className="aurora-card sel" style={{ marginTop: "-1px", padding: "26px", display: "grid", gap: "14px", borderRadius: "0 18px 18px 18px" }}>
            <span className="h tl" /><span className="h tr" /><span className="h bl" /><span className="h br" />
            <span className="dim">560 × auto</span>
            <div>
              <label htmlFor="jcode" className="aurora-label">Meeting code</label>
              <input id="jcode" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="AB7K92" maxLength={10} className="aurora-input" style={{ fontFamily: "'Space Mono', monospace", textAlign: "center", fontSize: "20px", letterSpacing: "0.3em" }} />
            </div>
            <div>
              <label htmlFor="jname" className="aurora-label"><User size={11} style={{ display: "inline" }} /> Your name</label>
              <input id="jname" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Santhosh" maxLength={40} className="aurora-input" />
            </div>
            <div>
              <label htmlFor="jpass" className="aurora-label"><Lock size={11} style={{ display: "inline" }} /> Password (if required)</label>
              <input id="jpass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Optional" className="aurora-input" />
            </div>
            {err && <p role="alert" style={{ borderRadius: "12px", background: "#FFF1EC", border: "1px solid #F0531C44", padding: "12px", fontSize: "13px", color: "#D2410E", fontWeight: 600 }}>{err}</p>}
            <div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" }}>
              <motion.button disabled={busy} whileTap={{ scale: 0.97 }} className="aurora-btn-dark"><LogIn size={15} /> {busy ? "Checking…" : "Join Now"}</motion.button>
              <button type="button" onClick={() => navigate("/create")} style={{ background: "none", border: 0, color: "#4A6173", fontSize: "14px", cursor: "pointer", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "6px" }}>Create instead <ArrowRight size={14} /></button>
            </div>
          </div>
        </form>
        <div style={{ height: "60px" }} />
      </div>
    </AuroraShell>
  )
}
