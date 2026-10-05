import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { roomsApi } from "../services/api"
import { setHostToken } from "../utils/identity"
import { googleCalendarUrl, icsContent, downloadIcs } from "../utils/calendar"
import { AuroraShell, AuroraBadge } from "../components/aurora/AuroraChrome"

const TYPES = [["meeting", "Meeting"], ["classroom", "Classroom"], ["webinar", "Webinar"], ["study", "Study Room"], ["watch", "Watch Party"]]

export default function CreateMeeting() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: "", hostName: "", date: "", time: "", duration: 60, password: "", roomType: "meeting" })
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null)
  const [err, setErr] = useState(null)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const scheduledAt = form.date && form.time ? new Date(`${form.date}T${form.time}`) : null

  const create = async (startNow) => {
    setErr(null)
    if (!form.title.trim()) { setErr("Give your meeting a title."); return }
    if (!form.hostName.trim()) { setErr("Enter your display name."); return }
    setBusy(true)
    try {
      const data = await roomsApi.create({
        title: form.title.trim(),
        hostName: form.hostName.trim(),
        scheduledAt: scheduledAt && !isNaN(scheduledAt) ? scheduledAt.toISOString() : null,
        durationMin: Number(form.duration) || 60,
        password: form.password.trim() || null,
        roomType: form.roomType
      })
      setHostToken(data.code, data.hostToken)
      const payload = { ...data, title: form.title.trim(), hostName: form.hostName.trim(), scheduledAt: scheduledAt?.toISOString() || null, duration: Number(form.duration) || 60 }
      setResult(payload)
      try { sessionStorage.setItem("sm_last_create", JSON.stringify(payload)) } catch {}
      if (startNow) navigate(`/meet/${data.code}?name=${encodeURIComponent(form.hostName.trim())}&host=1`)
    } catch (e) {
      setErr(e.message)
    } finally { setBusy(false) }
  }

  const copy = async (t) => { try { await navigator.clipboard.writeText(t) } catch {} }
  const link = result ? `${window.location.origin}/meet/${result.code}` : ""

  return (
    <AuroraShell>
      <div style={{ paddingTop: "130px", paddingLeft: "64px", paddingRight: "24px", maxWidth: "860px" }} className="max-sm:!px-6">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <AuroraBadge prefix="No signup" strong="ready in seconds" />
        </motion.div>
        <h1 style={{ fontFamily: "''Londrina Solid', sans-serif", fontWeight: 400, fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1, letterSpacing: "-0.02em", marginTop: "22px" }}>Create A Meeting</h1>
        <p style={{ marginTop: "12px", fontSize: "15px", color: "rgba(255,255,255,0.6)", maxWidth: "420px" }}>One link for meetings, classes, and watch parties.</p>

        {!result ? (
          <div className="aurora-card" style={{ marginTop: "24px", padding: "24px", display: "grid", gap: "16px" }}>
            <div>
              <label className="aurora-label" htmlFor="mtitle">Meeting title</label>
              <input id="mtitle" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. React Beginners Class" className="aurora-input" maxLength={80} />
            </div>
            <div>
              <label className="aurora-label" htmlFor="hname">Your name (host)</label>
              <input id="hname" value={form.hostName} onChange={(e) => set("hostName", e.target.value)} placeholder="e.g. Santhosh" className="aurora-input" maxLength={40} />
            </div>
            <div>
              <span className="aurora-label">Room type</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {TYPES.map(([v, label]) => (
                  <button key={v} type="button" onClick={() => set("roomType", v)} style={{ padding: "10px 18px", borderRadius: "999px", fontSize: "13px", fontWeight: 600, background: form.roomType === v ? "#fff" : "rgba(255,255,255,0.08)", color: form.roomType === v ? "#111" : "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.15)" }}>{label}</button>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "1fr 1fr 1fr" }} className="max-sm:!grid-cols-1">
              <div>
                <label className="aurora-label" htmlFor="mdate">Date (optional)</label>
                <input id="mdate" type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className="aurora-input" style={{ colorScheme: "dark" }} />
              </div>
              <div>
                <label className="aurora-label" htmlFor="mtime">Time (optional)</label>
                <input id="mtime" type="time" value={form.time} onChange={(e) => set("time", e.target.value)} className="aurora-input" style={{ colorScheme: "dark" }} />
              </div>
              <div>
                <label className="aurora-label" htmlFor="mdur">Duration (min)</label>
                <input id="mdur" type="number" min={5} max={480} value={form.duration} onChange={(e) => set("duration", e.target.value)} className="aurora-input" />
              </div>
            </div>
            <div>
              <label className="aurora-label" htmlFor="mpass">Password (optional)</label>
              <input id="mpass" type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Leave empty for open room" className="aurora-input" maxLength={64} />
            </div>
            {err && <p role="alert" style={{ borderRadius: "12px", background: "rgba(255,80,80,0.1)", padding: "12px", fontSize: "13px", color: "#ff9c9c" }}>{err}</p>}
            <div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" }}>
              <motion.button disabled={busy} onClick={() => create(true)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="aurora-btn-dark">{busy ? "Creating…" : "Meet Now"}</motion.button>
              <button disabled={busy} onClick={() => create(false)} style={{ background: "none", border: 0, color: "rgba(255,255,255,0.7)", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>{busy ? "…" : "Create without starting →"}</button>
            </div>
          </div>
        ) : (
          <div className="aurora-card" style={{ marginTop: "24px", padding: "28px", textAlign: "center" }}>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)" }}>Your meeting is ready</p>
            <h2 style={{ marginTop: "4px", fontFamily: "''Londrina Solid', sans-serif", fontSize: "24px", fontWeight: 600 }}>{result.title}</h2>
            <p style={{ marginTop: "12px", fontFamily: "monospace", fontSize: "36px", fontWeight: 700, letterSpacing: "0.3em" }}>{result.code}</p>
            <p style={{ marginTop: "8px", fontSize: "13px", color: "rgba(255,255,255,0.65)", wordBreak: "break-all" }}>{link}</p>
            <div style={{ marginTop: "20px", display: "flex", gap: "14px", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
              <button onClick={() => navigate(`/meet/${result.code}?name=${encodeURIComponent(result.hostName)}&host=1`)} className="aurora-btn-dark">Meet Now</button>
              <button onClick={() => copy(link)} style={{ width: "44px", height: "44px", borderRadius: "999px", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", cursor: "pointer" }} aria-label="Copy link">⧉</button>
            </div>
            <div style={{ marginTop: "12px", display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => copy(result.code)} style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", background: "none", border: 0, cursor: "pointer" }}>Copy code</button>
              <button onClick={() => navigate(`/schedule/${result.code}`)} style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", background: "none", border: 0, cursor: "pointer" }}>Meeting Card →</button>
            </div>
            {result.scheduledAt && (
              <div style={{ marginTop: "8px", display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                <a href={googleCalendarUrl({ title: result.title, details: `Join: ${link} Code: ${result.code}`, start: result.scheduledAt, end: new Date(new Date(result.scheduledAt).getTime() + result.duration * 60000) })} target="_blank" rel="noreferrer" style={{ fontSize: "13px", color: "#fff" }}>Add to Calendar</a>
                <button onClick={() => downloadIcs(`shadowmeet-${result.code}.ics`, icsContent({ title: result.title, description: `Join: ${link}`, start: result.scheduledAt, end: new Date(new Date(result.scheduledAt).getTime() + result.duration * 60000), code: result.code }))} style={{ fontSize: "13px", color: "#fff", background: "none", border: 0, cursor: "pointer" }}>Download .ics</button>
              </div>
            )}
            <button onClick={() => setResult(null)} style={{ marginTop: "12px", fontSize: "13px", color: "rgba(255,255,255,0.45)", background: "none", border: 0, cursor: "pointer" }}>Create another</button>
          </div>
        )}
        <div style={{ height: "40px" }} />
      </div>
    </AuroraShell>
  )
}

