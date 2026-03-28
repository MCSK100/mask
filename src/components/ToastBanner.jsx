export default function ToastBanner({ message, type = "info" }) {
  if (!message) return null

  const tone =
    type === "error"
      ? "border-rose-500/40 bg-rose-900/70 text-rose-100"
      : type === "success"
        ? "border-emerald-500/40 bg-emerald-900/70 text-emerald-100"
        : "border-cyan-500/40 bg-slate-900/80 text-cyan-100"

  return (
    <div className={`fixed right-3 top-3 z-50 rounded-xl border px-4 py-2 text-sm shadow-xl backdrop-blur ${tone}`}>
      {message}
    </div>
  )
}
