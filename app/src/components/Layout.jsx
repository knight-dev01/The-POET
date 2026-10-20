import { NavLink, Link } from 'react-router-dom'
import { SITE } from '../lib/site'

export default function Layout({ children }) {
  return (
    <>
      <header className="nav">
        <Link to="/" className="logo">
          IG<span>.</span>
        </Link>
        <nav>
          <NavLink to="/projects">Work</NavLink>
          <NavLink to="/blog">Blog</NavLink>
          <NavLink to="/topics">Topics</NavLink>
          <NavLink to="/cv">CV</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
        <ThemeToggle />
      </header>
      <main>{children}</main>
      <footer className="site-footer mono">
        <div>
          <strong>{SITE.brand}</strong> — {SITE.brandMeaning}
        </div>
        <div>{SITE.tagline}</div>
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
        <div>© {new Date().getFullYear()} {SITE.author}. All rights reserved.</div>
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
