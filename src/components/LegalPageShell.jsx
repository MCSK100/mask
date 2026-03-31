import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import SiteFooter from "./SiteFooter"
import CyberButton from "./CyberButton"

const defaultTitle = "Shadowchaty — Anonymous stranger chat & video"

export default function LegalPageShell({ title, description, children }) {
  const navigate = useNavigate()

  useEffect(() => {
document.title = `${title} | Shadowchaty`
    const meta = document.querySelector('meta[name="description"]')
    const prev = meta?.getAttribute("content")
    if (meta && description) meta.setAttribute("content", description)
    return () => {
      document.title = defaultTitle
      if (meta && prev) meta.setAttribute("content", prev)
    }
  }, [title, description])

  return (
    <div className="min-h-dvh bg-gradient-to-b from-slate-950 via-slate-950 to-black text-slate-200">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="truncate text-sm font-medium text-violet-300 hover:text-violet-200">
← Shadowchaty home
          </Link>
          <CyberButton type="button" onClick={() => navigate("/chat")} className="cyber-btn--sm shrink-0">
            Start chat
          </CyberButton>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <article className="space-y-4">{children}</article>
      </main>

      <SiteFooter />
    </div>
  )
}
