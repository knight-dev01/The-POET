import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { getPosts, getProjects, getAllTopics } from '../lib/content'
import { SITEMAP_PAGES } from '../lib/site'

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
              {SITEMAP_PAGES.map((p) => (
                <li key={p.to}>
                  <Link to={p.to}>{p.label}</Link>
                </li>
              ))}
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
