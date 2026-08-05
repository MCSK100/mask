import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import ParticlesBG from "../components/ParticlesBG"
import SiteFooter from "../components/SiteFooter"
import { CircularCarousel } from "../components/ui/circular-carousel"
import ParallaxSection from "../components/ui/ParallaxSection"
import TiltCard from "../components/ui/TiltCard"
import MarqueeBand from "../components/ui/MarqueeBand"

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
}

const featureCards = [
  {
    icon: "⚡",
    title: "Instant Match",
    desc: "Connect instantly with random strangers worldwide.",
  },
  {
    icon: "🎭",
    title: "Anonymous",
    desc: "No account required. Stay completely anonymous.",
  },
  {
    icon: "🔒",
    title: "Secure",
    desc: "Peer-to-peer WebRTC connection ensures privacy.",
  },
]

const bandItems = [
  "Anonymous",
  "Instant",
  "Secure",
  "Global",
  "No Signup",
  "WebRTC",
  "Private",
  "Encrypted",
]

const videoFeatures = [
  {
    icon: "⚡",
    title: "Lightning Fast",
    desc: "Connect in under 3 seconds. No waiting, no buffering.",
  },
  {
    icon: "🎭",
    title: "100% Anonymous",
    desc: "No personal info needed. Your identity stays hidden.",
  },
  {
    icon: "📱",
    title: "Works Everywhere",
    desc: "Desktop, tablet, or mobile. Fully responsive design.",
  },
]

export default function Home(){
  const navigate = useNavigate()

  return(
  <>
  <ParticlesBG/>
  <div className="relative flex min-h-screen flex-col">

  <Navbar/>

  <Hero/>

  {/* Marquee band */}
  <MarqueeBand items={bandItems} duration={30} />

  {/* Feature Cards */}
  <ParallaxSection speed={60} className="py-20">
    <section className="flex w-full justify-center px-4 pb-10 pt-4 sm:px-8 md:px-10">
      <div className="grid w-full max-w-5xl justify-items-center gap-6 md:grid-cols-3 md:gap-8">
        {featureCards.map((card, i) => (
          <motion.div
            key={card.title}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="w-full max-w-sm"
          >
            <TiltCard className="h-full">
              <div className="group relative h-full w-full rounded-2xl p-[1px] bg-gradient-to-r from-purple-500/40 via-pink-500/30 to-indigo-500/40 transition duration-300">
                <div className="h-full bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl text-center border border-white/10">
                  <div className="mb-4 text-4xl">{card.icon}</div>
                  <h3 className="font-display text-xl font-semibold mb-3 text-white group-hover:text-purple-400 transition">
                    {card.title}
                  </h3>
                  <p className="text-gray-400">{card.desc}</p>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </section>
  </ParallaxSection>

  {/* What is Shadowchaty Chat? */}
  <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20 pointer-events-none" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

    <div className="relative grid gap-16 lg:grid-cols-2 lg:items-center">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
        className="space-y-8"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-500" />
          </span>
          Trusted by 1M+ users
        </div>
        <div>
          <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            What is <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">Shadowchaty</span> Chat?
          </h2>
        </div>
        <p className="text-lg text-slate-300/90 leading-relaxed max-w-xl">
          Shadowchaty is a free random video chat platform where you can talk to strangers worldwide.
          It works similar to Omegle but with a modern interface and better experience.
        </p>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigate("/video")}
            className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-purple-500/40 hover:scale-105"
          >
            Try Video Chat
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <button
            onClick={() => navigate("/chat")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-800/50 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all hover:border-purple-500/50 hover:bg-slate-800"
          >
            Start Text Chat
          </button>
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
        custom={1}
        className="flex items-center justify-center"
      >
        <CircularCarousel
          items={[
            {
              id: "global",
              title: "Global Connections",
              description: "Meet people from every corner of the world instantly.",
              tag: "Worldwide",
            },
            {
              id: "zero",
              title: "Zero Setup",
              description: "Install as an app or open in browser. No signup. Chat immediately.",
              tag: "Instant",
            },
            {
              id: "text-video",
              title: "Text & Video",
              description: "Switch between text chat and video chat anytime.",
              tag: "Omnichannel",
            },
            {
              id: "private",
              title: "Private & Safe",
              description: "End-to-end encrypted connections. No logs kept.",
              tag: "Encrypted",
            },
          ]}
          autoPlay
        />
      </motion.div>
    </div>
  </section>

  {/* Free Random Video Chat with Strangers */}
  <ParallaxSection speed={80} className="py-16">
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
        className="text-center mb-12"
      >
        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl mb-4">
          Free Random Video Chat with Strangers
        </h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Looking for an Omegle alternative? Shadowchaty provides a modern, fast, and secure way to connect with strangers.
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        {videoFeatures.map((feature, i) => (
          <motion.div
            key={feature.title}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
          >
            <TiltCard className="h-full" maxTilt={10}>
              <div className="group relative h-full rounded-2xl border border-slate-700/50 bg-gradient-to-b from-slate-900/60 to-slate-900/30 p-8 text-center backdrop-blur-sm hover:border-purple-500/30 transition">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-purple-500/10 text-2xl">
                  {feature.icon}
                </div>
                <h3 className="font-display text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.desc}</p>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </section>
  </ParallaxSection>

  <SiteFooter />
  </div>
  </>
  )
}
