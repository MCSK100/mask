import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Video, Users, MonitorUp, GraduationCap, Presentation, BookOpen, Play, ArrowRight, Copy, CalendarPlus, RotateCcw, Clock } from "lucide-react"
import { roomsApi, meetingsApi } from "../services/api"
import { setHostToken } from "../utils/identity"
import { googleCalendarUrl, icsContent, downloadIcs } from "../utils/calendar"
import { WannaShell, WannaBadge } from "../components/wanna/WannaChrome"

const TYPES = [
  { v: "meeting", label: "Meeting", Icon: Video },
  { v: "classroom", label: "Classroom", Icon: GraduationCap },
  { v: "webinar", label: "Webinar", Icon: Presentation },
  { v: "study", label: "Study Room", Icon: BookOpen },
  { v: "watch", label: "Watch Party", Icon: Play },
]

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
      // Primary: LiveKit-backed meetings API (server owns metadata + tokens).
      let data
      try {
        data = await meetingsApi.create({
          title: form.title.trim(),
          hostName: form.hostName.trim(),
          scheduledAt: scheduledAt && !isNaN(scheduledAt) ? scheduledAt.toISOString() : null,
          durationMin: Number(form.duration) || 60,
          password: form.password.trim() || null,
          roomType: form.roomType
        })
        data = { ...data, code: data.meetingCode || data.code }
      } catch (e) {
        // Backward compat: legacy mesh backend (404 = routes not mounted).
        if (e?.status !== 404) throw e
        data = await roomsApi.create({
          title: form.title.trim(),
          hostName: form.hostName.trim(),
          scheduledAt: scheduledAt && !isNaN(scheduledAt) ? scheduledAt.toISOString() : null,
          durationMin: Number(form.duration) || 60,
          password: form.password.trim() || null,
          roomType: form.roomType
        })
      }
      setHostToken(data.code, data.hostToken)
      const payload = { ...data, title: form.title.trim(), hostName: form.hostName.trim(), scheduledAt: scheduledAt?.toISOString() || null, duration: Number(form.duration) || 60 }
      setResult(payload)
      try { sessionStorage.setItem("sm_last_create", JSON.stringify(payload)) } catch { /* best-effort only */ }
      if (startNow) navigate(`/meet/${data.code}?name=${encodeURIComponent(form.hostName.trim())}&host=1`)
    } catch (e) {
      setErr(e.message)
    } finally { setBusy(false) }
  }

  const copy = async (t) => { try { await navigator.clipboard.writeText(t) } catch { /* best-effort only */ } }
  const link = result ? `${window.location.origin}/meet/${result.code}` : ""

  return (
    <WannaShell>
      <div style={{ maxWidth: "880px", margin: "0 auto", padding: "30px 0 20px" }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <WannaBadge prefix="No signup" strong="ready in seconds" />
        </motion.div>
        <h1 className="wz-title">Create a meeting.</h1>
        <p className="wz-sub">One link for meetings, classes, and watch parties. Fast, modern, instant.</p>

        {!result ? (
          <div style={{ marginTop: "24px" }}>
            <div className="wz-card" style={{ display: "grid", gap: "16px" }}>
              <div>
                <label className="wz-label" htmlFor="mtitle">Meeting title</label>
                <input id="mtitle" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. React Beginners Class" className="wz-input" maxLength={80} />
              </div>
              <div>
                <label className="wz-label" htmlFor="hname">Your name (host)</label>
                <input id="hname" value={form.hostName} onChange={(e) => set("hostName", e.target.value)} placeholder="e.g. Santhosh" className="wz-input" maxLength={40} />
              </div>
              <div>
                <span className="wz-label">Room type</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {TYPES.map(({ v, label, Icon }) => (
                    <button key={v} type="button" onClick={() => set("roomType", v)} className={`wz-chip ${form.roomType === v ? "active" : ""}`}>
                      <Icon size={14} /> {label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "1fr 1fr 1fr" }} className="max-sm:!grid-cols-1">
                <div>
                  <label className="wz-label" htmlFor="mdate">Date (optional)</label>
                  <input id="mdate" type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className="wz-input" />
                </div>
                <div>
                  <label className="wz-label" htmlFor="mtime">Time (optional)</label>
                  <input id="mtime" type="time" value={form.time} onChange={(e) => set("time", e.target.value)} className="wz-input" />
                </div>
                <div>
                  <label className="wz-label" htmlFor="mdur">Duration (min)</label>
                  <input id="mdur" type="number" min={5} max={480} value={form.duration} onChange={(e) => set("duration", e.target.value)} className="wz-input" />
                </div>
              </div>
              <div>
                <label className="wz-label" htmlFor="mpass">Password (optional)</label>
                <input id="mpass" type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Leave empty for open room" className="wz-input" maxLength={64} />
              </div>
              {err && <p role="alert" className="wz-alert">{err}</p>}
              <div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" }}>
                <motion.button disabled={busy} onClick={() => create(true)} whileTap={{ scale: 0.97 }} className="wz-btn big"><Video size={18} color="#fff" /> {busy ? "Creating…" : "Meet Now"}</motion.button>
                <button disabled={busy} onClick={() => create(false)} className="wz-link">Create without starting <ArrowRight size={14} /></button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: "24px" }}>
            <div className="wz-card" style={{ padding: "34px", textAlign: "center" }}>
              <WannaBadge prefix="Your meeting" strong="is ready" />
              <h2 style={{ marginTop: "14px", fontSize: "26px", fontWeight: 500, letterSpacing: "-1px" }}>{result.title}</h2>
              <p style={{ marginTop: "12px", fontSize: "36px", fontWeight: 500, letterSpacing: "0.25em" }}>{result.code}</p>
              <p style={{ marginTop: "8px", fontSize: "13px", color: "rgba(0,0,0,.55)", wordBreak: "break-all" }}>{link}</p>
              <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
                <button onClick={() => navigate(`/meet/${result.code}?name=${encodeURIComponent(result.hostName)}&host=1`)} className="wz-btn big"><Video size={18} color="#fff" /> Meet Now</button>
                <button onClick={() => copy(link)} className="wz-chip" aria-label="Copy link"><Copy size={14} /> Copy link</button>
                <button onClick={() => copy(result.code)} className="wz-chip">Copy code</button>
              </div>
              <div style={{ marginTop: "12px", display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={() => navigate(`/schedule/${result.code}`)} className="wz-link">Meeting Card <ArrowRight size={13} /></button>
              </div>
              {result.scheduledAt && (
                <div style={{ marginTop: "10px", display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
                  <a href={googleCalendarUrl({ title: result.title, details: `Join: ${link} Code: ${result.code}`, start: result.scheduledAt, end: new Date(new Date(result.scheduledAt).getTime() + result.duration * 60000) })} target="_blank" rel="noreferrer" className="wz-link" style={{ color: "#724aee" }}><CalendarPlus size={14} /> Add to Calendar</a>
                  <button onClick={() => downloadIcs(`shadowmeet-${result.code}.ics`, icsContent({ title: result.title, description: `Join: ${link}`, start: result.scheduledAt, end: new Date(new Date(result.scheduledAt).getTime() + result.duration * 60000), code: result.code }))} className="wz-link" style={{ color: "#724aee" }}>Download .ics</button>
                </div>
              )}
              <button onClick={() => setResult(null)} className="wz-link" style={{ marginTop: "14px" }}><RotateCcw size={13} /> Create another</button>
            </div>
          </div>
        )}
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "14px", fontWeight: 500, marginTop: "28px" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><Users size={15} /> Works for teams &amp; classes</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><MonitorUp size={15} /> Screen + whiteboard built in</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><Clock size={15} /> Ready in seconds</span>
        </div>
      </div>
    </WannaShell>
  )
}
