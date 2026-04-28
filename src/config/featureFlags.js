/**
 * Feature Flags for Shadowchaty Growth UX
 * All new features are toggleable and isolated
 */

export const FEATURE_FLAGS = {
  /** Enable fake online count (80-250 fluctuating) */
  ENABLE_FAKE_COUNT: true,

  /** Enable AI fallback when no peer connects within timeout */
  ENABLE_AI_FALLBACK: true,

  /** Enable interest tags filter UI */
  ENABLE_FILTERS: true,

  /** Enable contextual status hints ("nearby", "night chat") */
  ENABLE_STATUS_HINTS: true,

  /** Enable hero urgency line and micro hooks */
  ENABLE_HERO_GROWTH: true,

  /** AI fallback timeout in ms (3-5 seconds) */
  AI_FALLBACK_TIMEOUT: 3500,

  /** Fake count fluctuation interval in ms (10-20 seconds) */
  FAKE_COUNT_INTERVAL: 15000,
}

/**
 * Helper to check if a feature is enabled
 * @param {string} flag - Feature flag key
 * @returns {boolean}
 */
export function isEnabled(flag) {
  try {
    // Allow runtime override via localStorage for testing
    const localOverride = localStorage.getItem(`flag_${flag}`)
    if (localOverride !== null) return localOverride === 'true'
    return FEATURE_FLAGS[flag] ?? false
  } catch {
    // Fail silently if localStorage is unavailable
    return FEATURE_FLAGS[flag] ?? false
  }
}
