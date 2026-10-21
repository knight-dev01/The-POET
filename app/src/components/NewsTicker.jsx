import { useEffect, useState } from 'react'

export default function NewsTicker() {
  const [items, setItems] = useState([])
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    let alive = true
    fetch('/api/news')
      .then((r) => r.json())
      .then((d) => {
        if (alive && Array.isArray(d.items)) setItems(d.items)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    if (items.length < 2) return
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 6000)
    return () => clearInterval(t)
  }, [items.length])

  if (items.length === 0) return null

  const cur = items[idx % items.length]

  return (
    <div className="news-ticker reveal" aria-label="Current dispatches">
      <span className="label">Dispatches</span>
      <div className="track">
        <span className="item" key={idx}>
          <a href={cur.url} target="_blank" rel="noreferrer">
            {cur.title}
          </a>
          <span className="src">{cur.src}</span>
        </span>
      </div>
    </div>
  )
}
