import { Link, useParams, Navigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import SEO from '../components/SEO'
import StoryRow from '../components/StoryRow'
import ClapButton from '../components/ClapButton'
import BookmarkButton from '../components/BookmarkButton'
import ShareBar from '../components/ShareBar'
import ReadingProgress from '../components/ReadingProgress'
import Comments from '../components/Comments'
import { fmtDate } from '../components/PostCard'
import { SITE } from '../lib/site'
import { getPost, getRelatedPosts, slugify } from '../lib/content'

export default function BlogPost() {
  const { slug } = useParams()
  const post = getPost(slug)

  if (!post) return <Navigate to="/404" replace />

  const related = getRelatedPosts(post, 3)
  const path = `/blog/${post.slug}`
  const key = `blog/${post.slug}`

  return (
    <>
      <SEO
        title={post.title}
        description={post.description}
        path={path}
        type="article"
        date={post.date?.toISOString()}
        keywords={[...post.topics, ...post.keywords]}
      />
      <ReadingProgress />
      <article className="medium-article">
        <header className="article-head">
          {post.topics.length > 0 && (
            <div className="topic-cloud article-topics">
              {post.topics.map((t) => (
                <Link key={t} to={`/topics/${slugify(t)}`} className="topic-chip">
                  {t}
                </Link>
              ))}
            </div>
          )}
          <h1 className="article-title">{post.title}</h1>

          <p className="paper-meta">
            THE POET WORKING PAPER · {post.topics[0] || 'General'} · {post.readingMinutes} PP.
          </p>

          {post.description && (
            <div className="paper-abstract">
              <span className="abs-label">Abstract</span>
              <p>{post.description}</p>
            </div>
          )}

          <div className="byline">
            <div className="byline-avatar" aria-hidden>
              IG
            </div>
            <div className="byline-meta">
              <div className="byline-row">
                <strong>{SITE.author}</strong>
                <Link className="byline-follow" to="/contact">
                  Follow
                </Link>
              </div>
              <p className="mono byline-sub">
                {fmtDate(post.date)}
                {post.updated && <> · updated {fmtDate(post.updated)}</>} · {post.readingMinutes} min read
              </p>
            </div>
            <div className="byline-actions">
              <ClapButton slug={key} />
              <BookmarkButton slug={key} />
              <ShareBar url={SITE.url + path} title={post.title} />
            </div>
          </div>
        </header>

        <div className="prose article-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
        </div>

        <footer className="article-foot">
          {post.keywords.length > 0 && (
            <p className="mono keywords">
              Written about{' '}
              {post.keywords.map((k) => (
                <Link key={k} to={`/topics?q=${encodeURIComponent(k)}`}>
                  {k}
                </Link>
              ))}
            </p>
          )}
          <div className="byline-actions article-foot-actions">
            <ClapButton slug={key} />
            <BookmarkButton slug={key} />
            <ShareBar url={SITE.url + path} title={post.title} />
          </div>
        </footer>
      </article>

      <Comments />

      {related.length > 0 && (
        <section className="section related reveal">
          <p className="mono section-tag">More from {SITE.author}</p>
          <div className="feed-related">
            {related.map((p) => (
              <StoryRow key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
