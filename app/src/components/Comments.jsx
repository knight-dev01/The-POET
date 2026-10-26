import { useEffect, useRef } from 'react'

export default function Comments() {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.async = true
    script.crossOrigin = 'anonymous'
    script.setAttribute('data-repo', 'knight-dev01/The-POET')
    script.setAttribute('data-repo-id', '')
    script.setAttribute('data-category', 'Announcements')
    script.setAttribute('data-category-id', '')
    script.setAttribute('data-mapping', 'pathname')
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'top')
    script.setAttribute(
      'data-theme',
      document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
    )
    script.setAttribute('data-lang', 'en')
    ref.current.appendChild(script)
    return () => ref.current?.querySelector('script')?.remove()
  }, [])

  return (
    <section className="section comments">
      <p className="mono section-tag">Responses</p>
      <h2>What readers are saying</h2>
      <p className="sub">Comments run on GitHub Discussions — sign in with GitHub to respond.</p>
      <div ref={ref} className="giscus" />
    </section>
  )
}
