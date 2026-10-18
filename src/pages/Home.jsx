import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Video, ArrowRight, Users, Briefcase, Gamepad2, Mail, ShieldCheck, Zap, Clock } from "lucide-react"
import { normalizeCode } from "../utils/meetingCode"
import Seo from "../components/Seo"
import "./Home.css"

export default function Home() {
  const navigate = useNavigate()
  const [code, setCode] = useState("")

  const quickJoin = (e) => {
    e?.preventDefault()
    const c = normalizeCode(code)
    if (c) navigate(`/meet/${c}`)
  }

  return (
    <div className="sp-">
      <Seo path="/" />

      {/* header */}
      <header className="sp-header">
        <div className="sp-wrap sp-header-inner">
          <button className="sp-logo" onClick={() => navigate("/")}>OneSpace Live</button>
          <nav className="sp-nav">
            <button onClick={() => navigate("/create")}>Meetings</button>
            <button onClick={() => navigate("/create")}>Classroom</button>
            <button onClick={() => navigate("/create")}>Watch Party</button>
            <button onClick={() => navigate("/blog")}>Blog</button>
            <button onClick={() => navigate("/about")}>About</button>
          </nav>
          <button className="sp-btn sp-btn-primary" onClick={() => navigate("/create")}>
            Meet Now <ArrowRight size={16} />
          </button>
        </div>
      </header>

      {/* hero */}
      <section className="sp-hero">
        {/* floating coins */}
        <div className="sp-coins" aria-hidden>
          {["🎥","📹","🎙️","💬","📺","🖥️","📊","🔒","🎵","📋","✋","📡"].map((e, i) => (
            <span key={i} className={`sp-coin sp-coin-${i + 1}`}>{e}</span>
          ))}
        </div>
        <div className="sp-wrap sp-hero-inner">
          <h1 className="sp-hero-title">
            It&rsquo;s only fun<br />if you&rsquo;re <span className="sp-accent">winning.</span>
          </h1>
          <div className="sp-hero-unit">
            <img src="/toons/toon-1.webp" alt="" aria-hidden />
          </div>
          <p className="sp-hero-sub">
            Video meetings, classrooms, watch parties and shared music - all in one fast browser room. No signup, no download.
          </p>
          <div className="sp-hero-cta">
            <button className="sp-btn sp-btn-primary big" onClick={() => navigate("/create")}>Meet Now <ArrowRight size={18} /></button>
            <button className="sp-btn sp-btn-ghost big" onClick={() => navigate("/join")}>Join with code</button>
          </div>
          <form className="sp-join" onSubmit={quickJoin}>
            <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="ENTER CODE" aria-label="Meeting code" maxLength={10} />
            <button type="submit">Join</button>
          </form>
        </div>
      </section>

      {/* being super */}
      <section className="sp-section sp-being">
        <div className="sp-wrap">
          <h2 className="sp-big">
            BEING SUPER<br />
            means <a href="/about" className="sp-link">we</a> love to<br />
            PUSH OUR LIMITS
          </h2>
          <div className="sp-fragments">
            {[1,2,3,4,5,6,7].map((n) => (
              <div key={n} className="sp-frag" style={{ background: `hsl(${(n * 47) % 360} 70% 85%)` }}>
                <img src={`/toons/toon-${((n - 1) % 4) + 1}.webp`} alt="" aria-hidden loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* careers-ish */}
      <section className="sp-section sp-careers">
        <div className="sp-wrap sp-careers-inner">
          <div className="sp-careers-text">
            <h2 className="sp-big">
              And<br />
              we aim to<br />
              find <a href="/about" className="sp-link">people</a><br />
              who feel the same way
            </h2>
            <p className="sp-sub">
              We build for teams who want meetings that move. If that sounds like you, come build with us.
            </p>
          </div>
          <div className="sp-careers-visual">
            <div className="sp-dominoes">
              {[1,2,3,4].map((n) => (
                <span key={n} className={`sp-domino sp-domino-${n}`} />
              ))}
            </div>
            <img className="sp-unit" src="/toons/toon-2.webp" alt="" aria-hidden />
          </div>
        </div>
      </section>

      {/* winners */}
      <section className="sp-section sp-winners">
        <div className="sp-wrap sp-winners-inner">
          <h2 className="sp-big center">
            Because<br />
            it takes<br />
            winners to build<br />
            winning <a href="/create" className="sp-link">rooms</a>
          </h2>
          <p className="sp-sub center">Get exploring.</p>
          <div className="sp-explore">
            <button className="sp-explore-card" onClick={() => navigate("/about")}>
              <span>About Us</span><ArrowRight size={18} />
            </button>
            <button className="sp-explore-card" onClick={() => navigate("/create")}>
              <span>Your Career</span><ArrowRight size={18} />
            </button>
            <button className="sp-explore-card" onClick={() => navigate("/create")}>
              <span>Our Rooms</span><ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* trust */}
      <section className="sp-trust">
        <div className="sp-wrap sp-trust-inner">
          {[
            { v: "3s", l: "to join - no signup" },
            { v: "1080p", l: "adaptive video" },
            { v: "50", l: "seats per room" },
          ].map((s) => (
            <div key={s.l} className="sp-trust-item">
              <p className="sp-trust-v">{s.v}</p>
              <p className="sp-trust-l">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* footer */}
      <footer className="sp-footer">
        <div className="sp-wrap sp-footer-inner">
          <div className="sp-footer-col">
            <button className="sp-logo" onClick={() => navigate("/")}>OneSpace Live</button>
            <p className="sp-footer-tag">Live meetings for modern teams.</p>
          </div>
          <div className="sp-footer-col">
            <span className="sp-footer-t">Product</span>
            <a href="/create">Meetings</a>
            <a href="/create">Classroom</a>
            <a href="/create">Watch Party</a>
            <a href="/blog">Blog</a>
          </div>
          <div className="sp-footer-col">
            <span className="sp-footer-t">Info</span>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/about">About</a>
            <a href="mailto:hello@onespace.live">Contact</a>
          </div>
        </div>
        <div className="sp-wrap">
          <p className="sp-copy">2026 OneSpace Live. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  )
}
