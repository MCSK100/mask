import { Link } from "react-router-dom"
import LegalPageShell from "../components/LegalPageShell"

export default function Blog() {
  return (
    <LegalPageShell
      title="Blog"
      description="Shadowchaty blog - Random video chat tips, Omegle alternatives, stranger chat safety."
    >
      <h1 className="text-2xl font-semibold text-white sm:text-3xl">Shadowchaty Blog</h1>
      <p className="text-sm text-slate-400 mb-8">Latest articles about random video chat, safety tips, and Omegle alternatives</p>

      <section className="space-y-8 text-sm leading-relaxed text-slate-300 sm:text-base">
        <article className="space-y-4">
          <h2 className="text-xl font-semibold text-white border-b border-slate-700 pb-2">How to Stay Safe on Random Video Chat Platforms</h2>
          <p>
            Random video chat platforms like Shadowchaty connect you with strangers worldwide instantly. While fun and exciting, safety should always come first.
          </p>
          <ul className="list-disc pl-6 space-y-1 text-slate-300">
            <li>Never share personal information (name, address, phone number, social media)</li>
            <li>Avoid sharing financial details or clicking suspicious links</li>
            <li>Use "Next Stranger" immediately if someone makes you uncomfortable</li>
            <li>Report abusive behavior using our contact form</li>
            <li>Keep conversations light and fun - treat others with respect</li>
          </ul>
          <p className="text-sm text-slate-400 mt-4 italic">
            Shadowchaty is for adults 18+. Parents should monitor children's internet use.
          </p>
        </article>

        <article className="space-y-4">
          <h2 className="text-xl font-semibold text-white border-b border-slate-700 pb-2">Why Shadowchaty is the Best Omegle Alternative in 2026</h2>
          <p>
            Omegle was great but has moderation issues. Shadowchaty offers modern features:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-slate-300">
            <li>Clean, fast WebRTC video chat (no lag)</li>
            <li>Beautiful neon interface</li>
            <li>No signup required - instant matching</li>
            <li>Peer-to-peer encryption for privacy</li>
            <li>Works worldwide with TURN relay support</li>
            <li>Text + video options</li>
          </ul>
        </article>

        <article className="space-y-4">
          <h2 className="text-xl font-semibold text-white border-b border-slate-700 pb-2">Tips for Great Random Stranger Conversations</h2>
          <p>
            Get the most out of your Shadowchaty experience:
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
            <h3 className="font-semibold text-white">Free Random Video Chat Guide</h3>
            <p className="text-slate-400 text-sm mt-1">Everything you need to know about stranger video chat</p>
          </Link>
          <Link to="/about" className="block p-4 rounded-xl border border-slate-700/50 hover:border-violet-400/50 hover:bg-slate-900/30 transition">
            <h3 className="font-semibold text-white">About Shadowchaty Platform</h3>
            <p className="text-slate-400 text-sm mt-1">Technology, safety, and features</p>
          </Link>
        </div>
      </section>
    </LegalPageShell>
  )
}
