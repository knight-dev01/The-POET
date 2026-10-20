const CLAP_KEY = 'poet:claps'
const BOOKMARK_KEY = 'poet:bookmarks'

function read(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

function write(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val))
  } catch {}
}

export function getClaps(slug) {
  return read(CLAP_KEY, {})[slug] || 0
}

export function addClap(slug) {
  const all = read(CLAP_KEY, {})
  all[slug] = (all[slug] || 0) + 1
  write(CLAP_KEY, all)
  return all[slug]
}

export function isBookmarked(slug) {
  return read(BOOKMARK_KEY, []).includes(slug)
}

export function toggleBookmark(slug) {
  const list = read(BOOKMARK_KEY, [])
  const i = list.indexOf(slug)
  if (i >= 0) list.splice(i, 1)
  else list.unshift(slug)
  write(BOOKMARK_KEY, list)
  return i < 0
}

export function getBookmarks() {
  return read(BOOKMARK_KEY, [])
}
