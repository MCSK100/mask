import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Copy, Video, CalendarPlus, Download } from "lucide-react"
import { roomsApi, meetingsApi } from "../services/api"
import { googleCalendarUrl, icsContent, downloadIcs } from "../utils/calendar"
import { WannaShell, WannaBadge } from "../components/wanna/WannaChrome"

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
  const copy = async (t) => { try { await navigator.clipboard.writeText(t) } catch { /* best-effort only */ } }

  return (
    <WannaShell>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "30px 0 20px" }}>
        <WannaBadge prefix="Scheduled" strong={code} />
        <h1 className="wz-title">Meeting card.</h1>
        {err && <p role="alert" className="wz-alert" style={{ marginTop: "14px" }}>{err}</p>}
        {room && (
          <div style={{ marginTop: "22px" }}>
            <div className="wz-card" style={{ padding: "32px", textAlign: "center" }}>
              <WannaBadge prefix={room.roomType} strong={room.status} />
              <h2 style={{ marginTop: "14px", fontSize: "24px", fontWeight: 500, letterSpacing: "-1px" }}>{room.title}</h2>
              <p style={{ marginTop: "12px", fontSize: "34px", fontWeight: 500, letterSpacing: "0.25em" }}>{room.code}</p>
              <p style={{ marginTop: "8px", fontSize: "13px", color: "rgba(0,0,0,.55)", wordBreak: "break-all" }}>{link}</p>
              <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
                <button onClick={() => navigate(`/meet/${room.code}`)} className="wz-btn big"><Video size={18} color="#fff" /> Meet Now</button>
                <button onClick={() => copy(link)} className="wz-chip" aria-label="Copy link"><Copy size={14} /> Copy link</button>
              </div>
              <div style={{ marginTop: "14px", display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={() => copy(room.code)} className="wz-link"><Copy size={13} /> Copy code</button>
                {room.scheduledAt && <button onClick={() => downloadIcs(`shadowmeet-${room.code}.ics`, icsContent({ title: room.title, description: `Join: ${link}`, start: room.scheduledAt, end: new Date(new Date(room.scheduledAt).getTime() + (room.durationMin || 60) * 60000), code: room.code }))} className="wz-link" style={{ color: "#724aee" }}><Download size={13} /> .ics</button>}
                {room.scheduledAt && <a style={{ color: "#724aee", display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: 500 }} target="_blank" rel="noreferrer" href={googleCalendarUrl({ title: room.title, details: `Join: ${link}`, start: room.scheduledAt, end: new Date(new Date(room.scheduledAt).getTime() + (room.durationMin || 60) * 60000) })}><CalendarPlus size={13} /> Google Calendar</a>}
              </div>
            </div>
          </div>
        )}
      </div>
    </WannaShell>
  )
}
