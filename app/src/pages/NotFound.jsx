import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

export default function NotFound() {
  return (
    <>
      <SEO title="Not found" description="Page not found." path="/404" noindex />
      <section className="section" style={{ borderTop: 'none' }}>
        <p className="mono section-tag">404</p>
        <h2>Page not found</h2>
        <p className="sub">That page doesn't exist — but the sitemap does.</p>
        <div className="cta-row">
          <Link className="btn primary" to="/">Go home</Link>
          <Link className="btn" to="/sitemap">View sitemap</Link>
        </div>
      </section>
    </>
  )
}
