import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import CyberButton from "./CyberButton"

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
        <span className="mr-2">🌙</span>
        12 PM Night Chat
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mb-3 max-w-xl text-sm text-gray-400 sm:text-base"
      >
        Every night at 12, strangers come online to chat anonymously.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8 max-w-xl text-sm text-gray-400 sm:text-base"
      >
        No login. Just real late-night conversations.
      </motion.p>

      {/* Hook */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mb-6 max-w-xl text-lg font-bold italic text-white sm:text-2xl"
      >
        Feeling bored? Can&rsquo;t sleep? Need someone to talk to?
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mb-8 max-w-xl text-base font-semibold text-purple-400 sm:text-lg"
      >
        Join the midnight chat now.
      </motion.p>

      {/* Micro Hooks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.55 }}
        className="mb-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 sm:text-sm"
      >
        <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/20 bg-cyan-950/30 px-3 py-1">
          💬 Talk with strangers online
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-fuchsia-500/20 bg-fuchsia-950/30 px-3 py-1">
          🌍 Meet people worldwide
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-950/30 px-3 py-1">
          🔒 Stay anonymous
        </span>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.65 }}
        className="grid w-full max-w-xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5"
      >
        <CyberButton onClick={() => navigate("/chat")} fullWidth>
          💬 Text Chat
        </CyberButton>

        <CyberButton onClick={() => navigate("/video")} fullWidth>
          🎥 Video Chat
        </CyberButton>
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
