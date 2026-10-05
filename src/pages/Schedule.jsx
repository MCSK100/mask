import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Copy, Video, CalendarPlus, Download, Link2 } from "lucide-react"
import { roomsApi, meetingsApi } from "../services/api"
import { googleCalendarUrl, icsContent, downloadIcs } from "../utils/calendar"
import { AuroraShell, AuroraBadge, SectionTab } from "../components/aurora/AuroraChrome"

export default function Schedule() {
  const { roomId } = useParams()
  const code = (roomId || "").toUpperCase()
  const navigate = useNavigate()
  const [room, setRoom] = useState(null)
  const [err, setErr] = useState(null)

  useEffect(() => {
    let alive = true
    meetingsApi.get(code)
      .then((d) => {
        if (!alive) return
        const m = d.meeting
        setRoom({ code: m.meetingCode, title: m.title, roomType: m.roomType || "meeting", status: m.status, scheduledAt: m.scheduledAt, durationMin: 60 })
      })
      .catch(() => {
        roomsApi.get(code).then((d) => { if (alive) setRoom(d.room) }).catch((e) => { if (alive) setErr(e.message) })
      })
    return () => { alive = false }
  }, [code])

  const link = typeof window !== "undefined" ? `${window.location.origin}/meet/${code}` : `/meet/${code}`
  const copy = async (t) => { try { await navigator.clipboard.writeText(t) } catch {} }

  return (
    <AuroraShell>
      <div style={{ paddingTop: "150px", paddingLeft: "34px", paddingRight: "34px", maxWidth: "640px", margin: "0 auto" }}>
        <AuroraBadge prefix="Scheduled" strong={code} />
        <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: "clamp(2.2rem,4vw,3.2rem)", letterSpacing: "-0.03em", marginTop: "18px", textTransform: "uppercase" }}>Meeting card<span style={{ color: "#F0531C" }}>.</span></h1>
        {err && <p style={{ marginTop: "12px", borderRadius: "12px", background: "#FFF1EC", border: "1px solid #F0531C44", padding: "12px", fontSize: "13px", color: "#D2410E", fontWeight: 600 }}>{err}</p>}
        {room && (
          <div style={{ marginTop: "20px" }}>
            <SectionTab icon={Link2} label="meeting-card.fig" />
            <div className="aurora-card" style={{ marginTop: "-1px", padding: "28px", textAlign: "center", borderRadius: "0 18px 18px 18px" }}>
              <p className="pin-tag" style={{ margin: "0 auto" }}>{room.roomType} · {room.status}</p>
              <h2 style={{ marginTop: "12px", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "24px", fontWeight: 700 }}>{room.title}</h2>
              <p style={{ marginTop: "12px", fontFamily: "'Space Mono', monospace", fontSize: "34px", fontWeight: 700, letterSpacing: "0.25em" }}>{room.code}</p>
              <p style={{ marginTop: "8px", fontSize: "13px", color: "#4A6173", wordBreak: "break-all" }}>{link}</p>
              <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
                <button onClick={() => navigate(`/meet/${room.code}`)} className="aurora-btn-dark"><Video size={15} /> Meet Now</button>
                <button onClick={() => copy(link)} style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#fff", border: "1.5px solid rgba(20,32,43,.13)", color: "#14202B", cursor: "pointer", display: "grid", placeItems: "center" }} aria-label="Copy link"><Copy size={16} /></button>
              </div>
              <div style={{ marginTop: "14px", display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", fontSize: "13px", fontWeight: 600 }}>
                <button onClick={() => copy(room.code)} style={{ background: "none", border: 0, color: "#4A6173", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}><Copy size={13} /> Copy code</button>
                {room.scheduledAt && <button onClick={() => downloadIcs(`shadowmeet-${room.code}.ics`, icsContent({ title: room.title, description: `Join: ${link}`, start: room.scheduledAt, end: new Date(new Date(room.scheduledAt).getTime() + (room.durationMin || 60) * 60000), code: room.code }))} style={{ background: "none", border: 0, color: "#0D99FF", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}><Download size={13} /> .ics</button>}
                {room.scheduledAt && <a style={{ color: "#0D99FF", display: "inline-flex", alignItems: "center", gap: "6px" }} target="_blank" rel="noreferrer" href={googleCalendarUrl({ title: room.title, details: `Join: ${link}`, start: room.scheduledAt, end: new Date(new Date(room.scheduledAt).getTime() + (room.durationMin || 60) * 60000) })}><CalendarPlus size={13} /> Google Calendar</a>}
              </div>
            </div>
          </div>
        )}
        <div style={{ height: "60px" }} />
      </div>
    </AuroraShell>
  )
}
