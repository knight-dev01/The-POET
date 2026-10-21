import { NavLink, Link } from 'react-router-dom'
import { SITE } from '../lib/site'

function Ornament() {
  return (
    <svg className="footer-ornament" viewBox="0 0 240 24" fill="none" aria-hidden>
      <path d="M0 12 H95" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path d="M145 12 H240" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path
        d="M120 12 C118 8 114 6 110 8 C106 10 108 14 112 13 C116 12 118 10 120 12 Z"
        fill="currentColor"
        opacity="0.7"
      />
      <path
        d="M120 12 C122 8 126 6 130 8 C134 10 132 14 128 13 C124 12 122 10 120 12 Z"
        fill="currentColor"
        opacity="0.7"
      />
      <circle cx="120" cy="12" r="2" fill="currentColor" />
    </svg>
  )
}

export default function Layout({ children }) {
  const year = new Date().getFullYear()
  return (
    <>
      <img src="/sprig.svg" className="sprig tr" alt="" aria-hidden />
      <img src="/sprig.svg" className="sprig bl" alt="" aria-hidden />
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
        <Ornament />
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
        <div className="footer-copy">
          © {year} {SITE.author} · {SITE.brand} — {SITE.brandMeaning}
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
