import { useEffect } from "react"

const SITE_URL = "https://onespace-live.vercel.app"
const DEFAULT_IMAGE = `${SITE_URL}/og-cover.jpg`
const DEFAULT_TITLE = "OneSpace Live — No-Signup Video Meetings & Live Classes"

function upsertMeta(attr, key, value, content) {
  if (!content) return
  const selector = `meta[${attr}="${key}"]`
  let el = document.querySelector(selector)
  if (!el) {
    el = document.createElement("meta")
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute(value, content)
}

function upsertLink(rel, href) {
  if (!href) return
  let el = document.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement("link")
    el.setAttribute("rel", rel)
    document.head.appendChild(el)
  }
  el.setAttribute("href", href)
}

/**
 * Sets title, description, canonical, OG + Twitter tags per route.
 * Pass `noindex: true` for private pages (meeting rooms, 404).
 */
export default function Seo({
  title = DEFAULT_TITLE,
  description = "OneSpace Live — no-signup video meetings, live classrooms, whiteboard, screen share, YouTube watch parties and polls. Meet. Teach. Share. Play. Together.",
  path = "/",
  image = DEFAULT_IMAGE,
  noindex = false,
}) {
  useEffect(() => {
    const prevTitle = document.title
    const descEl = document.querySelector('meta[name="description"]')
    const prevDesc = descEl?.getAttribute("content")
    const robotsEl = document.querySelector('meta[name="robots"]')
    const prevRobots = robotsEl?.getAttribute("content")
    const canonEl = document.querySelector('link[rel="canonical"]')
    const prevCanon = canonEl?.getAttribute("href")

    const url = `${SITE_URL}${path}`
    document.title = title
    upsertMeta("name", "description", "content", description)
    upsertMeta("name", "robots", "content", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large")
    upsertLink("canonical", url)
    upsertMeta("property", "og:title", "content", title)
    upsertMeta("property", "og:description", "content", description)
    upsertMeta("property", "og:url", "content", url)
    upsertMeta("property", "og:type", "content", "website")
    upsertMeta("property", "og:image", "content", image)
    upsertMeta("name", "twitter:title", "content", title)
    upsertMeta("name", "twitter:description", "content", description)
    upsertMeta("name", "twitter:image", "content", image)

    return () => {
      document.title = prevTitle || DEFAULT_TITLE
      if (descEl && prevDesc) descEl.setAttribute("content", prevDesc)
      if (robotsEl && prevRobots) robotsEl.setAttribute("content", prevRobots)
      if (canonEl && prevCanon) canonEl.setAttribute("href", prevCanon)
    }
  }, [title, description, path, image, noindex])

  return null
}

export { SITE_URL, DEFAULT_TITLE }
