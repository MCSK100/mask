import { useNavigate } from "react-router-dom"
export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="grid min-h-screen place-items-center p-6 text-center text-white">
      <div>
        <p className="font-mono text-6xl font-bold text-white/20">404</p>
        <h1 className="mt-2 font-display text-2xl font-bold">Room not found</h1>
        <p className="mt-1 text-sm text-slate-400">The link may be expired or the code mistyped.</p>
        <div className="mt-5 flex justify-center gap-2">
          <button onClick={() => navigate("/join")} className="rounded-xl bg-white/10 px-5 py-2.5 text-sm font-bold">Join with code</button>
          <button onClick={() => navigate("/")} className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-slate-900">Home</button>
        </div>
      </div>
    </div>
  )
}
