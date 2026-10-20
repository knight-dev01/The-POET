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
      👏 <span>{count || ''}</span>
    </button>
  )
}
