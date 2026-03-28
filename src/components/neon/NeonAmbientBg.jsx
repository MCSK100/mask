/** Subtle cyberpunk ambient layer — pointer-events none */
export default function NeonAmbientBg() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(88,28,135,0.35),transparent_50%),radial-gradient(ellipse_80%_50%_at_100%_50%,rgba(14,116,144,0.2),transparent_45%),radial-gradient(ellipse_60%_40%_at_0%_80%,rgba(157,23,77,0.15),transparent_40%)]" />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(rgba(168,85,247,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,0.3) 1px, transparent 1px)`,
          backgroundSize: "48px 48px"
        }}
      />
      <div className="absolute -left-1/4 top-1/4 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-[100px]" />
      <div className="absolute -right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-cyan-500/15 blur-[90px]" />
    </div>
  )
}
