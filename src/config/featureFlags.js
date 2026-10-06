/**
 * OneSpace Live feature flags (env-overridable).
 * VITE_FEATURE_* wins over defaults.
 */
function envBool(key, fallback) {
  const v = import.meta.env?.[key]
  if (v === undefined) return fallback
  return String(v).toLowerCase() === "true"
}

export const FEATURES = {
  YOUTUBE: envBool("VITE_FEATURE_YOUTUBE", true),
  MUSIC: envBool("VITE_FEATURE_MUSIC", true),
  WHITEBOARD: envBool("VITE_FEATURE_WHITEBOARD", true),
  RECORDING: envBool("VITE_FEATURE_RECORDING", true),
  STREAMING: envBool("VITE_FEATURE_STREAMING", false),
  POLLS: envBool("VITE_FEATURE_POLLS", true),
  FILES: envBool("VITE_FEATURE_FILES", true),
  CLASSROOM: envBool("VITE_FEATURE_CLASSROOM", true)
}

// legacy export kept for old components until removed
export const FEATURE_FLAGS = {
  ENABLE_FAKE_COUNT: false,
  ENABLE_AI_FALLBACK: false,
  ENABLE_FILTERS: false,
  ENABLE_STATUS_HINTS: false,
  ENABLE_HERO_GROWTH: false
}

export function isEnabled(flag) {
  return FEATURE_FLAGS[flag] ?? false
}
