function unquote(s) {
  const t = s.trim()
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1)
  }
  return t
}

function coerce(v) {
  if (v === 'true') return true
  if (v === 'false') return false
  if (v.startsWith('[') && v.endsWith(']')) {
    return v
      .slice(1, -1)
      .split(',')
      .map((s) => unquote(s))
      .filter(Boolean)
  }
  return unquote(v)
}

// Small YAML-subset frontmatter parser (strings, booleans, inline + block lists).
// Replaces gray-matter, which is Node-only and crashes browser bundles (Buffer).
export function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!m) return { data: {}, content: raw }

  const data = {}
  const lines = m[1].split(/\r?\n/)
  let i = 0

  while (i < lines.length) {
    const kv = lines[i].match(/^([A-Za-z_][\w-]*):\s*(.*)$/)
    if (!kv) {
      i++
      continue
    }
    const key = kv[1]
    let val = kv[2].trim()

    if (val === '' || val === '>' || val === '>-' || val === '|' || val === '|-') {
      const isBlock = val === '' || val === '>' || val === '>' || val === '|' || val === '|-' || val === '>-'
      const items = []
      const text = []
      i++
      while (i < lines.length) {
        const item = lines[i].match(/^\s+-\s+(.*)$/)
        if (item) {
          items.push(unquote(item[1]))
          i++
          continue
        }
        const cont = lines[i].match(/^\s+(.*)$/)
        if (cont && cont[1].trim() !== '') {
          text.push(cont[1])
          i++
          continue
        }
        if (lines[i].trim() === '') {
          i++
          continue
        }
        break
      }
      if (items.length) data[key] = items
      else if (text.length) data[key] = text.join(val === '|' || val === '|-' ? '\n' : ' ')
      continue
    }

    data[key] = coerce(val)
    i++
  }

  return { data, content: raw.slice(m[0].length) }
}

const modules = import.meta.glob('/content/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function readingTimeOf(text) {
  const words = String(text).trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

function parseAll() {
  const items = []
  for (const [path, raw] of Object.entries(modules)) {
    const { data, content } = parseFrontmatter(raw)
    const parts = path.split('/')
    const kind = parts[parts.length - 2] // 'blog' | 'projects'
    const slug = parts[parts.length - 1].replace(/\.md$/, '')
    items.push({
      kind,
      slug,
      path,
      body: content,
      title: data.title || slug,
      description: data.description || '',
      date: data.date ? new Date(data.date) : null,
      updated: data.updated ? new Date(data.updated) : null,
      topics: Array.isArray(data.topics) ? data.topics : [],
      keywords: Array.isArray(data.keywords) ? data.keywords : [],
      draft: Boolean(data.draft),
      featured: Boolean(data.featured),
      external: data.external || null,
      source: data.source || null,
      stack: Array.isArray(data.stack) ? data.stack : [],
      live: data.live || null,
      repo: data.repo || null,
      cover: data.cover || null,
      readingMinutes: readingTimeOf(content),
    })
  }
  return items
}

const ALL = parseAll()

export function getPosts({ includeDrafts = false } = {}) {
  return ALL.filter((p) => p.kind === 'blog' && (includeDrafts || !p.draft)).sort(
    (a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0)
  )
}

export function getPost(slug) {
  return ALL.find((p) => p.kind === 'blog' && p.slug === slug) || null
}

export function getProjects({ includeDrafts = false } = {}) {
  return ALL.filter((p) => p.kind === 'projects' && (includeDrafts || !p.draft)).sort(
    (a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0)
  )
}

export function getProject(slug) {
  return ALL.find((p) => p.kind === 'projects' && p.slug === slug) || null
}

export function getAllTopics() {
  const map = new Map()
  for (const p of getPosts()) {
    for (const t of p.topics) {
      const key = t.toLowerCase()
      if (!map.has(key)) map.set(key, { slug: key, label: t, count: 0 })
      map.get(key).count += 1
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
}

export function slugify(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function getPostsByTopic(topicSlug) {
  const key = topicSlug.toLowerCase()
  return getPosts().filter((p) => p.topics.some((t) => slugify(t) === key))
}

export function getRelatedPosts(post, limit = 3) {
  const scored = getPosts()
    .filter((p) => p.slug !== post.slug)
    .map((p) => {
      const shared = p.topics.filter((t) =>
        post.topics.some((pt) => slugify(pt) === slugify(t))
      ).length
      return { post: p, score: shared }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || (b.post.date?.getTime() || 0) - (a.post.date?.getTime() || 0))
  return scored.slice(0, limit).map((x) => x.post)
}

export function getFeaturedPosts(limit = 3) {
  const featured = getPosts().filter((p) => p.featured)
  return (featured.length ? featured : getPosts()).slice(0, limit)
}
