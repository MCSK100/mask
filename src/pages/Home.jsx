import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import ParticlesBG from "../components/ParticlesBG"
import SiteFooter from "../components/SiteFooter"
import CyberButton from "../components/CyberButton"

export default function Home(){
  const navigate = useNavigate()

  return(
  <>
  <ParticlesBG/>
  <div className="relative flex min-h-screen flex-col">

  <Navbar/>

  <Hero/>

  {/* Feature Cards */}
  <section className="flex w-full justify-center px-4 pb-10 pt-4 sm:px-8 md:px-10">
  <div className="grid w-full max-w-5xl justify-items-center gap-6 md:grid-cols-3 md:gap-8">

  <div className="group relative w-full max-w-sm p-[1px] rounded-2xl bg-gradient-to-r from-purple-500/40 via-pink-500/30 to-indigo-500/40 hover:scale-105 transition duration-300">
  <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl text-center border border-white/10">
  <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-purple-400 transition">
  ⚡ Instant Match
  </h3>
  <p className="text-gray-400">
  Connect instantly with random strangers worldwide.
  </p>
  </div>
  </div>

  <div className="group relative w-full max-w-sm p-[1px] rounded-2xl bg-gradient-to-r from-purple-500/40 via-pink-500/30 to-indigo-500/40 hover:scale-105 transition duration-300">
  <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl text-center border border-white/10">
  <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-purple-400 transition">
  🎭 Anonymous
  </h3>
  <p className="text-gray-400">
  No account required. Stay completely anonymous.
  </p>
  </div>
  </div>

  <div className="group relative w-full max-w-sm p-[1px] rounded-2xl bg-gradient-to-r from-purple-500/40 via-pink-500/30 to-indigo-500/40 hover:scale-105 transition duration-300">
  <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl text-center border border-white/10">
  <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-purple-400 transition">
  🔒 Secure
  </h3>
  <p className="text-gray-400">
  Peer-to-peer WebRTC connection ensures privacy.
  </p>
  </div>
  </div>

  </div>
  </section>

  {/* What is Shadowchaty Chat? */}
  <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20 pointer-events-none" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
    
    <div className="relative grid gap-16 lg:grid-cols-2 lg:items-center">
      <div className="space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-500" />
          </span>
          Trusted by 1M+ users
        </div>
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
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
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="group relative rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-2xl transition-transform group-hover:scale-110">
            🌍
          </div>
          <h3 className="font-semibold text-white mb-2 text-lg">Global Connections</h3>
          <p className="text-sm text-slate-400 leading-relaxed">Meet people from every corner of the world instantly.</p>
        </div>
        
        <div className="group relative rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 backdrop-blur-xl transition-all duration-300 hover:border-pink-500/40 hover:shadow-lg hover:shadow-pink-500/10 hover:-translate-y-1">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-2xl transition-transform group-hover:scale-110">
            🚀
          </div>
          <h3 className="font-semibold text-white mb-2 text-lg">Zero Setup</h3>
          <p className="text-sm text-slate-400 leading-relaxed">Install as an app or open in browser. No signup. Chat immediately.</p>
        </div>
        
        <div className="group relative rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-2xl transition-transform group-hover:scale-110">
            💬
          </div>
          <h3 className="font-semibold text-white mb-2 text-lg">Text & Video</h3>
          <p className="text-sm text-slate-400 leading-relaxed">Switch between text chat and video chat anytime.</p>
        </div>
        
        <div className="group relative rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-2xl transition-transform group-hover:scale-110">
            🛡️
          </div>
          <h3 className="font-semibold text-white mb-2 text-lg">Private & Safe</h3>
          <p className="text-sm text-slate-400 leading-relaxed">End-to-end encrypted connections. No logs kept.</p>
        </div>
      </div>
    </div>
  </section>

  {/* Free Random Video Chat with Strangers */}
  <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
        Free Random Video Chat with Strangers
      </h2>
      <p className="text-lg text-slate-400 max-w-2xl mx-auto">
        Looking for an Omegle alternative? Shadowchaty provides a modern, fast, and secure way to connect with strangers.
      </p>
    </div>
    
    <div className="grid gap-6 md:grid-cols-3">
      <div className="group relative rounded-2xl border border-slate-700/50 bg-gradient-to-b from-slate-900/60 to-slate-900/30 p-8 text-center backdrop-blur-sm hover:border-purple-500/30 transition">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-purple-500/10 text-2xl">
          ⚡
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Lightning Fast</h3>
        <p className="text-sm text-slate-400">Connect in under 3 seconds. No waiting, no buffering.</p>
      </div>
      
      <div className="group relative rounded-2xl border border-slate-700/50 bg-gradient-to-b from-slate-900/60 to-slate-900/30 p-8 text-center backdrop-blur-sm hover:border-purple-500/30 transition">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-purple-500/10 text-2xl">
          🎭
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">100% Anonymous</h3>
        <p className="text-sm text-slate-400">No personal info needed. Your identity stays hidden.</p>
      </div>
      
      <div className="group relative rounded-2xl border border-slate-700/50 bg-gradient-to-b from-slate-900/60 to-slate-900/30 p-8 text-center backdrop-blur-sm hover:border-purple-500/30 transition">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-purple-500/10 text-2xl">
          📱
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Works Everywhere</h3>
        <p className="text-sm text-slate-400">Desktop, tablet, or mobile. Fully responsive design.</p>
      </div>
    </div>
  </section>

  <SiteFooter />
  </div>
  </>
  )
}
