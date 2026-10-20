import { Link, useParams, Navigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import SEO from '../components/SEO'
import PostCard, { fmtDate } from '../components/PostCard'
import { getPost, getRelatedPosts, slugify } from '../lib/content'

export default function BlogPost() {
  const { slug } = useParams()
  const post = getPost(slug)

  if (!post) return <Navigate to="/404" replace />

  const related = getRelatedPosts(post, 3)

  return (
    <>
      <SEO
        title={post.title}
        description={post.description}
        path={`/blog/${post.slug}`}
        type="article"
        date={post.date?.toISOString()}
        keywords={[...post.topics, ...post.keywords]}
      />
      <article className="section article" style={{ borderTop: 'none' }}>
        <p className="mono section-tag">
          <Link to="/blog">← Blog</Link>
        </p>
        <h1 className="article-title">{post.title}</h1>
        <p className="mono meta-line">
          {fmtDate(post.date)}
          {post.updated && <> · updated {fmtDate(post.updated)}</>}
        </p>
        {post.topics.length > 0 && (
          <div className="topic-cloud">
            {post.topics.map((t) => (
              <Link key={t} to={`/topics/${slugify(t)}`} className="topic-chip">
                {t}
              </Link>
            ))}
          </div>
        )}
        <div className="prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
        </div>
        {post.keywords.length > 0 && (
          <p className="mono keywords">
            Keywords: {post.keywords.map((k) => (
              <Link key={k} to={`/topics?q=${encodeURIComponent(k)}`}>{k}</Link>
            ))}
          </p>
        )}
      </article>

      {related.length > 0 && (
        <section className="section reveal">
          <p className="mono section-tag">Related</p>
          <h2>Keep reading</h2>
          <div className="grid2">
            {related.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
