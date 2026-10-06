import { useEffect, useRef } from "react"

const TOON_IMAGES = [
  { src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png", bg: "#F4845F", label: "Live Video" },
  { src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png", bg: "#6BBF7A", label: "Classroom" },
  { src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png", bg: "#E882B4", label: "Watch Party" },
  { src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png", bg: "#6EB5FF", label: "Whiteboard" },
]

function preloadToons() {
  TOON_IMAGES.forEach(({ src }) => {
    const im = new Image()
    im.src = src
  })
}

/**
 * Decorative floating 3D character for body sections.
 * - Outer wrapper handles scroll parallax (rAF, translate3d).
 * - Inner image idles with a gentle bob (CSS keyframes, no JS conflict).
 * - `active` crossfades between the 4 characters (650ms, spec easing).
 * - Purely decorative: aria-hidden, pointer-events none, desktop-only via CSS.
 */
export default function ToonFloat({
  active = 0,
  height = 300,
  speed = 0.06,
  glow = true,
  style,
  className = "",
}) {
  const wrapRef = useRef(null)

  useEffect(() => {
    preloadToons()
  }, [])

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    let raf = 0
    const render = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const viewportCenter = window.innerHeight / 2
      const elCenter = r.top + r.height / 2
      el.style.transform = `translate3d(0, ${(elCenter - viewportCenter) * speed}px, 0)`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(render)
    }
    render()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [speed])

  const current = TOON_IMAGES[((active % 4) + 4) % 4]

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={`toon-float ${className}`}
      style={{ position: "absolute", pointerEvents: "none", zIndex: 1, willChange: "transform", ...style }}
    >
      {glow && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: "-18%",
            background: `radial-gradient(closest-side, ${current.bg}66, transparent 70%)`,
            filter: "blur(28px)",
            transition: "background 650ms cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      )}
      <div style={{ position: "relative", height, aspectRatio: "0.6 / 1" }}>
        {TOON_IMAGES.map((item, i) => (
          <img
            key={item.src}
            src={item.src}
            alt=""
            aria-hidden
            draggable={false}
            className="toon-bob"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "bottom center",
              filter: "drop-shadow(0 24px 28px rgba(0,0,0,.35))",
              opacity: i === ((active % 4) + 4) % 4 ? 1 : 0,
              transition: "opacity 650ms cubic-bezier(0.4,0,0.2,1)",
              animationDelay: `${i * -1.3}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
