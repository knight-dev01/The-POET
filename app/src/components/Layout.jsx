import { NavLink, Link } from 'react-router-dom'
import { SITE } from '../lib/site'

export default function Layout({ children }) {
  const year = new Date().getFullYear()
  return (
    <>
      <div className="corner-marks" aria-hidden>
        <span className="tl" />
        <span className="tr" />
        <span className="bl" />
        <span className="br" />
      </div>
      <header className="nav">
        <Link to="/" className="logo">
          IG<span>.</span>
        </Link>
        <nav>
          <NavLink to="/blog">Stories</NavLink>
          <NavLink to="/projects">Work</NavLink>
          <NavLink to="/topics">Topics</NavLink>
          <NavLink to="/library">Library</NavLink>
          <NavLink to="/cv">CV</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
        <ThemeToggle />
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div className="footer-meta mono">
          <div className="footer-links">
            <a href={SITE.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            {SITE.linkedin && (
              <a href={SITE.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            )}
            <a href={`mailto:${SITE.email}`}>Email</a>
            <Link to="/sitemap">Sitemap</Link>
          </div>
          <div>
            © {year} {SITE.author}. All rights reserved.
          </div>
        </div>
        <div className="title-block">
          <div className="tb-cell">
            <span className="tb-label">Project</span>
            <span className="tb-value">{SITE.brand}</span>
          </div>
          <div className="tb-cell">
            <span className="tb-label">Title</span>
            <span className="tb-value">{SITE.brandMeaning}</span>
          </div>
          <div className="tb-cell">
            <span className="tb-label">Drawn by</span>
            <span className="tb-value">{SITE.author}</span>
          </div>
          <div className="tb-cell">
            <span className="tb-label">Scale</span>
            <span className="tb-value">1:1</span>
          </div>
          <div className="tb-cell">
            <span className="tb-label">Sheet</span>
            <span className="tb-value">A-{String(year).slice(-2)}</span>
          </div>
        </div>
      </footer>
    </>
  )
}

function ThemeToggle() {
  return (
    <button
      className="theme-toggle mono"
      aria-label="Toggle theme"
      onClick={() => {
        const root = document.documentElement
        const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light'
        if (next === 'light') {
          root.classList.add('mode-light')
          root.removeAttribute('data-theme')
        } else {
          root.classList.remove('mode-light')
          root.setAttribute('data-theme', 'dark')
        }
        try {
          localStorage.setItem('theme-pref', next)
        } catch {}
      }}
    >
      ◐
    </button>
  )
}
