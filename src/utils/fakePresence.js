/**
 * Fake Presence Utility
 * Generates fluctuating online count for social proof
 * Does NOT interfere with real socket connections
 */

const MIN_COUNT = 80
const MAX_COUNT = 250
const ABSOLUTE_MIN = 50
const FLUCTUATION_MIN = 10_000 // 10s
const FLUCTUATION_MAX = 20_000 // 20s
const TYPING_CHANCE = 0.25 // 25% chance to show typing

let currentCount = randomBetween(MIN_COUNT, MAX_COUNT)
let intervalId = null
let typingIntervalId = null
let listeners = []
let typingListeners = []

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Get next fluctuated count (smooth ±5-15 change)
 */
function nextCount() {
  const delta = randomBetween(5, 15)
  const direction = Math.random() > 0.5 ? 1 : -1
  let next = currentCount + delta * direction
  if (next < ABSOLUTE_MIN) next = ABSOLUTE_MIN + randomBetween(5, 15)
  if (next > MAX_COUNT) next = MAX_COUNT - randomBetween(5, 15)
  currentCount = next
  return currentCount
}

/**
 * Get random interval duration
 */
function nextInterval() {
  return randomBetween(FLUCTUATION_MIN, FLUCTUATION_MAX)
}

/**
 * Get formatted display string
 * @param {number} count
 * @returns {object} { text, icon }
 */
export function formatOnlineCount(count) {
  const icons = ['🔥', '🟢', '⚡']
  const icon = icons[Math.floor(Math.random() * icons.length)]
  const templates = [
    `${icon} ${count} online now`,
    `${icon} ${count} people chatting`,
    `${count} strangers online`
  ]
  return {
    text: templates[Math.floor(Math.random() * templates.length)],
    count,
    icon
  }
}

/**
 * Start fake presence simulation
 * @param {Function} onCount - callback(count)
 * @param {Function} onTyping - callback(boolean)
 * @returns {Function} stop function
 */
export function startFakePresence(onCount, onTyping) {
  // initial
  if (onCount) {
    onCount(currentCount)
    listeners.push(onCount)
  }
  if (onTyping) {
    typingListeners.push(onTyping)
  }

  if (!intervalId) {
    const tick = () => {
      const count = nextCount()
      listeners.forEach(fn => {
        try { fn(count) } catch {/* fail silently */}
      })
      intervalId = setTimeout(tick, nextInterval())
    }
    intervalId = setTimeout(tick, nextInterval())
  }

  // Optional typing indicator simulation
  if (onTyping && !typingIntervalId) {
    const typingTick = () => {
      const isTyping = Math.random() < TYPING_CHANCE
      typingListeners.forEach(fn => {
        try { fn(isTyping) } catch {/* fail silently */}
      })
      typingIntervalId = setTimeout(typingTick, randomBetween(8_000, 15_000))
    }
    typingIntervalId = setTimeout(typingTick, randomBetween(5_000, 12_000))
  }

  return () => stopFakePresence(onCount, onTyping)
}

/**
 * Stop fake presence simulation
 */
export function stopFakePresence(onCount, onTyping) {
  if (onCount) listeners = listeners.filter(fn => fn !== onCount)
  if (onTyping) typingListeners = typingListeners.filter(fn => fn !== onTyping)

  if (!listeners.length && intervalId) {
    clearTimeout(intervalId)
    intervalId = null
  }
  if (!typingListeners.length && typingIntervalId) {
    clearTimeout(typingIntervalId)
    typingIntervalId = null
  }
}

/** Get current count without starting simulation */
export function getCurrentFakeCount() {
  return currentCount
}

/** Reset to a fresh random count */
export function resetFakeCount() {
  currentCount = randomBetween(MIN_COUNT, MAX_COUNT)
  return currentCount
}
