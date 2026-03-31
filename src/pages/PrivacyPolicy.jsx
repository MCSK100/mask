import { Link } from "react-router-dom"
import LegalPageShell from "../components/LegalPageShell"

export default function PrivacyPolicy() {
  return (
    <LegalPageShell
      title="Privacy Policy"
      description="How Shadowchaty handles data for anonymous stranger text and video chat — privacy policy."
    >
      <h1 className="text-2xl font-semibold text-white sm:text-3xl">Privacy Policy</h1>
      <p className="text-sm text-slate-400">Last updated: March 28, 2026</p>

      <section className="space-y-3 text-sm leading-relaxed text-slate-300 sm:text-base">
        <h2 className="text-lg font-semibold text-white">1. Overview</h2>
        <p>
          Shadowchaty ("we", "us") provides anonymous text and video chat between strangers. This policy
          describes what information may be processed when you use our website and realtime service, and your
          choices. By using Shadowchaty, you agree to this policy.
        </p>

        <h2 className="pt-2 text-lg font-semibold text-white">2. No accounts</h2>
        <p>
          Shadowchaty does not require registration. We do not ask for your name, email, or phone number to use basic chat
          features.
        </p>

        <h2 className="pt-2 text-lg font-semibold text-white">3. Messages and media</h2>
        <p>
          <strong className="text-slate-200">Text chat:</strong> Messages are relayed through our servers to your
          matched stranger. We may apply technical limits (e.g. length, rate limits) for abuse prevention. We do not
          intend to store chat transcripts for marketing purposes.
        </p>
        <p>
          <strong className="text-slate-200">Video chat:</strong> Video and audio may be sent peer-to-peer using
          WebRTC when possible. Connection setup can involve signaling through our servers. Some networks require relay
          servers (TURN); if configured, media may pass through those providers per their terms.
        </p>

        <h2 className="pt-2 text-lg font-semibold text-white">4. Log and technical data</h2>
        <p>
          Like most websites, we may process technical data such as IP address, device/browser type, general location
          (derived from IP), timestamps, and diagnostic logs to operate, secure, and improve the service and to detect
          abuse.
        </p>

        <h2 className="pt-2 text-lg font-semibold text-white">5. Cookies and similar technologies</h2>
        <p>
          We may use cookies or local storage for essential functionality, preferences, or analytics if enabled. You can
          control cookies through your browser settings.
        </p>

        <h2 className="pt-2 text-lg font-semibold text-white">6. Advertising</h2>
        <p>
          If third-party ads are shown, those partners may collect information under their own privacy policies. We
          encourage you to review the policies of any ad networks you interact with.
        </p>

        <h2 className="pt-2 text-lg font-semibold text-white">7. Children</h2>
        <p>
          Shadowchaty is not intended for users under 18. If you believe a minor has used the service, contact us using the
          details on the About page.
        </p>

        <h2 className="pt-2 text-lg font-semibold text-white">8. Data retention</h2>
        <p>
          We retain technical and security-related information only as long as reasonably necessary for the purposes
          above, unless a longer period is required by law.
        </p>

        <h2 className="pt-2 text-lg font-semibold text-white">9. Your rights</h2>
        <p>
          Depending on where you live, you may have rights to access, correct, delete, or restrict certain processing of
          personal information. Contact us to make a request. We may need to verify your request where permitted by law.
        </p>

        <h2 className="pt-2 text-lg font-semibold text-white">10. Changes</h2>
        <p>
          We may update this policy from time to time. The "Last updated" date will change when revisions are
          posted. Continued use after changes means you accept the updated policy.
        </p>

        <h2 className="pt-2 text-lg font-semibold text-white">11. Contact</h2>
        <p>
          Questions about privacy? Visit{" "}
          <Link to="/about" className="text-violet-400 underline hover:text-violet-300">
            About / Contact
          </Link>
          .
        </p>
      </section>
    </LegalPageShell>
  )
}
