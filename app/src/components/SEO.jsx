import { Helmet } from 'react-helmet-async'
import { SITE } from '../lib/site'

export default function SEO({
  title,
  description,
  path = '/',
  keywords,
  type = 'website',
  image,
  jsonLd,
  noindex = false,
  date,
}) {
  const fullTitle = title ? `${title} · ${SITE.name}` : SITE.title
  const desc = description || SITE.description
  const url = SITE.url.replace(/\/$/, '') + (path === '/' ? '/' : path)
  const img = image || `${SITE.url.replace(/\/$/, '')}/og.png`

  const baseLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${SITE.url}/#person`,
        name: SITE.author,
        url: SITE.url,
        email: SITE.email,
        sameAs: [SITE.github, SITE.linkedin, SITE.twitter].filter(Boolean),
        jobTitle: 'AI-Native Backend Engineer & Writer',
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
        description: SITE.description,
        publisher: { '@id': `${SITE.url}/#person` },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE.url}/topics?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  }

  const pageLd =
    type === 'article' && date
      ? {
          '@type': 'Article',
          headline: title,
          description: desc,
          url,
          datePublished: date,
          author: { '@type': 'Person', name: SITE.author },
          publisher: { '@id': `${SITE.url}/#person` },
          mainEntityOfPage: url,
          keywords: (keywords || []).join(', '),
        }
      : null

  const graph = [...baseLd['@graph'], ...(pageLd ? [pageLd] : []), ...(jsonLd ? [jsonLd] : [])]

  return (
    <Helmet>
      <html lang="en" />
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {keywords?.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {!noindex && <meta name="robots" content="index, follow, max-image-preview:large" />}

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta property="og:locale" content={SITE.locale} />
      {date && <meta property="article:published_time" content={date} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />

      <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>
    </Helmet>
  )
}
