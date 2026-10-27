# Google Ads & GA4 Setup

All tracking lives in one file: **`assets/js/tracking.js`**.
Nothing is active until you add real IDs — no fake IDs ship with the site.

## What you need

| Item | Looks like | Where to get it |
|---|---|---|
| GA4 Measurement ID | `G-XXXXXXXXXX` | Google Analytics → Admin → Data streams → your web stream |
| Google Ads ID | `AW-XXXXXXXXX` | Google Ads → Tools → Google tag |
| Conversion label | `XXXXXXXXXXX` | Google Ads → Goals → Conversions → your "Submit lead form" conversion → Tag setup |

## Step 1 — Activate the Google tag

Open `assets/js/tracking.js`. Near the top there is a commented block that
starts with `STEP 1`. Uncomment it and replace:

- both occurrences of `G-XXXXXXXXXX` with your GA4 Measurement ID
- `AW-XXXXXXXXX` with your Google Ads ID

That block loads gtag.js and configures both GA4 and Google Ads.

## Step 2 — Report the lead conversion to Google Ads

In the same file, inside the `gfTrackLead` function, there is a commented
block marked `STEP 2`. Uncomment it and replace
`AW-XXXXXXXXX/XXXXXXXXXXX` with your Google Ads ID and conversion label,
joined by a slash.

This fires a Google Ads conversion **only after a successful form
submission** (the `generate_lead` event).

## What gets tracked (already wired — no changes needed)

| Event | When it fires | Parameters |
|---|---|---|
| `generate_lead` | After a form submits successfully | `service`, `page_path`, `form_name` |
| `phone_call` | Any tap/click on a phone number | `page_path`, `service`, `button_location` |
| `cta_click` | Free Estimate / Get a Quote / Schedule Inspection / Emergency Help buttons and offer saves | `cta_text`, `page_path`, `service`, `cta_location` |
| `scroll_75` | Once, when a visitor reaches 75% of the page | `page_path`, `service` |

## Step 3 — Verify

1. Deploy the site.
2. Open GA4 → Admin → DebugView (or Realtime).
3. Visit the site, click a phone number, submit a test form.
4. Confirm `phone_call` and `generate_lead` events appear.
5. In Google Ads, confirm the conversion shows as "Recording conversions"
   (can take a few hours after the first test conversion).

Tip: recommended Google Ads setup is to import the GA4 `generate_lead`
event as a conversion **or** use the direct conversion snippet from Step 2 —
using both will double-count. Pick one.
