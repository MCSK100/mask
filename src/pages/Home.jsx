import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import ParticlesBG from "../components/ParticlesBG"
import { useState } from "react"
import { normalizeCode } from "../utils/meetingCode"

function MockRoom() {
  const tiles = [
    { n: "Aarav · Teacher", host: true, c: "from-indigo-500/40 to-fuchsia-500/30" },
    { n: "Mia", c: "from-sky-500/40 to-indigo-500/30" },
    { n: "Leo", c: "from-emerald-500/40 to-teal-500/30" },
    { n: "Zara", c: "from-amber-500/40 to-pink-500/30" }
  ]
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 p-3 shadow-2xl backdrop-blur-xl">
      <div className="mb-2 flex items-center justify-between px-1 text-[11px] text-slate-400">
        <span className="flex items-center gap-2"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> React Beginners · RX82KP · 04:12</span>
        <span>👥 12</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {tiles.map((t) => (
          <motion.div key={t.n} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className={`relative h-28 overflow-hidden rounded-2xl bg-gradient-to-br sm:h-36 ${t.c}`}>
            <div className="absolute inset-0 grid place-items-center text-2xl font-bold text-white/80">{t.n.slice(0, 1)}</div>
            <div className="absolute bottom-1.5 left-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] text-white">{t.n}{t.host && " · HOST"}</div>
            <div className="absolute right-1.5 top-1.5 text-[10px]">🎙️</div>
          </motion.div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-[1fr_120px] gap-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">Whiteboard · live</p>
          <svg viewBox="0 0 200 60" className="mt-1 h-12 w-full"><path d="M5 50 Q 40 5 70 30 T 130 25 T 195 40" stroke="#a78bfa" strokeWidth="3" fill="none" strokeLinecap="round" /><circle cx="150" cy="18" r="8" stroke="#34d399" fill="none" strokeWidth="3" /></svg>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-2 text-[10px] text-slate-300">
          <p className="font-bold text-slate-200">💬 Chat</p>
          <p className="mt-1 truncate">Mia: this is clear ✨</p>
          <p className="truncate text-slate-500">Leo: +1</p>
          <p className="mt-1 rounded bg-red-500/20 px-1 text-red-200">▶ Now: intro.mp4</p>
        </div>
      </div>
      <div className="mx-auto mt-3 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-sm">
        <span>🎙️</span><span>📹</span><span className="rounded-full bg-indigo-500 px-2 text-xs font-bold text-white">Present</span><span>✏️</span><span>💬</span><span className="rounded-full bg-red-600 px-2 text-xs font-bold">Leave</span>
      </div>
    </div>
  )
}

const FEATURES = [
  ["🎥", "Live Video", "Adaptive grid for 1–16+ people with active-speaker glow."],
  ["🎙️", "Voice", "Crystal WebRTC audio with mute controls and reconnection."],
  ["🖥️", "Screen Share", "Present tab, window or full screen in one click."],
  ["🧑‍🏫", "Classroom", "Teacher stage, student badges, hand-raise and polls."],
  ["✏️", "Whiteboard", "Real-time canvas with shapes, text and PNG export."],
  ["💬", "Chat", "Room chat with replies, system events and /commands."],
  ["▶️", "YouTube Together", "Host-synced watch parties with queue-ready state."],
  ["🎵", "Music Room", "Share audio links and stay in sync (rights-respecting)."],
  ["📊", "Polls", "Live polls with instant results for classes and teams."],
  ["✋", "Raise Hand", "Orderly Q&A without interrupting the speaker."],
  ["📡", "Live Ready", "Architecture prepared for RTMP/YouTube/Twitch."],
  ["🔒", "Private by design", "Codes, passwords, locks, waiting room, host tokens."]
]

export default function Home() {
  const navigate = useNavigate()
  const [code, setCode] = useState("")
  const quickJoin = (e) => {
    e?.preventDefault()
    const c = normalizeCode(code)
    if (c) navigate(`/meet/${c}`)
  }

  return (
    <div className="relative min-h-screen text-white">
      <ParticlesBG />
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6">
        <button onClick={() => navigate("/")} className="flex items-center gap-2.5" aria-label="ShadowMeet home">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-cyan-400 font-display text-sm font-bold">SM</span>
          <span className="font-display text-lg font-bold tracking-tight">ShadowMeet</span>
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/join")} className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white">Join</button>
          <button onClick={() => navigate("/create")} className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-900 hover:bg-slate-200">Create meeting</button>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <section className="grid items-center gap-10 py-10 lg:grid-cols-2 lg:py-16">
          <div>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> No account · No downloads · Free to start
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Your Meeting Room.<br />
              <span className="bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">Your Classroom.</span><br />
              Your Space.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }} className="mt-5 max-w-xl text-base text-slate-400 sm:text-lg">
              Meet, teach, collaborate and have fun — directly from your browser. Share your screen, draw together, watch YouTube and connect. No account. No downloads.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-7 flex flex-wrap gap-3">
              <button onClick={() => navigate("/create")} className="rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-7 py-3.5 font-bold shadow-lg shadow-fuchsia-500/25 transition hover:scale-[1.02]">Create Meeting</button>
              <button onClick={() => navigate("/join")} className="rounded-2xl border border-white/15 bg-white/5 px-7 py-3.5 font-bold backdrop-blur transition hover:bg-white/10">Join Meeting</button>
              <a href="#features" className="rounded-2xl px-5 py-3.5 text-sm font-semibold text-slate-300 hover:text-white">Explore Features ↓</a>
            </motion.div>
            <form onSubmit={quickJoin} className="mt-5 flex max-w-md gap-2">
              <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Enter code (e.g. AB7K92)" aria-label="Meeting code" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-mono tracking-[0.2em] placeholder:tracking-normal placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-400" maxLength={10} />
              <button className="rounded-xl bg-white/10 px-5 font-bold hover:bg-white/15">Join →</button>
            </form>
            <p className="mt-3 text-xs text-slate-500">Start a meeting in seconds. Click → Create → Share → Meet.</p>
          </div>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.7 }}>
            <MockRoom />
            <div className="mt-3 flex flex-wrap justify-center gap-1.5 text-[11px] text-slate-400">
              {["LIVE", "HD", "P2P", "Encrypted", "No signup"].map((t) => (
                <span key={t} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">{t}</span>
              ))}
            </div>
          </motion.div>
        </section>

        <section id="features" className="py-10">
          <h2 className="text-center font-display text-2xl font-bold sm:text-3xl">Everything you need to meet, teach and play</h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-slate-400">One link for meetings, classes, study rooms and watch parties. Built for small rooms first, with a clean path to SFU for scale.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {FEATURES.map(([icon, title, desc]) => (
              <div key={title} className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur transition hover:border-fuchsia-400/30 hover:bg-white/[0.05]">
                <div className="text-2xl">{icon}</div>
                <h3 className="mt-2 font-semibold text-white">{title}</h3>
                <p className="mt-1 text-sm text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-10">
          <div className="grid gap-4 md:grid-cols-3">
            {[["Meeting", "Daily standups and team syncs.", "/create"], ["Classroom", "Teach with board, polls and hands.", "/create"], ["Watch Party", "YouTube together, perfectly synced.", "/create"]].map(([t, d]) => (
              <button key={t} onClick={() => navigate("/create")} className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-6 text-left transition hover:border-indigo-400/40">
                <p className="font-display text-lg font-bold">{t}</p>
                <p className="mt-1 text-sm text-slate-400">{d}</p>
                <p className="mt-3 text-sm font-bold text-indigo-300">Start →</p>
              </button>
            ))}
          </div>
        </section>

        <section className="pb-16 pt-4 text-center">
          <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/15 via-fuchsia-500/10 to-cyan-500/10 p-8 sm:p-12">
            <h2 className="font-display text-2xl font-bold sm:text-4xl">Start a meeting in seconds.</h2>
            <p className="mt-2 text-slate-400">Free-first. P2P for small rooms. No signup, ever.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button onClick={() => navigate("/create")} className="rounded-2xl bg-white px-7 py-3 font-bold text-slate-900">Create Meeting</button>
              <button onClick={() => navigate("/join")} className="rounded-2xl border border-white/15 px-7 py-3 font-bold">Join with code</button>
            </div>
          </div>
          <footer className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
            <span>© 2026 ShadowMeet</span>
            <button onClick={() => navigate("/privacy")}>Privacy</button>
            <button onClick={() => navigate("/terms")}>Terms</button>
            <button onClick={() => navigate("/about")}>About</button>
          </footer>
        </section>
      </main>
    </div>
  )
}
