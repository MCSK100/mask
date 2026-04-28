/**
 * AI Fallback Feature
 * Simulates human-like chat when no real peer connects
 * Does NOT interfere with real socket connections
 */

import { isEnabled } from '../config/featureFlags'

const AI_MESSAGES = [
  "Hey! 👋",
  "How's your night going? 😊",
  "What's up? 😄",
  "Bored too? Haha",
  "Where are you from? 🌍",
  "This app is pretty cool",
  "Late night chats hit different 🌙",
  "You doing anything fun?",
  "Just chilling here",
  "Nice to meet someone new! ✨"
]

const AI_REPLIES = [
  "Same here! 😅",
  "Haha really?",
  "That's interesting",
  "Tell me more 👀",
  "I feel you",
  "Nice! 😊",
  "Same, just passing time",
  "Cool cool",
  "Yeah I get that",
  "Haha same energy 🔥"
]

let aiSession = null

function randomDelay(min = 1200, max = 3000) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateMessageId() {
  return `ai-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function createMessage(text, type = 'stranger') {
  const now = new Date()
  return {
    id: generateMessageId(),
    type,
    text,
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isoTime: now.toISOString()
  }
}

/**
 * Start AI fallback session
 * @param {object} callbacks
 * @param {Function} callbacks.onMessage - Called with new AI message
 * @param {Function} callbacks.onTyping - Called with boolean typing state
 * @param {Function} callbacks.onStatus - Called with status text update
 */
export function startAiFallback({ onMessage, onTyping, onStatus }) {
  if (!isEnabled('ENABLE_AI_FALLBACK')) return { stop: () => {} }

  // Clear any existing session
  stopAiFallback()

  const session = {
    active: true,
    timeouts: [],
    messageIndex: 0,
    replyMode: false
  }
  aiSession = session

  const addTimeout = (fn, delay) => {
    if (!session.active) return
    const id = setTimeout(() => {
      if (session.active) fn()
    }, delay)
    session.timeouts.push(id)
    return id
  }

  // Initial greeting after delay
  addTimeout(() => {
    if (!session.active) return
    onStatus?.("You are now chatting with someone nearby...")
    onTyping?.(true)

    addTimeout(() => {
      if (!session.active) return
      onTyping?.(false)
      const msg = createMessage(pickRandom(AI_MESSAGES))
      onMessage?.(msg)
      session.messageIndex++
      scheduleNext()
    }, randomDelay(800, 1500))
  }, randomDelay(500, 1200))

  function scheduleNext() {
    if (!session.active || session.messageIndex >= 8) return

    addTimeout(() => {
      if (!session.active) return
      onTyping?.(true)

      addTimeout(() => {
        if (!session.active) return
        onTyping?.(false)
        const replies = session.replyMode ? AI_REPLIES : AI_MESSAGES
        const msg = createMessage(pickRandom(replies))
        onMessage?.(msg)
        session.messageIndex++
        session.replyMode = !session.replyMode
        scheduleNext()
      }, randomDelay(1000, 2500))
    }, randomDelay(4000, 8000))
  }

  return {
    stop: () => stopAiFallback()
  }
}

/**
 * Stop AI fallback session immediately
 */
export function stopAiFallback() {
  if (aiSession) {
    aiSession.active = false
    aiSession.timeouts.forEach(clearTimeout)
    aiSession = null
  }
}

/**
 * Check if AI session is currently active
 */
export function isAiActive() {
  return aiSession?.active ?? false
}
