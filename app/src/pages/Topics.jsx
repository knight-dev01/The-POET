import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SEO from '../components/SEO'
import { getAllTopics, getPosts } from '../lib/content'

export default function Topics() {
  const [params] = useSearchParams()
  const initial = params.get('q') || ''
  const [q, setQ] = useState(initial)
  const topics = useMemo(() => getAllTopics(), [])
  const posts = useMemo(() => getPosts(), [])

  const filteredTopics = useMemo(() => {
    if (!q.trim()) return topics
    const s = q.toLowerCase()
    return topics.filter((t) => t.label.toLowerCase().includes(s))
  }, [topics, q])

  const matchedPosts = useMemo(() => {
    if (!q.trim()) return []
    const s = q.toLowerCase()
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(s) ||
        p.keywords.some((k) => k.toLowerCase().includes(s)) ||
        p.topics.some((t) => t.toLowerCase().includes(s))
    )
  }, [posts, q])

  return (
    <>
      <SEO
        title="Topics"
        description="An index of every concept, tool and keyword on this site — each links to related articles."
        path="/topics"
      />
      <section className="section" style={{ borderTop: 'none' }}>
        <p className="mono section-tag">Knowledge hub</p>
        <h2>Topics & concepts</h2>
        <p className="sub">A living index of everything referenced here. Search a keyword to see all related posts.</p>
        <input
          className="search"
          type="search"
          placeholder="Search topics, concepts, keywords…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search topics"
        />
        <div className="topic-cloud">
          {filteredTopics.map((t) => (
            <Link key={t.slug} to={`/topics/${t.slug}`} className="topic-chip">
              {t.label} <span className="mono">{t.count}</span>
            </Link>
          ))}
        </div>
        {q.trim() && (
          <>
            <h3 style={{ marginTop: '2rem' }}>Matching posts ({matchedPosts.length})</h3>
            <ul className="post-list">
              {matchedPosts.map((p) => (
                <li key={p.slug}>
                  <Link to={`/blog/${p.slug}`}>{p.title}</Link>
                  {p.description && <p className="mono">{p.description}</p>}
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </>
  )
}
