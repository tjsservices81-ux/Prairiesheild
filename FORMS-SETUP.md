# Getting the forms and emails working

All 70 forms on the site send to **one** Formspree form:

```
https://formspree.io/f/xdeegvgr
```

Nothing else needs adding in Formspree, so there's no form per page to set up.

## What each submission contains

- The customer's name, phone, email, ZIP, service and message
- `form-name`: the page it came from, for example `lead-chimney-repair` or
  `lead-homepage`
- `page-service`: the service the page is about
- `offer`: the voucher the customer saved, or `None`
- The email subject reads **New estimate request (lead-…)**, so you can sort
  your inbox by page

## In the Formspree dashboard

1. **Confirm the email address.** Formspree sends a confirmation the first time
   the form is used. Until you click it, submissions are held.
2. **Check the notification address** under the form's *Settings* and send
   them to the inbox you actually read.
3. **Spam:** the forms include Formspree's `_gotcha` honeypot field, and
   Formspree filters spam on its own. If spam gets through, turn on reCAPTCHA
   or Formspree's spam protection under the form's settings. You don't need
   to change the site for that.
4. **Allowed domains (recommended):** restrict the form to
   `prairieshieldwaterproofing.com` so other sites can't post to it.

## Testing

Submit the form on the homepage and on one service page from the live site,
then check that both arrive in your inbox and in Formspree's *Submissions* tab.

If a form can't send, the customer sees a message telling them it didn't go
through, along with the phone number, so a failed send is never silent.

## Free plan limit

Formspree's free plan has a monthly submission cap. If you start getting a lot
of leads, check your usage in the Formspree dashboard so leads don't start
bouncing.
