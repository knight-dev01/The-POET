import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const CONTENT = join(ROOT, 'content')
const DIST = join(ROOT, 'dist')

const SITE_URL = (process.env.VITE_SITE_URL || 'https://knight-dev01.github.io/The-POET').replace(/\/$/, '')
const SITE_NAME = 'Ifet Great'

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!m) return {}
  const data = {}
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.*)$/)
    if (!kv) continue
    let val = kv[2].trim().replace(/^["']|["']$/g, '')
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean)
    }
    data[kv[1]] = val
  }
  return data
}

function readCollection(dir) {
  const full = join(CONTENT, dir)
  if (!existsSync(full)) return []
  return readdirSync(full)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const raw = readFileSync(join(full, f), 'utf8')
      const fm = parseFrontmatter(raw)
      return { slug: f.replace(/\.md$/, ''), ...fm }
    })
    .filter((p) => p.draft !== 'true')
}

function iso(d) {
  if (!d) return new Date().toISOString()
  const date = new Date(d)
  return isNaN(date) ? new Date().toISOString() : date.toISOString()
}

function xmlEscape(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

const posts = readCollection('blog').sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
const projects = readCollection('projects')
const topics = [...new Set(posts.flatMap((p) => (Array.isArray(p.topics) ? p.topics : p.topics ? [p.topics] : [])))].map((t) =>
  String(t).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
)

const staticRoutes = ['/', '/blog', '/projects', '/topics', '/about', '/cv', '/contact']

const urls = [
  ...staticRoutes.map((r) => ({ loc: `${SITE_URL}${r === '/' ? '/' : r}`, lastmod: iso(), priority: r === '/' ? '1.0' : '0.7' })),
  ...posts.map((p) => ({ loc: `${SITE_URL}/blog/${p.slug}`, lastmod: iso(p.updated || p.date), priority: '0.8' })),
  ...projects.map((p) => ({ loc: `${SITE_URL}/projects/${p.slug}`, lastmod: iso(p.date), priority: '0.7' })),
  ...topics.map((t) => ({ loc: `${SITE_URL}/topics/${t}`, lastmod: iso(), priority: '0.5' })),
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${xmlEscape(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`

const rssItems = posts
  .slice(0, 50)
  .map((p) => {
    const link = `${SITE_URL}/blog/${p.slug}`
    return `    <item>
      <title>${xmlEscape(p.title)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <description>${xmlEscape(p.description || '')}</description>
      <pubDate>${new Date(p.date || Date.now()).toUTCString()}</pubDate>
    </item>`
  })
  .join('\n')

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(SITE_NAME)} — Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Articles, tutorials and build notes by ${xmlEscape(SITE_NAME)}.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${rssItems}
  </channel>
</rss>
`

if (!existsSync(DIST)) mkdirSync(DIST, { recursive: true })
writeFileSync(join(DIST, 'sitemap.xml'), sitemap)
writeFileSync(join(DIST, 'robots.txt'), robots)
writeFileSync(join(DIST, 'rss.xml'), rss)

console.log(`SEO files written: sitemap.xml (${urls.length} URLs), robots.txt, rss.xml (${posts.length} posts)`)
