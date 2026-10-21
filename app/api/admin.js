const OWNER = 'knight-dev01'
const REPO = 'The-POET'
const BRANCH = 'main'
const BASE = `https://api.github.com/repos/${OWNER}/${REPO}`

function ok(res, data) {
  res.status(200).json(data)
}
function fail(res, code, msg) {
  res.status(code).json({ error: msg })
}

async function gh(path, opts = {}) {
  const token = process.env.GITHUB_TOKEN
  if (!token) throw new Error('GITHUB_TOKEN not set')
  const r = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(opts.body ? { 'Content-Type': 'application/json' } : {}),
      ...(opts.headers || {}),
    },
  })
  if (!r.ok) {
    const t = await r.text()
    throw new Error(`GitHub ${r.status}: ${t.slice(0, 200)}`)
  }
  return r.json()
}

function authed(req) {
  const pass = process.env.ADMIN_PASSWORD
  if (!pass) return false
  const h = req.headers.authorization || ''
  return h === `Bearer ${pass}`
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
        const folder = col === 'projects' ? 'app/content/projects' : 'app/content/blog'
        const data = await gh(`/contents/${folder}?ref=${BRANCH}`)
        const files = (Array.isArray(data) ? data : [])
          .filter((f) => f.name.endsWith('.md'))
          .map((f) => ({ name: f.name, path: f.path }))
        return ok(res, { files })
      }
      if (action === 'read') {
        const p = url.searchParams.get('path')
        if (!p) return fail(res, 400, 'path required')
        const data = await gh(`/contents/${p}?ref=${BRANCH}`)
        const content = Buffer.from(data.content, 'base64').toString('utf8')
        return ok(res, { content, sha: data.sha })
      }
      return fail(res, 400, 'Unknown action')
    }

    if (req.method === 'POST') {
      let body = ''
      for await (const chunk of req) body += chunk
      const { action, path, content, message } = JSON.parse(body || '{}')

      if (action === 'write') {
        if (!path || content == null) return fail(res, 400, 'path and content required')
        let sha
        try {
          const existing = await gh(`/contents/${path}?ref=${BRANCH}`)
          sha = existing.sha
        } catch {}
        const payload = {
          message: message || `admin: update ${path}`,
          content: Buffer.from(content, 'utf8').toString('base64'),
          branch: BRANCH,
          ...(sha ? { sha } : {}),
        }
        await gh(`/contents/${path}`, { method: 'PUT', body: JSON.stringify(payload) })
        return ok(res, { ok: true })
      }

      if (action === 'delete') {
        if (!path) return fail(res, 400, 'path required')
        const existing = await gh(`/contents/${path}?ref=${BRANCH}`)
        await gh(`/contents/${path}`, {
          method: 'DELETE',
          body: JSON.stringify({ message: `admin: delete ${path}`, sha: existing.sha, branch: BRANCH }),
        })
        return ok(res, { ok: true })
      }

      return fail(res, 400, 'Unknown action')
    }

    return fail(res, 405, 'Method not allowed')
  } catch (e) {
    return fail(res, 500, e.message || 'Server error')
  }
}
