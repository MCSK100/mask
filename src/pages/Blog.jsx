import { Link } from "react-router-dom"
import LegalPageShell from "../components/LegalPageShell"

export default function Blog() {
  return (
    <LegalPageShell
      title="Blog"
      description="OneSpace Live blog — video meeting tips, online classroom guides, and watch-party ideas."
    >
      <h2 className="text-2xl font-semibold text-white sm:text-3xl">OneSpace Live Blog</h2>
      <p className="text-sm text-slate-400 mb-8">Latest articles about video meetings, online classes, and watch parties</p>

      <section className="space-y-8 text-sm leading-relaxed text-slate-300 sm:text-base">
        <article className="space-y-4">
          <h2 className="text-xl font-semibold text-white border-b border-slate-700 pb-2">How to Stay Safe in Online Video Meetings</h2>
          <p>
            Video meeting platforms like OneSpace Live connect you with teams and classmates instantly. While fun and productive, safety should always come first.
          </p>
          <ul className="list-disc pl-6 space-y-1 text-slate-300">
            <li>Never share personal information (address, phone number, passwords) in a shared room</li>
            <li>Avoid clicking suspicious links shared in chat</li>
            <li>Use private codes and host controls for sensitive meetings</li>
            <li>Report abusive behavior using our contact form</li>
            <li>Keep conversations respectful — treat others with respect</li>
          </ul>
          <p className="text-sm text-slate-400 mt-4 italic">
            OneSpace Live is for adults 18+. Parents should monitor children's internet use.
          </p>
        </article>

        <article className="space-y-4">
          <h2 className="text-xl font-semibold text-white border-b border-slate-700 pb-2">Why OneSpace Live is the Best Free Meeting App in 2026</h2>
          <p>
            Many meeting tools are slow or require downloads. OneSpace Live offers modern features:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-slate-300">
            <li>Clean, fast video meetings (no lag)</li>
            <li>Beautiful modern interface</li>
            <li>No signup required — join with a code</li>
            <li>LiveKit-powered video for privacy and quality</li>
            <li>Works worldwide in the browser</li>
            <li>Whiteboard, polls, chat + watch parties</li>
          </ul>
        </article>

        <article className="space-y-4">
          <h2 className="text-xl font-semibold text-white border-b border-slate-700 pb-2">Tips for Great Online Meetings and Classes</h2>
          <p>
            Get the most out of your OneSpace Live experience:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-slate-300">
            <li>Start with "Hi" or "Hello there!"</li>
            <li>Ask open-ended questions ("What do you enjoy doing?")</li>
            <li>Share fun facts about yourself</li>
            <li>Use emojis to express emotions</li>
            <li>Be patient - not every match clicks</li>
            <li>Next Stranger is always one click away</li>
          </ul>
        </article>
      </section>

      <section className="mt-12 pt-8 border-t border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4">More Reading</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Link to="/" className="block p-4 rounded-xl border border-slate-700/50 hover:border-violet-400/50 hover:bg-slate-900/30 transition">
            <h3 className="font-semibold text-white">Free Video Meeting Guide</h3>
            <p className="text-slate-400 text-sm mt-1">Everything you need to know about no-signup video meetings</p>
          </Link>
          <Link to="/about" className="block p-4 rounded-xl border border-slate-700/50 hover:border-violet-400/50 hover:bg-slate-900/30 transition">
            <h3 className="font-semibold text-white">About OneSpace Live Platform</h3>
            <p className="text-slate-400 text-sm mt-1">Technology, safety, and features</p>
          </Link>
        </div>
      </section>
    </LegalPageShell>
  )
}
