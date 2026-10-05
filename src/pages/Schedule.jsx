import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { roomsApi } from "../services/api"
import { googleCalendarUrl, icsContent, downloadIcs } from "../utils/calendar"
import { AuroraShell, AuroraBadge } from "../components/aurora/AuroraChrome"

export default function Schedule() {
  const { roomId } = useParams()
  const code = (roomId || "").toUpperCase()
  const navigate = useNavigate()
  const [room, setRoom] = useState(null)
  const [err, setErr] = useState(null)

  useEffect(() => {
    roomsApi.get(code).then((d) => setRoom(d.room)).catch((e) => setErr(e.message))
  }, [code])

  const link = `${window.location.origin}/meet/${code}`
  const copy = async (t) => { try { await navigator.clipboard.writeText(t) } catch {} }

  return (
    <AuroraShell>
      <div style={{ paddingTop: "24vh", paddingLeft: "64px", paddingRight: "24px", maxWidth: "640px" }} className="max-sm:!px-6">
        <AuroraBadge prefix="Scheduled" strong={code} />
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em", marginTop: "22px" }}>Meeting card</h1>
        {err && <p style={{ marginTop: "12px", borderRadius: "12px", background: "rgba(255,80,80,0.1)", padding: "12px", fontSize: "13px", color: "#ff9c9c" }}>{err}</p>}
        {room && (
          <div className="aurora-card" style={{ marginTop: "24px", padding: "28px", textAlign: "center" }}>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)" }}>{room.roomType} · {room.status}</p>
            <h2 style={{ marginTop: "4px", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "22px", fontWeight: 600 }}>{room.title}</h2>
            <p style={{ marginTop: "12px", fontFamily: "monospace", fontSize: "36px", fontWeight: 700, letterSpacing: "0.3em" }}>{room.code}</p>
            <p style={{ marginTop: "8px", fontSize: "13px", color: "rgba(255,255,255,0.65)", wordBreak: "break-all" }}>{link}</p>
            <div style={{ marginTop: "20px", display: "flex", gap: "14px", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
              <button onClick={() => navigate(`/meet/${room.code}`)} className="aurora-btn-dark">Get Started</button>
              <button onClick={() => copy(link)} style={{ width: "44px", height: "44px", borderRadius: "999px", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", cursor: "pointer" }} aria-label="Copy link">⧉</button>
            </div>
            <div style={{ marginTop: "12px", display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", fontSize: "13px" }}>
              <button onClick={() => copy(room.code)} style={{ background: "none", border: 0, color: "rgba(255,255,255,0.7)", cursor: "pointer" }}>Copy code</button>
              {room.scheduledAt && <button onClick={() => downloadIcs(`shadowmeet-${room.code}.ics`, icsContent({ title: room.title, description: `Join: ${link}`, start: room.scheduledAt, end: new Date(new Date(room.scheduledAt).getTime() + (room.durationMin || 60) * 60000), code: room.code }))} style={{ background: "none", border: 0, color: "rgba(255,255,255,0.7)", cursor: "pointer" }}>.ics</button>}
              {room.scheduledAt && <a style={{ color: "#fff" }} target="_blank" rel="noreferrer" href={googleCalendarUrl({ title: room.title, details: `Join: ${link}`, start: room.scheduledAt, end: new Date(new Date(room.scheduledAt).getTime() + (room.durationMin || 60) * 60000) })}>Google Calendar</a>}
            </div>
          </div>
        )}
        <div style={{ height: "60px" }} />
      </div>
    </AuroraShell>
  )
}
