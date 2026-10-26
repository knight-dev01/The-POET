import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SEO from '../components/SEO'
import PostCard from '../components/PostCard'
import { getPosts, searchPosts } from '../lib/content'

export default function Blog() {
  const posts = useMemo(() => getPosts(), [])
  const [params] = useSearchParams()
  const [q, setQ] = useState(params.get('q') || '')

  const filtered = useMemo(() => searchPosts(q, posts), [posts, q])

  return (
    <>
      <SEO
        title="Blog"
        description="Technical articles, tutorials and build notes — a searchable index of everything I've written."
        path="/blog"
        type="website"
      />
      <section className="section" style={{ borderTop: 'none' }}>
        <p className="mono section-tag">Blog</p>
        <h2>Posts & articles</h2>
        <p className="sub">Tutorials, deep dives and build notes. Filter by keyword or topic.</p>
        <input
          className="search"
          type="search"
          placeholder="Search posts, topics, keywords…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search posts"
        />
        <div className="grid2">
          {filtered.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
        {filtered.length === 0 && <p className="sub">No posts match "{q}".</p>}
      </section>
    </>
  )
}
