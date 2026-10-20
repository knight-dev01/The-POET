import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { getPosts, getProjects, getAllTopics } from '../lib/content'

export default function Sitemap() {
  const posts = getPosts()
  const projects = getProjects()
  const topics = getAllTopics()

  return (
    <>
      <SEO title="Sitemap" description="Every page on this site." path="/sitemap" />
      <section className="section" style={{ borderTop: 'none' }}>
        <p className="mono section-tag">Sitemap</p>
        <h2>Every page</h2>
        <div className="sitemap-grid">
          <div>
            <h3>Pages</h3>
            <ul className="post-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/projects">Projects</Link></li>
              <li><Link to="/topics">Topics</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/cv">CV</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3>Posts ({posts.length})</h3>
            <ul className="post-list">
              {posts.map((p) => (
                <li key={p.slug}><Link to={`/blog/${p.slug}`}>{p.title}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Projects ({projects.length})</h3>
            <ul className="post-list">
              {projects.map((p) => (
                <li key={p.slug}><Link to={`/projects/${p.slug}`}>{p.title}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Topics ({topics.length})</h3>
            <ul className="post-list">
              {topics.map((t) => (
                <li key={t.slug}><Link to={`/topics/${t.slug}`}>{t.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
