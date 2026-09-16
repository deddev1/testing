/**
 * Worker entry for Astro static output in ./dist.
 * IMPORTANT: Always fetch assets via https://assets.local — never the request
 * hostname — or Cloudflare returns HTTP 522 on custom domains.
 *
 * /sitemap.xml and /robots.txt are served as static assets (see wrangler.toml
 * run_worker_first exclusions). Do not route them through this Worker — reading
 * and rewriting those bodies has caused Google "couldn't fetch" / HTTP 500s.
 */
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

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (needsCanonicalRedirect(url)) {
      url.protocol = 'https:'
      url.hostname = CANONICAL_HOST
      return Response.redirect(url.toString(), 301)
    }

    const assetResponse = await assetsFetch(env, request, url.pathname + url.search)
    return withHtmlCharset(assetResponse)
  },
}
