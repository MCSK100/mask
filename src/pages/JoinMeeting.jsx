import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { normalizeCode } from "../utils/meetingCode"
import { roomsApi } from "../services/api"

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
      await roomsApi.validate(c, password)
      try { sessionStorage.setItem("sm_name", name.trim()) } catch {}
      navigate(`/meet/${c}?name=${encodeURIComponent(name.trim())}${password ? `&pwd=${encodeURIComponent(password)}` : ""}`)
    } catch (e2) {
      setErr(e2.message)
    } finally { setBusy(false) }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10 text-white">
      <button onClick={() => navigate("/")} className="mb-4 text-sm text-slate-400 hover:text-white">← Back</button>
      <h1 className="font-display text-3xl font-bold">Join a meeting</h1>
      <p className="mt-1 text-sm text-slate-400">Enter the code shared by your host. No account needed.</p>
      <form onSubmit={join} className="mt-6 space-y-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div>
          <label htmlFor="jcode" className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">Meeting code</label>
          <input id="jcode" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="AB7K92" maxLength={10} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center font-mono text-xl tracking-[0.3em] focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        </div>
        <div>
          <label htmlFor="jname" className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">Your name</label>
          <input id="jname" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Santhosh" maxLength={40} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        </div>
        <div>
          <label htmlFor="jpass" className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">Password (if required)</label>
          <input id="jpass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Optional" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3" />
        </div>
        {err && <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{err}</p>}
        <button disabled={busy} className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-3.5 font-bold disabled:opacity-50">{busy ? "Checking…" : "Continue →"}</button>
      </form>
    </div>
  )
}
