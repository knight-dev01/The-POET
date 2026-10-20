import { Link } from 'react-router-dom'

export function fmtDate(d) {
  if (!d) return ''
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function PostCard({ post }) {
  return (
    <article className="card work reveal">
      <p className="mono meta-line">
        {fmtDate(post.date)}
        {post.topics?.length > 0 && <> · {post.topics.slice(0, 2).join(' · ')}</>}
      </p>
      <h3>
        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
      </h3>
      {post.description && <p>{post.description}</p>}
      <p className="card-links">
        <Link to={`/blog/${post.slug}`}>Read →</Link>
        {post.external && (
          <a href={post.external} target="_blank" rel="noreferrer">
            Source →
          </a>
        )}
      </p>
    </article>
  )
}
