import { Link, useParams, Navigate } from 'react-router-dom'
import SEO from '../components/SEO'
import PostCard from '../components/PostCard'
import { getPostsByTopic, getAllTopics } from '../lib/content'

export default function TopicPage() {
  const { slug } = useParams()
  const topics = getAllTopics()
  const meta = topics.find((t) => t.slug === slug)
  const posts = getPostsByTopic(slug)

  if (!meta) return <Navigate to="/topics" replace />

  return (
    <>
      <SEO
        title={meta.label}
        description={`Everything written about ${meta.label} — ${meta.count} article${meta.count === 1 ? '' : 's'}.`}
        path={`/topics/${slug}`}
      />
      <section className="section" style={{ borderTop: 'none' }}>
        <p className="mono section-tag">
          <Link to="/topics">← Topics</Link>
        </p>
        <h2>{meta.label}</h2>
        <p className="sub">{meta.count} article{meta.count === 1 ? '' : 's'} on this topic.</p>
        <div className="grid2">
          {posts.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </section>
    </>
  )
}
