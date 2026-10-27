# Prairie Shield Waterproofing & Foundation Repair — Website

Static website for **Prairie Shield Waterproofing & Foundation Repair**, Chicago.

> *Professional Repairs. Lasting Results.*

Plain HTML, CSS and vanilla JavaScript. No frameworks, no build step, no
database. Designed for Netlify hosting with Netlify Forms.

**45 pages:** homepage, 21 masonry service pages, 9 foundation service pages,
special offers, 7 service-area pages + hub, about, contact, privacy, thank-you
and 404.

---

## How to run locally

```bash
# from the project root
python3 -m http.server 8000
```

Then open <http://localhost:8000>. A local server is recommended so clean URLs
like `/tuckpointing/` resolve correctly.

## How to deploy to Netlify

1. **Create a GitHub repository** (or use this one).
2. **Push the files** to the repository's main branch.
3. **Connect the repository to Netlify**: *Add new site → Import an existing
   project*, pick GitHub and select the repo.
4. **Confirm the publish folder**: the publish directory is the repository root
   (`.`) — already set in `netlify.toml`. Leave the build command empty.
5. **Deploy.** Netlify publishes the site and automatically detects all 40 lead
   forms.
6. **Enable form notifications** in *Netlify → Forms → Form notifications* so
   submissions reach your inbox.
7. **Test the forms**: submit a test on the homepage and a service page, then
   confirm the entries appear in *Netlify → Forms*.

> **reCAPTCHA:** every form uses Netlify's built-in reCAPTCHA
> (`data-netlify-recaptcha="true"`). Netlify injects Google's official widget
> and branding at deploy time using its own keys — **no site key is needed and
> the widget does not render on a local server**, only on the deployed site.

---

## Forms and emails

The code side is complete and verified — 70 forms across 47 pages, all with
correct Netlify markup. Three things remain in the Netlify dashboard plus one
email address. See **`FORMS-SETUP.md`** for the exact steps.

Short version: enable form detection and redeploy, point form notifications at
a real inbox, and either set `SITE_RECAPTCHA_KEY` / `SITE_RECAPTCHA_SECRET` or
run `./tools/recaptcha.sh off`.

## ⚠️ Replace before launch

| Item | Placeholder value | Where |
|---|---|---|
| Email | `info@prairieshieldwaterproofing.com` | Footers, contact page, privacy policy, schema |
| Final domain | `https://www.prairieshieldwaterproofing.com` | Canonicals, Open Graph, Twitter cards, JSON-LD, `sitemap.xml`, `robots.txt` |
| GA4 ID | `G-XXXXXXXXXX` | `assets/js/tracking.js` (see `GOOGLE-ADS-GA4-SETUP.md`) |
| Google Ads ID | `AW-XXXXXXXXX` | `assets/js/tracking.js` |
| Ads conversion label | `XXXXXXXXXXX` | `assets/js/tracking.js` |
| Real reviews | "Future customer review" cards | Every page's review slider (marked `REVIEW PLACEHOLDER` in the HTML) |
| Real project photos | All `assets/images/photo-*.webp` | See `IMAGE-CREDITS.md` |
| Before & after photos | `placeholder-before.webp` / `placeholder-after.webp` | Before & After section on every service page |
| Financing details | Generic "ask us about payment options" block | Homepage financing section (marked `FINANCING PLACEHOLDER`) |
| Offer terms & expiration | Generic terms; expiry auto-set to end of next month | `OFFERS` list in the page generator + `.js-offer-expires` in `main.js` |
| Warranty wording | "30-year warranty (subject to written terms)" | Confirm exact wording with the business |
| Insurance & bonding | "Fully Insured & Bonded" | Confirm before launch |
| Legal business name | Not yet shown | Add the registered LLC name to the footer once formed |
| Privacy policy | `/privacy-policy/` | **Must be reviewed and approved by the business before launch** |

The phone number is live: **(847) 942-0209** / `tel:+18479420209`, set in the
page generator, the JSON-LD schema and `assets/js/forms.js`.

Tip: a project-wide search-and-replace for
`info@prairieshieldwaterproofing.com` and
`https://www.prairieshieldwaterproofing.com` updates the rest at once.

## Brand

| Token | Value | Used for |
|---|---|---|
| Navy | `#0B2D5C` | Headings, header, primary structure |
| Construction Red | `#B22234` | Primary CTAs, alerts, accents |
| Metallic Gold | `#D4AF37` | Highlights, rules, badges, focus rings |
| White | `#FFFFFF` | Backgrounds |
| Dark Charcoal | `#222222` | Deep sections |

Gold does **not** meet AA contrast on white, so it is used only for large
display text, rules, icons and accents on dark backgrounds — never for body
copy on white. Fonts: Montserrat (headings/buttons), Inter (body/forms).

## Logo files

| File | Used for |
|---|---|
| `assets/images/logo-horizontal.png` | Header logo on every page |
| `assets/images/logo-white.png` | Knockout version — footer, offer cards, dark sections |
| `assets/images/logo-shield.png` | Shield mark — thank-you page, compact spots |
| `assets/images/logo-mobile.png` | Compact lockup (available if a smaller header is wanted) |
| `assets/images/logo-icon-192.png` / `-512.png` | Web app manifest icons |
| `/favicon.ico`, `/favicon-32x32.png`, `/favicon-16x16.png`, `/apple-touch-icon.png` | Browser tabs, bookmarks, Google results, iOS home screen |

All derived from the supplied shield artwork. The horizontal lockup pairs the
shield with a typeset wordmark; if a vector (SVG/AI/EPS) version of the logo
becomes available, swapping it in will sharpen the rendering further.

## Special offers & the save-offer system

`/special-offers/` presents four offers. **No coupon codes are shown or stored
anywhere** — customers tap **Save Offer**, which stores the offer's name in
their browser (`localStorage`) and attaches it automatically to any estimate
request as a hidden `offer` field. Saved offers show as "✓ Offer Saved" and the
form banner switches to confirm the offer will be applied.

To change offers, edit the `OFFERS` list in the page generator and rebuild.
Expiration dates are computed in JavaScript as the end of next month so they
never go stale — replace with fixed dates if you prefer.

## Forms

40 Netlify forms, each with honeypot (`bot-field`), reCAPTCHA, AJAX submission
and a no-JS fallback that posts normally and redirects to `/thank-you/`:
`lead-homepage`, `lead-contact`, `lead-special-offers`, `lead-<service-slug>`
(30) and `lead-area-<area-slug>` (7).

## Tracking

`generate_lead`, `phone_call`, `cta_click` (including offer saves) and
`scroll_75` are wired in `assets/js/tracking.js`. Google tracking stays
**inactive** until real IDs are added — see `GOOGLE-ADS-GA4-SETUP.md`.

## Project structure

```
/
├── index.html                      Homepage
├── 404.html
├── <service>/index.html            30 service pages (21 masonry + 9 foundation)
├── special-offers/index.html
├── service-areas/index.html        + 7 county/city pages
├── about/  contact/  privacy-policy/  thank-you/
├── assets/
│   ├── css/styles.css              All styles (mobile-first)
│   ├── js/main.js                  Nav, accordions, reveals, counters, sliders
│   ├── js/offers.js                Save-offer system + confetti
│   ├── js/forms.js                 AJAX form submission
│   ├── js/tracking.js              GA4 / Google Ads events
│   └── images/                     Logos, offer art, placeholder photos
├── favicon.ico / favicon-*.png / apple-touch-icon.png / site.webmanifest
├── sitemap.xml   robots.txt   netlify.toml
├── GOOGLE-ADS-GA4-SETUP.md
└── IMAGE-CREDITS.md
```
