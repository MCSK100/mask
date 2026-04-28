import { useEffect, useState, useCallback } from 'react'
import { startFakePresence, stopFakePresence, formatOnlineCount } from '../utils/fakePresence'
import { isEnabled } from '../config/featureFlags'

/**
 * React hook for fake online presence
 * Returns fluctuating count and optional typing indicator
 * Falls back to real count if feature disabled
 */
export function useFakePresence({ realCount = 0 } = {}) {
  const enabled = isEnabled('ENABLE_FAKE_COUNT')

  const [fakeCount, setFakeCount] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [formattedCount, setFormattedCount] = useState(null)

  useEffect(() => {
    if (!enabled) return

    const stop = startFakePresence(
      (count) => {
        setFakeCount(count)
        setFormattedCount(formatOnlineCount(count))
      },
      (typing) => setIsTyping(typing)
    )

    return () => stop()
  }, [enabled])

  // When disabled, use real count
  const displayCount = enabled ? fakeCount : realCount
  const displayFormatted = enabled
    ? formattedCount
    : formatOnlineCount(realCount)

  return {
    count: displayCount,
    formatted: displayFormatted,
    isTyping,
    isEnabled: enabled
  }
}
