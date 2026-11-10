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
    return env.ASSETS.fetch(request);
  },
};
