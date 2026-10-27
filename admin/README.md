# Contract Builder — internal

Lives at `/admin/`. Not linked from anywhere on the site, excluded in
`robots.txt`, and carries a `noindex` meta tag.

## How it is used

1. Open `/admin/` and fill in the form.
2. Tick **Include financial assistance information** if the customer could use it.

**Email 1 — the contract.** Download the contract PDF: one file, the branded
letter first saying exactly what the email says, then the contract itself.
Open the contract email, attach that PDF, send.

**Email 2 — help paying.** Only if you ticked the box. Download the financial
help PDF, open the second email, attach, send.

The two go out separately on purpose. Money worries are private, and at the
bottom of a contract email that sheet reads like a sales angle. On its own it
reads as what it is. The contract letter tells them a second email is coming so
they look out for it, and says plainly that nothing is owed for it.

Everything is generated in the browser. Nothing is uploaded, stored or sent
anywhere. Close the tab and it is gone.

## Why the last step is manual

The site is static — Netlify serves files, there is no server behind it. A
browser cannot attach a file to an email on its own, and `mailto:` has no way
to carry an attachment. So the email is written for you and the two PDFs are
attached by hand. Two clicks.

If that becomes a chore, it can be automated with a Netlify Function and an
email service (Resend, Postmark and SendGrid all have free tiers that cover
this volume). That needs an account and an API key, and the key must live in
Netlify's environment variables — never in the page, which is public. Ask and
I will wire it up.

## Securing it — do this before real customer details go in

Right now the page is hidden, not protected. Anyone who knows or guesses the
address can open it. It holds no data at rest, so the exposure is the tool
itself rather than a customer list, but it still carries your contract
template and should not be public.

Options, best first:

1. **Netlify password protection** — Site configuration → Access & security →
   Visitor access. Site-wide or per-path. Requires a paid Netlify plan.
2. **Netlify Identity + role gate** — free, more setup.
3. **Run it locally instead** — the page is self-contained. Copy the `admin/`
   folder, `assets/css/admin.css`, `assets/js/admin.js` and
   `assets/vendor/jspdf-2.5.1.umd.min.js` to your own machine, open
   `admin/index.html` in a browser and delete `/admin/` from the live site.
   Nothing to secure if it is not published.

Do not rely on a JavaScript password prompt. The code is downloadable, so the
password is in plain sight — that is theatre, not security.

## The legal side

**The contract terms in this tool are a starting structure, not legal advice,
and I did not write them as a lawyer.** Have an attorney review the terms, the
warranty wording and the cancellation notice before you send a signed contract
to anyone.

Illinois requires a right-to-cancel notice on most home repair contracts signed
at the customer's home, and the Home Repair and Remodeling Act has its own
requirements for contracts over a threshold amount. Your attorney will know the
current wording and figures.

## The financing sheet

It deliberately lists **phone numbers and offices that route people to whatever
is running now**, rather than naming specific programs. Programs open and close
constantly — Chicago's own Home Repair Program is not taking new registrations
in 2026, so a sheet naming it would already be wrong.

Verified at the time of writing:

- HUD housing counseling locator — 1-800-569-4287, hud.gov/findacounselor.
  Free; HUD-approved agencies cannot charge to discuss your options.
- Chicago 311 — 311, or 312-744-5000 from outside the city.
- 211 — statewide, free, 24 hours.
- City of Chicago Department of Housing — chicago.gov/doh.
- Illinois Housing Development Authority — ihda.org.

The whole sheet is editable in the page under "Review and edit what that sheet
says". Check it before you send it to anybody.

## jsPDF

Vendored at `assets/vendor/jspdf-2.5.1.umd.min.js` rather than loaded from a
CDN, so the tool works on any network and a blocked or down CDN cannot stop you
producing a contract. MIT licensed.
