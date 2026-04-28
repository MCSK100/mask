import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import CyberButton from "./CyberButton"
import { isEnabled } from "../config/featureFlags"

export default function Hero() {
  const navigate = useNavigate()
  const growthEnabled = isEnabled('ENABLE_HERO_GROWTH')

  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center text-center px-4 py-10 sm:px-6">

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-6 text-3xl font-bold leading-tight sm:text-5xl md:text-7xl"
      >
        Talk to Strangers Instantly
        <br />
        <span className="text-purple-500">Shadowchaty</span>
      </motion.h1>

      {/* Subtitl1e */}
      <p className="mb-8 max-w-xl text-sm text-gray-400 sm:mb-10 sm:text-base">
        {growthEnabled
          ? "Late night ah? Feeling bored? Start a random chat now — no signup needed."
          : "Meet strangers worldwide through secure anonymous chat and video. No signup. No identity. Just real conversations."
        }
      </p>

      {/* Micro Hooks */}
      {growthEnabled && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 sm:text-sm"
        >
          <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/20 bg-cyan-950/30 px-3 py-1">
            ⚡ Instant match
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-fuchsia-500/20 bg-fuchsia-950/30 px-3 py-1">
            🕶️ Anonymous
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-950/30 px-3 py-1">
            🔒 Secure
          </span>
        </motion.div>
      )}

      {/* Buttons */}
      <div className="grid w-full max-w-lg grid-cols-1 gap-3 sm:flex sm:w-auto sm:max-w-none sm:flex-wrap sm:justify-center sm:gap-4">
        <CyberButton onClick={() => navigate("/chat")} fullWidth>
          {growthEnabled ? "Start Chatting Now 🚀" : "Text Chat"}
        </CyberButton>

        <CyberButton onClick={() => navigate("/video")} fullWidth>
          {growthEnabled ? "Try Video Chat 🎥" : "Video Chat"}
        </CyberButton>
      </div>

    </section>

  )
}
