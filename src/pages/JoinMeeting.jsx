import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { User, Lock, ArrowRight, LogIn } from "lucide-react"
import { normalizeCode } from "../utils/meetingCode"
import { roomsApi, meetingsApi } from "../services/api"
import { WannaShell, WannaBadge } from "../components/wanna/WannaChrome"

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
      try { sessionStorage.setItem("sm_name", name.trim()) } catch { /* best-effort only */ }
      navigate(`/meet/${c}?name=${encodeURIComponent(name.trim())}${password ? `&pwd=${encodeURIComponent(password)}` : ""}`)
    } catch (e2) {
      setErr(e2.message)
    } finally { setBusy(false) }
  }

  return (
    <WannaShell>
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "30px 0 20px" }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <WannaBadge prefix="No account" strong="just a code" />
        </motion.div>
        <h1 className="wz-title">Join a meeting.</h1>
        <p className="wz-sub">Enter the code your host shared. You will be in within seconds.</p>
        <form onSubmit={join} style={{ marginTop: "24px" }}>
          <div className="wz-card" style={{ display: "grid", gap: "14px" }}>
            <div>
              <label htmlFor="jcode" className="wz-label">Meeting code</label>
              <input id="jcode" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="AB7K92" maxLength={10} className="wz-input" style={{ textAlign: "center", fontSize: "20px", letterSpacing: "0.3em" }} />
            </div>
            <div>
              <label htmlFor="jname" className="wz-label"><User size={12} style={{ display: "inline" }} /> Your name</label>
              <input id="jname" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Santhosh" maxLength={40} className="wz-input" />
            </div>
            <div>
              <label htmlFor="jpass" className="wz-label"><Lock size={12} style={{ display: "inline" }} /> Password (if required)</label>
              <input id="jpass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Optional" className="wz-input" />
            </div>
            {err && <p role="alert" className="wz-alert">{err}</p>}
            <div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" }}>
              <motion.button disabled={busy} whileTap={{ scale: 0.97 }} className="wz-btn big"><LogIn size={18} color="#fff" /> {busy ? "Checking…" : "Join Now"}</motion.button>
              <button type="button" onClick={() => navigate("/create")} className="wz-link">Create instead <ArrowRight size={14} /></button>
            </div>
          </div>
        </form>
      </div>
    </WannaShell>
  )
}
