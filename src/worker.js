// Prairie Shield — Cloudflare Worker in front of the static site.
// Every non-canonical request (http, bare domain, /index.html, a missing
// trailing slash or a retired URL) gets ONE 301 straight to the final
// https://www. address, so crawlers and visitors never follow a chain.
// Everything else is served from the static files as normal.
const CANONICAL_ORIGIN = 'https://www.prairieshieldwaterproofing.com';
const CANONICAL_HOST = 'www.prairieshieldwaterproofing.com';
const BARE_HOST = 'prairieshieldwaterproofing.com';

// Retired URLs. Keep in step with _redirects.
const MOVED = {
  '/roofing-siding/': '/',
  '/porch-step-repair/': '/porch-repair/',
  '/masonry-concrete-repair/': '/masonry-restoration/',
  '/foundation-piers/': '/helical-push-piers/',
  '/french-drain-systems/': '/french-drain-drain-tile/',
  '/tuckpointing-masonry/': '/tuckpointing/',
  '/basement-waterproofing/': '/basement-waterproofing-chicago/',
};

function canonicalPath(pathname) {
  let p = pathname;
  // /foo/index.html -> /foo/
  if (p.endsWith('/index.html')) { p = p.slice(0, -'index.html'.length); }
  // Page URLs end in a slash; files (anything with an extension) do not.
  const last = p.slice(p.lastIndexOf('/') + 1);
  if (last && !last.includes('.')) { p += '/'; }
  return MOVED[p] || p;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const isOurHost = url.hostname === CANONICAL_HOST || url.hostname === BARE_HOST;

    // Only page requests are normalized; local previews and workers.dev pass through.
    if (isOurHost && (request.method === 'GET' || request.method === 'HEAD')) {
      const path = canonicalPath(url.pathname);
      if (url.protocol !== 'https:' || url.hostname !== CANONICAL_HOST || path !== url.pathname) {
        return Response.redirect(CANONICAL_ORIGIN + path + url.search, 301);
      }
    }

    // Scheduled posts: 404 until their date; their cards, sitemap entries and
    // llms.txt lines are removed until then too.
    const pending = Object.keys(SCHEDULED).filter(p => !isLive(SCHEDULED[p]));
    if (pending.length === 0) return env.ASSETS.fetch(request);
    if (pending.includes(url.pathname)) return notFound(request, env);

    const res = await env.ASSETS.fetch(request);
    const type = res.headers.get('content-type') || '';
    if (res.status !== 200) return res;
    if (url.pathname === '/sitemap.xml' || url.pathname === '/llms.txt') {
      let text = await res.text();
      for (const p of pending) {
        text = url.pathname === '/sitemap.xml'
          ? text.replace(new RegExp(`[ \\t]*<url>\\s*<loc>[^<]*${p}</loc>[\\s\\S]*?</url>\\n?`, 'g'), '')
          : text.split('\n').filter(line => !line.includes(p)).join('\n');
      }
      return new Response(text, { status: 200, headers: freshHeaders(res.headers) });
    }
    if (type.includes('text/html')) {
      const rewritten = new HTMLRewriter()
        .on('[data-publish]', { element(el) { if (!isLive(el.getAttribute('data-publish'))) el.remove(); } })
        .transform(res);
      return new Response(rewritten.body, { status: 200, headers: freshHeaders(res.headers) });
    }
    return res;
  },
};

// Path -> first day it is visible (midnight in Chicago, 06:00 UTC in November).
const SCHEDULED = {
  '/learning-center/foundation-crack-repair-chicago/': '2026-11-18',
  '/learning-center/epoxy-vs-polyurethane-crack-injection/': '2026-11-19',
  '/learning-center/sump-pump-installation-chicago/': '2026-11-25',
  '/learning-center/sump-pump-installation-guide/': '2026-11-26',
};

function isLive(date) {
  return Date.now() >= Date.parse(`${date}T06:00:00Z`);
}

// Rewritten responses must not be revalidated against the static file's ETag,
// or a browser could keep a copy made before a post went live.
function freshHeaders(headers) {
  const h = new Headers(headers);
  h.delete('etag');
  h.delete('content-length');
  h.set('cache-control', 'no-cache');
  return h;
}

async function notFound(request, env) {
  // Any missing path makes the assets binding answer with the site's 404 page.
  const page = await env.ASSETS.fetch(new Request(new URL('/__not-published-yet__/', request.url), request));
  return new Response(page.body, { status: 404, headers: freshHeaders(page.headers) });
}
