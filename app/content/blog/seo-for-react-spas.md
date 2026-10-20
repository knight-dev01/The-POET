---
title: "SEO for React SPAs: what actually works"
description: "Meta tags, JSON-LD, sitemaps and RSS — how to make a client-rendered React app indexable."
date: 2026-01-18
topics: ["seo", "react", "web"]
keywords: ["react SEO", "SPA indexing", "JSON-LD react", "react helmet"]
featured: true
---

Single-page apps get a bad reputation for SEO, but the basics still apply.

## The non-negotiables

- **Unique title + meta description per route** — done here with `react-helmet-async`.
- **Canonical URLs** — tell search engines which version is the real one.
- **JSON-LD structured data** — `Person`, `WebSite` and `Article` help Google understand your content.

## Sitemap + RSS

A static sitemap and RSS feed are generated at build time from the same markdown files that power the pages. One source of truth.

## What Google actually does

Google renders JavaScript. The real risk isn't "SPAs can't be indexed" — it's *thin content* and *missing metadata*. Fix those and a React app indexes fine.
