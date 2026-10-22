import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { getProjects } from '../lib/content'

export default function Projects() {
  const projects = getProjects()
  return (
    <>
      <SEO
        title="Projects"
        description="Selected work — apps, tools and experiments shipped end-to-end."
        path="/projects"
      />
      <section className="section" style={{ borderTop: 'none' }}>
        <p className="mono section-tag">Work</p>
        <h2>Projects</h2>
        <p className="sub">A consolidation of things I've built across the web.</p>
        <div className="grid2">
          {projects.map((p, i) => (
            <article key={p.slug} className="card work reveal">
              <p className="mono">{p.stack?.slice(0, 4).join(' · ')}</p>
              <h3>
                <span className="card-index" aria-hidden>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <Link to={`/projects/${p.slug}`}>{p.title}</Link>
              </h3>
              <p>{p.description}</p>
              <p className="card-links">
                <Link to={`/projects/${p.slug}`}>Details →</Link>
                {p.repo && (
                  <a href={p.repo} target="_blank" rel="noreferrer">
                    GitHub →
                  </a>
                )}
                {p.live && (
                  <a href={p.live} target="_blank" rel="noreferrer">
                    Live →
                  </a>
                )}
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
