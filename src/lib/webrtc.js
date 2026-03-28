/**
 * ICE server list for WebRTC. STUN alone helps many NAT cases; symmetric NAT / strict
 * firewalls usually need TURN. Set VITE_TURN_URLS, VITE_TURN_USERNAME, VITE_TURN_CREDENTIAL
 * (e.g. Twilio, Cloudflare, Metered, self-hosted coturn).
 */
const PUBLIC_STUN = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  { urls: "stun:stun2.l.google.com:19302" },
  { urls: "stun:stun3.l.google.com:19302" },
  { urls: "stun:stun4.l.google.com:19302" },
  { urls: "stun:global.stun.twilio.com:3478" }
]

function parseTurnUrls(raw) {
  if (!raw || typeof raw !== "string") return []
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

/** @returns {RTCIceServer[]} */
export function getIceServers() {
  const servers = [...PUBLIC_STUN]

  const urls = parseTurnUrls(import.meta.env.VITE_TURN_URLS)
  const username = import.meta.env.VITE_TURN_USERNAME
  const credential = import.meta.env.VITE_TURN_CREDENTIAL

  if (urls.length && username && credential) {
    servers.push({ urls, username, credential })
  }

  return servers
}
