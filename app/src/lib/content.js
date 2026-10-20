import matter from 'gray-matter'

const modules = import.meta.glob('/content/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function parseAll() {
  const items = []
  for (const [path, raw] of Object.entries(modules)) {
    const { data, content } = matter(raw)
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
