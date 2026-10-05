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
      <div className="w-full max-w-md rounded-[3px] border-[3px] border-white bg-black p-6">
        <h2 className="font-display text-2xl text-white">We Invite You To {title}</h2>
        <p className="mt-1 text-base font-semibold text-white">We Share One Code. We Meet Together.</p>
        <div className="mt-4 rounded-[3px] bg-supari-primary p-4 text-center">
          <p className="text-sm font-bold text-white">Meeting Code</p>
          <p className="font-mono text-3xl font-bold tracking-[0.3em] text-white">{code}</p>
          <p className="mt-2 break-all text-xs font-semibold text-white">{link}</p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button onClick={() => copy(link)} className="rounded-[80px] bg-supari-secondary px-3 py-2 text-sm font-bold text-white">Copy Link</button>
          <button onClick={() => copy(code)} className="rounded-[80px] border-[3px] border-white bg-transparent px-3 py-2 text-sm font-bold text-white">Copy Code</button>
          <button onClick={share} className="rounded-[80px] border-[3px] border-white bg-transparent px-3 py-2 text-sm font-bold text-white">Share</button>
          <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Join ${title} on ShadowMeet: ${link} (code ${code})`)}`, "_blank")} className="rounded-[80px] border-[3px] border-white bg-transparent px-3 py-2 text-sm font-bold text-white">WhatsApp</button>
        </div>
        <button onClick={onClose} className="mt-3 w-full rounded-[80px] border-[3px] border-white/30 py-2 text-sm font-semibold text-white">Close</button>
      </div>
    </div>
  )
}
