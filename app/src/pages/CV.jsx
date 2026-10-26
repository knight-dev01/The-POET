import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { CV as CV_DATA } from '../lib/cv'
import { SITE } from '../lib/site'
import { getProjects, getPosts } from '../lib/content'

export default function CV() {
  const projects = getProjects()
  const posts = getPosts()

  const jsonLd = {
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: SITE.author,
      jobTitle: CV_DATA.headline,
      email: CV_DATA.email,
      url: `${SITE.url}/cv`,
      address: CV_DATA.location,
      knowsAbout: CV_DATA.skills.flatMap((s) => s.items),
      worksFor: { '@type': 'Organization', name: CV_DATA.experience[0]?.company || '' },
      alumniOf: CV_DATA.education.map((e) => ({
        '@type': 'EducationalOrganization',
        name: e.school,
      })),
    },
  }

  return (
    <>
      <SEO
        title="CV"
        description={`Virtual CV of ${SITE.author} — ${CV_DATA.headline}. Experience, skills, education and selected work.`}
        path="/cv"
        jsonLd={jsonLd}
      />

      <section className="section cv" style={{ borderTop: 'none' }}>
        <div className="cv-head">
          <div>
            <p className="mono section-tag">Curriculum Vitae</p>
            <h1 className="article-title">{SITE.author}</h1>
            <p className="lede" style={{ animation: 'none' }}>
              {CV_DATA.headline} · {CV_DATA.location}
            </p>
          </div>
          <div className="cv-actions no-print">
            <button className="btn primary" onClick={() => window.print()}>
              Print / Save PDF
            </button>
            <a className="btn" href={`mailto:${CV_DATA.email}`}>
              {CV_DATA.email}
            </a>
          </div>
        </div>

        <div className="prose">
          <p>{CV_DATA.summary}</p>
        </div>

        <div className="cv-grid">
          <div className="cv-block">
            <h2>Experience</h2>
            {CV_DATA.experience.map((e, i) => (
              <div key={i} className="cv-item">
                <div className="cv-item-head">
                  <strong>{e.role}</strong>
                  <span className="mono">
                    {e.start} — {e.end}
                  </span>
                </div>
                <p className="cv-company">
                  {e.company}
                  {e.location && <> · {e.location}</>}
                </p>
                <ul>
                  {e.points.map((pt, j) => (
                    <li key={j}>{pt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="cv-block">
            <h2>Skills</h2>
            {CV_DATA.skills.map((s, i) => (
              <div key={i} className="cv-skill-row">
                <strong className="mono">{s.group}</strong>
                <div className="topic-cloud">
                  {s.items.map((it) => (
                    <span key={it} className="topic-chip">
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="cv-block">
            <h2>Education</h2>
            {CV_DATA.education.map((e, i) => (
              <div key={i} className="cv-item">
                <div className="cv-item-head">
                  <strong>{e.program}</strong>
                  <span className="mono">
                    {e.start} — {e.end}
                  </span>
                </div>
                <p className="cv-company">{e.school}</p>
                {e.note && <p className="mono">{e.note}</p>}
              </div>
            ))}
          </div>

          <div className="cv-block">
            <h2>Selected projects</h2>
            {projects.slice(0, 5).map((p) => (
              <div key={p.slug} className="cv-item">
                <div className="cv-item-head">
                  <strong>
                    <Link to={`/projects/${p.slug}`}>{p.title}</Link>
                  </strong>
                  <span className="mono">{p.stack?.slice(0, 3).join(' · ')}</span>
                </div>
                <p className="cv-company">{p.description}</p>
              </div>
            ))}
            <p className="more-link no-print">
              <Link to="/projects">All projects →</Link>
            </p>
          </div>

          <div className="cv-block">
            <h2>Writing</h2>
            {posts.slice(0, 5).map((p) => (
              <div key={p.slug} className="cv-item">
                <div className="cv-item-head">
                  <strong>
                    <Link to={`/blog/${p.slug}`}>{p.title}</Link>
                  </strong>
                  <span className="mono">{p.date ? new Date(p.date).getFullYear() : ''}</span>
                </div>
                <p className="cv-company">{p.description}</p>
              </div>
            ))}
            <p className="more-link no-print">
              <Link to="/blog">All posts →</Link>
            </p>
          </div>

          <div className="cv-block">
            <h2>Open source & community</h2>
            <ul>
              {CV_DATA.openSource.map((pt, i) => (
                <li key={i}>{pt}</li>
              ))}
            </ul>
          </div>

          <div className="cv-block">
            <h2>Certifications</h2>
            <ul>
              {CV_DATA.certifications.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>

          <div className="cv-block">
            <h2>Interests & focus areas</h2>
            <div className="topic-cloud">
              {CV_DATA.interests.map((it) => (
                <span key={it} className="topic-chip">
                  {it}
                </span>
              ))}
            </div>
          </div>

          <div className="cv-block">
            <h2>Contact</h2>
            <div className="topic-cloud">
              <a className="topic-chip" href={`mailto:${CV_DATA.email}`}>
                {CV_DATA.email}
              </a>
              <a className="topic-chip" href={`tel:${CV_DATA.phone.replace(/\s/g, '')}`}>
                {CV_DATA.phone}
              </a>
              <a className="topic-chip" href={CV_DATA.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a className="topic-chip" href={CV_DATA.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
