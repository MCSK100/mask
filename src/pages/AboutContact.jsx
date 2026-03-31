import { Link } from "react-router-dom"
import LegalPageShell from "../components/LegalPageShell"

const contactEmail = "contact.shadowchaty@gmail.com"

export default function AboutContact() {
  return (
    <LegalPageShell
      title="About & Contact"
      description="About Shadowchaty — anonymous stranger text and video chat. Contact and site information."
    >
      <h1 className="text-2xl font-semibold text-white sm:text-3xl">About Shadowchaty</h1>
      <p className="text-sm text-slate-400 mb-8">Shadowchaty — anonymous stranger chat</p>
      <p className="text-lg text-slate-300 leading-relaxed mb-8">
        Shadowchaty is a next-generation random video chat platform designed to connect people globally. 
        Our goal is to provide a safe, fast, and modern alternative to traditional chat platforms like Omegle.
      </p>

      <h1 className="text-2xl font-semibold text-white sm:text-3xl">About / Contact</h1>
      <p className="text-sm text-slate-400">Shadowchaty — anonymous stranger chat</p>

      <section className="space-y-4 text-sm leading-relaxed text-slate-300 sm:text-base">
        <h2 className="text-lg font-semibold text-white">What is Shadowchaty?</h2>
        <p>
          Shadowchaty is a lightweight way to meet strangers for text or video conversations without creating an account.
          Matches are random; you can skip to the next person when you want a new chat.
        </p>

        <h2 className="pt-2 text-lg font-semibold text-white">Safety</h2>
        <p>
          Treat others respectfully. Do not share personal data you are not comfortable exposing to strangers. If
          someone makes you uncomfortable, use "Next Stranger" and leave the chat. Parents and guardians
          should know Shadowchaty is intended for adults 18+.
        </p>

        <h2 className="pt-2 text-lg font-semibold text-white">Technology</h2>
        <p>
          Text chat uses a realtime connection through our servers. Video uses WebRTC when supported by your browser,
          with optional relay (TURN) servers for difficult networks. See our Privacy Policy for how data is handled.
        </p>

        <h2 className="pt-2 text-lg font-semibold text-white">Contact</h2>
        <p>
          For privacy requests, abuse reports, or partnership inquiries, email:{" "}
          <a href={`mailto:${contactEmail}`} className="break-all text-violet-400 underline hover:text-violet-300">
            {contactEmail}
          </a>
          .
        </p>


        <h2 className="pt-2 text-lg font-semibold text-white">Legal</h2>
        <p className="flex flex-wrap gap-x-4 gap-y-2">
          <Link to="/privacy" className="text-violet-400 underline hover:text-violet-300">
            Privacy Policy
          </Link>
          <Link to="/terms" className="text-violet-400 underline hover:text-violet-300">
            Terms & Conditions
          </Link>
        </p>
      </section>
    </LegalPageShell>
  )
}
