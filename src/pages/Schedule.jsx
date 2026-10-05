import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { roomsApi } from "../services/api"
import { googleCalendarUrl, icsContent, downloadIcs } from "../utils/calendar"

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
    <div className="mx-auto max-w-lg px-4 py-10 text-white">
      <button onClick={() => navigate("/")} className="mb-4 text-sm text-slate-400 hover:text-white">← Home</button>
      <h1 className="font-display text-2xl font-bold">Scheduled meeting</h1>
      {err && <p className="mt-3 rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{err}</p>}
      {room && (
        <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs uppercase tracking-widest text-slate-500">{room.roomType} · {room.status}</p>
          <h2 className="mt-1 font-display text-xl font-bold">{room.title}</h2>
          <p className="mt-3 text-center font-mono text-4xl font-bold tracking-[0.3em]">{room.code}</p>
          <p className="mt-2 break-all text-center text-sm text-indigo-300">{link}</p>
          {room.scheduledAt && <p className="mt-1 text-center text-xs text-slate-400">📅 {new Date(room.scheduledAt).toLocaleString()}</p>}
          <div className="mt-5 grid grid-cols-2 gap-2">
            <button onClick={() => copy(link)} className="rounded-xl bg-indigo-500 px-3 py-2.5 text-sm font-bold">Copy Link</button>
            <button onClick={() => copy(room.code)} className="rounded-xl bg-white/10 px-3 py-2.5 text-sm font-bold">Copy Code</button>
            <button onClick={() => navigate(`/meet/${room.code}`)} className="rounded-xl bg-emerald-500 px-3 py-2.5 text-sm font-bold">Join →</button>
            <button onClick={() => { if (room.scheduledAt) downloadIcs(`shadowmeet-${room.code}.ics`, icsContent({ title: room.title, description: `Join: ${link}`, start: room.scheduledAt, end: new Date(new Date(room.scheduledAt).getTime() + (room.durationMin || 60) * 60000), code: room.code })) }} className="rounded-xl bg-white/10 px-3 py-2.5 text-sm font-bold">.ics</button>
          </div>
          {room.scheduledAt && (
            <a className="mt-2 block rounded-xl bg-white/10 px-3 py-2.5 text-center text-sm font-bold" target="_blank" rel="noreferrer" href={googleCalendarUrl({ title: room.title, details: `Join: ${link}`, start: room.scheduledAt, end: new Date(new Date(room.scheduledAt).getTime() + (room.durationMin || 60) * 60000) })}>Add to Google Calendar</a>
          )}
        </div>
      )}
    </div>
  )
}
