import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { roomsApi } from "../services/api"
import { setHostToken } from "../utils/identity"
import { googleCalendarUrl, icsContent, downloadIcs } from "../utils/calendar"

const TYPES = [["meeting", "🤝 Meeting"], ["classroom", "🧑‍🏫 Classroom"], ["webinar", "📡 Webinar"], ["study", "📚 Study Room"], ["watch", "▶️ Watch Party"]]

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
      if (startNow) {
        navigate(`/meet/${data.code}?name=${encodeURIComponent(form.hostName.trim())}&host=1`)
      }
    } catch (e) {
      setErr(e.message)
    } finally { setBusy(false) }
  }

  const copy = async (t) => { try { await navigator.clipboard.writeText(t) } catch {} }
  const link = result ? `${window.location.origin}/meet/${result.code}` : ""

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 text-white">
      <button onClick={() => navigate("/")} className="mb-4 text-sm text-slate-400 hover:text-white">← Back</button>
      <h1 className="font-display text-3xl font-bold">Create a meeting</h1>
      <p className="mt-1 text-sm text-slate-400">No signup. Your link is ready in seconds.</p>

      {!result ? (
        <div className="mt-6 space-y-4 rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400" htmlFor="mtitle">Meeting title</label>
            <input id="mtitle" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. React Beginners Class" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-fuchsia-400" maxLength={80} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400" htmlFor="hname">Your name (host)</label>
            <input id="hname" value={form.hostName} onChange={(e) => set("hostName", e.target.value)} placeholder="e.g. Santhosh" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-fuchsia-400" maxLength={40} />
          </div>
          <div>
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Room type</span>
            <div className="flex flex-wrap gap-2">
              {TYPES.map(([v, label]) => (
                <button key={v} type="button" onClick={() => set("roomType", v)} className={`rounded-xl px-3.5 py-2 text-sm font-semibold ${form.roomType === v ? "bg-indigo-500 text-white" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}>{label}</button>
              ))}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400" htmlFor="mdate">Date (optional)</label>
              <input id="mdate" type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white [color-scheme:dark]" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400" htmlFor="mtime">Time (optional)</label>
              <input id="mtime" type="time" value={form.time} onChange={(e) => set("time", e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 [color-scheme:dark]" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400" htmlFor="mdur">Duration (min)</label>
              <input id="mdur" type="number" min={5} max={480} value={form.duration} onChange={(e) => set("duration", e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400" htmlFor="mpass">Password (optional)</label>
            <input id="mpass" type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Leave empty for open room" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3" maxLength={64} />
          </div>
          {err && <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{err}</p>}
          <div className="flex flex-col gap-2 sm:flex-row">
            <button disabled={busy} onClick={() => create(false)} className="flex-1 rounded-2xl border border-white/15 bg-white/5 px-5 py-3.5 font-bold hover:bg-white/10 disabled:opacity-50">{busy ? "Creating…" : "Create Meeting"}</button>
            <button disabled={busy} onClick={() => create(true)} className="flex-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-3.5 font-bold disabled:opacity-50">{busy ? "Creating…" : "Create & Start Now"}</button>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center">
          <p className="text-xs uppercase tracking-widest text-slate-500">Your meeting is ready</p>
          <h2 className="mt-1 font-display text-2xl font-bold">{result.title}</h2>
          <p className="mt-3 font-mono text-4xl font-bold tracking-[0.3em]">{result.code}</p>
          <p className="mt-2 break-all text-sm text-indigo-300">{link}</p>
          {result.scheduledAt && <p className="mt-1 text-xs text-slate-400">📅 {new Date(result.scheduledAt).toLocaleString()} · {result.duration} min</p>}
          <div className="mt-5 grid grid-cols-2 gap-2">
            <button onClick={() => copy(link)} className="rounded-xl bg-indigo-500 px-3 py-2.5 text-sm font-bold">Copy Link</button>
            <button onClick={() => copy(result.code)} className="rounded-xl bg-white/10 px-3 py-2.5 text-sm font-bold">Copy Code</button>
            <button onClick={() => navigate(`/meet/${result.code}?name=${encodeURIComponent(result.hostName)}&host=1`)} className="rounded-xl bg-emerald-500 px-3 py-2.5 text-sm font-bold">Start Now →</button>
            <button onClick={() => navigate(`/schedule/${result.code}`)} className="rounded-xl bg-white/10 px-3 py-2.5 text-sm font-bold">Meeting Card</button>
          </div>
          {result.scheduledAt && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <a href={googleCalendarUrl({ title: result.title, details: `Join: ${link} Code: ${result.code}`, start: result.scheduledAt, end: new Date(new Date(result.scheduledAt).getTime() + result.duration * 60000) })} target="_blank" rel="noreferrer" className="rounded-xl bg-white/10 px-3 py-2.5 text-sm font-bold">Add to Calendar</a>
              <button onClick={() => downloadIcs(`shadowmeet-${result.code}.ics`, icsContent({ title: result.title, description: `Join: ${link}`, start: result.scheduledAt, end: new Date(new Date(result.scheduledAt).getTime() + result.duration * 60000), code: result.code }))} className="rounded-xl bg-white/10 px-3 py-2.5 text-sm font-bold">Download .ics</button>
            </div>
          )}
          <button onClick={() => setResult(null)} className="mt-3 text-sm text-slate-500 hover:text-white">Create another</button>
        </div>
      )}
    </div>
  )
}
