import { list, put } from '@vercel/blob'
import { readFile, writeFile, readdir, unlink } from 'node:fs/promises'
import path from 'node:path'

const ROOTS = [
  { prefix: 'content/blog/', dir: 'content/blog' },
  { prefix: 'content/projects/', dir: 'content/projects' },
]
const SEED_FLAG = 'content/.seeded'
const MANIFEST = 'content/deleted.json'

if (!process.env.BLOB_READ_WRITE_TOKEN && !(process.env.VERCEL_OIDC_TOKEN && process.env.BLOB_STORE_ID)) {
  console.log('[sync] no blob credentials — keeping local content as-is')
  process.exit(0)
}

const fetchText = async (url) => {
  const r = await fetch(url)
  if (!r.ok) throw new Error(`blob fetch ${r.status}`)
  return r.text()
}

async function listAll(prefix) {
  const out = []
  let cursor
  do {
    const res = await list({ prefix, ...(cursor ? { cursor } : {}) })
    out.push(...res.blobs)
    cursor = res.hasMore && res.cursor ? res.cursor : undefined
  } while (cursor)
  return out
}

const index = (blobs) => new Map(blobs.map((b) => [b.pathname, b]))
const putOpts = { access: 'public', addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 60 }

let blobs = await listAll('content/')
let byPath = index(blobs)

if (!byPath.has(SEED_FLAG)) {
  console.log('[sync] first run — seeding blob store from local content')
  for (const root of ROOTS) {
    const files = await readdir(root.dir).catch(() => [])
    for (const f of files) {
      if (!f.endsWith('.md')) continue
      const bp = root.prefix + f
      if (byPath.has(bp)) continue
      const body = await readFile(path.join(root.dir, f), 'utf8')
      await put(bp, body, putOpts)
      console.log('[sync] seeded', bp)
    }
  }
  await put(SEED_FLAG, new Date().toISOString(), putOpts)
  blobs = await listAll('content/')
  byPath = index(blobs)
}

let written = 0
for (const b of blobs) {
  if (!b.pathname.endsWith('.md')) continue
  const root = ROOTS.find((r) => b.pathname.startsWith(r.prefix))
  if (!root) continue
  const name = b.pathname.slice(root.prefix.length)
  if (!name || name.includes('/')) continue
  const text = await fetchText(b.url)
  await writeFile(path.join(root.dir, name), text, 'utf8')
  written++
}
console.log(`[sync] wrote ${written} file(s) from blob store`)

if (byPath.has(MANIFEST)) {
  const deleted = JSON.parse(await fetchText(byPath.get(MANIFEST).url))
  for (const p of deleted) {
    const local = p.replace(/^\/?app\//, '')
    await unlink(local).catch(() => {})
    console.log('[sync] removed deleted file', local)
  }
}

console.log('[sync] done')
