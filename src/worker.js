// Prairie Shield — Cloudflare Worker in front of the static site.
// Sends the bare domain to www (the address every canonical tag uses), so
// Google sees one copy of the site, then serves the files as normal.
const CANONICAL_HOST = 'www.prairieshieldwaterproofing.com';
const BARE_HOST = 'prairieshieldwaterproofing.com';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === BARE_HOST) {
      url.hostname = CANONICAL_HOST;
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
