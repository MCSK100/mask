import { Link } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import {
  ArrowDownRight,
  ArrowRight,
  BookOpen,
  Check,
  MessageCircle,
  MonitorUp,
  PenTool,
  Play,
  Users,
  Video,
} from "lucide-react"
import Seo from "../components/Seo"
import "./Home.css"

const features = [
  {
    number: "01",
    title: "Meet face to face",
    description: "Bring your team, students, or community into a live room with real-time audio and video.",
    Icon: Video,
  },
  {
    number: "02",
    title: "Think on the same canvas",
    description: "Sketch ideas and explain a concept together on the shared whiteboard.",
    Icon: PenTool,
  },
  {
    number: "03",
    title: "Show, don't just tell",
    description: "Share your screen to walk through a lesson, a prototype, or a workflow.",
    Icon: MonitorUp,
  },
  {
    number: "04",
    title: "Keep the conversation moving",
    description: "Use live chat, polls, and supported shared media without leaving the room.",
    Icon: MessageCircle,
  },
]

const useCases = [
  ["Online classes", "Teach, explain, and check in with learners from anywhere.", BookOpen],
  ["Team meetings", "Share updates and work through the next decision together.", Users],
  ["Study groups", "Compare notes, solve problems, and keep everyone involved.", PenTool],
  ["Workshops", "Demonstrate a process and make space for questions as you go.", MonitorUp],
]

const faqs = [
  {
    question: "Do participants need an account?",
    answer: "Participants can join from a room link or code with a display name. Room creation and joining are available directly in the app.",
  },
  {
    question: "How do I start a live class?",
    answer: "Create a room, enter your name and a title, then share its link or code. In the room, use the available video, chat, whiteboard, and host controls.",
  },
  {
    question: "Can I share my screen?",
    answer: "The meeting toolbar includes screen sharing. It depends on browser support and permission to share a screen or window.",
  },
  {
    question: "Does OneSpace Live have a whiteboard?",
    answer: "Yes. The live room includes a collaborative whiteboard when the feature is enabled for the application.",
  },
  {
    question: "Can I use it on mobile?",
    answer: "The site adapts to smaller screens. Audio, camera, and screen-sharing options depend on your mobile browser and device permissions.",
  },
  {
    question: "Is OneSpace Live free?",
    answer: "You can create a room in the current app without selecting a paid plan. Availability depends on the service configuration and capacity.",
  },
]

function Wordmark() {
  return (
    <Link className="os-wordmark" to="/" aria-label="OneSpace Live home">
      <span className="os-wordmark-icon"><Video size={16} /></span>
      <span>OneSpace <span className="os-wordmark-light">Live</span></span>
    </Link>
  )
}

export default function Home() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="os-home">
      <Seo path="/" />
      <section className="os-hero" id="top">
        <video className="os-hero-video" src="/hero.mp4" autoPlay muted loop playsInline aria-hidden="true" />
        <div className="os-hero-shade" />
        <header className="os-nav-wrap">
          <nav className="os-nav" aria-label="Main navigation">
            <Wordmark />
            <div className="os-nav-links">
              <a href="#features">Features</a>
              <a href="#how-it-works">How it works</a>
              <a href="#use-cases">Use cases</a>
              <a href="#faq">FAQ</a>
            </div>
            <div className="os-nav-actions">
              <Link className="os-nav-join" to="/join">Join a room</Link>
              <Link className="os-button os-button-small" to="/create">Start a room <ArrowRight size={15} /></Link>
            </div>
          </nav>
        </header>

        <div className="os-hero-content">
          <motion.p className="os-eyebrow" initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.6 }}>
            Your space. Your people. Your moment.
          </motion.p>
          <motion.h1 initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.75, delay: reduceMotion ? 0 : 0.08 }}>
            One space.<br /><em>Every conversation.</em>
          </motion.h1>
          <motion.p className="os-hero-copy" initial={reduceMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.65, delay: reduceMotion ? 0 : 0.2 }}>
            Bring your classes, meetings, and ideas together. Meet face to face, share your screen, and work things out on a live whiteboard.
          </motion.p>
          <motion.div className="os-hero-actions" initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.3 }}>
            <Link className="os-button" to="/create">Start a free room <ArrowRight size={17} /></Link>
            <Link className="os-button os-button-glass" to="/join"><Play size={15} /> Join a room</Link>
          </motion.div>
          <p className="os-microcopy"><Check size={14} /> No complicated setup. Join with a room link or code.</p>
          <div className="os-room-tools-preview" aria-label="Tools available in a OneSpace Live room">
            <span className="os-room-tools-label">In your room</span>
            <span><Video size={14} /> Video</span>
            <span><MonitorUp size={14} /> Share screen</span>
            <span><PenTool size={14} /> Whiteboard</span>
            <span><MessageCircle size={14} /> Chat</span>
          </div>
        </div>

        <a className="os-scroll" href="#features"><span>Explore the space</span><ArrowDownRight size={16} /></a>
        <span className="os-hero-index" aria-hidden="true">01 / 04</span>
      </section>

      <main>
      <section className="os-section os-features" id="features">
        <div className="os-section-heading">
          <p className="os-eyebrow os-eyebrow-dark">One room, more ways to connect</p>
          <h2>Everything you need<br /><em>to work together.</em></h2>
          <p>From live teaching to team collaboration, keep the conversation and the work in one shared space.</p>
        </div>
        <div className="os-feature-grid">
          {features.map(({ number, title, description, Icon }) => (
            <article className="os-feature" key={number}>
              <div className="os-feature-top"><span>{number}</span><Icon size={21} strokeWidth={1.6} /></div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="os-how" id="how-it-works">
        <div className="os-how-intro">
          <p className="os-eyebrow">A simpler way to get together</p>
          <h2>From link<br />to <em>live.</em></h2>
          <p>Skip the long setup. Make a space, invite your people, and get started.</p>
          <Link className="os-text-link" to="/create">Start your first session <ArrowRight size={16} /></Link>
        </div>
        <ol className="os-steps">
          <li><span>01</span><div><h3>Create your room</h3><p>Give your meeting or class a name and start a new room.</p></div></li>
          <li><span>02</span><div><h3>Invite your people</h3><p>Copy the room link or share its code with participants.</p></div></li>
          <li><span>03</span><div><h3>Connect and collaborate</h3><p>Meet, chat, share a screen, and use the tools available in your room.</p></div></li>
        </ol>
      </section>

      <section className="os-section os-use-cases" id="use-cases">
        <div className="os-section-heading os-section-heading-left">
          <p className="os-eyebrow os-eyebrow-dark">Made for showing up</p>
          <h2>One space.<br /><em>Many reasons.</em></h2>
        </div>
        <div className="os-use-grid">
          {useCases.map(([title, description, Icon], index) => (
            <article className="os-use-item" key={title}>
              <span className="os-use-number">0{index + 1}</span>
              <Icon size={20} strokeWidth={1.6} />
              <div><h3>{title}</h3><p>{description}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="os-privacy">
        <div className="os-privacy-mark"><span /><span /><span /></div>
        <div>
          <p className="os-eyebrow">Clear by design</p>
          <h2>Your space should feel<br /><em>simple and secure.</em></h2>
          <p>Join with a room link or code, then use the controls available in your session. Hosts can manage participant access with the room tools currently enabled.</p>
        </div>
        <Link className="os-button os-button-glass" to="/privacy">Read our privacy policy <ArrowRight size={16} /></Link>
      </section>

      <section className="os-section os-faq" id="faq">
        <div className="os-section-heading os-section-heading-left">
          <p className="os-eyebrow os-eyebrow-dark">Good to know</p>
          <h2>A few things<br /><em>you might ask.</em></h2>
        </div>
        <div className="os-faq-list">
          {faqs.map(({ question, answer }) => (
            <details key={question}>
              <summary>{question}<span aria-hidden="true">+</span></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="os-final-cta">
        <p className="os-eyebrow">Make room for a good conversation</p>
        <h2>Your next session<br /><em>starts here.</em></h2>
        <p>Bring everyone together and turn your next idea into a shared experience.</p>
        <div className="os-hero-actions">
          <Link className="os-button" to="/create">Create a room <ArrowRight size={17} /></Link>
          <Link className="os-button os-button-glass" to="/join">Join an existing room</Link>
        </div>
      </section>
      </main>

      <footer className="os-footer">
        <div className="os-footer-main">
          <div><Wordmark /><p>One simple space for meetings, classes, and collaboration.</p></div>
          <nav aria-label="Footer navigation">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#faq">FAQ</a>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/about">Contact</Link>
          </nav>
        </div>
        <p className="os-copyright">© {new Date().getFullYear()} OneSpace Live</p>
      </footer>
    </div>
  )
}
