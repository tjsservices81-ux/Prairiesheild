# Getting the forms and emails working

**The code side is done and verified.** All 70 forms across 47 pages have correct
Netlify markup — `data-netlify`, a matching hidden `form-name`, the honeypot,
the reCAPTCHA placeholder, `method="POST"` and a no-JavaScript fallback.

What is left is three things in the Netlify dashboard and one email address
from you. None of them can be done from the code.

---

## 1. Turn on form detection  ← nothing works without this

Netlify → your site → **Forms**.

If it says forms are not enabled, enable them, then **trigger a redeploy**.
Netlify only finds forms by scanning the HTML of a deploy, so a form added
before detection was switched on is invisible until the site is deployed again.

After the redeploy you should see 41 forms listed. If the list is empty,
nothing else on this page will help — come back to me.

## 2. Point the notifications at a real inbox  ← this is "the emails"

Netlify → **Forms → Form notifications → Add notification → Email notification**.

- **Email to notify:** the address you actually read
- **Form:** leave as all forms, so you never miss one from a page you forgot

Worth knowing: Netlify stores every submission in the dashboard whether or not
a notification is set. So if this is misconfigured you do not lose the leads —
but you will not know they arrived, which amounts to the same thing.

Add a second notification to a backup address. One bounced email should not
cost you a job.

## 3. reCAPTCHA — decide, then act

This is the single most likely thing to break all 40 forms silently, so read
this bit properly.

`data-netlify-recaptcha="true"` is on every form. For that to work you **must**
set two environment variables in Netlify:

Netlify → **Site configuration → Environment variables**

| Key | Value |
|---|---|
| `SITE_RECAPTCHA_KEY` | your reCAPTCHA v2 **site key** |
| `SITE_RECAPTCHA_SECRET` | your reCAPTCHA v2 **secret key** |

Get both free at google.com/recaptcha/admin — choose **reCAPTCHA v2,
"I'm not a robot" tick box**, and add your domain. Then redeploy.

**If you do not set them, submissions are rejected.** The site is now honest
about that — it tells the customer it did not send and gives them the phone
number — but you will have lost the lead.

### Or turn it off

Perfectly reasonable for a contractor site:

```
./tools/recaptcha.sh off
```

Then commit and push. The honeypot stays, and Netlify runs every submission
through its own spam filtering regardless. What you lose is a tick box between
a customer and sending you a lead; what you gain is one less thing that can
silently stop all 40 forms. `./tools/recaptcha.sh on` puts it back.

## 4. The email address shown on the site

Still the placeholder `info@prairieshieldwaterproofing.com`, in the footer,
the contact page, the privacy policy and the data Google reads. Separate from
form delivery — this is the one customers see and write to. Send me the real
one and it is a single pass.

---

## Test it properly once deployed

Not by looking at the screen — the screen will say it worked.

1. Submit the homepage form with a real address you can check.
2. Netlify → Forms — the submission should be listed within seconds.
3. Check the inbox for the notification.
4. Do it again from a **service page** form, because those have two forms with
   the same name and both should land in the same bucket.
5. Try it **with JavaScript disabled**. It should post and land you on
   `/thank-you/`. That is the path a small number of real visitors take.

If a submission shows in the dashboard but no email arrives, the problem is
step 2. If nothing shows at all, it is step 1 or step 3.

---

## What was fixed in the code

- A submission can no longer report success when it was not recorded. The old
  version treated any `res.ok` as sent; Netlify can answer 200 and still
  discard a submission whose captcha did not verify, which would have told the
  customer their request was on its way when it was not.
- An uncompleted reCAPTCHA is now caught before sending, with a message asking
  them to tick the box, rather than a generic failure after the fact.
- The failure message now says plainly that nothing reached us and not to wait
  for a reply, and puts the phone number in front of them.
