import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center text-center px-4 py-10 sm:px-6">

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-6 text-3xl font-bold leading-tight sm:text-5xl md:text-7xl"
      >
        Connect. Chat. Stay Anonymous.
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
        ShadowChat is a modern anonymous chat platform designed for people who value privacy and authentic connections. Join instantly, chat freely, and meet new people without revealing your identity.
      </motion.p>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.65 }}
        className="w-full max-w-xl"
      >
        <button
          type="button"
          onClick={() => navigate("/chat")}
          className="cta-btn"
        >
          <span>Start Chat</span>
          <span className="cta-arrow">→</span>
        </button>
      </motion.div>

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-2 text-xs font-medium tracking-widest text-slate-500 uppercase sm:text-sm"
      >
        shadowchaty.vercel.app
      </motion.span>

    </section>

  )
}
