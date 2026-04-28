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
  <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
      <div>
        <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
          What is <span className="text-purple-500">Shadowchaty</span> Chat?
        </h2>
        <p className="text-lg text-slate-300 leading-relaxed mb-8">
          Shadowchaty is a free random video chat platform where you can talk to strangers worldwide.
          It works similar to Omegle but with a modern interface and better experience.
        </p>
        {/* <div className="flex flex-wrap gap-3">
          <CyberButton onClick={() => navigate("/chat")}>
            Start Text Chat
          </CyberButton>
          <CyberButton onClick={() => navigate("/video")}>
            Try Video Chat
          </CyberButton>
        </div> */}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-6 backdrop-blur-sm">
          <div className="mb-3 text-3xl">🌍</div>
          <h3 className="font-semibold text-white mb-2">Global Connections</h3>
          <p className="text-sm text-slate-400">Meet people from every corner of the world instantly.</p>
        </div>
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-6 backdrop-blur-sm">
          <div className="mb-3 text-3xl">🚀</div>
          <h3 className="font-semibold text-white mb-2">Zero Setup</h3>
          <p className="text-sm text-slate-400">No downloads, no signup. Open and chat immediately.</p>
        </div>
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-6 backdrop-blur-sm">
          <div className="mb-3 text-3xl">💬</div>
          <h3 className="font-semibold text-white mb-2">Text & Video</h3>
          <p className="text-sm text-slate-400">Switch between text chat and video chat anytime.</p>
        </div>
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-6 backdrop-blur-sm">
          <div className="mb-3 text-3xl">🛡️</div>
          <h3 className="font-semibold text-white mb-2">Private & Safe</h3>
          <p className="text-sm text-slate-400">End-to-end encrypted connections. No logs kept.</p>
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

    <div className="mt-12 text-center">
      <p className="text-slate-400 mb-6 max-w-xl mx-auto">
        Whether you want to make new friends, have fun conversations, or simply pass time, 
        Shadowchaty makes it easy. Start chatting without any registration.
      </p>
      <div className="flex flex-wrap justify-center gap-5">
        <CyberButton onClick={() => navigate("/chat")}>
          Start Chatting Now
        </CyberButton>
        <CyberButton onClick={() => navigate("/video")}>
          Video Chat
        </CyberButton>
      </div>
    </div>
  </section>

  <SiteFooter />
  </div>
  </>
  )
}
