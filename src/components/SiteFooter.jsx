import { Link } from "react-router-dom"

const linkClass =
  "text-xs text-slate-500 transition hover:text-violet-300 sm:text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/50 rounded"

export default function SiteFooter({ className = "" }) {
  return (
    <footer
      className={`border-t border-white/5 bg-slate-950/25 px-4 py-8 backdrop-blur-md ${className}`}
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 sm:flex-row sm:justify-between sm:gap-6">
        <p className="text-center text-xs text-slate-500 sm:text-left">
          © {new Date().getFullYear()} Mask. Anonymous stranger chat for adults. Use responsibly.
        </p>
        <nav aria-label="Legal and contact" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-end">
          <Link to="/about" className={linkClass}>
            About / Contact
          </Link>
          <Link to="/privacy" className={linkClass}>
            Privacy
          </Link>
          <Link to="/terms" className={linkClass}>
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  )
}
