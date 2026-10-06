import { Link } from "react-router-dom"
import LegalPageShell from "../components/LegalPageShell"

const contactEmail = "contact.onespacelive@gmail.com"

export default function AboutContact() {
  return (
    <LegalPageShell
      title="About & Contact"
      description="About OneSpace Live — no-signup video meetings, live classrooms and watch parties. Contact and site information."
    >
      <h2 className="text-2xl font-semibold text-white sm:text-3xl">About OneSpace Live</h2>
      <p className="text-sm text-slate-400 mb-8">OneSpace Live — no-signup video meetings</p>
      <p className="text-lg text-slate-300 leading-relaxed mb-8">
        OneSpace Live is a next-generation video meeting platform designed to connect people globally. 
        Our goal is to provide a fast, private, and modern room for meetings, classes and watch parties.
      </p>

      <h2 className="text-2xl font-semibold text-white sm:text-3xl">About / Contact</h2>
      <p className="text-sm text-slate-400">OneSpace Live — no-signup video meetings</p>

      <section className="space-y-4 text-sm leading-relaxed text-slate-300 sm:text-base">
        <h2 className="text-lg font-semibold text-white">What is OneSpace Live?</h2>
        <p>
          OneSpace Live is a lightweight way to meet for video, classroom sessions or watch parties without creating an account.
          Share a code and anyone can join instantly from the browser.
        </p>

        <h2 className="pt-2 text-lg font-semibold text-white">Safety</h2>
        <p>
          Treat others respectfully. Do not share personal data you are not comfortable exposing in a meeting. If
          someone makes you uncomfortable, leave the room or ask the host to remove them. Parents and guardians
          should know OneSpace Live is intended for adults 18+.
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
