import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import StoryRow from '../components/StoryRow'
import NewsTicker from '../components/NewsTicker'
import { SITE } from '../lib/site'
import { getPosts, getProjects, getAllTopics } from '../lib/content'

export default function Home() {
  const posts = getPosts()
  const projects = getProjects().slice(0, 3)
  const topics = getAllTopics().slice(0, 10)
  const latest = posts.slice(0, 4)

  return (
    <>
      <SEO title="" description={SITE.description} path="/" />

      <section className="hero">
        <p className="eyebrow">The POET · Philosophy of Emerging Technology</p>
        <h1>
          {SITE.author} <em>— AI-Native Backend Engineer &amp; Writer</em>
        </h1>
        <p className="lede">{SITE.tagline}</p>
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
          <Link className="btn" to="/blog">
            Read stories
          </Link>
        </div>
      </section>

      <NewsTicker />

      <section className="profile-sheet reveal">
        <figure className="portrait-fig">
          <div className="portrait">
            <div className="portrait-inner">
              <span className="leaf-bg" aria-hidden />
              <span className="mono-ig">IG</span>
            </div>
          </div>
          <figcaption className="portrait-cap mono">Fig. 1 — Author, Lagos</figcaption>
        </figure>
        <div className="profile-info">
          <p className="eyebrow">Naturalist of emerging systems</p>
          <h1>{SITE.author}</h1>
          <p className="profile-role">AI-Native Backend Engineer &amp; Writer</p>
          <p className="profile-bio">
            First Class CS graduate (CGPA 4.88/5.00). I build production REST APIs,
            FastAPI and Django systems, and AI tooling — and I write about the ideas
            behind them.
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

      <section className="section">
        <p className="section-tag">Fig. 2 — Latest stories</p>
        <h2>Latest stories</h2>
        {posts.length === 0 && (
          <p className="sub">No stories yet. Add markdown files to app/content/blog/.</p>
        )}
        {latest.map((p) => (
          <StoryRow key={p.slug} post={p} />
        ))}
        <p className="more-link">
          <Link to="/blog">All stories →</Link>
        </p>
      </section>

      <section className="section">
        <p className="section-tag">Fig. 3 — Selected work</p>
        <h2>Selected work</h2>
        <div className="feed-project-grid">
          {projects.map((p, i) => (
            <article key={p.slug} className="card work">
              <p className="meta-line">{p.stack?.slice(0, 3).join(' · ')}</p>
              <h3>
                <span className="card-index" aria-hidden>
                  {String(i + 1).padStart(2, '0')}
                </span>
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

      <section className="section">
        <p className="section-tag">Fig. 4 — Topics</p>
        <h2>Browse topics</h2>
        <div className="topic-cloud">
          {topics.map((t) => (
            <Link key={t.slug} to={`/topics/${t.slug}`} className="topic-chip">
              {t.label}
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
