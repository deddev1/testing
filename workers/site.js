/**
 * Worker entry for Astro static output in ./dist.
 * IMPORTANT: Always fetch page assets via https://assets.local — never the
 * request hostname — or Cloudflare returns HTTP 522 on custom domains.
 *
 * Sitemap + robots are served from an embedded build payload (seo-payload.js)
 * so Google never depends on Workers Assets edge cases that returned HTTP 500
 * to some crawlers for /sitemap.xml while browsers still got 200.
 */
import { ROBOTS_TXT, SITEMAP_TXT, SITEMAP_XML } from './seo-payload.js'

const CANONICAL_HOST = 'theislecheats.cc'
const LEGACY_HOSTS = new Set([
  'theislecheats.net',
  'www.theislecheats.net',
  'www.theislecheats.cc',
])

function needsCanonicalRedirect(url) {
  const host = url.hostname.toLowerCase()
  return url.protocol === 'http:' || LEGACY_HOSTS.has(host)
}

function assetsFetch(env, request, pathname) {
  return env.ASSETS.fetch(new Request(new URL(pathname, 'https://assets.local'), request))
}

function withHtmlCharset(response) {
  const contentType = response.headers.get('content-type') || ''
  const primary = contentType.split(',')[0].trim()
  if (!primary.toLowerCase().startsWith('text/html')) return response
  if (/charset=/i.test(primary)) {
    if (contentType.includes(',')) {
      const headers = new Headers(response.headers)
      headers.set('content-type', primary)
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      })
    }
    return response
  }
  const headers = new Headers(response.headers)
  headers.set('content-type', 'text/html; charset=utf-8')
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

function seoResponse(body, contentType) {
  return new Response(body, {
    status: 200,
    headers: {
      'content-type': contentType,
      'cache-control': 'public, max-age=0, must-revalidate',
      'x-content-type-options': 'nosniff',
    },
  })
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (needsCanonicalRedirect(url)) {
      url.protocol = 'https:'
      url.hostname = CANONICAL_HOST
      return Response.redirect(url.toString(), 301)
    }

    if (url.pathname === '/sitemap.xml') {
      return seoResponse(SITEMAP_XML, 'application/xml; charset=utf-8')
    }
    if (url.pathname === '/sitemap.txt') {
      return seoResponse(SITEMAP_TXT, 'text/plain; charset=utf-8')
    }
    if (url.pathname === '/robots.txt') {
      return seoResponse(ROBOTS_TXT, 'text/plain; charset=utf-8')
    }

    const assetResponse = await assetsFetch(env, request, url.pathname + url.search)
    return withHtmlCharset(assetResponse)
  },
}
