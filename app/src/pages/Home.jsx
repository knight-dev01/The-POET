import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import StoryRow from '../components/StoryRow'
import { SITE } from '../lib/site'
import { getPosts, getProjects, getAllTopics } from '../lib/content'

export default function Home() {
  const posts = getPosts()
  const projects = getProjects().slice(0, 3)
  const topics = getAllTopics().slice(0, 10)

  return (
    <>
      <SEO title="" description={SITE.description} path="/" />
      <div className="medium-feed">
        <aside className="feed-rail">
          <div className="feed-rail-inner">
            <p className="mono section-tag">The POET</p>
            <h1 className="feed-title">Philosophy of Emerging Technology</h1>
            <p className="feed-desc">{SITE.tagline}</p>
            <Link className="btn primary" to="/cv">
              View CV
            </Link>
            <nav className="feed-nav">
              <p className="mono feed-nav-label">Browse</p>
              <Link to="/blog">Latest stories</Link>
              <Link to="/projects">Projects</Link>
              <Link to="/topics">Topics</Link>
              <Link to="/library">Your library</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
            </nav>
            <div className="feed-topics">
              <p className="mono feed-nav-label">Featured topics</p>
              {topics.map((t) => (
                <Link key={t.slug} to={`/topics/${t.slug}`}>
                  {t.label}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <div className="feed-main">
          <header className="feed-tabs">
            <span className="feed-tab active">For you</span>
            <Link className="feed-tab" to="/blog">
              Latest
            </Link>
          </header>

          {posts.length === 0 && (
            <p className="sub">No stories yet. Add markdown files to `app/content/blog/`.</p>
          )}
          {posts.map((p) => (
            <StoryRow key={p.slug} post={p} />
          ))}

          <section className="feed-projects">
            <p className="mono section-tag">Selected work</p>
            <div className="feed-project-grid">
              {projects.map((p) => (
                <article key={p.slug} className="card work">
                  <p className="mono">{p.stack?.slice(0, 3).join(' · ')}</p>
                  <h3>
                    <Link to={`/projects/${p.slug}`}>{p.title}</Link>
                  </h3>
                  <p>{p.description}</p>
                </article>
              ))}
            </div>
            <p className="more-link">
              <Link to="/projects">All projects →</Link>
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
