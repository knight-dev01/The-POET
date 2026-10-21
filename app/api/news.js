const FEEDS = [
  { src: 'HN', url: 'https://hnrss.org/frontpage?count=8' },
  { src: 'AI', url: 'https://news.google.com/rss/search?q=artificial+intelligence+OR+LLM+OR+machine+learning&hl=en-US&gl=US&ceid=US:en' },
  { src: 'Eng', url: 'https://news.google.com/rss/search?q=software+engineering+OR+backend+OR+API&hl=en-US&gl=US&ceid=US:en' },
]

let cache = { t: 0, items: [] }
const TTL = 20 * 60 * 1000

function extract(xml, src) {
  const items = []
  const re = /<item[\s\S]*?<\/item>/g
  const itemsFound = xml.match(re) || []
  for (const chunk of itemsFound.slice(0, 6)) {
    const titleM = chunk.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i)
    const linkM = chunk.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i)
    if (titleM && linkM) {
      items.push({
        title: titleM[1].trim().replace(/\s+/g, ' '),
        url: linkM[1].trim(),
        src,
      })
    }
  }
  return items
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 's-maxage=1200, stale-while-revalidate=600')

  if (Date.now() - cache.t < TTL && cache.items.length > 0) {
    return res.status(200).json({ items: cache.items })
  }

  const results = await Promise.allSettled(
    FEEDS.map(async (f) => {
      const r = await fetch(f.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; POETNewsBot/1.0)' },
        signal: AbortSignal.timeout(8000),
      })
      if (!r.ok) throw new Error(String(r.status))
      const xml = await r.text()
      return extract(xml, f.src)
    })
  )

  const merged = []
  for (const r of results) {
    if (r.status === 'fulfilled') merged.push(...r.value)
  }

  merged.sort(() => Math.random() - 0.5)
  cache = { t: Date.now(), items: merged.slice(0, 12) }
  res.status(200).json({ items: cache.items })
}
