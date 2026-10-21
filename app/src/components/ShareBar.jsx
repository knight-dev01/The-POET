import { useState } from 'react'

export default function ShareBar({ url, title }) {
  const [copied, setCopied] = useState(false)
  const full = url.startsWith('http') ? url : `https://${window.location.host}${url}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(full)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {}
  }

  return (
    <div className="share-bar">
      <button className="icon-btn" title="Copy link" onClick={copy}>
        {copied ? 'Copied' : 'Copy link'}
      </button>
      <a
        className="icon-btn"
        target="_blank"
        rel="noreferrer"
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(full)}`}
      >
        𝕏
      </a>
      <a
        className="icon-btn"
        target="_blank"
        rel="noreferrer"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(full)}`}
      >
        in
      </a>
      <a
        className="icon-btn"
        target="_blank"
        rel="noreferrer"
        href={`https://wa.me/?text=${encodeURIComponent(title + ' ' + full)}`}
      >
        WhatsApp
      </a>
    </div>
  )
}
