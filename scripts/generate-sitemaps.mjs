/**
 * Single sitemap at /sitemap.xml — every indexed page URL + image sitemap entries.
 * Every <url> must include ≥1 <image:image>. Every first-party still image must appear.
 */
import { existsSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = join(root, 'public')
const dataDir = join(root, 'src', 'data')
const pagesDir = join(root, 'src', 'pages')
// Must match astro `site`, HTML canonicals, and robots.txt Sitemap host.
// Google drops every <loc> that is not on the same host as the sitemap URL.
const SITE = (process.env.SITE_URL || 'https://theislecheats.cc').replace(/\/$/, '')
const TODAY = new Date().toLocaleDateString('en-CA')
const HREFLANG = ['en', 'x-default']

const FOREST = '/media/theisle-cheats-esp-forest.jpg'
const RIVER = '/media/theisle-cheats-esp-river.jpg'
const HOME_HERO = '/media/home-hero-dino.jpg'
const PRODUCT_HERO = '/media/product-hero.webp'
const PRODUCT_COVER = '/media/product-cover.webp'
const OG_DEFAULT = '/og/default.jpg'

/** All indexable still images that must appear in the sitemap at least once. */
const ALL_SITE_IMAGES = [FOREST, RIVER, HOME_HERO, PRODUCT_HERO, PRODUCT_COVER, OG_DEFAULT]

const FORUM_IMAGES = {
  'features-list': RIVER,
  hotkeys: FOREST,
  'complete-setup': RIVER,
  'disable-antivirus': FOREST,
  'undetected-status': RIVER,
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function siteUrl(path) {
  return !path || path === '/' ? `${SITE}/` : `${SITE}${path.startsWith('/') ? path : `/${path}`}`
}

function loadGames() {
  const src = readFileSync(join(dataDir, 'games.ts'), 'utf8')
  return [...src.matchAll(/\{\s*slug:\s*['"]([^'"]+)['"],\s*name:\s*['"]([^'"]+)['"]/g)].map(
    (match) => ({ slug: match[1], name: match[2] }),
  )
}

function loadForums() {
  const src = readFileSync(join(dataDir, 'blogs.ts'), 'utf8')
  const pattern =
    /slug:\s*['"]([^'"]+)['"],\s*title:\s*['"]([^'"]+)['"],[\s\S]*?date:\s*['"](\d{4}-\d{2}-\d{2})['"]/g
  return [...src.matchAll(pattern)].map((match) => ({
    slug: match[1],
    title: match[2],
    date: match[3],
  }))
}

function loadStaticRoutes() {
  return readdirSync(pagesDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.astro') && entry.name !== '404.astro')
    .map((entry) => (entry.name === 'index.astro' ? '/' : `/${entry.name.slice(0, -6)}`))
}

function alternateLinks(url) {
  return HREFLANG.map(
    (language) =>
      `    <xhtml:link rel="alternate" hreflang="${language}" href="${escapeXml(url)}" />`,
  ).join('\n')
}

function imageBlock({ src, title, caption }) {
  return `    <image:image>
      <image:loc>${escapeXml(siteUrl(src))}</image:loc>
      <image:title>${escapeXml(title)}</image:title>
      <image:caption>${escapeXml(caption)}</image:caption>
    </image:image>`
}

function urlEntry({ path, priority, changefreq, lastmod = TODAY, images }) {
  if (!images?.length) {
    throw new Error(`Sitemap entry for ${path} is missing images`)
  }
  const url = siteUrl(path)
  const imageXml = images.map((image) => imageBlock(image)).join('\n')
  return `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${alternateLinks(url)}
${imageXml}
  </url>`
}

function buildSitemap(games, forums) {
  const entries = [
    urlEntry({
      path: '/',
      priority: '1.0',
      changefreq: 'daily',
      images: [
        {
          src: FOREST,
          title: 'TheIsle Cheats ESP Gameplay',
          caption: 'Entity ESP gameplay shown before checkout.',
        },
        {
          src: HOME_HERO,
          title: 'TheIsle Cheats Home Hero',
          caption: 'Homepage hero artwork for The Isle Cheats on Evrima.',
        },
        {
          src: OG_DEFAULT,
          title: 'TheIsle Cheats Social Preview',
          caption: 'Default Open Graph image for The Isle Cheats.',
        },
      ],
    }),
    ...games.map((game) =>
      urlEntry({
        path: `/${game.slug}-cheats`,
        priority: '0.9',
        changefreq: 'weekly',
        images: [
          {
            src: RIVER,
            title: 'Evrima ESP Product Gameplay',
            caption: 'Product features, compatibility, status and price before checkout.',
          },
          {
            src: PRODUCT_HERO,
            title: `${game.name} Product Hero`,
            caption: `Hero artwork for ${game.name} product details and checkout.`,
          },
          {
            src: PRODUCT_COVER,
            title: `${game.name} Product Cover`,
            caption: `Cover artwork for ${game.name} listing and social previews.`,
          },
        ],
      }),
    ),
    urlEntry({
      path: '/forums',
      priority: '0.85',
      changefreq: 'weekly',
      images: [
        {
          src: RIVER,
          title: 'The Isle Cheats Forum Gameplay',
          caption: 'Gameplay reference for setup and feature threads.',
        },
      ],
    }),
    ...forums.map((forum) =>
      urlEntry({
        path: `/forums/${forum.slug}`,
        priority: '0.8',
        changefreq: 'monthly',
        lastmod: forum.date,
        images: [
          {
            src: FORUM_IMAGES[forum.slug] || RIVER,
            title: `${forum.title} Gameplay`,
            caption: `Visible Evrima gameplay reference for ${forum.title}.`,
          },
        ],
      }),
    ),
    urlEntry({
      path: '/reviews',
      priority: '0.8',
      changefreq: 'weekly',
      images: [
        {
          src: FOREST,
          title: 'The Isle Cheats Review Gameplay',
          caption: 'Gameplay accompanying verified buyer reviews.',
        },
      ],
    }),
    urlEntry({
      path: '/faq',
      priority: '0.75',
      changefreq: 'monthly',
      images: [
        {
          src: RIVER,
          title: 'Evrima ESP FAQ Gameplay',
          caption: 'Product screenshot accompanying pre-purchase answers.',
        },
      ],
    }),
    urlEntry({
      path: '/support',
      priority: '0.75',
      changefreq: 'weekly',
      images: [
        {
          src: FOREST,
          title: 'The Isle Cheats Support Gameplay',
          caption: 'Evrima ESP reference accompanying load, inject and delivery support.',
        },
      ],
    }),
  ]

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join('\n')}
</urlset>
`
}

function validate(games, forums, staticRoutes, sitemap) {
  const errors = []
  if (forums.some((forum) => ['instructions', 'how-to-load'].includes(forum.slug))) {
    errors.push('Retired forum slug remains indexed')
  }

  for (const game of games) {
    const page = join(pagesDir, `${game.slug}-cheats.astro`)
    if (!existsSync(page)) errors.push(`Product route has no page file: /${game.slug}-cheats`)
  }
  if (forums.length && !existsSync(join(pagesDir, 'forums', '[slug].astro'))) {
    errors.push('Forum routes have no dynamic page file: src/pages/forums/[slug].astro')
  }

  for (const image of ALL_SITE_IMAGES) {
    const diskPath = join(publicDir, image.replace(/^\//, ''))
    if (!existsSync(diskPath)) errors.push(`Missing image asset on disk: ${image}`)
  }

  const expectedRoutes = new Set([
    ...staticRoutes,
    ...games.map((game) => `/${game.slug}-cheats`),
    ...forums.map((forum) => `/forums/${forum.slug}`),
  ])
  const expectedUrls = new Set([...expectedRoutes].map(siteUrl))

  // Page <loc> only — image:loc also uses <loc> nesting under image:image
  const pageLocs = [...sitemap.matchAll(/<url>\s*<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
  const imageLocs = [...sitemap.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map((match) => match[1])
  const urlBlocks = sitemap.match(/<url>[\s\S]*?<\/url>/g) || []

  for (const url of expectedUrls) {
    if (!pageLocs.includes(url)) errors.push(`Missing URL: ${url}`)
  }
  for (const url of pageLocs) {
    if (!expectedUrls.has(url)) errors.push(`Unexpected URL: ${url}`)
  }
  if (new Set(pageLocs).size !== pageLocs.length) {
    errors.push('sitemap.xml contains duplicate page URLs')
  }
  if (sitemap.includes('<sitemapindex')) errors.push('sitemap.xml must be a single urlset, not an index')
  if (urlBlocks.length !== expectedUrls.size) {
    errors.push(`Expected ${expectedUrls.size} <url> entries, found ${urlBlocks.length}`)
  }

  for (const block of urlBlocks) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1] || '(unknown)'
    if (!block.includes('<image:image>')) {
      errors.push(`URL missing image entry: ${loc}`)
    }
    if (!block.includes('<image:loc>')) {
      errors.push(`URL missing image:loc: ${loc}`)
    }
  }

  for (const image of ALL_SITE_IMAGES) {
    const absolute = siteUrl(image)
    if (!imageLocs.includes(absolute)) {
      errors.push(`Sitemap missing required image: ${image}`)
    }
  }

  if (imageLocs.length < expectedUrls.size) {
    errors.push('Image count is lower than page count — every URL needs an image')
  }

  if (errors.length) throw new Error(`Sitemap validation failed:\n- ${errors.join('\n- ')}`)
}

function main() {
  const games = loadGames()
  const forums = loadForums()
  const staticRoutes = loadStaticRoutes()
  const sitemap = buildSitemap(games, forums)
  validate(games, forums, staticRoutes, sitemap)

  writeFileSync(join(publicDir, 'sitemap.xml'), sitemap, 'utf8')

  const pageLocLines = [...sitemap.matchAll(/<url>\s*<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  const sitemapTxt = `${pageLocLines.join('\n')}\n`
  writeFileSync(join(publicDir, 'sitemap.txt'), sitemapTxt, 'utf8')

  const robots = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${siteUrl('/sitemap.xml')}`,
    `Sitemap: ${siteUrl('/sitemap.txt')}`,
    '',
  ].join('\n')
  writeFileSync(join(publicDir, 'robots.txt'), robots, 'utf8')

  // Embed into the Worker so Google never depends on asset-binding edge cases
  // that have returned HTTP 500 to some crawlers for /sitemap.xml.
  const payloadPath = join(root, 'workers', 'seo-payload.js')
  writeFileSync(
    payloadPath,
    [
      '// AUTO-GENERATED by scripts/generate-sitemaps.mjs — do not edit by hand.',
      `export const SITEMAP_XML = ${JSON.stringify(sitemap)}`,
      `export const SITEMAP_TXT = ${JSON.stringify(sitemapTxt)}`,
      `export const ROBOTS_TXT = ${JSON.stringify(robots)}`,
      '',
    ].join('\n'),
    'utf8',
  )

  const stale = [
    'sitemap-pages.xml',
    'sitemap-products.xml',
    'sitemap-forums.xml',
    'sitemap-images.xml',
    'sitemap-blogs.xml',
    'sitemap-regions.xml',
    'sitemap-index.xml',
    'sitemap_index.xml',
  ]
  for (const name of stale) {
    for (const dir of [publicDir, join(root, 'dist')]) {
      const path = join(dir, name)
      if (existsSync(path)) unlinkSync(path)
    }
  }

  const urlCount = (sitemap.match(/<url>/g) || []).length
  const imageCount = (sitemap.match(/<image:image>/g) || []).length
  console.log(
    `Sitemap OK: ${urlCount} URLs, ${imageCount} images in ${siteUrl('/sitemap.xml')}`,
  )
  console.log(`Worker SEO payload written: workers/seo-payload.js`)
}

main()
