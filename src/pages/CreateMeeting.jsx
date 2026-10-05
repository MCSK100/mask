import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Video, Users, MonitorUp, GraduationCap, Presentation, BookOpen, Play, ArrowRight, Link2, Copy, CalendarPlus, RotateCcw, Clock } from "lucide-react"
import { roomsApi, meetingsApi } from "../services/api"
import { setHostToken } from "../utils/identity"
import { googleCalendarUrl, icsContent, downloadIcs } from "../utils/calendar"
import { AuroraShell, AuroraBadge, SectionTab } from "../components/aurora/AuroraChrome"

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
      <div style={{ paddingTop: "150px", paddingLeft: "34px", paddingRight: "34px", maxWidth: "880px", margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <AuroraBadge prefix="No signup" strong="ready in seconds" />
        </motion.div>
        <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: "clamp(2.4rem,5vw,4rem)", lineHeight: 0.95, letterSpacing: "-0.03em", marginTop: "18px", textTransform: "uppercase" }}>
          Create a<br />meeting<span style={{ color: "#F0531C" }}>.</span>
        </h1>
        <p style={{ marginTop: "12px", fontSize: "16px", color: "#4A6173", maxWidth: "440px" }}>One link for meetings, classes, and watch parties. Light, modern, instant.</p>

        {!result ? (
          <div style={{ marginTop: "22px" }}>
            <SectionTab icon={Video} label="new-room.fig" />
            <div className="aurora-card sel" style={{ marginTop: "-1px", padding: "26px", display: "grid", gap: "16px", borderRadius: "0 18px 18px 18px" }}>
              <span className="h tl" /><span className="h tr" /><span className="h bl" /><span className="h br" />
              <span className="dim">860 × auto</span>
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
                  {TYPES.map(({ v, label, Icon }) => (
                    <button key={v} type="button" onClick={() => set("roomType", v)} className={`chip ${form.roomType === v ? "active" : ""}`} style={{ cursor: "pointer" }}>
                      <Icon size={14} /> {label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "1fr 1fr 1fr" }} className="max-sm:!grid-cols-1">
                <div>
                  <label className="aurora-label" htmlFor="mdate">Date (optional)</label>
                  <input id="mdate" type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className="aurora-input" />
                </div>
                <div>
                  <label className="aurora-label" htmlFor="mtime">Time (optional)</label>
                  <input id="mtime" type="time" value={form.time} onChange={(e) => set("time", e.target.value)} className="aurora-input" />
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
              {err && <p role="alert" style={{ borderRadius: "12px", background: "#FFF1EC", border: "1px solid #F0531C44", padding: "12px", fontSize: "13px", color: "#D2410E", fontWeight: 600 }}>{err}</p>}
              <div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" }}>
                <motion.button disabled={busy} onClick={() => create(true)} whileTap={{ scale: 0.97 }} className="aurora-btn-dark"><Video size={15} /> {busy ? "Creating…" : "Meet Now"}</motion.button>
                <button disabled={busy} onClick={() => create(false)} style={{ background: "none", border: 0, color: "#4A6173", fontSize: "14px", fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}>Create without starting <ArrowRight size={14} /></button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: "22px" }}>
            <SectionTab icon={Link2} label="room-ready" />
            <div className="aurora-card" style={{ marginTop: "-1px", padding: "30px", textAlign: "center", borderRadius: "0 18px 18px 18px" }}>
              <p className="pin-tag" style={{ margin: "0 auto" }}><Clock size={12} /> your meeting is ready</p>
              <h2 style={{ marginTop: "14px", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "26px", fontWeight: 700 }}>{result.title}</h2>
              <p style={{ marginTop: "12px", fontFamily: "'Space Mono', monospace", fontSize: "36px", fontWeight: 700, letterSpacing: "0.25em" }}>{result.code}</p>
              <p style={{ marginTop: "8px", fontSize: "13px", color: "#4A6173", wordBreak: "break-all" }}>{link}</p>
              <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
                <button onClick={() => navigate(`/meet/${result.code}?name=${encodeURIComponent(result.hostName)}&host=1`)} className="aurora-btn-dark"><Video size={15} /> Meet Now</button>
                <button onClick={() => copy(link)} style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#fff", border: "1.5px solid rgba(20,32,43,.13)", color: "#14202B", cursor: "pointer", display: "grid", placeItems: "center" }} aria-label="Copy link"><Copy size={16} /></button>
                <button onClick={() => copy(result.code)} style={{ height: "44px", borderRadius: "999px", background: "#F1F6FA", border: "1px solid rgba(20,32,43,.08)", padding: "0 18px", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}>Copy code</button>
              </div>
              <div style={{ marginTop: "12px", display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={() => navigate(`/schedule/${result.code}`)} style={{ fontSize: "13px", color: "#4A6173", background: "none", border: 0, cursor: "pointer", fontWeight: 600 }}>Meeting Card <ArrowRight size={13} style={{ display: "inline" }} /></button>
              </div>
              {result.scheduledAt && (
                <div style={{ marginTop: "10px", display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                  <a href={googleCalendarUrl({ title: result.title, details: `Join: ${link} Code: ${result.code}`, start: result.scheduledAt, end: new Date(new Date(result.scheduledAt).getTime() + result.duration * 60000) })} target="_blank" rel="noreferrer" style={{ fontSize: "13px", fontWeight: 700, color: "#0D99FF", display: "inline-flex", alignItems: "center", gap: "6px" }}><CalendarPlus size={14} /> Add to Calendar</a>
                  <button onClick={() => downloadIcs(`shadowmeet-${result.code}.ics`, icsContent({ title: result.title, description: `Join: ${link}`, start: result.scheduledAt, end: new Date(new Date(result.scheduledAt).getTime() + result.duration * 60000), code: result.code }))} style={{ fontSize: "13px", fontWeight: 700, color: "#0D99FF", background: "none", border: 0, cursor: "pointer" }}>Download .ics</button>
                </div>
              )}
              <button onClick={() => setResult(null)} style={{ marginTop: "14px", fontSize: "13px", color: "#8AA6B8", background: "none", border: 0, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}><RotateCcw size={13} /> Create another</button>
            </div>
          </div>
        )}
        <div style={{ height: "40px" }} />
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", fontSize: "13px", color: "#4A6173", fontWeight: 600 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><Users size={14} /> Works for teams & classes</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><MonitorUp size={14} /> Screen + whiteboard built in</span>
        </div>
      </div>
    </AuroraShell>
  )
}
