import { useCallback, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, ArrowRight, Video } from "lucide-react"

const IMAGES = [
  { src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png", bg: "#F4845F", panel: "#F79B7F", label: "Live Video" },
  { src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png", bg: "#6BBF7A", panel: "#85CC92", label: "Classroom" },
  { src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png", bg: "#E882B4", panel: "#ED9DC4", label: "Watch Party" },
  { src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png", bg: "#6EB5FF", panel: "#8DC4FF", label: "Whiteboard" },
]

const EASE = "cubic-bezier(0.4,0,0.2,1)"
const DURATION = 650

const GRAIN_URI = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`

function roleStyle(role, isMobile) {
  const base = {
    position: "absolute",
    aspectRatio: "0.6 / 1",
    transition: `transform ${DURATION}ms ${EASE}, filter ${DURATION}ms ${EASE}, opacity ${DURATION}ms ${EASE}, left ${DURATION}ms ${EASE}`,
    willChange: "transform, filter, opacity",
  }
  if (role === "center") {
    return {
      ...base,
      transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
      filter: "blur(0px)",
      opacity: 1,
      zIndex: 20,
      left: "50%",
      height: isMobile ? "60%" : "92%",
      bottom: isMobile ? "22%" : 0,
    }
  }
  if (role === "left") {
    return {
      ...base,
      transform: "translateX(-50%) scale(1)",
      filter: "blur(2px)",
      opacity: 0.85,
      zIndex: 10,
      left: isMobile ? "20%" : "30%",
      height: isMobile ? "16%" : "28%",
      bottom: isMobile ? "32%" : "12%",
    }
  }
  if (role === "right") {
    return {
      ...base,
      transform: "translateX(-50%) scale(1)",
      filter: "blur(2px)",
      opacity: 0.85,
      zIndex: 10,
      left: isMobile ? "80%" : "70%",
      height: isMobile ? "16%" : "28%",
      bottom: isMobile ? "32%" : "12%",
    }
  }
  return {
    ...base,
    transform: "translateX(-50%) scale(1)",
    filter: "blur(4px)",
    opacity: 1,
    zIndex: 5,
    left: "50%",
    height: isMobile ? "13%" : "22%",
    bottom: isMobile ? "32%" : "12%",
  }
}

export default function ToonHero() {
  const navigate = useNavigate()
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(() => (typeof window !== "undefined" ? window.innerWidth < 640 : false))
  const lockRef = useRef(false)
  const touchX = useRef(null)

  useEffect(() => {
    IMAGES.forEach(({ src }) => {
      const im = new Image()
      im.src = src
    })
  }, [])

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const navigateTo = useCallback((dir) => {
    if (lockRef.current) return
    lockRef.current = true
    setActiveIndex((prev) => (dir === "next" ? (prev + 1) % 4 : (prev + 3) % 4))
    window.setTimeout(() => {
      lockRef.current = false
    }, DURATION)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") navigateTo("next")
      if (e.key === "ArrowLeft") navigateTo("prev")
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [navigateTo])

  const center = activeIndex
  const left = (activeIndex + 3) % 4
  const right = (activeIndex + 1) % 4
  const roleOf = (i) => (i === center ? "center" : i === left ? "left" : i === right ? "right" : "back")

  const active = IMAGES[activeIndex]

  return (
    <div
      style={{
        backgroundColor: active.bg,
        transition: `background-color ${DURATION}ms ${EASE}`,
        fontFamily: "'Inter', sans-serif",
      }}
      className="relative w-full overflow-hidden"
    >
      <div className="relative w-full" style={{ height: "100vh", overflow: "hidden" }}>
        {/* SEO H1 — visually hidden, keeps one keyword H1 on the page */}
        <h1 className="sr-only">OneSpace Live — no-signup video meetings, live classes and watch parties</h1>

        {/* 1. Grain overlay */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 50, opacity: 0.4, backgroundImage: GRAIN_URI, backgroundSize: "200px 200px", backgroundRepeat: "repeat" }}
        />

        {/* 2. Giant ghost text */}
        <div
          aria-hidden
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none"
          style={{ zIndex: 2, top: "18%" }}
        >
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(90px, 28vw, 380px)",
              fontWeight: 900,
              color: "#fff",
              opacity: 1,
              lineHeight: 1,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
            }}
          >
            ONE SPACE
          </span>
        </div>

        {/* 3. Top bar: brand + CTA */}
        <div className="absolute top-6 left-4 sm:left-8" style={{ zIndex: 60 }}>
          <p className="text-xs font-semibold uppercase text-white" style={{ opacity: 0.9, letterSpacing: "0.18em" }}>
            ONESPACE&nbsp;LIVE
          </p>
        </div>
        <div className="absolute top-5 right-4 sm:right-8" style={{ zIndex: 60 }}>
          <button
            type="button"
            onClick={() => navigate("/create")}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-black transition hover:scale-105 sm:px-5 sm:py-2.5 sm:text-sm"
          >
            <Video size={16} /> Meet Now
          </button>
        </div>

        {/* 4. Carousel */}
        <div
          className="absolute inset-0"
          style={{ zIndex: 3 }}
          onTouchStart={(e) => {
            touchX.current = e.touches[0].clientX
          }}
          onTouchEnd={(e) => {
            if (touchX.current == null) return
            const dx = e.changedTouches[0].clientX - touchX.current
            if (dx < -40) navigateTo("next")
            else if (dx > 40) navigateTo("prev")
            touchX.current = null
          }}
        >
          {IMAGES.map((item, i) => (
            <div key={item.src} style={roleStyle(roleOf(i), isMobile)}>
              <img
                src={item.src}
                alt={i === center ? `OneSpace Live — ${item.label} 3D visual` : ""}
                aria-hidden={i !== center}
                width="100%"
                height="100%"
                draggable={false}
                style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "bottom center" }}
              />
            </div>
          ))}
        </div>

        {/* Active-mode pill */}
        <div className="absolute left-1/2 top-[13%] -translate-x-1/2 sm:top-[15%]" style={{ zIndex: 60 }}>
          <span
            key={activeIndex}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white sm:text-xs"
            style={{ backgroundColor: "rgba(0,0,0,0.28)", backdropFilter: "blur(6px)" }}
          >
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-white" />
            {active.label}
          </span>
        </div>

        {/* 5. Bottom-left text + nav */}
        <div className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24" style={{ zIndex: 60, maxWidth: "320px" }}>
          <p
            className="mb-2 font-bold uppercase text-white sm:mb-3 sm:text-[22px]"
            style={{ letterSpacing: "0.02em", opacity: 0.95, fontSize: "16px" }}
          >
            ONESPACE LIVE ROOMS
          </p>
          <p className="mb-4 hidden text-xs text-white sm:mb-5 sm:block sm:text-sm" style={{ opacity: 0.85, lineHeight: 1.6 }}>
            No-signup video meetings, live classes, whiteboard and watch parties — one fast room, right in your
            browser. Pick a vibe, hit Meet Now.
          </p>
          <div className="mb-3 flex items-center gap-2 sm:mb-4">
            <button
              type="button"
              onClick={() => navigate("/create")}
              className="rounded-full bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-black transition hover:scale-105 sm:text-sm"
            >
              Meet Now
            </button>
            <button
              type="button"
              onClick={() => navigate("/join")}
              className="rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition hover:scale-105 sm:text-sm"
              style={{ border: "2px solid #fff" }}
            >
              Join
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Previous visual"
              onClick={() => navigateTo("prev")}
              className="grid h-12 w-12 place-items-center rounded-full text-white transition sm:h-16 sm:w-16"
              style={{ backgroundColor: "transparent", border: "2px solid #fff" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.08)"
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)"
                e.currentTarget.style.backgroundColor = "transparent"
              }}
            >
              <ArrowLeft size={26} strokeWidth={2.25} />
            </button>
            <button
              type="button"
              aria-label="Next visual"
              onClick={() => navigateTo("next")}
              className="grid h-12 w-12 place-items-center rounded-full text-white transition sm:h-16 sm:w-16"
              style={{ backgroundColor: "transparent", border: "2px solid #fff" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.08)"
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)"
                e.currentTarget.style.backgroundColor = "transparent"
              }}
            >
              <ArrowRight size={26} strokeWidth={2.25} />
            </button>
          </div>
        </div>

        {/* 6. Bottom-right link */}
        <div className="absolute bottom-6 right-4 sm:bottom-20 sm:right-10" style={{ zIndex: 60 }}>
          <a
            href="/create"
            className="flex items-center text-white"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(20px, 4vw, 56px)",
              fontWeight: 400,
              opacity: 0.95,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "opacity 200ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "1"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "0.95"
            }}
          >
            START&nbsp;NOW
            <ArrowRight className="ml-2 h-5 w-5 sm:h-8 sm:w-8" strokeWidth={2.25} />
          </a>
        </div>
      </div>
    </div>
  )
}
