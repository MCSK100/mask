import { useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { ShieldCheck, Zap, Lock } from "lucide-react"

export default function Hero() {
  const navigate = useNavigate()
  const sectionRef = useRef(null)

  // Mouse-move parallax values
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const springX = useSpring(mx, { stiffness: 60, damping: 20 })
  const springY = useSpring(my, { stiffness: 60, damping: 20 })

  // Depth offsets for layered parallax
  const layer1X = useTransform(springX, (v) => v * 30)
  const layer1Y = useTransform(springY, (v) => v * 22)
  const layer2X = useTransform(springX, (v) => v * -22)
  const layer2Y = useTransform(springY, (v) => v * -16)
  const layer3X = useTransform(springX, (v) => v * 14)
  const layer3Y = useTransform(springY, (v) => v * 10)

  const handleMouseMove = (e) => {
    const rect = sectionRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mx.set(x)
    my.set(y)
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-[100vh] flex-col items-center justify-center overflow-hidden px-4 py-24 text-center sm:px-6 pt-28"
    >

      {/* Ambient gradient blobs */}
      <motion.div
        style={{ x: layer2X, y: layer2Y }}
        className="pointer-events-none absolute -left-24 top-24 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl"
      />
      <motion.div
        style={{ x: layer1X, y: layer1Y }}
        className="pointer-events-none absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl"
      />
      <motion.div
        style={{ x: layer3X, y: layer3Y }}
        className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-pink-600/15 blur-3xl"
      />

      {/* Floating decorative chips (3D depth) */}
      <motion.div
        style={{ x: layer3X, y: layer3Y, z: 40 }}
        className="pointer-events-none absolute left-[12%] top-[22%] hidden rotate-[-8deg] rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 backdrop-blur-md md:flex md:items-center md:gap-2 animate-float"
      >
        <ShieldCheck size={14} /> 100% Anonymous
      </motion.div>
      <motion.div
        style={{ x: layer2X, y: layer2Y, z: 60 }}
        className="pointer-events-none absolute right-[10%] top-[30%] hidden rotate-[6deg] rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 backdrop-blur-md md:flex md:items-center md:gap-2 animate-float"
      >
        <Zap size={14} /> Connect in 3s
      </motion.div>
      <motion.div
        style={{ x: layer1X, y: layer1Y, z: 80 }}
        className="pointer-events-none absolute bottom-[24%] left-[16%] hidden rotate-[4deg] rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 backdrop-blur-md md:flex md:items-center md:gap-2"
      >
        <Lock size={14} /> Encrypted
      </motion.div>

      {/* Eyebrow */}
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-purple-300 backdrop-blur-md sm:text-sm"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-500" />
        </span>
        Trusted by 1M+ users
      </motion.span>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="font-display mb-6 max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
      >
        Connect.
        <br />
        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
          Chat.
        </span>{" "}
        Stay Anonymous.
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mb-3 max-w-xl text-sm text-gray-400 sm:text-base"
      >
        Where Meaningful Conversations Begin.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8 max-w-xl text-sm text-gray-400 sm:text-base"
      >
        OneSpace Live is a modern no-signup video meeting platform designed for people who value speed and simplicity. Join instantly, meet freely, and collaborate without creating an account.
      </motion.p>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.65 }}
        className="flex w-full max-w-xl flex-col justify-center gap-4 sm:flex-row"
      >
        <button
          type="button"
          onClick={() => navigate("/video")}
          className="cta-btn"
        >
          <span>Video Chat</span>
          <span className="cta-arrow">→</span>
        </button>
        <button
          type="button"
          onClick={() => navigate("/chat")}
          className="cta-btn cta-btn-secondary"
        >
          <span>Text Chat</span>
          <span className="cta-arrow">→</span>
        </button>
      </motion.div>

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-6 text-xs font-medium uppercase tracking-widest text-slate-500 sm:text-sm"
      >
        onespace-live.vercel.app
      </motion.span>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="flex h-10 w-6 items-start justify-center rounded-full border border-white/20 p-1.5"
        >
          <div className="h-2 w-1 rounded-full bg-white/60" />
        </motion.div>
      </motion.div>
    </section>
  )
}
