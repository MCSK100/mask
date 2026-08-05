/**
 * MarqueeBand
 * An infinite scrolling marquee strip used as an immersive band between sections.
 * Provide `items` (array of strings) and an optional `duration` (seconds) for speed.
 */
export default function MarqueeBand({
  items = [],
  duration = 28,
  className = "",
}) {
  // Repeat items twice so the -50% translate loops seamlessly.
  const doubled = [...items, ...items];

  return (
    <div
      className={`marquee-paused relative overflow-hidden border-y border-white/10 bg-white/[0.02] py-5 ${className}`}
      style={{ "--marquee-duration": `${duration}s` }}
      aria-hidden
    >
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#020617] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#020617] to-transparent" />

      <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-10 text-sm font-semibold uppercase tracking-[0.3em] text-white/40"
          >
            {item}
            <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
