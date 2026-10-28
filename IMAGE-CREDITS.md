# Image Credits

## Brand artwork: supplied by the owner

The Prairie Shield shield logo and the two promotional offer graphics
(`offer-500-masonry-foundation.webp`, `offer-150-chimney.webp`) were supplied
by the business owner. No third-party licences apply.

Derived assets built from that artwork:

| File | How it was made |
|---|---|
| `logo-shield.png` | Supplied shield, background removed, trimmed |
| `logo-horizontal.png` | Shield + typeset wordmark lockup (navy, for light backgrounds) |
| `logo-white.png` | Same lockup knocked out white for dark backgrounds |
| `logo-mobile.png` | Compact version of the lockup |
| `logo-icon-192.png`, `logo-icon-512.png` | Square shield icons for the web manifest |
| `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png` | Favicon set from the shield |
| `og-image.png` | Social share card (1200×630) built from the logo |

## Photos: locally generated placeholders

No stock photos, downloaded images or third-party assets are used. Every
`photo-*.webp` and both before/after placeholders were generated
programmatically for this project as simple brand-coloured graphics. There are
**no external licences to credit**, and **none of them depict real Prairie Shield
projects**. They are labelled as placeholders on the page.

## Images to replace with real photos

| File | Replace with |
|---|---|
| `placeholder-before.webp` | Real "before" project photos |
| `placeholder-after.webp` | Real "after" project photos |
| `photo-home-hero.webp` | General hero / lead photo |
| `photo-family-team.webp` | Real photo of the team |
| `photo-masonry-concrete-repair.webp` | Real masonry / concrete repair photo |
| `photo-chimney-repair.webp` | Real chimney repair photo |
| `photo-porch-step-repair.webp` | Real porch / step repair photo |
| `photo-basement-waterproofing.webp` | Real waterproofing project photo |
| `photo-foundation-repair.webp` | Real foundation repair photo |
| `photo-foundation-crack-repair.webp` | Real crack repair photo |
| `photo-bowed-wall-repair.webp` | Real wall reinforcement photo |
| `photo-sump-pump-installation.webp` | Real sump pump install photo |
| `photo-french-drain-drain-tile.webp` | Real drainage project photo |
| `photo-crawl-space-encapsulation.webp` | Real crawl space photo |
| `photo-emergency-flooding.webp` | Real emergency call photo |

Several masonry pages currently share a placeholder photo (for example the
brick and mortar pages reuse `photo-tuckpointing.webp`). As real photos arrive,
give each service its own image and update the `photo` value for that service
in the page generator.

## Replacement guidance

- Use real project photos you own, or properly licensed images.
- Keep the same filenames to avoid touching HTML, or update the `<img src>`
  references if names change.
- Export at roughly 960×720 (4:3) for section photos and 480×360 for
  before/after tiles, compress, and prefer WebP.
- Update the `alt` text on each page to describe the real photo.
- **Do not use fake before-and-after photos.** The before/after sections are
  clearly labelled as placeholders until genuine paired photos exist.
- Record the source and licence of any licensed image in this file.

## Photos copied from the previous Prairie Shield website

Taken from prairieshieldwaterproofing.com (the owner's earlier site):

| File | Source photo |
|---|---|
| `photo-tuckpointing.webp` | Chimney tuckpointing repair (worker on site) |
| `photo-helical-push-piers.webp` | Helical pier bracket installed |
| `ba-chimney-repair-1-before/after.webp` | Chimney restoration before/after, split in two |
| `ba-brick-repair-2-before/after.webp` | Brick wall crack repair before/after, split in two |

The logo, favicons, share image, coupon graphics and discount cards were
rebuilt from the old site's `logo.png`.

## Free-licence illustration photos (not Prairie Shield jobs)

These show the *type* of work, not Prairie Shield projects. Each page shows
a visible credit line under the photo, as the licences require. They are
placed by `tools/stock_photos.py` and must never be used in Before & After
sections, which promise real project photos. Swap in real job photos as you
get them.

| File | Shows | Author | Licence | Source |
|---|---|---|---|---|
| `stock-sump-pump.webp` | Newly installed sump pump in a basement sump pit | Famartin | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:2023-07-30_20_08_18_A_newly-installed_sump_pump_in_the_basement_of_a_house_along_Aquetong_Lane_in_the_Mountainview_section_of_Ewing_Township,_Mercer_County,_New_Jersey.jpg |
| `stock-flooded-basement.webp` | Water spread across a basement floor after flooding | waynewalterberry | CC BY-SA 2.0 | https://www.flickr.com/photos/33509969@N08/52478340175 |
| `stock-wet-basement-wall.webp` | Water damage along the base of a basement block wall | '58 Foundations | CC BY 2.0 | https://www.flickr.com/photos/196436103@N02/52339556093 |
| `stock-crack-injection.webp` | Injection ports set along a sealed crack in a basement wall | waynewalterberry | CC BY-SA 2.0 | https://www.flickr.com/photos/33509969@N08/53307576628 |
| `stock-wall-braces.webp` | Steel braces reinforcing a basement foundation wall | Napolean_70 | CC BY 2.0 | https://www.flickr.com/photos/11278061@N05/4127321620 |
| `stock-window-well.webp` | Basement window well with a gravel base and grate cover | Tony Webster | CC BY-SA 2.0 | https://www.flickr.com/photos/87296837@N00/53243776625 |
| `stock-concrete-patio.webp` | Freshly poured concrete patio slab | Sery Content Development MT (www.jandjconstructionmt.com) | CC BY 2.0 | https://www.flickr.com/photos/142136365@N08/27038995593 |
| `stock-chicago-bungalow.webp` | Brick Chicago bungalow | Digital Sextant | CC BY-SA 2.0 | https://www.flickr.com/photos/61098690@N00/1407200752 |
| `stock-brick-cleaning.webp` | Brick wall partly washed, showing cleaned and uncleaned brick side by side | Masonry Guy | CC BY 3.0 | https://commons.wikimedia.org/wiki/File:Left_side_before_brick_wall_is_washed,_right_side_has_been_washed.jpg |
| `stock-sealed-brick.webp` | Red brick wall after a masonry sealer was applied | Andrew Lin | CC BY 2.0 | https://www.flickr.com/photos/75106436@N00/1198656775 |

Used on: `stock-sump-pump.webp` → /sump-pump-installation/; `stock-flooded-basement.webp` → /emergency-basement-flooding/; `stock-wet-basement-wall.webp` → /wet-basement-repair/; `stock-crack-injection.webp` → /crack-injection/; `stock-wall-braces.webp` → /wall-anchors/; `stock-window-well.webp` → /window-well-drains/; `stock-concrete-patio.webp` → /concrete-repair/, /concrete-resurfacing/; `stock-chicago-bungalow.webp` → /brick-replacement/, /masonry-restoration/; `stock-brick-cleaning.webp` → /masonry-cleaning/; `stock-sealed-brick.webp` → /masonry-sealing/
