import { useState, useEffect } from 'react'
import SEO from '../components/SEO'

const API = '/api/admin'

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!m) return { data: {}, body: raw }
  const data = {}
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.*)$/)
    if (!kv) continue
    let v = kv[2].trim()
    if (v.startsWith('[') && v.endsWith(']')) {
      v = v
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean)
    } else if (v === 'true') v = true
    else if (v === 'false') v = false
    else v = v.replace(/^['"]|['"]$/g, '')
    data[kv[1]] = v
  }
  return { data, body: m[2] || '' }
}

function buildFrontmatter(data, body) {
  const lines = ['---']
  for (const [k, v] of Object.entries(data)) {
    if (Array.isArray(v)) lines.push(`${k}: [${v.join(', ')}]`)
    else if (typeof v === 'boolean') lines.push(`${k}: ${v}`)
    else if (v === '' || v == null) continue
    else lines.push(`${k}: "${v}"`)
  }
  lines.push('---', '', body)
  return lines.join('\n')
}

export default function Admin() {
  const [password, setPassword] = useState('')
  const [session, setSession] = useState(() => sessionStorage.getItem('poet:admin') || '')
  const [files, setFiles] = useState([])
  const [selected, setSelected] = useState(null)
  const [raw, setRaw] = useState('')
  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(false)
  const [collection, setCollection] = useState('blog')

  const headers = { Authorization: `Bearer ${session}` }

  async function login(e) {
    e.preventDefault()
    setBusy(true)
    setMsg(null)
    try {
      const r = await fetch(`${API}?action=list&collection=blog`, { headers: { Authorization: `Bearer ${password}` } })
      if (!r.ok) throw new Error('Wrong password')
      sessionStorage.setItem('poet:admin', password)
      setSession(password)
      setPassword('')
    } catch (err) {
      setMsg({ err: true, text: err.message })
    }
    setBusy(false)
  }

  async function loadList(col) {
    setCollection(col)
    setSelected(null)
    setRaw('')
    try {
      const r = await fetch(`${API}?action=list&collection=${col}`, { headers })
      const d = await r.json()
      if (d.error) throw new Error(d.error)
      setFiles(d.files || [])
    } catch (err) {
      setMsg({ err: true, text: err.message })
    }
  }

  useEffect(() => {
    if (session) loadList('blog')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  async function openFile(f) {
    setSelected(f.path)
    setMsg(null)
    try {
      const r = await fetch(`${API}?action=read&path=${encodeURIComponent(f.path)}`, { headers })
      const d = await r.json()
      if (d.error) throw new Error(d.error)
      setRaw(d.content)
    } catch (err) {
      setMsg({ err: true, text: err.message })
    }
  }

  async function save() {
    if (!selected) return
    setBusy(true)
    setMsg(null)
    try {
      const r = await fetch(API, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'write',
          path: selected,
          content: raw,
          message: `admin: update ${selected}`,
        }),
      })
      const d = await r.json()
      if (d.error) throw new Error(d.error)
      setMsg({ err: false, text: 'Saved to GitHub. Vercel will redeploy.' })
    } catch (err) {
      setMsg({ err: true, text: err.message })
    }
    setBusy(false)
  }

  async function createNew() {
    const title = prompt('Post title?')
    if (!title) return
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const folder = collection === 'projects' ? 'app/content/projects' : 'app/content/blog'
    const path = `${folder}/${slug}.md`
    const today = new Date().toISOString().slice(0, 10)
    const skeleton =
      collection === 'projects'
        ? buildFrontmatter(
            { title, description: '', date: today, topics: [], keywords: [], stack: [], draft: true },
            ''
          )
        : buildFrontmatter(
            { title, description: '', date: today, topics: [], keywords: [], featured: false, draft: true },
            ''
          )
    setBusy(true)
    try {
      const r = await fetch(API, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'write', path, content: skeleton, message: `admin: create ${path}` }),
      })
      const d = await r.json()
      if (d.error) throw new Error(d.error)
      await loadList(collection)
      setSelected(path)
      setRaw(skeleton)
      setMsg({ err: false, text: 'Created. Edit and save.' })
    } catch (err) {
      setMsg({ err: true, text: err.message })
    }
    setBusy(false)
  }

  async function remove() {
    if (!selected || !confirm(`Delete ${selected}?`)) return
    setBusy(true)
    try {
      const r = await fetch(API, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', path: selected }),
      })
      const d = await r.json()
      if (d.error) throw new Error(d.error)
      setMsg({ err: false, text: 'Deleted.' })
      setSelected(null)
      setRaw('')
      await loadList(collection)
    } catch (err) {
      setMsg({ err: true, text: err.message })
    }
    setBusy(false)
  }

  function logout() {
    sessionStorage.removeItem('poet:admin')
    setSession('')
    setFiles([])
    setSelected(null)
  }

  if (!session) {
    return (
      <>
        <SEO title="Admin" description="Content admin" path="/admin" noindex />
        <div className="admin-panel">
          <form className="admin-gate" onSubmit={login}>
            <p className="mono section-tag">Admin access</p>
            <h2>Enter passphrase</h2>
            <div className="ledger-form">
              <div>
                <label htmlFor="pw">Passphrase</label>
                <input
                  id="pw"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <button className="btn primary" type="submit" disabled={busy}>
                {busy ? 'Checking…' : 'Unlock'}
              </button>
              {msg && <p className={`form-msg ${msg.err ? 'err' : ''}`}>{msg.text}</p>}
            </div>
          </form>
        </div>
      </>
    )
  }

  return (
    <>
      <SEO title="Admin" description="Content admin" path="/admin" noindex />
      <div className="admin-panel">
        <p className="mono section-tag">Admin · Content studio</p>
        <h2>Edit content</h2>
        <div className="cta-row">
          <button className="btn" onClick={() => loadList('blog')} disabled={busy}>
            Blog
          </button>
          <button className="btn" onClick={() => loadList('projects')} disabled={busy}>
            Projects
          </button>
          <button className="btn primary" onClick={createNew} disabled={busy}>
            New {collection === 'projects' ? 'project' : 'post'}
          </button>
          <button className="btn" onClick={logout}>
            Lock
          </button>
        </div>

        <div className="admin-list">
          {files.map((f) => (
            <button
              key={f.path}
              className={selected === f.path ? 'active' : ''}
              onClick={() => openFile(f)}
            >
              {f.name}
            </button>
          ))}
          {files.length === 0 && <p className="sub">No files in this collection.</p>}
        </div>

        {selected && (
          <div className="admin-editor">
            <p className="mono">{selected}</p>
            <textarea
              className="body-input"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              spellCheck={false}
            />
            <div className="admin-actions">
              <button className="btn primary" onClick={save} disabled={busy}>
                {busy ? 'Saving…' : 'Save to GitHub'}
              </button>
              <button className="btn" onClick={remove} disabled={busy}>
                Delete file
              </button>
            </div>
          </div>
        )}

        {msg && <p className={`form-msg ${msg.err ? 'err' : ''}`}>{msg.text}</p>}
      </div>
    </>
  )
}
