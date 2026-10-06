import { Copy, Share2, MessageCircle, X, Link2 } from "lucide-react"
import { meetingLink } from "../../utils/meetingCode"

export function InviteDialog({ code, title, onClose }) {
  const link = typeof window !== "undefined" ? `${window.location.origin}/meet/${code}` : `/meet/${code}`
  const copy = async (t) => {
    try { await navigator.clipboard.writeText(t) } catch {}
  }
  const share = async () => {
    const data = { title: `Join ${title}`, text: `Join "${title}" on OneSpace Live. Code: ${code}`, url: link }
    if (navigator.share) { try { await navigator.share(data) } catch {} }
    else copy(link)
  }
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#14202B66] p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Invite">
      <div className="w-full max-w-md rounded-[18px] border border-[#14202b22] bg-white p-6 shadow-[0_20px_50px_-32px_rgba(20,19,16,.32)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="tab"><Link2 size={12} /> invite.fig</p>
            <h2 className="font-display text-2xl font-bold text-[#14202B] mt-2">Invite to {title}</h2>
            <p className="mt-1 text-sm font-medium text-[#4A6173]">Share one code. Meet together.</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="meet-btn"><X size={16} /></button>
        </div>
        <div className="mt-4 rounded-2xl bg-[#F0531C] p-4 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-white/85">Meeting Code</p>
          <p className="font-mono text-3xl font-bold tracking-[0.3em] text-white">{code}</p>
          <p className="mt-2 break-all text-xs font-medium text-white/90">{link}</p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <button onClick={() => copy(link)} className="flex items-center justify-center gap-1.5 rounded-full bg-[#F0531C] px-3 py-2.5 text-sm font-bold text-white"><Copy size={14} /> Copy Link</button>
          <button onClick={() => copy(code)} className="flex items-center justify-center gap-1.5 rounded-full border-[1.5px] border-[#14202B] px-3 py-2.5 text-sm font-bold"><Copy size={14} /> Copy Code</button>
          <button onClick={share} className="flex items-center justify-center gap-1.5 rounded-full border-[1.5px] border-[#14202b22] bg-[#F1F6FA] px-3 py-2.5 text-sm font-bold"><Share2 size={14} /> Share</button>
          <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Join ${title} on OneSpace Live: ${link} (code ${code})`)}`, "_blank")} className="flex items-center justify-center gap-1.5 rounded-full border-[1.5px] border-[#14202b22] bg-[#F1F6FA] px-3 py-2.5 text-sm font-bold"><MessageCircle size={14} /> WhatsApp</button>
        </div>
        <button onClick={onClose} className="mt-3 w-full rounded-full border border-[#14202b22] py-2.5 text-sm font-semibold text-[#4A6173]">Close</button>
      </div>
    </div>
  )
}
