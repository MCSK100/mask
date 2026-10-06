import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Video, MonitorUp, PenTool, Play, BarChart3, Lock, ArrowRight, Check,
  Sparkles, Zap, Users, Clock, ShieldCheck
} from "lucide-react"
import { normalizeCode } from "../utils/meetingCode"
import Seo from "../components/Seo"
import ToonFloat from "../components/ToonFloats"
import "./Home.css"

const TOOLS = [
  { name: "Live Video", icon: Video, tag: "Crystal-clear faces, big and bright.", stat: "1080p · adaptive" },
  { name: "Screen Share", icon: MonitorUp, tag: "Share any tab in one click.", stat: "1-click · no plugins" },
  { name: "Whiteboard", icon: PenTool, tag: "Sketch together, strokes saved.", stat: "live · synced" },
  { name: "Watch Together", icon: Play, tag: "Press play at the same time.", stat: "YouTube · in sync" },
  { name: "Polls", icon: BarChart3, tag: "Answers in seconds, live results.", stat: "instant · realtime" },
  { name: "Private Rooms", icon: Lock, tag: "Codes, locks and host controls.", stat: "private · by design" },
]

const MODES = [
  {
    n: "01", title: "Instant meetings",
    copy: "No accounts, no downloads — share a code and the whole team is in within seconds.",
    bg: "#FFF3E8", accent: "#F4845F", toon: "/toons/toon-1.webp",
    chips: ["3-second join", "No download", "Host controls"],
    tags: ["1080p · adaptive", "4 here"], cta: "Create a room", to: "/create",
  },
  {
    n: "02", title: "Live classrooms",
    copy: "Teach on a stage with hand raises, live polls and a shared whiteboard.",
    bg: "#E4FAF4", accent: "#6BBF7A", toon: "/toons/toon-2.webp",
    chips: ["Stage + strip", "Raise hand", "Quizzes"],
    tags: ["HANDS UP · 2", "Polls · live"], cta: "Teach now", to: "/create",
  },
  {
    n: "03", title: "Watch parties",
    copy: "Press play at the same time — YouTube in sync, with chat and reactions on the side.",
    bg: "#FDEDF6", accent: "#E882B4", toon: "/toons/toon-3.webp",
    chips: ["YouTube in sync", "Live chat", "Reactions"],
    tags: ["IN SYNC", "Chat · live"], cta: "Start watching", to: "/create",
  },
]

const BENTO = [
  { tool: 0, span: "span-big", visual: "tiles", bg: "#f5f2ff" },
  { tool: 3, span: "span-wide", visual: "watch", bg: "#FFF3E8" },
  { tool: 2, span: "span-std", visual: "board", bg: "#E4FAF4" },
  { tool: 4, span: "span-std", visual: "polls", bg: "#ECE9FF" },
  { tool: 1, span: "span-wide", visual: "share", bg: "#FFF3E8" },
  { tool: 5, span: "span-wide", visual: "lock", bg: "#f5f2ff" },
]

const RIBBON = ["NO SIGNUP", "FREE TO START", "1080P VIDEO", "WHITEBOARD", "LIVE POLLS", "WATCH PARTY", "3-SECOND JOIN", "PRIVATE BY DESIGN"]

function BentoVisual({ kind }) {
  if (kind === "tiles") {
    const tiles = [
      { n: "A", c: "linear-gradient(135deg,#724aee,#2a166e)" },
      { n: "M", c: "linear-gradient(135deg,#ff8655,#b34a1f)" },
      { n: "J", c: "linear-gradient(135deg,#1c3a5a,#0a1626)" },
      { n: "Z", c: "linear-gradient(135deg,#12b899,#0a4a40)" },
    ]
    return (
      <div className="mini-tiles">
        {tiles.map((t) => (
          <div key={t.n} className="mini-tile" style={{ background: t.c }}><span>{t.n}</span></div>
        ))}
        <span className="mini-live">LIVE</span>
      </div>
    )
  }
  if (kind === "watch") {
    return (
      <div className="mini-watch">
        <span className="mini-play" aria-hidden><i /></span>
        <div className="mini-progress"><i style={{ width: "62%" }} /></div>
        <p>02:14 · In sync</p>
      </div>
    )
  }
  if (kind === "board") {
    return (
      <div className="mini-board">
        <svg viewBox="0 0 200 120"><path d="M10 100 Q 60 10 100 60 T 190 50" stroke="#724aee" strokeWidth="6" fill="none" strokeLinecap="round" /><circle cx="150" cy="35" r="14" stroke="#ff8655" fill="none" strokeWidth="6" /></svg>
      </div>
    )
  }
  if (kind === "polls") {
    return (
      <div className="mini-polls">
        {[["A", "78%"], ["B", "45%"], ["C", "62%"]].map(([o, w]) => (
          <div key={o} className="mini-poll-row"><span>{o}</span><div className="mini-poll-bar"><i style={{ width: w }} /></div></div>
        ))}
      </div>
    )
  }
  if (kind === "share") {
    return (
      <div className="mini-share">
        <div className="mini-browser"><i /><i /><i /><em>mia-s-screen · 1080p</em></div>
        <div className="mini-screen"><MonitorUp size={30} color="#724aee" /></div>
      </div>
    )
  }
  return (
    <div className="mini-lock">
      <span className="mini-lock-icon"><Lock size={26} color="#fff" /></span>
      <p className="mini-code">RX82KP</p>
    </div>
  )
}

function HeroRoom() {
  const tiles = [
    { n: "Aarav · Host", c: "linear-gradient(135deg,#724aee,#2a166e)", you: true },
    { n: "Mia", c: "linear-gradient(135deg,#724aee,#2a166e)" },
    { n: "Leo", c: "linear-gradient(135deg,#1c3a5a,#0a1626)" },
    { n: "Zara", c: "linear-gradient(135deg,#12b899,#0a4a40)" },
  ]
  return (
    <div className="wn-deck">
      <div className="wn-deck-stack" aria-hidden />
      <div className="wn-deck-top">
        <span className="wn-deck-dots"><i /><i /><i /></span>
        <span className="wn-deck-title">React Beginners · RX82KP</span>
        <span className="wn-deck-live">LIVE</span>
        <span className="wn-deck-count">4 here</span>
      </div>
      <div className="wn-deck-main">
        {tiles.map((t) => (
          <div key={t.n} className={`wn-tile ${t.you ? "you" : ""}`} style={{ background: t.c }}>
            <span className="wn-tile-scan" aria-hidden />
            <span className="wn-tile-initial">{t.n.slice(0, 1)}</span>
            <span className="wn-tile-tag">{t.n}{t.you ? " · YOU" : ""}</span>
            <span className={`wn-tile-mic ${t.you ? "on" : ""}`} aria-hidden />
          </div>
        ))}
      </div>
      <div className="wn-deck-bottom">
        <div className="wn-deck-panel board">
          <p>Whiteboard · Live</p>
          <svg viewBox="0 0 200 60"><path d="M5 50 Q 40 5 70 30 T 130 25 T 195 40" stroke="#724aee" strokeWidth="4" fill="none" strokeLinecap="square" /><rect x="142" y="10" width="16" height="16" stroke="#ff8655" fill="none" strokeWidth="4" /></svg>
        </div>
        <div className="wn-deck-panel chat">
          <p className="h">Chat</p>
          <p className="m"><strong>Mia:</strong> All clear</p>
          <p className="m"><strong>Leo:</strong> +1</p>
        </div>
        <div className="wn-deck-panel ctrl">
          <p className="h">Controls</p>
          <div className="wn-ctrl-row">
            <span className="k on">MIC</span>
            <span className="k on">CAM</span>
            <span className="k">SHARE</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [code, setCode] = useState("")
  const heroSecRef = useRef(null)
  const heroTiltRef = useRef(null)

  const quickJoin = (e) => {
    e?.preventDefault()
    const c = normalizeCode(code)
    if (c) navigate(`/meet/${c}`)
  }

  // cinematic hero: 3D tilt + scroll parallax + depth layers
  useEffect(() => {
    const sec = heroSecRef.current
    const tilt = heroTiltRef.current
    if (!sec || !tilt) return
    let raf = 0
    let tx = 0, ty = 0
    const render = () => {
      raf = 0
      const y = window.scrollY
      tilt.style.transform = `translateY(${y * 0.06}px) rotateX(${ty}deg) rotateY(${tx}deg)`
      sec.querySelectorAll("[data-depth]").forEach((el) => {
        const d = Number(el.dataset.depth) || 16
        el.style.translate = `${tx * d * 0.6}px ${y * 0.02 * (d / 16) + ty * d * 0.6}px`
      })
      sec.querySelectorAll("[data-speed]").forEach((el) => {
        el.style.translate = `0px ${y * Number(el.dataset.speed || 0.1)}px`
      })
    }
    const onMove = (e) => {
      const r = sec.getBoundingClientRect()
      tx = (((e.clientX - r.left) / r.width) - 0.5) * 10
      ty = -(((e.clientY - r.top) / r.height) - 0.5) * 8
      if (!raf) raf = requestAnimationFrame(render)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(render) }
    const onLeave = () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(render) }
    sec.addEventListener("mousemove", onMove)
    sec.addEventListener("mouseleave", onLeave)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      sec.removeEventListener("mousemove", onMove)
      sec.removeEventListener("mouseleave", onLeave)
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="wn-">
      <Seo path="/" />
      {/* header */}
      <div className="wn-pad"><div className="wn-wrap">
        <header className="wn-header">
          <div className="wn-header-left">
            <button className="wn-logo" onClick={() => navigate("/")}>OneSpace Live</button>
            <span className="wn-by">by</span>
            <span className="wn-mark"><Video size={18} /></span>
          </div>
          <button className="wn-btn" onClick={() => navigate("/create")}>
            <span>Meet Now</span><Video size={18} color="#fff" />
          </button>
        </header>
      </div></div>

      {/* hero — centered minimal, cinematic 3D */}
      <div className="wn-pad"><div className="wn-wrap">
        <section className="wn-hero wn-hero-min" ref={heroSecRef}>
          <div className="wn-hero-bg" aria-hidden>
            <div className="wn-gridlines" />
            <div className="wn-shard s1" data-speed="0.12" />
            <div className="wn-shard s2" data-speed="0.2" />
            <div className="wn-beam" data-speed="0.07" />
          </div>
          <motion.p
            className="wn-hero-pill"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          >
            <span className="wn-hero-dot" /> No signup · Free to start
          </motion.p>
          <motion.h1
            className="wn-hero-h1"
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}
          >
            Video meetings that start<br />in <em>seconds.</em>
          </motion.h1>
          <motion.p
            className="wn-hero-sub"
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.16 }}
          >
            Video, whiteboard, polls and watch parties in one fast room — right in your browser.
          </motion.p>
          <motion.div
            className="wn-hero-cta"
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.24 }}
          >
            <button className="wn-btn big" onClick={() => navigate("/create")}><span>Meet Now</span><ArrowRight size={18} color="#fff" /></button>
            <button className="wn-btn big light" onClick={() => navigate("/join")}><span>Join with code</span></button>
          </motion.div>
          <motion.form
            className="wn-join wn-join-min"
            onSubmit={quickJoin}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.3 }}
          >
            <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="ENTER CODE" aria-label="Meeting code" maxLength={10} />
            <button className="wn-btn big dark" type="submit"><span>Join</span></button>
          </motion.form>
          <motion.div
            className="wn-hero-trust"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.38 }}
          >
            <span><ShieldCheck size={14} /> Private by design</span>
            <span><Zap size={14} /> 3-second join</span>
            <span><Clock size={14} /> No downloads</span>
          </motion.div>
          <motion.div
            className="wn-hero-frame"
            initial={{ opacity: 0, y: 48 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.32 }}
          >
            <div className="wn-tilt" ref={heroTiltRef}>
              <div className="wn-chipf c1" data-depth="26" aria-hidden>
                <p style={{ margin: 0, fontWeight: 500, fontSize: "14px" }}>Polls · Live results</p>
                <p style={{ margin: "8px 0 0", fontSize: "12px", background: "#e4dfff", borderRadius: "4px", padding: "6px 10px" }}>A = ½bh — 78% correct</p>
                <p style={{ margin: "6px 0 0", fontSize: "12px", fontWeight: 700, color: "#7251eb" }}>24 votes in</p>
              </div>
              <div className="wn-chipf c2" data-depth="16" aria-hidden>
                <p style={{ margin: 0, fontSize: "13px" }}><strong>SCREEN</strong> · Mia is sharing</p>
              </div>
              <div className="wn-chipf c3" data-depth="34" aria-hidden>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: 500 }}>HANDS UP · 2</p>
                <p style={{ margin: "6px 0 0", fontSize: "12px", color: "rgba(0,0,0,.55)" }}>Daniel · Aisha</p>
              </div>
              <div className="wn-browser-bar" aria-hidden>
                <span /><span /><span />
                <em>onespace-live · live room · 1080p</em>
              </div>
              <HeroRoom />
            </div>
          </motion.div>
        </section>
      </div></div>

      {/* marquee ribbon */}
      <div className="marquee" aria-hidden>
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <div key={k} className="marquee-chunk">
              {RIBBON.map((w) => (
                <span key={`${k}-${w}`} className="marquee-item">{w}<i>✦</i></span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* modes — sticky stacking cards with 3D crew */}
      <section className="wn-modes">
        <div className="wn-pad"><div className="wn-wrap modes-head">
          <p className="wn-eyebrow-tag">PICK YOUR ROOM</p>
          <h2 className="wn-title center">One link.<br />Three ways to meet.</h2>
          <p className="wn-sub">Scroll — each room stacks in with its own crew and toolkit.</p>
        </div></div>
        <div className="wn-pad"><div className="wn-wrap">
          <div className="stack">
            {MODES.map((m, i) => (
              <div key={m.n} className="stack-item" style={{ top: `${92 + i * 30}px`, zIndex: i + 1 }}>
                <motion.article
                  className="stack-card"
                  style={{ background: m.bg }}
                  initial={{ opacity: 0, y: 80 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                >
                  <div className="stack-text">
                    <p className="stack-num">{m.n}</p>
                    <h3 className="stack-title">{m.title}</h3>
                    <p className="stack-copy">{m.copy}</p>
                    <div className="stack-chips">
                      {m.chips.map((c) => (<span key={c} className="stack-chip">{c}</span>))}
                    </div>
                    <button className="wn-btn" onClick={() => navigate(m.to)}><span>{m.cta}</span><ArrowRight size={18} color="#fff" /></button>
                  </div>
                  <div className="stack-visual" style={{ background: m.accent }}>
                    <img src={m.toon} alt="" aria-hidden draggable={false} className="stack-toon" loading="lazy" />
                    <div className="stack-tags" aria-hidden>
                      {m.tags.map((t, ti) => (<span key={t} className={`stack-tag t${ti}`}>{t}</span>))}
                    </div>
                  </div>
                </motion.article>
              </div>
            ))}
          </div>
        </div></div>
      </section>

      {/* dark immersive band */}
      <section className="wn-dark">
        <ToonFloat active={0} height={260} speed={0.1} style={{ left: "3%", bottom: "30px" }} />
        <ToonFloat active={3} height={300} speed={-0.09} style={{ right: "3%", top: "50px" }} />
        <div className="wn-orb orb-a" aria-hidden />
        <div className="wn-orb orb-b" aria-hidden />
        <div className="wn-wrap dark-inner">
          <motion.p
            className="dark-eyebrow"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.45 }}
          >
            WHY ONESPACE LIVE
          </motion.p>
          <motion.h2
            className="dark-giant"
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.6 }}
          >
            One room.<br /><span className="outline">Every mode.</span>
          </motion.h2>
          <div className="dark-stats">
            {[
              ["3s", "to join — no signup, no download"],
              ["1080p", "adaptive video on any network"],
              ["50", "seats in every live room"],
            ].map(([v, l], i) => (
              <motion.div
                key={l} className="dark-stat"
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.45, delay: i * 0.1 }}
              >
                <p className="v">{v}</p>
                <p className="l">{l}</p>
              </motion.div>
            ))}
          </div>
          <button className="wn-btn big light" onClick={() => navigate("/create")}><span>Start free</span><ArrowRight size={18} color="#724aee" /></button>
        </div>
      </section>

      {/* bento toolkit */}
      <section className="wn-bento-sec">
        <div className="wn-glow-blob" aria-hidden style={{ width: "520px", height: "520px", left: "-140px", top: "120px", background: "radial-gradient(closest-side, rgba(255,243,232,.95), transparent 70%)" }} />
        <div className="wn-glow-blob" aria-hidden style={{ width: "620px", height: "620px", right: "-180px", top: "420px", background: "radial-gradient(closest-side, rgba(228,250,244,.95), transparent 70%)" }} />
        <div className="wn-pad"><div className="wn-wrap" style={{ position: "relative" }}>
          <div style={{ textAlign: "center" }}>
            <p className="wn-eyebrow-tag">THE TOOLKIT</p>
            <h2 className="wn-title center">Six tools. Zero downloads.</h2>
            <p className="wn-sub">Everything lives inside the room — hover a card to feel the depth.</p>
          </div>
          <div className="wn-bento">
            {BENTO.map((b, i) => {
              const t = TOOLS[b.tool]
              const Icon = t.icon
              return (
                <motion.article
                  key={t.name}
                  className={`bento-cell ${b.span}`}
                  style={{ background: b.bg }}
                  initial={{ opacity: 0, y: 44 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: (i % 4) * 0.07 }}
                >
                  <div className="bento-top">
                    <span className="bento-icon"><Icon size={22} /></span>
                    <p className="bento-stat">{t.stat}</p>
                  </div>
                  <div className="bento-vis"><BentoVisual kind={b.visual} /></div>
                  <h3 className="bento-name">{t.name}</h3>
                  <p className="bento-tag">{t.tag}</p>
                </motion.article>
              )
            })}
          </div>
          <div className="wn-more">
            <button className="wn-btn big" onClick={() => navigate("/create")}><span>Start a meeting</span><ArrowRight size={18} color="#fff" /></button>
          </div>
        </div></div>
      </section>

      {/* cta */}
      <section className="wn-cta-sec">
        <ToonFloat active={0} height={225} speed={0.07} style={{ left: "1.5%", top: "130px" }} />
        <div className="wn-cta-wrap">
          <div className="wn-cta-1">
            <p className="wn-title white" style={{ fontSize: "40px" }}>The full pack</p>
            <div style={{ width: "100%", maxWidth: "340px" }}>
              {[["6 realtime tools", "Live video, screen, board"], ["Classroom mode", "Stage + strip + polls"], ["Private by design", "Codes + host controls"], ["No signup", "Join in 3 seconds"], ["In the browser", "Nothing to install"]].map(([a, b]) => (
                <p className="wn-check" key={a}><Check size={18} /> <span><strong>{a}</strong><br /><span style={{ color: "rgba(255,255,255,.7)", fontSize: "14px" }}>{b}</span></span></p>
              ))}
            </div>
            <button className="wn-btn big light" style={{ width: "100%", justifyContent: "center" }} onClick={() => navigate("/create")}><span>Start free</span></button>
          </div>
          <div className="wn-cta-2">
            <Sparkles size={40} color="#000" />
            <p className="wn-title" style={{ fontSize: "40px", textAlign: "center" }}>Classroom</p>
            <p style={{ textAlign: "center", color: "rgba(0,0,0,.6)" }}>Teach with a stage, hand raises and quizzes.</p>
            <button className="wn-btn big dark" style={{ width: "100%", justifyContent: "center" }} onClick={() => navigate("/create")}><span>Teach now</span></button>
          </div>
        </div>
        <div className="wn-cta-wrap" style={{ marginTop: "24px" }}>
          <div className="wn-dl">
            <p className="wn-dl-title">Try it right now, in your browser</p>
            <button className="wn-btn big light" onClick={() => navigate("/join")}><span>Join a room</span></button>
          </div>
        </div>
        <div className="wn-custom">
          <span style={{ width: "90px", height: "90px", borderRadius: "6px", background: "#fff", display: "grid", placeItems: "center", marginBottom: "10px" }}><Users size={40} color="#724aee" /></span>
          <h3 style={{ color: "#fff", fontSize: "32px", fontWeight: 500, margin: "10px 0" }}>Got a team in mind? Let us talk!</h3>
          <a href="mailto:hello@onespace.live" style={{ color: "#fff", fontSize: "18px" }}>hello@onespace.live</a>
        </div>
      </section>

      {/* footer */}
      <footer className="wn-footer">
        <div className="wn-fo">
          <div className="col">
            <button className="wn-logo" style={{ color: "#fff" }} onClick={() => navigate("/")}>OneSpace Live</button>
            <span style={{ color: "rgba(255,255,255,.7)" }}>Live meetings for modern teams.</span>
          </div>
          <div className="col">
            <span className="t">Product</span>
            <a href="/create">Meetings</a><a href="/create">Classroom</a><a href="/create">Watch Party</a><a href="/blog">Blog</a>
          </div>
          <div className="col">
            <span className="t">Info</span>
            <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/about">About</a><a href="mailto:hello@onespace.live">Contact</a>
          </div>
        </div>
        <p className="wn-copy">© 2026 OneSpace Live · All Rights Reserved</p>
      </footer>
    </div>
  )
}
