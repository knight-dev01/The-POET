import { Link } from 'react-router-dom'
import { fmtDate } from './PostCard'
import BookmarkButton from './BookmarkButton'

export default function StoryRow({ post }) {
  return (
    <article className="story">
      <div className="story-main">
        <div className="story-meta mono">
          <span className="story-dot" aria-hidden>●</span>
          {fmtDate(post.date)} · {post.readingMinutes} min read
        </div>
        <h2 className="story-title">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        {post.description && <p className="story-sub">{post.description}</p>}
        <div className="story-foot">
          <div className="story-topics">
            {post.topics.slice(0, 2).map((t) => (
              <Link key={t} to={`/topics/${t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`} className="story-topic">
                {t}
              </Link>
            ))}
          </div>
          <div className="story-actions">
            <BookmarkButton slug={`blog/${post.slug}`} />
          </div>
        </div>
      </div>
      {post.cover && (
        <Link to={`/blog/${post.slug}`} className="story-thumb">
          <img src={post.cover} alt="" loading="lazy" />
        </Link>
      )}
    </article>
  )
}
