import { useState, useEffect, useRef } from 'react'
import SEO from '../components/SEO'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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
  const taRef = useRef(null)
  const [mode, setMode] = useState('split')

  const headers = { Authorization: `Bearer ${session}` }

  function focusTa(start, end) {
    requestAnimationFrame(() => {
      const ta = taRef.current
      if (!ta) return
      ta.focus()
      ta.setSelectionRange(start, end)
    })
  }

  function wrapSel(before, after, placeholder) {
    const ta = taRef.current
    if (!ta) return
    const { selectionStart: s, selectionEnd: e, value } = ta
    const sel = value.slice(s, e) || placeholder
    setRaw(value.slice(0, s) + before + sel + after + value.slice(e))
    focusTa(s + before.length, s + before.length + sel.length)
  }

  function prefixLine(token) {
    const ta = taRef.current
    if (!ta) return
    const { selectionStart: s, selectionEnd: e, value } = ta
    const start = value.lastIndexOf('\n', s - 1) + 1
    let end = value.indexOf('\n', e)
    if (end === -1) end = value.length
    const block = value.slice(start, end)
    const lines = block.split('\n')
    const allPrefixed = lines.every((l) => !l.trim() || l.startsWith(token))
    const nextBlock = lines
      .map((l) => (!l.trim() ? l : allPrefixed ? l.slice(token.length) : token + l))
      .join('\n')
    setRaw(value.slice(0, start) + nextBlock + value.slice(end))
    focusTa(s, e + (nextBlock.length - block.length))
  }

  function insertBlock(text, cursorOffset = text.length) {
    const ta = taRef.current
    if (!ta) return
    const { selectionStart: s, value } = ta
    const head = value.slice(0, s)
    const lead = s === 0 || head.endsWith('\n\n') ? '' : head.endsWith('\n') ? '\n' : '\n\n'
    setRaw(head + lead + text + '\n\n' + value.slice(s))
    const c = s + lead.length + cursorOffset
    focusTa(c, c)
  }

  function onEditorKeyDown(e) {
    if (e.key === 'Tab') {
      e.preventDefault()
      const ta = taRef.current
      if (!ta) return
      const { selectionStart: s, selectionEnd: end, value } = ta
      setRaw(value.slice(0, s) + '  ' + value.slice(end))
      focusTa(s + 2, s + 2)
      return
    }
    if (!(e.ctrlKey || e.metaKey)) return
    const k = e.key.toLowerCase()
    if (k === 'b') {
      e.preventDefault()
      wrapSel('**', '**', 'bold')
    } else if (k === 'i') {
      e.preventDefault()
      wrapSel('_', '_', 'italic')
    } else if (k === 'k') {
      e.preventDefault()
      wrapSel('[', '](https://)', 'link text')
    }
  }

  const TOOLS = [
    { label: 'H2', title: 'Heading 2', run: () => prefixLine('## ') },
    { label: 'H3', title: 'Heading 3', run: () => prefixLine('### ') },
    { sep: true },
    { label: 'B', title: 'Bold (Ctrl+B)', run: () => wrapSel('**', '**', 'bold') },
    { label: 'I', title: 'Italic (Ctrl+I)', run: () => wrapSel('_', '_', 'italic') },
    { label: 'S', title: 'Strikethrough', run: () => wrapSel('~~', '~~', 'struck') },
    { label: '<>', title: 'Inline code', run: () => wrapSel('`', '`', 'code') },
    { sep: true },
    { label: '>', title: 'Blockquote', run: () => prefixLine('> ') },
    { label: '•', title: 'Bulleted list', run: () => prefixLine('- ') },
    { label: '1.', title: 'Numbered list', run: () => prefixLine('1. ') },
    { sep: true },
    { label: 'Link', title: 'Link (Ctrl+K)', run: () => wrapSel('[', '](https://)', 'link text') },
    { label: 'Img', title: 'Image', run: () => wrapSel('![', '](https://image.png)', 'alt text') },
    { sep: true },
    { label: '{}', title: 'Code block', run: () => insertBlock('```js\n\n```', 7) },
    { label: 'Tbl', title: 'Table', run: () => insertBlock('| Column | Column |\n| ------ | ------ |\n| Cell | Cell |') },
    { label: 'HR', title: 'Horizontal rule', run: () => insertBlock('---') },
  ]

  const fm = parseFrontmatter(raw)
  const isDraft = fm.data.draft === true || fm.data.draft === 'true'

  function togglePublish() {
    const { data, body } = parseFrontmatter(raw)
    const nowDraft = data.draft === true || data.draft === 'true'
    setRaw(buildFrontmatter({ ...data, draft: !nowDraft }, body))
    setMsg({
      err: false,
      text: !nowDraft
        ? 'Marked as draft — press Save to apply.'
        : 'Ready to publish — press Save to apply.',
    })
  }

  async function login(e) {
    e.preventDefault()
    setBusy(true)
    setMsg(null)
    try {
      const r = await fetch(`${API}?action=list&collection=blog`, { headers: { Authorization: `Bearer ${password}` } })
      if (!r.ok) {
        const d = await r.json().catch(() => ({}))
        throw new Error(d.error || `Login failed (HTTP ${r.status})`)
      }
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
      setMsg({
        err: false,
        text: d.deployed
          ? 'Saved. Redeploying — the site updates in about a minute.'
          : 'Saved. Will publish on the next deploy (set DEPLOY_HOOK to auto-redeploy).',
      })
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
            <div className="editor-head">
              <p className="mono">{selected}</p>
              {isDraft ? (
                <span className="draft-chip">
                  Draft — hidden on site
                  <button type="button" onClick={togglePublish}>
                    Publish
                  </button>
                </span>
              ) : (
                <span className="draft-chip live">
                  Live
                  <button type="button" onClick={togglePublish}>
                    Unpublish
                  </button>
                </span>
              )}
            </div>
            <div className="md-toolbar" role="toolbar" aria-label="Markdown tools">
              {TOOLS.map((t, i) =>
                t.sep ? (
                  <span key={`sep-${i}`} className="md-sep" aria-hidden />
                ) : (
                  <button
                    key={t.label}
                    type="button"
                    className="md-tool"
                    title={t.title}
                    onClick={t.run}
                  >
                    {t.label}
                  </button>
                )
              )}
              <div className="md-modes">
                {['edit', 'split', 'preview'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`md-mode ${mode === m ? 'active' : ''}`}
                    onClick={() => setMode(m)}
                  >
                    {m[0].toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className={`editor-panes ${mode}`}>
              <textarea
                ref={taRef}
                className="body-input"
                value={raw}
                onChange={(e) => setRaw(e.target.value)}
                onKeyDown={onEditorKeyDown}
                spellCheck={false}
                aria-label="Markdown source"
              />
              {mode !== 'edit' && (
                <div className="admin-preview prose">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {parseFrontmatter(raw).body || '_Empty document — start writing._'}
                  </ReactMarkdown>
                </div>
              )}
            </div>
            <div className="admin-actions">
              <span className="mono editor-status">
                {raw.trim() ? raw.trim().split(/\s+/).length : 0} words · {raw.length} chars
              </span>
              <button className="btn primary" onClick={save} disabled={busy}>
                {busy ? 'Saving…' : 'Save'}
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
