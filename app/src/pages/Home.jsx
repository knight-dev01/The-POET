import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import StoryRow from '../components/StoryRow'
import NewsTicker from '../components/NewsTicker'
import { SITE } from '../lib/site'
import { getPosts, getProjects, getAllTopics } from '../lib/content'

function Compass() {
  return (
    <svg className="compass" viewBox="0 0 44 44" fill="none" aria-hidden>
      <circle cx="22" cy="22" r="20" stroke="currentColor" strokeWidth="1" opacity=".5" />
      <circle cx="22" cy="22" r="2" fill="currentColor" />
      <path d="M22 4 L24 22 L22 40 L20 22 Z" fill="currentColor" opacity=".8" />
      <path d="M4 22 L22 20 L40 22 L22 24 Z" fill="currentColor" opacity=".35" />
      <text x="22" y="10" textAnchor="middle" fontSize="5" fill="currentColor" fontFamily="monospace">N</text>
    </svg>
  )
}

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
          <section className="profile-sheet reveal">
            <div className="portrait">
              <span className="mono-ig">IG</span>
              <Compass />
              <span className="coords">6.5244 N · 3.3792 E</span>
            </div>
            <div className="profile-info">
              <p className="mono paper-meta">Curriculum vitae · Working portfolio · Vol. 1</p>
              <h1>{SITE.author}</h1>
              <p className="profile-role">AI-Native Backend Engineer &amp; Writer</p>
              <p className="profile-bio">
                First Class CS graduate (CGPA 4.88/5.00). Building production REST APIs,
                FastAPI/Django systems and AI tooling at FlyRank AI. Writing about the
                philosophy of emerging technology.
              </p>
              <ul className="profile-stats">
                <li>
                  <strong>{posts.length}</strong>
                  essays
                </li>
                <li>
                  <strong>{projects.length}</strong>
                  projects
                </li>
                <li>
                  <strong>4.88</strong>
                  CGPA
                </li>
              </ul>
              <p className="avail">
                <span className="dot" aria-hidden /> Available for backend &amp; AI engineering roles
              </p>
              <div className="cta-row">
                <Link className="btn primary" to="/cv">
                  View CV
                </Link>
                <Link className="btn" to="/contact">
                  Get in touch
                </Link>
              </div>
            </div>
          </section>

          <NewsTicker />

          <header className="feed-tabs">
            <span className="feed-tab active">For you</span>
            <Link className="feed-tab" to="/blog">
              Latest
            </Link>
          </header>

          {posts.length === 0 && (
            <p className="sub">No stories yet. Add markdown files to app/content/blog/.</p>
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
