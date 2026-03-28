import { Link } from "react-router-dom"
import LegalPageShell from "../components/LegalPageShell"

export default function Terms() {
  return (
    <LegalPageShell
      title="Terms & Conditions"
      description="Terms and conditions for using Mask anonymous stranger chat and video."
    >
      <h1 className="text-2xl font-semibold text-white sm:text-3xl">Terms &amp; Conditions</h1>
      <p className="text-sm text-slate-400">Last updated: March 28, 2026</p>

      <section className="space-y-3 text-sm leading-relaxed text-slate-300 sm:text-base">
        <h2 className="text-lg font-semibold text-white">1. Agreement</h2>
        <p>
          These Terms govern your use of Mask (the &quot;Service&quot;). By accessing or using the Service, you agree
          to these Terms. If you do not agree, do not use the Service.
        </p>

        <h2 className="pt-2 text-lg font-semibold text-white">2. Eligibility</h2>
        <p>You must be at least 18 years old to use the Service. By using Mask, you represent that you meet this age requirement.</p>

        <h2 className="pt-2 text-lg font-semibold text-white">3. Anonymous use</h2>
        <p>
          The Service is designed for casual, anonymous conversations. You are responsible for your conduct. Do not
          use the Service to harass, threaten, hate speech, exploit, or harm others, or to share illegal content.
        </p>

        <h2 className="pt-2 text-lg font-semibold text-white">4. Prohibited conduct</h2>
        <p>You agree not to:</p>
        <ul className="list-inside list-disc space-y-1 pl-1 text-slate-400">
          <li>Violate any applicable law or regulation</li>
          <li>Spam, scam, phish, or distribute malware</li>
          <li>Record, capture, or redistribute others&apos; video, audio, or messages without their consent where required by law</li>
          <li>Attempt to reverse engineer, overload, or disrupt the Service</li>
          <li>Bypass safety or rate limits</li>
        </ul>

        <h2 className="pt-2 text-lg font-semibold text-white">5. Monitoring and enforcement</h2>
        <p>
          We may use automated or manual measures to protect users and the platform, including rate limits, blocks, or
          termination of access. We are not obligated to monitor all content but may do so where appropriate.
        </p>

        <h2 className="pt-2 text-lg font-semibold text-white">6. Disclaimers</h2>
        <p>
          THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND,
          WHETHER EXPRESS OR IMPLIED. WE DO NOT WARRANT UNINTERRUPTED OR ERROR-FREE OPERATION. Stranger-to-stranger chat
          involves risk; you interact at your own discretion.
        </p>

        <h2 className="pt-2 text-lg font-semibold text-white">7. Limitation of liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, MASK AND ITS OPERATORS WILL NOT BE LIABLE FOR ANY INDIRECT,
          INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF DATA, PROFITS, OR GOODWILL, ARISING
          FROM YOUR USE OF THE SERVICE.
        </p>

        <h2 className="pt-2 text-lg font-semibold text-white">8. Third-party services</h2>
        <p>
          The Service may rely on third-party infrastructure (hosting, realtime, WebRTC relays, advertising). Your use of
          those components may be subject to third-party terms.
        </p>

        <h2 className="pt-2 text-lg font-semibold text-white">9. Changes</h2>
        <p>
          We may modify these Terms. Material changes may be indicated by updating the &quot;Last updated&quot; date.
          Continued use constitutes acceptance of the revised Terms.
        </p>

        <h2 className="pt-2 text-lg font-semibold text-white">10. Contact</h2>
        <p>
          For legal questions, see{" "}
          <Link to="/about" className="text-violet-400 underline hover:text-violet-300">
            About / Contact
          </Link>
          .
        </p>
      </section>
    </LegalPageShell>
  )
}
