import { useState, useEffect } from 'react'
import { isEnabled } from '../config/featureFlags'

const INTEREST_TAGS = [
  { id: 'cinema', label: 'Cinema', emoji: '🎬' },
  { id: 'cricket', label: 'Cricket', emoji: '🏏' },
  { id: 'love', label: 'Love', emoji: '❤️' },
  { id: 'timepass', label: 'Timepass', emoji: '😄' },
  { id: 'gaming', label: 'Gaming', emoji: '🎮' },
  { id: 'music', label: 'Music', emoji: '🎵' }
]

const STORAGE_KEY = 'shadowchaty_filters'

export default function ChatFilters({ onChange }) {
  const enabled = isEnabled('ENABLE_FILTERS')
  const [nearbyMode, setNearbyMode] = useState(true)
  const [selectedTags, setSelectedTags] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedTags))
    } catch { /* fail silently */ }
  }, [selectedTags])

  // Notify parent of changes
  useEffect(() => {
    onChange?.({
      nearbyMode,
      tags: selectedTags
    })
  }, [nearbyMode, selectedTags, onChange])

  if (!enabled) return null

  const toggleTag = (tagId) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2 px-1 py-2">
      {/* Nearby Mode Toggle */}
      <button
        type="button"
        onClick={() => setNearbyMode(v => !v)}
        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
          nearbyMode
            ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-200'
            : 'border-slate-600/40 bg-slate-900/40 text-slate-400 hover:border-slate-500'
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
        Nearby Mode
      </button>

      <div className="h-4 w-px bg-slate-700/50" />

      {/* Interest Tags */}
      {INTEREST_TAGS.map(tag => {
        const active = selectedTags.includes(tag.id)
        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => toggleTag(tag.id)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              active
                ? 'border-fuchsia-500/40 bg-fuchsia-950/40 text-fuchsia-200'
                : 'border-slate-600/30 bg-slate-900/30 text-slate-400 hover:border-slate-500 hover:text-slate-300'
            }`}
          >
            {tag.emoji} {tag.label}
          </button>
        )
      })}
    </div>
  )
}
