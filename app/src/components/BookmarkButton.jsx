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
      {saved ? '★' : '☆'}
    </button>
  )
}
