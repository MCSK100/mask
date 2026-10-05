import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Video, MonitorUp, PenTool, Play, BarChart3, Lock, ArrowRight, Check,
  Sparkles, GraduationCap, Zap, MessageSquare, Users, Clock, ShieldCheck
} from "lucide-react"
import { normalizeCode } from "../utils/meetingCode"
import "./Home.css"

const TOOLS = [
  { name: "Live Video", icon: Video, tag: "Crystal-clear faces, big and bright.", stat: "1080p · adaptive" },
  { name: "Screen Share", icon: MonitorUp, tag: "Share any tab in one click.", stat: "1-click · no plugins" },
  { name: "Whiteboard", icon: PenTool, tag: "Sketch together, strokes saved.", stat: "live · synced" },
  { name: "Watch Together", icon: Play, tag: "Press play at the same time.", stat: "YouTube · in sync" },
  { name: "Polls", icon: BarChart3, tag: "Answers in seconds, live results.", stat: "instant · realtime" },
  { name: "Private Rooms", icon: Lock, tag: "Codes, locks and host controls.", stat: "private · by design" },
]

const SLIDES = [
  { n: "1. Instant Join", cls: "orange", title: "No accounts, no downloads — share a code and you are in.", bg: "#FFF3E8" },
  { n: "2. Live Collaboration", cls: "blue", title: "Video, whiteboard, chat and polls in one fast room.", bg: "#ECE9FF" },
  { n: "3. Classroom Mode", cls: "green", title: "Teach with a stage, raise hands and quiz the class.", bg: "#E4FAF4" },
]

function HeroRoom() {
  const tiles = [
    { n: "Aarav · Host", c: "#0D99FF" },
    { n: "Mia", c: "#724aee" },
    { n: "Leo", c: "#16283A" },
    { n: "Zara", c: "#2ad7b8" },
  ]
  return (
    <div style={{ background: "#fff", border: "2px solid #000", borderRadius: "24px", padding: "22px", boxShadow: "12px 12px 0 #724aee" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "14px" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 500, fontSize: "15px" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#2ad7b8", display: "inline-block" }} />
          React Beginners · RX82KP
        </span>
        <span style={{ background: "#000", color: "#fff", borderRadius: "100px", padding: "6px 14px", fontSize: "12px", fontWeight: 500 }}>4 here</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {tiles.map((t) => (
          <div key={t.n} style={{ position: "relative", height: "112px", borderRadius: "16px", overflow: "hidden", background: t.c }}>
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: "30px", fontWeight: 500, color: "#fff" }}>{t.n.slice(0, 1)}</div>
            <div style={{ position: "absolute", bottom: "6px", left: "6px", borderRadius: "100px", background: "rgba(0,0,0,.7)", padding: "3px 10px", fontSize: "11px", color: "#fff" }}>{t.n}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: "10px", marginTop: "10px" }}>
        <div style={{ borderRadius: "16px", background: "#f5f2ff", padding: "10px 12px", fontSize: "12px", fontWeight: 500 }}>
          Whiteboard · Live
          <svg viewBox="0 0 200 60" style={{ marginTop: "6px", height: "42px", width: "100%" }}><path d="M5 50 Q 40 5 70 30 T 130 25 T 195 40" stroke="#724aee" strokeWidth="4" fill="none" strokeLinecap="round" /><circle cx="150" cy="18" r="8" stroke="#ff8655" fill="none" strokeWidth="4" /></svg>
        </div>
        <div style={{ borderRadius: "16px", background: "#f5f2ff", padding: "10px 12px", fontSize: "12px" }}>
          <p style={{ fontWeight: 500, margin: 0 }}>Chat</p>
          <p style={{ margin: "6px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Mia: All clear</p>
          <p style={{ margin: 0 }}>Leo: +1</p>
        </div>
      </div>
    </div>
  )
}

function ToolVisual({ tool }) {
  const Icon = tool.icon
  return (
    <div className="wn-pose-card">
      <div style={{ background: "#fff", borderRadius: "20px", padding: "34px", boxShadow: "0 24px 60px -20px rgba(0,0,0,.35)" }}>
        <div style={{ width: "56px", height: "56px", borderRadius: "18px", background: "#724aee", display: "grid", placeItems: "center", color: "#fff" }}>
          <Icon size={26} />
        </div>
        <h3 style={{ fontSize: "38px", fontWeight: 500, letterSpacing: "-1px", margin: "18px 0 6px", color: "#000" }}>{tool.name}</h3>
        <p style={{ fontSize: "17px", color: "rgba(0,0,0,.6)", margin: 0 }}>{tool.tag}</p>
        <p style={{ display: "inline-block", marginTop: "16px", background: "#f5f2ff", color: "#7251eb", borderRadius: "100px", padding: "8px 18px", fontSize: "14px", fontWeight: 500 }}>{tool.stat}</p>
      </div>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [code, setCode] = useState("")
  const [activeTool, setActiveTool] = useState(0)
  const toolListRef = useRef(null)
  const slideSecRef = useRef(null)
  const slideTrackRef = useRef(null)
  const slideBarRef = useRef(null)
  const heroSecRef = useRef(null)
  const heroTiltRef = useRef(null)

  const quickJoin = (e) => {
    e?.preventDefault()
    const c = normalizeCode(code)
    if (c) navigate(`/meet/${c}`)
  }

  // poses-style scroll spy
  useEffect(() => {
    const el = toolListRef.current
    if (!el) return
    const onScroll = () => {
      const items = el.querySelectorAll("[data-tool]")
      let best = 0
      let bestDist = Infinity
      items.forEach((it, i) => {
        const d = Math.abs(it.offsetTop - el.scrollTop - 200)
        if (d < bestDist) { bestDist = d; best = i }
      })
      setActiveTool(best)
    }
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => el.removeEventListener("scroll", onScroll)
  }, [])

  // sticky horizontal slider progress
  useEffect(() => {
    const onScroll = () => {
      const sec = slideSecRef.current
      const track = slideTrackRef.current
      if (!sec || !track) return
      const rect = sec.getBoundingClientRect()
      const total = sec.offsetHeight - window.innerHeight
      const p = Math.min(Math.max(-rect.top / total, 0), 1)
      track.style.transform = `translateX(${-p * 200}vw)`
      if (slideBarRef.current) slideBarRef.current.style.transform = `scaleX(${p})`
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

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
      sec.querySelectorAll(".wn-orb[data-speed]").forEach((el) => {
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

  const pickTool = (i) => {
    const el = toolListRef.current
    const item = el?.querySelectorAll("[data-tool]")?.[i]
    if (item) el.scrollTo({ top: item.offsetTop - 220, behavior: "smooth" })
    else setActiveTool(i)
  }

  return (
    <div className="wn-">
      {/* header */}
      <div className="wn-pad"><div className="wn-wrap">
        <header className="wn-header">
          <div className="wn-header-left">
            <button className="wn-logo" onClick={() => navigate("/")}>ShadowMeet</button>
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
          <span className="wn-orb o1" data-speed="0.12" aria-hidden />
          <span className="wn-orb o2" data-speed="0.2" aria-hidden />
          <span className="wn-orb o3" data-speed="0.07" aria-hidden />
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
            Meetings that start<br />in <em>seconds.</em>
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
                <p style={{ margin: 0, fontWeight: 500, fontSize: "14px" }}>Polls &amp; Quizzes</p>
                <p style={{ margin: "8px 0 0", fontSize: "12px", background: "#e4dfff", borderRadius: "8px", padding: "6px 10px" }}>A = ½bh</p>
                <p style={{ margin: "6px 0 0", fontSize: "12px", fontWeight: 700, color: "#7251eb" }}>78%</p>
              </div>
              <div className="wn-chipf c2" data-depth="16" aria-hidden>
                <p style={{ margin: 0, fontSize: "13px" }}><strong>Sarah</strong> · That makes sense!</p>
              </div>
              <div className="wn-chipf c3" data-depth="34" aria-hidden>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: 500 }}>Raise Hand</p>
                <p style={{ margin: "6px 0 0", fontSize: "12px", color: "rgba(0,0,0,.55)" }}>Daniel · Aisha</p>
              </div>
              <div className="wn-browser-bar" aria-hidden>
                <span /><span /><span />
                <em>shadowmeet · live room</em>
              </div>
              <HeroRoom />
            </div>
          </motion.div>
        </section>
      </div></div>

      {/* tools / poses */}
      <section style={{ marginTop: "40px" }}>
        <div className="wn-pad"><div className="wn-wrap" style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ maxWidth: "600px", textAlign: "center" }}>
            <h2 className="wn-title center">6 Tools for different scenarios</h2>
            <p className="wn-sub">Scroll the list to enjoy the tool variations!</p>
          </div>
        </div></div>
        <div className="wn-poses">
          <div className="wn-poses-l">
            <span className="wn-pose-num">0{activeTool + 1}.</span>
            <motion.div
              key={activeTool}
              className="wn-pose-motion"
              initial={{ opacity: 0, x: 60, rotateY: -12 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <ToolVisual tool={TOOLS[activeTool]} />
            </motion.div>
          </div>
          <div className="wn-poses-r">
            <div className="wn-selector" aria-hidden>
              <div className="wn-fade top" />
              <div className="wn-pill">{TOOLS[activeTool].name}</div>
              <div className="wn-fade btm" />
            </div>
            <div className="wn-tool-scroll" ref={toolListRef}>
              <div style={{ height: "240px" }} />
              {TOOLS.map((t, i) => (
                <button key={t.name} data-tool className="wn-tool-name" onClick={() => pickTool(i)} style={{ opacity: i === activeTool ? 1 : 0.35, display: "block" }}>
                  {t.name}
                </button>
              ))}
              <div style={{ height: "240px" }} />
            </div>
          </div>
        </div>
        <div className="wn-pad wn-mtools"><div className="wn-wrap" style={{ display: "grid", gap: "16px", paddingBottom: "80px" }}>
          {TOOLS.map((t) => {
            const Icon = t.icon
            return (
              <div key={t.name} style={{ border: "2px solid #000", borderRadius: "20px", padding: "24px", display: "flex", gap: "16px", alignItems: "center" }}>
                <span style={{ width: "48px", height: "48px", borderRadius: "14px", background: "#724aee", display: "grid", placeItems: "center", color: "#fff", flex: "none" }}><Icon size={22} /></span>
                <span><strong style={{ fontSize: "20px", fontWeight: 500 }}>{t.name}</strong><br /><span style={{ color: "rgba(0,0,0,.55)" }}>{t.tag}</span></span>
              </div>
            )
          })}
        </div></div>
      </section>

      {/* purple features */}
      <section className="wn-purple">
        <div className="wn-wrap">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <h2 className="wn-title center white" style={{ maxWidth: "620px" }}>One room. Beautiful and modern.</h2>
          </div>
          <div className="wn-stage">
            <div style={{ background: "#fff", borderRadius: "24px", padding: "26px", width: "min(880px, 92vw)", position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <span style={{ background: "#000", color: "#fff", borderRadius: "100px", padding: "6px 14px", fontSize: "13px" }}>Algebra 101</span>
                <span style={{ background: "#E8382F", color: "#fff", borderRadius: "8px", padding: "4px 10px", fontSize: "12px", fontWeight: 700 }}>LIVE</span>
                <span style={{ marginLeft: "auto", display: "flex", gap: "8px", alignItems: "center", color: "rgba(0,0,0,.5)", fontSize: "13px" }}><Clock size={14} /> 00:42:18 <Users size={14} /> 6 here</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "12px" }}>
                <div style={{ borderRadius: "16px", background: "linear-gradient(135deg,#2B4A6B,#16283A)", minHeight: "240px", display: "grid", placeItems: "center", color: "#fff", fontSize: "60px", fontWeight: 300 }}>A</div>
                <div style={{ borderRadius: "16px", background: "#f5f2ff", padding: "20px", minHeight: "240px" }}>
                  <p style={{ fontWeight: 500, margin: "0 0 8px" }}>Whiteboard</p>
                  <svg viewBox="0 0 200 120" style={{ width: "100%", height: "150px" }}><path d="M10 100 Q 60 10 100 60 T 190 50" stroke="#724aee" strokeWidth="5" fill="none" strokeLinecap="round" /><circle cx="150" cy="35" r="14" stroke="#ff8655" fill="none" strokeWidth="5" /></svg>
                </div>
              </div>
            </div>
          </div>
          <div className="wn-curve" aria-hidden />
          <p className="wn-sub white">One fast room for the whole class. Here are a few features of the crew:</p>
          <div className="wn-feats">
            <motion.div className="wn-feat-1" initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5 }}>
              <div style={{ display: "flex", gap: "10px" }}>
                <span style={{ width: "52px", height: "52px", borderRadius: "16px", background: "#724aee", display: "grid", placeItems: "center", color: "#fff" }}><Zap size={24} /></span>
                <span style={{ width: "52px", height: "52px", borderRadius: "16px", background: "#fff", display: "grid", placeItems: "center", color: "#724aee" }}><ShieldCheck size={24} /></span>
              </div>
              <div style={{ marginTop: "60px" }}>
                <h4 className="wn-h4">High attention to detail.</h4>
                <p className="wn-small">Just have a look at this stage!</p>
              </div>
            </motion.div>
            <motion.div className="wn-feat-2" initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <div style={{ display: "flex", gap: "12px" }}>
                {["A", "M", "J"].map((c) => (
                  <span key={c} style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#000", color: "#fff", display: "grid", placeItems: "center", fontSize: "20px" }}>{c}</span>
                ))}
              </div>
              <div style={{ marginTop: "60px" }}>
                <h4 className="wn-h4">Separate tracks.</h4>
                <p className="wn-small">Turn camera or mic on or off — either way it looks great!</p>
              </div>
            </motion.div>
          </div>
          <motion.div className="wn-feat-wide" initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5 }}>
            <div className="txt">
              <h3>Adaptive quality with LiveKit, satisfying for every network.</h3>
              <p className="wn-small-2" style={{ marginTop: "30px" }}>The room is like an eyeball magnet!</p>
            </div>
            <div className="vis">
              <div style={{ background: "#fff", borderRadius: "20px 20px 0 0", padding: "24px", display: "flex", gap: "10px", alignItems: "center" }}>
                <MessageSquare size={20} color="#724aee" />
                <span style={{ fontWeight: 500 }}>Chat is live. Say hello to the class.</span>
              </div>
              <div style={{ background: "#e4dfff", borderRadius: "0 0 20px 20px", padding: "24px", display: "flex", gap: "10px" }}>
                <span style={{ background: "#724aee", color: "#fff", borderRadius: "100px", padding: "8px 18px", fontSize: "14px" }}>Polls</span>
                <span style={{ background: "#fff", color: "#000", borderRadius: "100px", padding: "8px 18px", fontSize: "14px" }}>Raise hand</span>
                <span style={{ background: "#000", color: "#fff", borderRadius: "100px", padding: "8px 18px", fontSize: "14px" }}>Record</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* sticky slider */}
      <section>
        <div className="wn-pad"><div className="wn-wrap" style={{ display: "flex", justifyContent: "center", marginTop: "120px" }}>
          <h2 className="wn-title center">How meetings improve your workflow?</h2>
        </div></div>
        <div className="wn-hscroll" ref={slideSecRef}>
          <div className="wn-hsticky">
            <div className="wn-htrack" ref={slideTrackRef}>
              {SLIDES.map((s) => (
                <div className="wn-slide" key={s.n}>
                  <div className="wn-slide-title">
                    <p className={`wn-slide-tag ${s.cls}`}>{s.n}</p>
                    <h4 className="wn-h4">{s.title}</h4>
                  </div>
                  <div className="wn-slide-vis">
                    <div style={{ background: s.bg, borderRadius: "24px", padding: "48px", minHeight: "340px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ background: "#fff", borderRadius: "20px", padding: "26px 34px", fontSize: "20px", fontWeight: 500, boxShadow: "0 20px 50px -20px rgba(0,0,0,.25)" }}>{s.n}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="wn-progress" aria-hidden><span ref={slideBarRef} /></div>
          </div>
        </div>
      </section>

      {/* showcase */}
      <section className="wn-purple">
        <div className="wn-wrap">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <h2 className="wn-title center white" style={{ maxWidth: "620px" }}>Created specifically for meetings, classes and watch parties</h2>
          </div>
          <div className="wn-cases-1">
            <div className="wn-shot" style={{ background: "#fff", padding: "22px", width: "240px" }}>
              <p style={{ fontWeight: 500, margin: "0 0 10px" }}>Breakout Rooms</p>
              {["Room 1", "Room 2", "Room 3"].map((r) => (
                <p key={r} style={{ background: "#f5f2ff", borderRadius: "12px", padding: "8px 12px", fontSize: "13px", margin: "0 0 6px" }}>{r}</p>
              ))}
            </div>
            <div className="wn-shot" style={{ background: "#fff", padding: "22px", flex: 1, maxWidth: "640px" }}>
              <p style={{ fontWeight: 500, margin: "0 0 10px" }}>Attendance · 6 present</p>
              <div style={{ display: "flex", gap: "8px" }}>{["A", "M", "J", "E", "+2"].map((c) => (
                <span key={c} style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#724aee", color: "#fff", display: "grid", placeItems: "center" }}>{c}</span>
              ))}</div>
            </div>
          </div>
          <div className="wn-cases-2">
            <div className="wn-shot" style={{ background: "#fff", padding: "22px", width: "300px" }}>
              <p style={{ fontWeight: 500, margin: "0 0 10px" }}>Raise Hand</p>
              {["Daniel", "Aisha"].map((n) => (
                <p key={n} style={{ background: "#f5f2ff", borderRadius: "12px", padding: "8px 12px", fontSize: "13px", margin: "0 0 6px" }}>{n}</p>
              ))}
            </div>
            <div className="wn-shot" style={{ background: "#fff", padding: "22px", flex: 1, maxWidth: "560px" }}>
              <p style={{ fontWeight: 500, margin: "0 0 10px" }}>Chat · Q&A · People</p>
              <p style={{ background: "#f5f2ff", borderRadius: "12px", padding: "10px 14px", fontSize: "14px" }}>Sarah: That makes sense!</p>
            </div>
          </div>
        </div>
      </section>

      {/* preview grid */}
      <section className="wn-preview-sec">
        <div className="wn-wrap">
          <div style={{ textAlign: "center" }}>
            <p className="wn-sub" style={{ margin: 0 }}>Full Preview</p>
            <h2 className="wn-title center" style={{ fontSize: "90px", letterSpacing: "-4px", marginTop: "10px" }}>Every tool</h2>
          </div>
          <div className="wn-grid">
            {[...TOOLS, { name: "Classroom Mode", icon: GraduationCap, tag: "Stage, strip and teacher controls.", stat: "teach · live" }, { name: "No Signup", icon: Zap, tag: "Join in 3 seconds flat.", stat: "free · instant" }].map((t, i) => {
              const Icon = t.icon
              const bgs = ["#f5f2ff", "#FFF3E8", "#E4FAF4", "#ECE9FF"]
              return (
                <motion.div key={t.name} className="wn-cell" style={{ background: bgs[i % 4] }}
                  initial={{ opacity: 0, scale: 0.9, rotate: i % 2 ? -2 : 2 }} whileInView={{ opacity: 1, scale: 1, rotate: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45, delay: (i % 4) * 0.06 }}>
                  <span style={{ width: "48px", height: "48px", borderRadius: "14px", background: "#000", display: "grid", placeItems: "center", color: "#fff" }}><Icon size={22} /></span>
                  <span><p className="t">{t.name}</p><p className="d">{t.tag}</p></span>
                </motion.div>
              )
            })}
          </div>
          <div className="wn-more">
            <button className="wn-btn big" onClick={() => navigate("/create")}><span>Start a meeting</span><ArrowRight size={18} color="#fff" /></button>
          </div>
        </div>
      </section>

      {/* cta */}
      <section className="wn-cta-sec">
        <div className="wn-cta-wrap">
          <div className="wn-cta-1">
            <p className="wn-title white" style={{ fontSize: "40px" }}>Full pack</p>
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
          <span style={{ width: "90px", height: "90px", borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center", marginBottom: "10px" }}><Users size={40} color="#724aee" /></span>
          <h3 style={{ color: "#fff", fontSize: "32px", fontWeight: 500, margin: "10px 0" }}>Got a team in mind? Let us talk!</h3>
          <a href="mailto:hello@shadowmeet.app" style={{ color: "#fff", fontSize: "18px" }}>hello@shadowmeet.app</a>
        </div>
      </section>

      {/* footer */}
      <footer className="wn-footer">
        <div className="wn-fo">
          <div className="col">
            <button className="wn-logo" style={{ color: "#fff" }} onClick={() => navigate("/")}>ShadowMeet</button>
            <span style={{ color: "rgba(255,255,255,.7)" }}>Live meetings for modern teams.</span>
          </div>
          <div className="col">
            <span className="t">Product</span>
            <a href="/create">Meetings</a><a href="/create">Classroom</a><a href="/create">Watch Party</a><a href="/blog">Blog</a>
          </div>
          <div className="col">
            <span className="t">Info</span>
            <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/about">About</a><a href="mailto:hello@shadowmeet.app">Contact</a>
          </div>
        </div>
        <p className="wn-copy">© 2026 ShadowMeet · All Rights Reserved</p>
      </footer>
    </div>
  )
}
