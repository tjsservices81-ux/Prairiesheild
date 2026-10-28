#!/usr/bin/env python3
"""Free-licence illustration photos on service pages, with their credits.

These are NOT Prairie Shield jobs. They only ever go in a page's explainer
image slot, with a neutral alt text and a visible credit line (every licence
here requires one). Never use them in Before & After sections, which promise
real project photos.

    python3 tools/stock_photos.py   # also runs at the end of build_pages.py
"""
import hashlib
import html
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

LICENSES = {
    "CC BY 2.0": "https://creativecommons.org/licenses/by/2.0/",
    "CC BY 3.0": "https://creativecommons.org/licenses/by/3.0/",
    "CC BY-SA 2.0": "https://creativecommons.org/licenses/by-sa/2.0/",
    "CC BY-SA 4.0": "https://creativecommons.org/licenses/by-sa/4.0/",
}

# image file in assets/images -> (alt, author, source URL, licence)
PHOTOS = {
    "stock-sump-pump.webp": ("Newly installed sump pump in a basement sump pit", "Famartin",
        "https://commons.wikimedia.org/wiki/File:2023-07-30_20_08_18_A_newly-installed_sump_pump_in_the_basement_of_a_house_along_Aquetong_Lane_in_the_Mountainview_section_of_Ewing_Township,_Mercer_County,_New_Jersey.jpg", "CC BY-SA 4.0"),
    "stock-flooded-basement.webp": ("Water spread across a basement floor after flooding", "waynewalterberry",
        "https://www.flickr.com/photos/33509969@N08/52478340175", "CC BY-SA 2.0"),
    "stock-wet-basement-wall.webp": ("Water damage along the base of a basement block wall", "&#x27;58 Foundations",
        "https://www.flickr.com/photos/196436103@N02/52339556093", "CC BY 2.0"),
    "stock-crack-injection.webp": ("Injection ports set along a sealed crack in a basement wall", "waynewalterberry",
        "https://www.flickr.com/photos/33509969@N08/53307576628", "CC BY-SA 2.0"),
    "stock-wall-braces.webp": ("Steel braces reinforcing a basement foundation wall", "Napolean_70",
        "https://www.flickr.com/photos/11278061@N05/4127321620", "CC BY 2.0"),
    "stock-window-well.webp": ("Basement window well with a gravel base and grate cover", "Tony Webster",
        "https://www.flickr.com/photos/87296837@N00/53243776625", "CC BY-SA 2.0"),
    "stock-concrete-patio.webp": ("Freshly poured concrete patio slab", "Sery Content Development MT (www.jandjconstructionmt.com)",
        "https://www.flickr.com/photos/142136365@N08/27038995593", "CC BY 2.0"),
    "stock-chicago-bungalow.webp": ("Brick Chicago bungalow", "Digital Sextant",
        "https://www.flickr.com/photos/61098690@N00/1407200752", "CC BY-SA 2.0"),
    "stock-brick-cleaning.webp": ("Brick wall partly washed, showing cleaned and uncleaned brick side by side", "Masonry Guy",
        "https://commons.wikimedia.org/wiki/File:Left_side_before_brick_wall_is_washed,_right_side_has_been_washed.jpg", "CC BY 3.0"),
    "stock-sealed-brick.webp": ("Red brick wall after a masonry sealer was applied", "Andrew Lin",
        "https://www.flickr.com/photos/75106436@N00/1198656775", "CC BY 2.0"),
}

# page -> photo
PAGES = {
    "sump-pump-installation": "stock-sump-pump.webp",
    "emergency-basement-flooding": "stock-flooded-basement.webp",
    "wet-basement-repair": "stock-wet-basement-wall.webp",
    "crack-injection": "stock-crack-injection.webp",
    "wall-anchors": "stock-wall-braces.webp",
    "window-well-drains": "stock-window-well.webp",
    "concrete-repair": "stock-concrete-patio.webp",
    "concrete-resurfacing": "stock-concrete-patio.webp",
    "brick-replacement": "stock-chicago-bungalow.webp",
    "masonry-restoration": "stock-chicago-bungalow.webp",
    "masonry-cleaning": "stock-brick-cleaning.webp",
    "masonry-sealing": "stock-sealed-brick.webp",
}

SLOT = re.compile(r'(<div class="split__media img-shimmer" data-anim="right">\s*)<img [^>]*>(\s*<p class="photo-credit">.*?</p>)?', re.S)


def figure(name):
    from PIL import Image
    path = os.path.join(ROOT, "assets", "images", name)
    w, h = Image.open(path).size
    v = hashlib.md5(open(path, "rb").read()).hexdigest()[:8]
    alt, author, src, lic = PHOTOS[name]
    return (f'<img src="/assets/images/{name}?v={v}" alt="{html.escape(alt)}" width="{w}" height="{h}" loading="lazy">\n'
            f'        <p class="photo-credit">Example photo: <a href="{src}" rel="nofollow noopener" target="_blank">{author}</a>, '
            f'<a href="{LICENSES[lic]}" rel="nofollow noopener" target="_blank">{lic}</a></p>')


def apply():
    for page, name in PAGES.items():
        p = os.path.join(ROOT, page, "index.html")
        s = open(p, encoding="utf-8").read()
        t, n = SLOT.subn(lambda m: m.group(1) + figure(name), s, count=1)
        assert n == 1, f"no explainer image slot on {page}"
        if t != s:
            open(p, "w", encoding="utf-8").write(t)
    print(f"illustration photos placed on {len(PAGES)} pages")


if __name__ == "__main__":
    apply()
