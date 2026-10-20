import SEO from '../components/SEO'
import { SITE } from '../lib/site'

export default function Contact() {
  return (
    <>
      <SEO
        title="Contact"
        description={`Get in touch with ${SITE.name}.`}
        path="/contact"
      />
      <section className="section" style={{ borderTop: 'none' }}>
        <p className="mono section-tag">Contact</p>
        <h2>Let's build something.</h2>
        <p className="sub">Email is best. You can also find me here:</p>
        <div className="cta-row">
          <a className="btn primary" href={`mailto:${SITE.email}`}>
            {SITE.email}
          </a>
          <a className="btn" href={SITE.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          {SITE.linkedin && (
            <a className="btn" href={SITE.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          )}
        </div>
      </section>
    </>
  )
}
