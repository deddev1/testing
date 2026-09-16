/**
 * Worker entry for Astro static output in ./dist.
 * IMPORTANT: Always fetch assets via https://assets.local — never the request
 * hostname — or Cloudflare returns HTTP 522 on custom domains.
 *
 * Sitemap/robots go through the Worker (not asset-only) so:
 * - .net / www always 301 to theislecheats.cc (same host as <loc> URLs)
 * - Googlebot gets plain XML (no stylesheet) with correct Content-Type
 */
const CANONICAL_HOST = 'theislecheats.cc'
const LEGACY_HOSTS = new Set([
  'theislecheats.net',
  'www.theislecheats.net',
  'www.theislecheats.cc',
])
const BOT_UA =
  /Googlebot|Google-InspectionTool|Googlebot-Image|bingbot|BingPreview|Slurp|DuckDuckBot|YandexBot|Baiduspider|Applebot|facebookexternalhit|Twitterbot|LinkedInBot|SemrushBot|AhrefsBot/i

function needsCanonicalRedirect(url) {
  const host = url.hostname.toLowerCase()
  return url.protocol === 'http:' || LEGACY_HOSTS.has(host)
}

function assetsFetch(env, request, pathname) {
  return env.ASSETS.fetch(new Request(new URL(pathname, 'https://assets.local'), request))
}

async function serveSitemap(request, env) {
  const assetResponse = await assetsFetch(env, request, '/sitemap.xml')
  if (!assetResponse.ok) return assetResponse

  let body = await assetResponse.text()
  const ua = request.headers.get('user-agent') || ''
  const wantsStylesheet = !BOT_UA.test(ua)

  // Never ship stylesheet in the static file; inject only for browsers.
  body = body.replace(/\s*<\?xml-stylesheet[^?]*\?>\s*/g, '\n')
  if (wantsStylesheet && !body.includes('xml-stylesheet')) {
    body = body.replace(
      /^<\?xml version="1\.0" encoding="UTF-8"\?>\s*/,
      '<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/css" href="/sitemap.css"?>\n',
    )
  }

  return new Response(body, {
    status: 200,
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': wantsStylesheet
        ? 'public, max-age=3600'
        : 'public, max-age=600, must-revalidate',
      'x-content-type-options': 'nosniff',
      'x-robots-tag': 'noarchive',
    },
  })
}

async function serveRobots(request, env) {
  const assetResponse = await assetsFetch(env, request, '/robots.txt')
  if (!assetResponse.ok) return assetResponse
  const body = await assetResponse.text()
  return new Response(body, {
    status: 200,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=600, must-revalidate',
      'x-content-type-options': 'nosniff',
    },
  })
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

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (needsCanonicalRedirect(url)) {
      url.protocol = 'https:'
      url.hostname = CANONICAL_HOST
      return Response.redirect(url.toString(), 301)
    }

    if (url.pathname === '/sitemap.xml') {
      return serveSitemap(request, env)
    }
    if (url.pathname === '/robots.txt') {
      return serveRobots(request, env)
    }

    const assetResponse = await assetsFetch(env, request, url.pathname + url.search)
    return withHtmlCharset(assetResponse)
  },
}
