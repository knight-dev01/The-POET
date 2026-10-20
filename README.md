# The POET

**Philosophy of Emerging Technology** — the personal portfolio, blog and knowledge hub of **Ifet Great**, AI-Native Backend Engineer.

> Live consolidation of my projects, articles and concepts from across the web — built to be indexed, referenced and always current.

**Person:** Ifet Great · Lagos, Nigeria · greatifet12@gmail.com
**GitHub:** [knight-dev01](https://github.com/knight-dev01)

---

## What's inside

| Section | Route | Purpose |
|---|---|---|
| Home | `/` | Featured writing, projects, topic cloud |
| Blog | `/blog` | All articles, filterable by keyword |
| Article | `/blog/:slug` | Rendered markdown + related posts |
| Projects | `/projects` | Selected work with stack + links |
| Topics | `/topics`, `/topics/:slug` | Searchable knowledge hub by concept/keyword |
| CV | `/cv` | Virtual CV — print to PDF from the browser |
| Sitemap | `/sitemap` | Human-readable index of every page |

## Features

- **Markdown-first content** — every post and project is a `.md` file with frontmatter in `app/content/`
- **Visual editing** — Decap CMS at `/admin` (GitHub-backed, no code needed)
- **Heavy SEO** — per-page titles/meta/canonical, Open Graph + Twitter cards, JSON-LD (`Person`, `WebSite`, `Article`, `ProfilePage`)
- **Auto-generated** `sitemap.xml`, `robots.txt` and `rss.xml` on every build
- **Knowledge hub** — topic pages, related posts, keyword links, search
- **Dark/light theme** — dark by default, preference saved locally
- **Smooth interactions** — scroll reveals, hover states, reduced-motion respected
- **Code-split** — routes lazy-load; markdown renderer only fetched on article pages

## Stack

- [Vite](https://vite.dev) + [React 18](https://react.dev)
- [React Router](https://reactrouter.com) · [react-helmet-async](https://github.com/staylor/react-helmet-async)
- [react-markdown](https://remarkjs.github.io/react-markdown) + remark-gfm · [gray-matter](https://github.com/jonschlinkert/gray-matter)
- Fonts: General Sans (Fontshare) + IBM Plex Mono (Google Fonts)
- CMS: [Decap CMS](https://decapcms.org)

## Getting started

```bash
cd app
npm install
npm run dev      # http://localhost:5173
npm run build    # builds dist/ + generates sitemap, robots, rss
```

## Adding content

Drop a file in `app/content/blog/` or `app/content/projects/`:

```markdown
---
title: "My new post"
description: "One line that becomes the meta description."
date: 2026-03-01
topics: ["python", "api"]
keywords: ["python api", "fastapi tutorial"]
featured: false
draft: false
---

Your markdown here…
```

- `draft: true` keeps it off the live site
- `topics` power the hub pages; `keywords` feed SEO
- Prefer a UI? Open `/admin` after deploying (see CMS note below)

## Editing your CV

All CV data (experience, skills, education, certifications) lives in
`app/src/lib/cv.js`. Site-wide identity (name, links, tagline) is in
`app/src/lib/site.js`.

## Deployment (Vercel)

Import the repo in Vercel and set:

- **Root Directory:** `app`
- **Framework:** Vite
- **Build Command:** `npm run build` (includes SEO file generation)
- **Output Directory:** `dist`

Set the environment variable `VITE_SITE_URL` to your production URL —
it drives canonical URLs, the sitemap, RSS and JSON-LD.

> **CMS note:** Decap's `git-gateway` backend is Netlify-native. On Vercel,
> editing raw markdown in the GitHub UI works out of the box; for the `/admin`
> visual editor, point the backend at a GitHub OAuth proxy (Decap docs:
> "Working with the GitHub API").

## Project structure

```
Portfolio/
├── app/
│   ├── content/          # markdown: blog/ + projects/
│   ├── public/admin/     # Decap CMS
│   ├── scripts/          # generate-seo.mjs (sitemap/robots/rss)
│   └── src/
│       ├── components/   # Layout, SEO, PostCard
│       ├── lib/          # site.js, cv.js, content.js
│       └── pages/        # Home, Blog, CV, Topics, …
└── README.md
```

## License

MIT — content and design © Ifet Great.
