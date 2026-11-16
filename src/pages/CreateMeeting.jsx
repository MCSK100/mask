import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Video, Users, MonitorUp, ArrowRight, Copy, CalendarPlus, RotateCcw, Clock } from "lucide-react"
import { roomsApi, meetingsApi } from "../services/api"
import { setHostToken } from "../utils/identity"
import { googleCalendarUrl, icsContent, downloadIcs } from "../utils/calendar"
import { WannaShell, WannaBadge } from "../components/wanna/WannaChrome"
import Seo from "../components/Seo"

export default function CreateMeeting() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: "", hostName: "", password: "" })
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null)
  const [err, setErr] = useState(null)
  const [copyState, setCopyState] = useState("")
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

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
          scheduledAt: null,
          durationMin: 60,
          password: form.password.trim() || null,
          roomType: "meeting"
        })
        data = { ...data, code: data.meetingCode || data.code }
      } catch (e) {
        // Backward compat: legacy mesh backend (404 = routes not mounted).
        if (e?.status !== 404) throw e
        data = await roomsApi.create({
          title: form.title.trim(),
          hostName: form.hostName.trim(),
          scheduledAt: null,
          durationMin: 60,
          password: form.password.trim() || null,
          roomType: "meeting"
        })
      }
      setHostToken(data.code, data.hostToken)
      const payload = { ...data, title: form.title.trim(), hostName: form.hostName.trim(), scheduledAt: null, duration: 60 }
      setResult(payload)
      try { sessionStorage.setItem("sm_last_create", JSON.stringify(payload)) } catch { /* best-effort only */ }
      if (startNow) navigate(`/meet/${data.code}?name=${encodeURIComponent(form.hostName.trim())}&host=1`)
    } catch (e) {
      // Network/CORS failures carry no status — explain instead of "Failed to fetch".
      setErr(
        e?.status
          ? e.message
          : "Can't reach the meeting server. If it just woke up, wait ~30 seconds and retry — or check that the backend allows this site (CORS)."
      )
    } finally { setBusy(false) }
  }

  const copy = async (t, label) => {
    try {
      await navigator.clipboard.writeText(t)
      setCopyState(`${label} copied`)
    } catch {
      setCopyState(`Couldn't copy the ${label.toLowerCase()}. Select and copy it instead.`)
    }
  }
  const link = result ? `${window.location.origin}/meet/${result.code}` : ""

  return (
    <WannaShell>
      <Seo
        title="Create a room | OneSpace Live"
        description="Set up a live class or meeting room, then invite your group with a shareable link or room code."
        path="/create"
      />
      <div className="wz-create-layout wz-main">
        <section className="wz-create-heading">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <WannaBadge prefix="OneSpace Live" strong="live classes and meetings" />
          </motion.div>
          <h1 className="wz-title">Start a session with everyone.</h1>
          <p className="wz-sub">Create a room for your class or team. Share one link, then meet face to face.</p>
          <div className="wz-create-benefits">
            <div className="wz-create-benefit"><Video size={18} /><span>Live video, screen sharing, and a collaborative whiteboard.</span></div>
            <div className="wz-create-benefit"><Users size={18} /><span>Invite learners or teammates with a room link or code.</span></div>
            <div className="wz-create-benefit"><Clock size={18} /><span>No account or app download required to get started.</span></div>
          </div>
        </section>
        {!result ? (
          <form className="wz-create-form" onSubmit={(e) => { e.preventDefault(); create(true) }}>
            <div className="wz-card wz-create-card">
              <div>
                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 600, letterSpacing: "-.03em" }}>Room details</h2>
                <p style={{ margin: "6px 0 0", color: "var(--os-muted)", fontSize: "13px" }}>You can share the room as soon as it is created.</p>
              </div>
              <div>
                <label className="wz-label" htmlFor="mtitle">Class or meeting name</label>
                <input id="mtitle" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Biology: cell structure" className="wz-input" maxLength={80} required />
                <p className="wz-field-help">Give participants a clear idea of what this session is about.</p>
              </div>
              <div>
                <label className="wz-label" htmlFor="hname">Your display name</label>
                <input id="hname" value={form.hostName} onChange={(e) => set("hostName", e.target.value)} placeholder="e.g. Maya" className="wz-input" maxLength={40} autoComplete="name" required />
              </div>
              <div>
                <label className="wz-label" htmlFor="mpass">Room password <span style={{ fontWeight: 400, color: "var(--os-muted)" }}>(optional)</span></label>
                <input id="mpass" type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Leave blank for an open room" className="wz-input" maxLength={64} autoComplete="new-password" />
              </div>
              {err && <p role="alert" className="wz-alert">{err}</p>}
              <div className="wz-create-actions">
                <motion.button type="submit" disabled={busy} whileTap={{ scale: 0.97 }} className="wz-btn big"><Video size={18} /> {busy ? "Creating room…" : "Create room and join"}</motion.button>
                <button type="button" disabled={busy} onClick={() => create(false)} className="wz-link">Create without joining <ArrowRight size={14} /></button>
              </div>
            </div>
            <div className="wz-create-meta">
              <span><Users size={15} /> Built for classes and teams</span>
              <span><MonitorUp size={15} /> Share screen and whiteboard</span>
            </div>
          </form>
        ) : (
          <div className="wz-create-form">
            <div className="wz-card wz-create-card wz-result-card">
              <WannaBadge prefix="Room created" strong="ready to share" />
              <div>
                <h2 style={{ margin: "16px 0 0", fontSize: "24px", fontWeight: 600, letterSpacing: "-.03em" }}>{result.title}</h2>
                <p style={{ margin: "18px 0 4px", color: "var(--os-muted)", fontSize: "13px" }}>Room code</p>
                <p className="wz-result-code" style={{ margin: 0, fontSize: "34px", fontWeight: 600, letterSpacing: ".18em" }}>{result.code}</p>
              </div>
              <div className="wz-share-link">
                <span>{link}</span>
                <button type="button" onClick={() => copy(link, "Link")} className="wz-chip"><Copy size={14} /> Copy link</button>
              </div>
              <div className="wz-create-actions">
                <button type="button" onClick={() => navigate(`/meet/${result.code}?name=${encodeURIComponent(result.hostName)}&host=1`)} className="wz-btn big"><Video size={18} /> Join room</button>
                <button type="button" onClick={() => copy(result.code, "Code")} className="wz-chip"><Copy size={14} /> Copy code</button>
              </div>
              {copyState && <p role={copyState.startsWith("Couldn't") ? "alert" : "status"} className={copyState.startsWith("Couldn't") ? "wz-alert" : "wz-copy-state"}>{copyState}</p>}
              <button type="button" onClick={() => navigate(`/schedule/${result.code}`)} className="wz-link">View room details <ArrowRight size={13} /></button>
              {result.scheduledAt && (
                <div style={{ marginTop: "10px", display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
                  <a href={googleCalendarUrl({ title: result.title, details: `Join: ${link} Code: ${result.code}`, start: result.scheduledAt, end: new Date(new Date(result.scheduledAt).getTime() + result.duration * 60000) })} target="_blank" rel="noreferrer" className="wz-link" style={{ color: "var(--os-accent)" }}><CalendarPlus size={14} /> Add to Calendar</a>
                  <button type="button" onClick={() => downloadIcs(`onespace-live-${result.code}.ics`, icsContent({ title: result.title, description: `Join: ${link}`, start: result.scheduledAt, end: new Date(new Date(result.scheduledAt).getTime() + result.duration * 60000), code: result.code }))} className="wz-link" style={{ color: "var(--os-accent)" }}>Download .ics</button>
                </div>
              )}
              <button type="button" onClick={() => { setResult(null); setCopyState(""); setErr(null) }} className="wz-link"><RotateCcw size={13} /> Create another room</button>
            </div>
          </div>
        )}
      </div>
    </WannaShell>
  )
}
