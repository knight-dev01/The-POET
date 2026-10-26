import { put, list, del } from '@vercel/blob'

const BLOG = 'content/blog/'
const PROJ = 'content/projects/'
const MANIFEST = 'content/deleted.json'

function ok(res, data) {
  res.status(200).json(data)
}
function fail(res, code, msg) {
  res.status(code).json({ error: msg })
}

function authed(req) {
  const pass = process.env.ADMIN_PASSWORD || 'admin'
  const h = req.headers.authorization || ''
  return h === `Bearer ${pass}`
}

const prefixFor = (col) => (col === 'projects' ? PROJ : BLOG)
const toBlob = (p) => String(p).replace(/^\/?app\//, '')
const toApp = (p) => 'app/' + p
const validPath = (p) => /^app\/content\/(blog|projects)\/[^/]+\.md$/.test(String(p))

async function readManifest() {
  const r = await list({ prefix: MANIFEST, limit: 5 })
  const b = r.blobs.find((x) => x.pathname === MANIFEST)
  if (!b) return []
  try {
    const res = await fetch(b.url)
    return res.ok ? await res.json() : []
  } catch {
    return []
  }
}

async function writeManifest(paths) {
  await put(MANIFEST, JSON.stringify(paths, null, 2), {
    access: 'public',
    allowOverwrite: true,
    addRandomSuffix: false,
    cacheControlMaxAge: 60,
  })
}

async function triggerDeploy() {
  const hook = process.env.DEPLOY_HOOK
  if (!hook) return false
  try {
    await fetch(hook, { method: 'POST' })
    return true
  } catch {
    return false
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (!authed(req)) return fail(res, 401, 'Unauthorized')

  try {
    if (req.method === 'GET') {
      const url = new URL(req.url, 'http://x')
      const action = url.searchParams.get('action')

      if (action === 'list') {
        const col = url.searchParams.get('collection') || 'blog'
        const r = await list({ prefix: prefixFor(col), limit: 1000 })
        const files = r.blobs
          .filter((b) => b.pathname.endsWith('.md'))
          .map((b) => ({ name: b.pathname.split('/').pop(), path: toApp(b.pathname) }))
          .sort((a, b) => a.name.localeCompare(b.name))
        return ok(res, { files })
      }

      if (action === 'read') {
        const p = url.searchParams.get('path')
        if (!p || !validPath(p)) return fail(res, 400, 'Invalid path')
        const blobPath = toBlob(p)
        const r = await list({ prefix: blobPath, limit: 1000 })
        const b = r.blobs.find((x) => x.pathname === blobPath)
        if (!b) return fail(res, 404, 'File not found in storage')
        const rr = await fetch(b.url)
        if (!rr.ok) return fail(res, 500, `Could not read ${blobPath}`)
        return ok(res, { content: await rr.text() })
      }

      return fail(res, 400, 'Unknown action')
    }

    if (req.method === 'POST') {
      let body = ''
      for await (const chunk of req) body += chunk
      const { action, path, content } = JSON.parse(body || '{}')

      if (action === 'write') {
        if (!path || !validPath(path)) return fail(res, 400, 'Invalid path')
        if (content == null) return fail(res, 400, 'content required')
        const blobPath = toBlob(path)
        await put(blobPath, content, {
          access: 'public',
          allowOverwrite: true,
          addRandomSuffix: false,
          cacheControlMaxAge: 60,
        })
        const manifest = await readManifest()
        if (manifest.includes(blobPath)) await writeManifest(manifest.filter((x) => x !== blobPath))
        const deployed = await triggerDeploy()
        return ok(res, { ok: true, deployed })
      }

      if (action === 'delete') {
        if (!path || !validPath(path)) return fail(res, 400, 'Invalid path')
        const blobPath = toBlob(path)
        await del(blobPath)
        const manifest = await readManifest()
        if (!manifest.includes(blobPath)) await writeManifest([...manifest, blobPath])
        const deployed = await triggerDeploy()
        return ok(res, { ok: true, deployed })
      }

      return fail(res, 400, 'Unknown action')
    }

    return fail(res, 405, 'Method not allowed')
  } catch (e) {
    const msg = e?.message || String(e)
    const hint =
      e?.name === 'BlobAccessError' || /token|credential|blob store/i.test(msg)
        ? 'Blob storage problem — attach a Blob store to this project in Vercel (Storage → Create Blob), then redeploy.'
        : `${e?.name || 'Error'}: ${msg}`
    return fail(res, 500, hint)
  }
}
