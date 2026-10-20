import { Copy, Share2, MessageCircle, X, Link2 } from "lucide-react"

export function InviteDialog({ code, title, onClose }) {
  const link = typeof window !== "undefined" ? `${window.location.origin}/meet/${code}` : `/meet/${code}`
  const copy = async (t) => {
    try {
      await navigator.clipboard.writeText(t)
    } catch (error) {
      console.warn("[invite] failed to copy meeting details", error)
    }
  }
  const share = async () => {
    const data = { title: `Join ${title}`, text: `Join "${title}" on OneSpace Live. Code: ${code}`, url: link }
    if (navigator.share) {
      try {
        await navigator.share(data)
      } catch (error) {
        if (error?.name !== "AbortError") console.warn("[invite] failed to share meeting details", error)
      }
    }
    else copy(link)
  }
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Invite">
      <div className="w-full max-w-md rounded-xl border border-white/15 bg-[#111820] p-6 text-[#f3f1ed] shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.16em] text-[#b9dceb]"><Link2 size={12} /> Room invitation</p>
            <h2 className="mt-2 font-display text-2xl font-medium text-[#f3f1ed]">Invite to {title}</h2>
            <p className="mt-1 text-sm font-medium text-[#aab2ba]">Share the room link or code.</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="meet-btn"><X size={16} /></button>
        </div>
        <div className="mt-4 rounded-lg border border-[#b9dceb33] bg-[#18222c] p-4 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#aab2ba]">Meeting code</p>
          <p className="font-mono text-3xl font-bold tracking-[0.3em] text-[#d8eff8]">{code}</p>
          <p className="mt-2 break-all text-xs font-medium text-[#c0c9ce]">{link}</p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <button onClick={() => copy(link)} className="flex items-center justify-center gap-1.5 rounded-md bg-[#b9dceb] px-3 py-2.5 text-sm font-semibold text-[#0c171e]"><Copy size={14} /> Copy link</button>
          <button onClick={() => copy(code)} className="flex items-center justify-center gap-1.5 rounded-md border border-white/20 bg-[#18222c] px-3 py-2.5 text-sm font-semibold"><Copy size={14} /> Copy code</button>
          <button onClick={share} className="flex items-center justify-center gap-1.5 rounded-md border border-white/15 bg-[#18222c] px-3 py-2.5 text-sm font-semibold"><Share2 size={14} /> Share</button>
          <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Join ${title} on OneSpace Live: ${link} (code ${code})`)}`, "_blank")} className="flex items-center justify-center gap-1.5 rounded-md border border-white/15 bg-[#18222c] px-3 py-2.5 text-sm font-semibold"><MessageCircle size={14} /> WhatsApp</button>
        </div>
        <button onClick={onClose} className="mt-3 w-full rounded-md border border-white/15 py-2.5 text-sm font-semibold text-[#aab2ba] hover:bg-white/5">Close</button>
      </div>
    </div>
  )
}
