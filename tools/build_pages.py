#!/usr/bin/env python3
"""Build Prairie Shield's location, service and Learning Center pages.

Every page is cut from tools/templates/area.html (a saved copy of the
original Cook County page), so header, footer, lead form, trust bar,
badges, reviews and process stay identical to the rest of the site. Only
the head metadata, hero, the page's own content sections and the FAQs
change.

    python3 tools/build_pages.py           # build everything
    python3 tools/build_pages.py --check   # build, then report word overlap

Content lives in tools/content_*.py. Edit the words there, then rebuild.
"""
import html
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

SITE = "https://www.prairieshieldwaterproofing.com"
TEMPLATE = os.path.join(ROOT, "tools", "templates", "area.html")
TPL_FORM = "lead-area-cook-county"

# ---------- small HTML helpers used by the content files ----------
WARN_SVG = ('<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l10 18H2L12 3z"/>'
            '<path d="M12 10v5"/><path d="M12 18.5v.01"/></svg>')
CHECK_SVG = ('<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
             'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>')
ARROW_SVG = ('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
             'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>')


def esc(s):
    return html.escape(s, quote=True)


def paras(text_list):
    return "\n".join(f"        <p>{p}</p>" for p in text_list)


def intro(eyebrow, heading, hid, sub=None):
    s = (f'      <div class="section-intro">\n        <span class="eyebrow">{eyebrow}</span>\n'
         f'        <h2 id="{hid}">{heading}</h2>\n        <hr class="rule-gold">\n')
    if sub:
        s += f"        <p>{sub}</p>\n"
    return s + "      </div>\n"


def prose_section(eyebrow, heading, hid, ps, grey=False, photo=None):
    cls = "section section--grey" if grey else "section"
    if photo:
        src, alt, w, h = photo
        return (f'  <section class="{cls}" aria-labelledby="{hid}">\n'
                f'    <div class="container split split--media-right">\n'
                f'      <div class="split__media img-shimmer" data-anim="right">\n'
                f'        <img src="{src}" alt="{esc(alt)}" width="{w}" height="{h}" loading="lazy">\n      </div>\n'
                f'      <div class="split__body" data-anim="left">\n        <span class="eyebrow">{eyebrow}</span>\n'
                f'        <h2 id="{hid}">{heading}</h2>\n        <hr class="rule-gold rule-gold--left">\n'
                f'{paras(ps)}\n'
                f'        <a class="btn btn--navy" href="#lead-form" data-cta data-location="explainer">Schedule a Free Inspection</a>\n'
                f'      </div>\n    </div>\n  </section>\n')
    return (f'  <section class="{cls}" aria-labelledby="{hid}">\n    <div class="container container--narrow article-body">\n'
            + intro(eyebrow, heading, hid) + paras(ps) + "\n    </div>\n  </section>\n")


def warn_section(eyebrow, heading, hid, items, sub=None, grey=True):
    cls = "section section--grey" if grey else "section"
    body = "\n".join(f'      <div class="warning-item" data-anim>{WARN_SVG}<span>{i}</span></div>' for i in items)
    return (f'  <section class="{cls}" aria-labelledby="{hid}">\n    <div class="container">\n'
            + intro(eyebrow, heading, hid, sub) + f'      <div class="warning-grid stagger-group">\n{body}\n      </div>\n'
            "    </div>\n  </section>\n")


def checklist_section(eyebrow, heading, hid, items, grey=False):
    cls = "section section--grey" if grey else "section"
    body = "\n".join(f"      <li>{CHECK_SVG}<span>{i}</span></li>" for i in items)
    return (f'  <section class="{cls}" aria-labelledby="{hid}">\n    <div class="container container--narrow">\n'
            + intro(eyebrow, heading, hid)
            + f'      <ul class="checklist checklist--cols" style="display:grid">\n{body}\n      </ul>\n'
            "    </div>\n  </section>\n")


def cards_section(eyebrow, heading, hid, cards, grey=True):
    cls = "section section--grey" if grey else "section"
    body = "\n".join(
        f'      <div class="card benefit-item" data-anim>\n        <h3>{CHECK_SVG}<span>{t}</span></h3>\n'
        f'        <p>{d}</p>\n      </div>' for t, d in cards)
    return (f'  <section class="{cls}" aria-labelledby="{hid}">\n    <div class="container">\n'
            + intro(eyebrow, heading, hid) + f'      <div class="card-grid card-grid--3 stagger-group">\n{body}\n      </div>\n'
            "    </div>\n  </section>\n")


def links_section(eyebrow, heading, hid, links, grey=False, sub=None, button=None):
    cls = "section section--grey" if grey else "section"
    body = "\n".join(f'      <a class="related-link" href="{u}" data-anim><span>{t}</span>{ARROW_SVG}</a>' for t, u in links)
    s = (f'  <section class="{cls}" aria-labelledby="{hid}">\n    <div class="container">\n'
         + intro(eyebrow, heading, hid, sub) + f'      <div class="related-grid stagger-group">\n{body}\n      </div>\n')
    if button:
        s += f'      <p style="text-align:center;margin-top:1.5rem"><a class="btn btn--outline" href="{button[1]}">{button[0]}</a></p>\n'
    return s + "    </div>\n  </section>\n"


def article_cards_section(eyebrow, heading, hid, items, grey=False):
    cls = "section section--grey" if grey else "section"
    body = "\n".join(
        f'      <a class="card service-card" href="{u}" data-anim>\n        <h3>{t}</h3>\n        <p>{d}</p>\n'
        f'        <span class="card-link">Read the guide &rarr;</span>\n      </a>' for t, u, d in items)
    return (f'  <section class="{cls}" aria-labelledby="{hid}">\n    <div class="container">\n'
            + intro(eyebrow, heading, hid) + f'      <div class="card-grid card-grid--3 stagger-group">\n{body}\n      </div>\n'
            "    </div>\n  </section>\n")


WATERPROOFING_LINKS = [
    ("Basement Waterproofing", "/basement-waterproofing/"),
    ("Wet Basement Repair", "/wet-basement-repair/"),
    ("Foundation Repair", "/foundation-repair/"),
    ("Foundation Crack Repair", "/foundation-crack-repair/"),
    ("Crack Injection", "/crack-injection/"),
    ("Bowed or Bowing Wall Repair", "/bowed-wall-repair/"),
    ("Carbon Fiber Wall Straps", "/carbon-fiber-wall-straps/"),
    ("Wall Anchors &amp; Bracing", "/wall-anchors/"),
    ("Helical and Push Piers", "/helical-push-piers/"),
    ("Sump Pump Installation &amp; Battery Backup", "/sump-pump-installation/"),
    ("French Drain &amp; Drain Tile Systems", "/french-drain-drain-tile/"),
    ("Window Well Drains", "/window-well-drains/"),
    ("Crawl Space Encapsulation", "/crawl-space-encapsulation/"),
    ("24/7 Emergency Basement Flooding", "/emergency-basement-flooding/"),
]
MASONRY_LINKS = [
    ("Tuckpointing", "/tuckpointing/"), ("Brick Repair", "/brick-repair/"),
    ("Chimney Repair", "/chimney-repair/"), ("Porch Repair", "/porch-repair/"),
    ("Step Repair", "/step-repair/"), ("Concrete Repair", "/concrete-repair/"),
    ("Lintel Replacement", "/lintel-replacement/"), ("Masonry Restoration", "/masonry-restoration/"),
]


def services_sections(place):
    where = f" in {place}" if place else ""
    return (links_section("Waterproofing &amp; Foundation", f"Waterproofing &amp; Foundation Services{where}",
                          "fnd-heading", WATERPROOFING_LINKS, grey=True)
            + links_section("Masonry", f"Masonry Services{where}", "mas-heading", MASONRY_LINKS,
                            button=("All Masonry Services", "/services/")))


# ---------- page assembly ----------
def faq_html(faqs, key, heading):
    items = []
    for i, (q, a) in enumerate(faqs, 1):
        items.append(
            f'      <div class="faq-item" data-anim>\n        <h3>\n'
            f'          <button class="faq-item__toggle" type="button" aria-expanded="true" aria-controls="faq-{key}-{i}">{q}</button>\n'
            f'        </h3>\n        <div class="faq-item__panel" id="faq-{key}-{i}">\n          <div class="faq-item__panel-inner">\n'
            f'            <p>{a}</p>\n          </div>\n        </div>\n      </div>')
    return ('<section class="section" aria-labelledby="faq-heading">\n  <div class="container">\n'
            '    <div class="section-intro">\n      <span class="eyebrow">Good to Know</span>\n'
            f'      <h2 id="faq-heading">{heading}</h2>\n      <hr class="rule-gold">\n    </div>\n'
            '    <div class="faq-list stagger-group">\n' + "\n".join(items) + "\n    </div>\n  </div>\n</section>")


def strip_tags(s):
    return html.unescape(re.sub(r"<[^>]+>", "", s))


def build(page, tpl):
    s = tpl
    url = SITE + page["path"]
    title, desc = page["title"], page["desc"]

    # head
    s = re.sub(r"<title>.*?</title>", f"<title>{title}</title>", s, count=1)
    for pat in (r'(<meta name="description" content=")[^"]*', r'(<meta property="og:description" content=")[^"]*',
                r'(<meta name="twitter:description" content=")[^"]*'):
        s = re.sub(pat, lambda m: m.group(1) + esc(desc), s, count=1)
    for pat in (r'(<meta property="og:title" content=")[^"]*', r'(<meta name="twitter:title" content=")[^"]*'):
        s = re.sub(pat, lambda m: m.group(1) + title, s, count=1)
    s = re.sub(r'(<link rel="canonical" href=")[^"]*', lambda m: m.group(1) + url, s, count=1)
    s = re.sub(r'(<meta property="og:url" content=")[^"]*', lambda m: m.group(1) + url, s, count=1)
    if page.get("og_type"):
        s = s.replace('<meta property="og:type" content="website">', f'<meta property="og:type" content="{page["og_type"]}">', 1)

    # structured data: keep the business node, rebuild the rest
    m = re.search(r'(<script type="application/ld\+json">\n)(.*?)(\n  </script>)', s, re.S)
    graph = json.loads(m.group(2))
    business = graph["@graph"][0]
    nodes = [business]
    nodes.extend(page.get("schema", []))
    if page["faqs"]:
        nodes.append({"@type": "FAQPage", "mainEntity": [
            {"@type": "Question", "name": strip_tags(q), "acceptedAnswer": {"@type": "Answer", "text": strip_tags(a)}}
            for q, a in page["faqs"]]})
    nodes.append({"@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i, "name": strip_tags(n), "item": SITE + u}
        for i, (n, u) in enumerate([("Home", "/")] + page["crumbs"], 1)]})
    s = s[:m.start(2)] + json.dumps({"@context": "https://schema.org", "@graph": nodes}, indent=2) + s[m.end(2):]

    s = s.replace('<body data-service="Cook County">', f'<body data-service="{esc(page["service"])}">', 1)

    # navigation: clear the template's active state, then mark this page's
    s = s.replace('<button class="subnav-toggle is-active"', '<button class="subnav-toggle"')
    s = s.replace(' class="is-active" aria-current="page"', "")
    nav = page.get("nav")
    if nav:
        s = s.replace(f'<button class="subnav-toggle" type="button" aria-expanded="false" aria-controls="{nav}">',
                      f'<button class="subnav-toggle is-active" type="button" aria-expanded="false" aria-controls="{nav}">', 1)
        s = re.sub(r'(<ul class="subnav[^"]*" id="%s">.*?<a href="%s")' % (re.escape(nav), re.escape(page["path"])),
                   lambda mm: mm.group(1) + ' class="is-active" aria-current="page"', s, count=1, flags=re.S)
    elif page.get("top_nav"):
        s = s.replace(f'<li><a href="{page["top_nav"]}">', f'<li><a href="{page["top_nav"]}" class="is-active" aria-current="page">', 1)

    # hero
    crumbs = "".join(f'<li><a href="{u}">{n}</a></li>' for n, u in [("Home", "/")] + page["crumbs"][:-1])
    crumbs += f'<li><span aria-current="page">{page["crumbs"][-1][0]}</span></li>'
    s = re.sub(r'(<nav class="breadcrumb" aria-label="Breadcrumb">\s*<ol>).*?(</ol>)',
               lambda mm: mm.group(1) + crumbs + mm.group(2), s, count=1, flags=re.S)
    s = s.replace('<p class="hero__tagline">Professional Repairs. Lasting Results.</p>',
                  f'<p class="hero__tagline">{page.get("tagline", "Professional Repairs. Lasting Results.")}</p>', 1)
    s = re.sub(r"<h1>.*?</h1>", lambda mm: f"<h1>{page['h1']}</h1>", s, count=1)
    s = re.sub(r'(<h1>.*?</h1>\s*<p class="hero__lead">).*?(</p>)', lambda mm: mm.group(1) + page["lead"] + mm.group(2),
               s, count=1, flags=re.S)
    s = s.replace("<h3>Free Estimate in Cook County</h3>", f"<h3>{page['form_heading']}</h3>", 1)
    s = s.replace(TPL_FORM, page["form"])
    s = s.replace('<input type="hidden" name="page-service" value="General Inquiry">',
                  f'<input type="hidden" name="page-service" value="{esc(page["service"])}">', 1)
    if page.get("preselect"):
        s = s.replace(f'<option value="{page["preselect"]}">', f'<option value="{page["preselect"]}" selected>', 1)
        s = s.replace('<option value="" selected disabled>Select a service</option>',
                      '<option value="" disabled>Select a service</option>', 1)

    # body: replace the template's two link sections with this page's content
    a = s.index('  <section class="section" aria-labelledby="mas-heading">')
    b = s.index('<section class="section section--grey" aria-labelledby="why-heading">')
    s = s[:a] + page["body"] + "\n" + s[b:]

    # FAQs
    a = s.index('<section class="section" aria-labelledby="faq-heading">')
    b = s.index("</section>", a) + len("</section>")
    s = s[:a] + faq_html(page["faqs"], page["faq_key"], page["faq_heading"]) + s[b:]

    s = s.replace("<h2 id=\"cta-heading\">Free Estimates Throughout Cook County</h2>",
                  f"<h2 id=\"cta-heading\">{page['cta']}</h2>", 1)

    if page["form"] != TPL_FORM:  # the Cook County page legitimately keeps these
        leftover = [w for w in ("Cook County Questions", "Free Estimate in Cook County", TPL_FORM) if w in s]
        assert not leftover, (page["path"], leftover)
    out = os.path.join(ROOT, page["path"].strip("/"), "index.html")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, "w", encoding="utf-8") as f:
        f.write(s)
    return out


def all_pages():
    # Imported here: the content modules import their helpers from this file
    import content_areas, content_services, content_articles
    return content_areas.pages() + content_services.pages() + content_articles.pages()


def main():
    with open(TEMPLATE, encoding="utf-8") as f:
        tpl = f.read()
    built = [build(p, tpl) for p in all_pages()]
    print(f"built {len(built)} pages")
    import stock_photos  # put the credited illustration photos back
    stock_photos.apply()
    if "--check" in sys.argv:
        check(built)


def check(paths):
    """Report how much page text overlaps, ignoring the shared chrome."""
    import difflib

    def body(p):
        t = open(p, encoding="utf-8").read()
        a = t.index('<main id="main">')
        b = t.index('<section class="section section--grey" aria-labelledby="why-heading">')
        faq = t[t.index('aria-labelledby="faq-heading"'):t.index('class="emergency-banner"')]
        t = t[a:b] + faq
        t = re.sub(r"(?s)<form.*?</form>|<aside.*?</aside>", " ", t)
        return re.sub(r"<[^>]+>", " ", t).split()
    texts = {os.path.relpath(p, ROOT): body(p) for p in paths if "/service-areas/" in p}
    keys = sorted(texts)
    worst = 0
    for i, k in enumerate(keys):
        for k2 in keys[i + 1:]:
            r = difflib.SequenceMatcher(None, texts[k], texts[k2], autojunk=False).ratio()
            worst = max(worst, r)
    print(f"area pages: {len(keys)}, highest text overlap between any two: {worst:.0%}")


if __name__ == "__main__":
    # Run under the module name so the content files share these helpers
    sys.modules.setdefault("build_pages", sys.modules["__main__"])
    main()
