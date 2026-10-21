import { useState } from 'react'
import { getClaps, addClap } from '../lib/engagement'

export default function ClapButton({ slug, initial = 0 }) {
  const [count, setCount] = useState(() => initial || getClaps(slug))
  return (
    <button
      className="icon-btn clap"
      title="Applaud"
      onClick={() => setCount(addClap(slug))}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M18 11V6a2 2 0 0 0-4 0v5"/><path d="M14 10V4a2 2 0 0 0-4 0v6"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>
      <span>{count || ''}</span>
    </button>
  )
}
