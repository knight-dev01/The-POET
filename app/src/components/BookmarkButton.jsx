import { useState } from 'react'
import { isBookmarked, toggleBookmark } from '../lib/engagement'

export default function BookmarkButton({ slug }) {
  const [saved, setSaved] = useState(() => isBookmarked(slug))
  return (
    <button
      className={`icon-btn ${saved ? 'on' : ''}`}
      title={saved ? 'Remove from library' : 'Save to library'}
      onClick={() => setSaved(toggleBookmark(slug))}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
    </button>
  )
}
