---
title: "How I structure a content-driven portfolio"
description: "A markdown-first approach to blogs, projects and a searchable knowledge hub — with full SEO from day one."
date: 2026-02-01
topics: ["content", "seo", "portfolio"]
keywords: ["markdown blog", "content driven site", "portfolio SEO"]
featured: true
---

This site is built **markdown-first**. Every post and project lives as a `.md` file with frontmatter, so adding content is as simple as dropping a file into `/content/blog/`.

## Why markdown-first?

- **Portable** — your content is plain text, not locked in a database.
- **Git-native** — every edit is a commit, with full history.
- **Fast** — no runtime fetching; content is bundled at build time.

## Frontmatter that does the SEO work

Each post declares its own `title`, `description`, `topics` and `keywords`. These feed:

1. The `<title>` and meta description
2. Open Graph + Twitter cards
3. JSON-LD `Article` structured data
4. The sitemap and RSS feed
5. Topic hub pages and related-post links

## Editing without code

This site ships with a Decap CMS admin at `/admin`, so you can write and edit posts in a visual editor backed by your GitHub repo.
