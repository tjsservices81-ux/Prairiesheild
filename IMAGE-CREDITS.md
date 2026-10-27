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
