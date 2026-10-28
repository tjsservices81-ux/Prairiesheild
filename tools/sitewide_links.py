#!/usr/bin/env python3
"""Add the new service pages and the Learning Center to every page's menu,
footer and estimate-form dropdown. Safe to re-run: links already present are
left alone."""
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# (insert after this href, new href, label)
NEW = [
    ("/basement-waterproofing/", "/wet-basement-repair/", "Wet Basement Repair"),
    ("/foundation-crack-repair/", "/crack-injection/", "Crack Injection"),
    ("/bowed-wall-repair/", "/carbon-fiber-wall-straps/", "Carbon Fiber Wall Straps"),
    ("/carbon-fiber-wall-straps/", "/wall-anchors/", "Wall Anchors &amp; Bracing"),
    ("/french-drain-drain-tile/", "/window-well-drains/", "Window Well Drains"),
]
# (insert after this option value, new option value)
OPTIONS = [
    ("Basement Waterproofing", "Wet Basement Repair"),
    ("Foundation Crack Repair", "Crack Injection"),
    ("Bowed or Bowing Wall Repair", "Carbon Fiber Wall Straps"),
    ("Carbon Fiber Wall Straps", "Wall Anchors &amp; Bracing"),
    ("French Drain &amp; Drain Tile Systems", "Window Well Drains"),
]


def add_links(block):
    for after, href, label in NEW:
        if f'href="{href}"' in block:
            continue
        m = re.search(r'(\n(\s*)<li><a href="%s"[^>]*>[^<]*</a></li>)' % re.escape(after), block)
        if m:
            block = block[:m.end()] + f'\n{m.group(2)}<li><a href="{href}">{label}</a></li>' + block[m.end():]
    return block


def fix(s):
    # header menu
    m = re.search(r'<ul class="subnav" id="subnav-foundation">.*?</ul>', s, re.S)
    if m:
        s = s[:m.start()] + add_links(m.group(0)) + s[m.end():]
    # footer list
    m = re.search(r'<h2>Waterproofing &amp; Foundation</h2>\s*<ul>.*?</ul>', s, re.S)
    if m:
        s = s[:m.start()] + add_links(m.group(0)) + s[m.end():]
    # footer company list
    if 'href="/learning-center/">Learning Center' not in s:
        s = s.replace('          <li><a href="/service-areas/">Service Areas</a></li>\n        </ul>',
                      '          <li><a href="/service-areas/">Service Areas</a></li>\n'
                      '          <li><a href="/learning-center/">Learning Center</a></li>\n        </ul>', 1)
    # form dropdowns
    for after, new in OPTIONS:
        if f'<option value="{new}">' in s:
            continue
        s = re.sub(r'(\n(\s*)<option value="%s">[^<]*</option>)' % re.escape(after),
                   lambda mm: mm.group(1) + f'\n{mm.group(2)}<option value="{new}">{new}</option>', s)
    # service count in the stats band (30 existing + 5 new)
    s = s.replace('<span class="stat__value" data-countup>30</span><span class="stat__label">Waterproofing, Foundation &amp; Masonry Services</span>',
                  '<span class="stat__value" data-countup>35</span><span class="stat__label">Waterproofing, Foundation &amp; Masonry Services</span>')
    return s


def main():
    files = [os.path.join(ROOT, "tools", "templates", "area.html")]
    for d, dirs, fs in os.walk(ROOT):
        dirs[:] = [x for x in dirs if x not in (".git", "tools", "node_modules")]
        files += [os.path.join(d, f) for f in fs if f.endswith(".html")]
    n = 0
    for p in files:
        s = open(p, encoding="utf-8").read()
        t = fix(s)
        if t != s:
            open(p, "w", encoding="utf-8").write(t)
            n += 1
    print(f"updated {n} files")


if __name__ == "__main__":
    main()
