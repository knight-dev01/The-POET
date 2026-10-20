import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import PostCard from '../components/PostCard'
import { SITE } from '../lib/site'
import { getFeaturedPosts, getProjects, getAllTopics } from '../lib/content'

export default function Home() {
  const featured = getFeaturedPosts(3)
  const projects = getProjects().slice(0, 4)
  const topics = getAllTopics().slice(0, 8)

  return (
    <>
      <SEO title="" description={SITE.description} path="/" />
      <section className="hero">
        <p className="mono eyebrow">● Available for work</p>
        <h1>
          {SITE.name}
          <br />
          <span>AI-Native Backend Engineer & Writer</span>
        </h1>
        <p className="lede">{SITE.tagline}</p>
        <div className="cta-row">
          <Link className="btn primary" to="/projects">
            View work
          </Link>
          <Link className="btn" to="/blog">
            Read the blog
          </Link>
          <Link className="btn" to="/contact">
            Get in touch
          </Link>
        </div>
      </section>

      <section className="section reveal">
        <p className="mono section-tag">01 — Writing</p>
        <h2>Latest from the blog</h2>
        <div className="grid2">
          {featured.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
        <p className="more-link">
          <Link to="/blog">All posts →</Link>
        </p>
      </section>

      <section className="section reveal">
        <p className="mono section-tag">02 — Work</p>
        <h2>Selected projects</h2>
        <div className="grid2">
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

      <section className="section reveal">
        <p className="mono section-tag">03 — Knowledge hub</p>
        <h2>Concepts I write about</h2>
        <p className="sub">A growing reference of topics, tools and ideas — each links to everything I've written on it.</p>
        <div className="topic-cloud">
          {topics.map((t) => (
            <Link key={t.slug} to={`/topics/${t.slug}`} className="topic-chip">
              {t.label} <span className="mono">{t.count}</span>
            </Link>
          ))}
        </div>
        <p className="more-link">
          <Link to="/topics">All topics →</Link>
        </p>
      </section>
    </>
  )
}
