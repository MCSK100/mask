/**
 * Shadowchaty Service Worker
 * Enables PWA install + lightweight offline caching.
 */

const CACHE_VERSION = "shadowchaty-v1"
const STATIC_CACHE = `${CACHE_VERSION}-static`
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`

const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/shadowchaty-favicon.jpg",
  "/shadowchaty-logo.png",
  "/favicon.png",
  "/favicon.svg"
]

self.addEventListener("install", (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS).catch(() => null))
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== RUNTIME_CACHE)
          .map((key) => caches.delete(key))
      )
      await self.clients.claim()
    })()
  )
})

self.addEventListener("fetch", (event) => {
  const { request } = event

  if (request.method !== "GET") return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request)
          const cache = await caches.open(RUNTIME_CACHE)
          cache.put(request, fresh.clone())
          return fresh
        } catch {
          const cached = await caches.match("/index.html")
          return cached || new Response("Offline", { status: 503, statusText: "Offline" })
        }
      })()
    )
    return
  }

  event.respondWith(
    (async () => {
      const cached = await caches.match(request)
      if (cached) return cached
      try {
        const fresh = await fetch(request)
        if (fresh && fresh.status === 200 && fresh.type === "basic") {
          const cache = await caches.open(RUNTIME_CACHE)
          cache.put(request, fresh.clone())
        }
        return fresh
      } catch {
        return cached || new Response("Offline", { status: 503, statusText: "Offline" })
      }
    })()
  )
})

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})
