import { meetingLink } from "../../utils/meetingCode"

export function InviteDialog({ code, title, onClose }) {
  const link = typeof window !== "undefined" ? `${window.location.origin}/meet/${code}` : `/meet/${code}`
  const copy = async (t) => {
    try { await navigator.clipboard.writeText(t) } catch {}
  }
  const share = async () => {
    const data = { title: `Join ${title}`, text: `Join "${title}" on ShadowMeet. Code: ${code}`, url: link }
    if (navigator.share) { try { await navigator.share(data) } catch {} }
    else copy(link)
  }
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-label="Invite">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6">
        <h2 className="font-display text-lg font-bold text-white">You're invited to {title}</h2>
        <p className="mt-1 text-sm text-slate-400">Share this code or link — no account needed.</p>
        <div className="mt-4 rounded-xl bg-white/5 p-4 text-center">
          <p className="text-xs uppercase tracking-widest text-slate-500">Meeting code</p>
          <p className="font-mono text-3xl font-bold tracking-[0.3em] text-white">{code}</p>
          <p className="mt-2 break-all text-xs text-indigo-300">{link}</p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button onClick={() => copy(link)} className="rounded-xl bg-indigo-500 px-3 py-2 text-sm font-bold text-white hover:bg-indigo-400">Copy Link</button>
          <button onClick={() => copy(code)} className="rounded-xl bg-white/10 px-3 py-2 text-sm font-bold text-white hover:bg-white/15">Copy Code</button>
          <button onClick={share} className="rounded-xl bg-white/10 px-3 py-2 text-sm font-bold text-white hover:bg-white/15">Share</button>
          <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Join ${title} on ShadowMeet: ${link} (code ${code})`)}`, "_blank")} className="rounded-xl bg-white/10 px-3 py-2 text-sm font-bold text-white hover:bg-white/15">WhatsApp</button>
        </div>
        <button onClick={onClose} className="mt-3 w-full rounded-xl border border-white/10 py-2 text-sm text-slate-300 hover:bg-white/5">Close</button>
      </div>
    </div>
  )
}
