import { motion } from "framer-motion"

export default function Hero() {
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
        className="mb-4 max-w-xl text-sm text-gray-400 sm:text-base"
      >
        Every night at 12. People from everywhere come online
        to talk with random strangers anonymously.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="mb-6 max-w-xl text-sm text-gray-400 sm:text-base"
      >
        No login. No identity. Just real late-night conversations.
      </motion.p>

      {/* Hook */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="mb-2 max-w-xl text-sm italic text-slate-300 sm:text-base"
      >
        Feeling bored? Can't sleep? Need someone to talk to?
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45 }}
        className="mb-8 max-w-xl text-sm font-medium text-purple-400 sm:text-base"
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
        className="flex w-full max-w-lg flex-col items-center gap-3"
      >
        <a
          href="https://shadowchaty.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="neon-cta group inline-flex items-center gap-3 rounded-xl px-8 py-4 font-black uppercase tracking-[0.25em] text-base sm:px-12 sm:py-5 sm:text-2xl"
        >
          <span>Enter ShadowChat</span>
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110">
            →
          </span>
        </a>
        <span className="text-xs font-medium tracking-widest text-cyan-400/70 uppercase sm:text-sm">
          shadowchaty.vercel.app
        </span>
      </motion.div>

    </section>

  )
}
