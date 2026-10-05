import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Video, MonitorUp, PenTool, Play, BarChart3, Lock, ArrowRight, ArrowUpRight,
  Clock, Users, Zap, MessageSquare, LayoutGrid, Sparkles, ShieldCheck, Globe
} from "lucide-react"
import AuroraNavbar from "../components/aurora/AuroraNavbar"
import { AuroraBadge, AuroraFooter, Sky, SectionTab } from "../components/aurora/AuroraChrome"
import { normalizeCode } from "../utils/meetingCode"

function MockRoom() {
  const tiles = [
    { n: "Aarav · Host", c: "#0D99FF" },
    { n: "Mia", c: "#F0531C" },
    { n: "Leo", c: "#14202B" },
    { n: "Zara", c: "#7C5CFF" },
  ]
  return (
    <div className="sel omd-card" style={{ overflow: "visible", padding: "22px", background: "#fff" }}>
      <span className="h tl" /><span className="h tr" /><span className="h bl" /><span className="h br" />
      <span className="dim">meeting-room.fig · 4 online</span>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "14px", fontSize: "14px", fontWeight: 600 }}>
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#27c06b", display: "inline-block" }} />
          React Beginners · RX82KP
        </span>
        <span className="pin-tag" style={{ fontSize: "10px", padding: "5px 10px" }}><Users size={12} /> 4 here</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {tiles.map((t) => (
          <div key={t.n} style={{ position: "relative", height: "112px", borderRadius: "12px", overflow: "hidden", background: t.c, border: "1px solid rgba(20,32,43,.08)" }}>
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: "30px", fontWeight: 700, color: "#fff", fontFamily: "'Bricolage Grotesque', sans-serif" }}>{t.n.slice(0, 1)}</div>
            <div style={{ position: "absolute", bottom: "6px", left: "6px", borderRadius: "7px", background: "rgba(20,32,43,.85)", padding: "3px 8px", fontSize: "11px", fontWeight: 600, color: "#fff" }}>{t.n}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: "10px", marginTop: "10px" }}>
        <div style={{ borderRadius: "12px", border: "1px solid rgba(20,32,43,.08)", background: "#F1F6FA", padding: "10px 12px" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}><PenTool size={13} color="#F0531C" /> Whiteboard · Live</p>
          <svg viewBox="0 0 200 60" style={{ marginTop: "6px", height: "42px", width: "100%" }}><path d="M5 50 Q 40 5 70 30 T 130 25 T 195 40" stroke="#F0531C" strokeWidth="4" fill="none" strokeLinecap="round" /><circle cx="150" cy="18" r="8" stroke="#0D99FF" fill="none" strokeWidth="4" /></svg>
        </div>
        <div style={{ borderRadius: "12px", border: "1px solid rgba(20,32,43,.08)", background: "#F1F6FA", padding: "10px 12px", fontSize: "12px", fontWeight: 500 }}>
          <p style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}><MessageSquare size={13} color="#0D99FF" /> Chat</p>
          <p style={{ marginTop: "6px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Mia: All clear</p>
          <p>Leo: +1</p>
        </div>
      </div>
    </div>
  )
}

const MARQUEE = ["Live Video", "Screen Share", "Whiteboard", "Watch Together", "Polls", "No Signup", "Classrooms"]

const FEATURES = [
  { icon: Video, title: "Live Video", desc: "Crystal-clear meetings with every face big, bright and in sync." },
  { icon: MonitorUp, title: "Screen Share", desc: "Share tabs and screens in one click. No plugins, no friction." },
  { icon: PenTool, title: "Whiteboard", desc: "Sketch together live and keep every stroke saved." },
  { icon: Play, title: "Watch Together", desc: "Press play at the same time. Perfect for classes and parties." },
  { icon: BarChart3, title: "Polls", desc: "Ask anything, get answers in seconds with live results." },
  { icon: Lock, title: "Private by Design", desc: "Every room guarded by codes and host controls." },
]

const STEPS = [
  { n: "01 · Create", who: "You", time: "10:02", text: "Pick a title, hit Meet Now — link is ready in seconds.", file: "meeting-link.copied" },
  { n: "02 · Share it", who: "ShadowMeet", time: "10:03", text: "One code, one link. Works for meetings, classes and watch parties.", file: null },
  { n: "03 · Meet live", who: "You + team", time: "Day 1", text: "Video, chat, whiteboard, polls and YouTube — all in the browser.", file: "whiteboard-live.png" },
  { n: "04 · Ship it", who: "ShadowMeet", time: "Done", text: "No accounts. No downloads. Just modern rooms that feel instant.", file: null },
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
    <div className="sup-page" style={{ position: "relative", width: "100%", minHeight: "100svh", overflow: "clip" }}>
      <Sky />
      <AuroraNavbar />

      {/* HERO */}
      <section className="hero" style={{ padding: "150px 0 44px", textAlign: "center", minHeight: "92vh", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 34px", width: "100%" }}>
          <div className="clock" style={{ display: "inline-flex", alignItems: "center", gap: "10px", fontFamily: "'Space Mono', monospace", fontSize: "12px", fontWeight: 700, letterSpacing: ".1em", color: "#14202B", background: "rgba(255,255,255,.65)", border: "1px solid rgba(20,32,43,.13)", padding: "7px 8px 7px 14px", borderRadius: "999px", marginBottom: "22px" }}>
            <span className="cdot" style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#F0531C", display: "inline-block" }} />
            NO SIGNUP · FREE TO START
            <span className="cz" style={{ color: "#8AA6B8", fontSize: "10px", borderLeft: "1px solid rgba(20,32,43,.13)", paddingLeft: "10px" }}>IN YOUR BROWSER</span>
          </div>

          <p className="we" style={{ fontFamily: "'Shantell Sans', cursive", fontSize: "22px", fontWeight: 600 }}>your meeting room, but modern</p>

          <div className="wordmark-wrap" style={{ display: "flex", justifyContent: "center", margin: "2px 0 10px" }}>
            <div className="wordmark sel" style={{ fontSize: "clamp(44px,9vw,118px)" }}>
              <span className="h tl" /><span className="h tr" /><span className="h bl" /><span className="h br" />
              IMPOSSIBLE<br />TO <span className="o">miss.</span>
              <span className="dim">hero.frame · 1280 × auto</span>
            </div>
          </div>

          <p className="tagline" style={{ fontSize: "clamp(16px,1.85vw,20px)", color: "#4A6173", maxWidth: "52ch", margin: "12px auto 26px", lineHeight: 1.55 }}>
            Meetings, classrooms and watch parties in one light, fast room. <span className="ser" style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", color: "#14202B" }}>No accounts. No downloads.</span> Just share a code and go.
          </p>

          <div className="hero-actions" style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/create")} className="btn">Meet Now <ArrowRight size={16} /></button>
            <button onClick={() => navigate("/join")} className="btn ghost">Join with code</button>
          </div>

          <form onSubmit={quickJoin} style={{ margin: "22px auto 0", display: "flex", gap: "10px", maxWidth: "440px", justifyContent: "center" }}>
            <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="ENTER CODE" aria-label="Meeting code" maxLength={10} className="aurora-input" style={{ fontFamily: "'Space Mono', monospace", letterSpacing: "0.25em", textAlign: "center", maxWidth: "260px" }} />
            <button className="btn" style={{ padding: "12px 22px", whiteSpace: "nowrap" }}>Join <ArrowUpRight size={15} /></button>
          </form>

          <div style={{ display: "grid", gap: "22px", marginTop: "48px", textAlign: "left" }} className="lg:grid-cols-[1fr_1fr] lg:items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.4 }}>
              <MockRoom />
            </motion.div>
            <div style={{ display: "grid", gap: "14px" }}>
              <div>
                <SectionTab icon={Sparkles} label="why shadowmeet" />
                <div className="omd-card omd-card-hover" style={{ padding: "30px", marginTop: "-1px" }}>
                  <p style={{ fontSize: "clamp(20px,2.2vw,28px)", lineHeight: 1.35, fontWeight: 500 }}>
                    We make people actually <em style={{ fontStyle: "normal", fontWeight: 700, color: "#F0531C" }}>show up</em> — because joining takes 3 seconds, not 3 downloads.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "9px", marginTop: "18px" }}>
                    {["Video", "Whiteboard", "Polls", "YouTube", "Chat", "Screen Share"].map((c) => (
                      <span key={c} className="chip" style={{ fontSize: "13px" }}>{c}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="omd-card" style={{ padding: "22px 24px", background: "#14202B", color: "#fff", borderColor: "#14202B" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,.12)" }}>
                  <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: "30px" }}>3s <span style={{ color: "#F0531C", fontSize: "18px" }}>join</span></span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: ".06em", textTransform: "uppercase", color: "#bdb8ad" }}>no signup</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,.12)" }}>
                  <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: "30px" }}>6 <span style={{ color: "#F0531C", fontSize: "18px" }}>tools</span></span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", textTransform: "uppercase", color: "#bdb8ad" }}>one room</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "8px 0" }}>
                  <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: "30px" }}>100% <span style={{ color: "#F0531C", fontSize: "18px" }}>free start</span></span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", textTransform: "uppercase", color: "#bdb8ad" }}>in browser</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee">
        <div className="track">
          {[...MARQUEE, ...MARQUEE].map((m, i) => (
            <span key={i} className="item">{m}</span>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section id="features" style={{ position: "relative", zIndex: 2, padding: "84px 34px 10px", maxWidth: "1280px", margin: "0 auto" }}>
        <div className="sec-head">
          <span className="scribble">what we make</span>
          <h2>One room.<br />Every tool.</h2>
          <span className="note">Six tools, one canvas — no tab-switching</span>
        </div>
        <div style={{ display: "grid", gap: "18px", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", marginTop: "20px" }}>
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35, delay: (i % 3) * 0.08 }}
              className="omd-card omd-card-hover sel"
              style={{ padding: "26px", background: i === 0 ? "#F0531C" : "#fff", borderColor: i === 0 ? "#F0531C" : "rgba(20,32,43,.13)", color: i === 0 ? "#fff" : "#14202B" }}
            >
              <span className="h tl" /><span className="h tr" /><span className="h bl" /><span className="h br" />
              <span className="dim">0{i + 1} · {title.toLowerCase()}.fig</span>
              <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: i === 0 ? "#fff" : "#F1F6FA", display: "grid", placeItems: "center", border: "1px solid rgba(20,32,43,.08)" }}>
                <Icon size={20} color={i === 0 ? "#F0531C" : "#14202B"} />
              </div>
              <h3 style={{ marginTop: "16px", fontSize: "24px", color: i === 0 ? "#fff" : "#14202B" }}>{title}</h3>
              <p style={{ marginTop: "10px", fontSize: "15px", lineHeight: 1.6, color: i === 0 ? "rgba(255,255,255,.92)" : "#4A6173" }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="process" style={{ padding: "80px 34px 10px", maxWidth: "860px", margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div className="sec-head">
          <span className="scribble">how it works</span>
          <h2>No forms.<br />Just this.</h2>
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ marginTop: "-1px" }}><SectionTab icon={MessageSquare} label="project-channel" /></div>
          <div className="omd-card" style={{ borderRadius: "0 18px 18px 18px", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid rgba(20,32,43,.08)", background: "#F1F6FA" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: 700, fontSize: "15px" }}>
                <Globe size={15} color="#8AA6B8" /> shadowmeet × your-team
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "'Space Mono', monospace", fontSize: "11px", fontWeight: 700, color: "#4A6173" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#27c06b", display: "inline-block" }} /> 3 online
              </div>
            </div>
            <div style={{ padding: "22px 22px 26px", display: "flex", flexDirection: "column", gap: "18px" }}>
              {STEPS.map((s) => (
                <div key={s.n}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "6px 0" }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10.5px", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#F0531C", whiteSpace: "nowrap" }}>{s.n}</span>
                    <span style={{ height: "1px", flex: 1, background: "linear-gradient(90deg, rgba(240,83,28,.35), transparent)" }} />
                  </div>
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", flex: "none", display: "grid", placeItems: "center", background: s.who === "ShadowMeet" ? "#F0531C" : "#0D99FF", color: "#fff", fontWeight: 700 }}>{s.who.slice(0, 1)}</div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontWeight: 700, fontSize: "14px" }}>{s.who}</span>
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: "#8AA6B8" }}>{s.time}</span>
                      </div>
                      <p style={{ fontSize: "14.5px", color: "#14202B", marginTop: "2px" }}>{s.text}</p>
                      {s.file && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginTop: "8px", background: "#F1F6FA", border: "1px solid rgba(20,32,43,.08)", borderRadius: "9px", padding: "7px 12px", fontFamily: "'Space Mono', monospace", fontSize: "12px", fontWeight: 700 }}>
                          <LayoutGrid size={14} color="#0D99FF" /> {s.file}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: "relative", zIndex: 2, padding: "60px 34px 10px", maxWidth: "1280px", margin: "0 auto" }}>
        <div className="omd-card sel" style={{ padding: "clamp(32px,5vw,64px)", display: "grid", gap: "24px", background: "#F0531C", borderColor: "#F0531C", color: "#fff", overflow: "visible" }}>
          <span className="h tl" /><span className="h tr" /><span className="h bl" /><span className="h br" />
          <span className="dim">cta.frame · ready to ship</span>
          <div>
            <p style={{ fontFamily: "'Shantell Sans', cursive", fontSize: "18px", opacity: 0.95 }}>have an idea worth meeting about?</p>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: "clamp(2.2rem,4.5vw,3.8rem)", lineHeight: 1, color: "#fff", marginTop: "8px" }}>MEET ALL TOGETHER NOW.</h2>
            <p style={{ marginTop: "14px", fontSize: "17px", fontWeight: 500, color: "rgba(255,255,255,.92)", maxWidth: "480px" }}>One simple link for every team and class. Free to start, modern by default.</p>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/create")} className="aurora-btn-white"><Zap size={15} /> Meet Now</button>
            <button onClick={() => navigate("/join")} style={{ background: "transparent", color: "#fff", fontWeight: 700, fontSize: "15px", padding: "12px 24px", borderRadius: "999px", border: "1.5px solid #fff", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px" }}><Clock size={15} /> Join with code</button>
          </div>
          <div style={{ display: "flex", gap: "18px", flexWrap: "wrap", fontSize: "13px", fontWeight: 600, opacity: 0.95 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><ShieldCheck size={14} /> Private by design</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><Users size={14} /> Built for classes & teams</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><Zap size={14} /> 48h-fast setup</span>
          </div>
        </div>
      </section>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "18px", position: "relative", zIndex: 2 }}>
        <AuroraBadge prefix="Loved by" strong="modern teams & classrooms" />
      </div>

      <AuroraFooter />
    </div>
  )
}
