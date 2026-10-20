import SEO from '../components/SEO'
import { SITE } from '../lib/site'

export default function About() {
  return (
    <>
      <SEO
        title="About"
        description={`About ${SITE.name} — developer, writer and builder.`}
        path="/about"
      />
      <section className="section" style={{ borderTop: 'none' }}>
        <p className="mono section-tag">About</p>
        <h2>About me</h2>
        <div className="prose">
          <p>
            Hi, I'm <strong>{SITE.name}</strong>. I build software and write about the
            concepts, tools and patterns I use along the way.
          </p>
          <p>
            This site is a consolidation of my work from across the web — projects,
            articles and a growing knowledge hub of ideas I reference and teach.
          </p>
          <p>
            Replace this bio with your own story: your background, what you focus on,
            notable work, and what you're looking for next.
          </p>
        </div>
        <ul className="checklist mono">
          <li>✓ Software development</li>
          <li>✓ Technical writing</li>
          <li>✓ Open source</li>
        </ul>
      </section>
    </>
  )
}
