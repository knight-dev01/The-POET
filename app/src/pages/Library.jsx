import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import StoryRow from '../components/StoryRow'
import { getBookmarks } from '../lib/engagement'
import { getPost } from '../lib/content'

export default function Library() {
  const slugs = getBookmarks()
  const posts = slugs.map((s) => getPost(s.replace(/^blog\//, ''))).filter(Boolean)

  return (
    <>
      <SEO title="Your library" description="Stories you've saved." path="/library" noindex />
      <section className="section" style={{ borderTop: 'none' }}>
        <p className="mono section-tag">Library</p>
        <h2>Your reading list</h2>
        {posts.length === 0 ? (
          <>
            <p className="sub">Nothing saved yet. Tap the star on any story to keep it here.</p>
            <div className="cta-row">
              <Link className="btn primary" to="/">
                Browse stories
              </Link>
            </div>
          </>
        ) : (
          <div className="feed-related">
            {posts.map((p) => (
              <StoryRow key={p.slug} post={p} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
