#!/usr/bin/env bash
# Turn Netlify reCAPTCHA on or off across every form on the site.
#
#   ./tools/recaptcha.sh off   — honeypot + Netlify's built-in spam filter only
#   ./tools/recaptcha.sh on    — re-enable reCAPTCHA
#
# Off is a legitimate choice. The honeypot is already in place and Netlify
# runs submissions through its own spam filtering regardless. reCAPTCHA adds
# a step between a customer and sending you a lead, and it needs
# SITE_RECAPTCHA_KEY and SITE_RECAPTCHA_SECRET set in Netlify or it will
# reject every submission.
set -euo pipefail
cd "$(dirname "$0")/.."

case "${1:-}" in
  off)
    # Neutralise the form attribute and the placeholder div, keeping both so
    # this is reversible without regenerating anything.
    find . -name '*.html' -not -path './node_modules/*' -print0 \
      | xargs -0 sed -i 's/ data-netlify-recaptcha="true"//g'
    echo "reCAPTCHA OFF — attribute removed from all forms."
    echo "Honeypot and Netlify's own spam filtering are still active."
    ;;
  on)
    find . -name '*.html' -not -path './node_modules/*' -print0 \
      | xargs -0 sed -i \
        -e 's|<div class="recaptcha-slot"></div>|<div class="recaptcha-slot" data-netlify-recaptcha="true"></div>|g' \
        -e 's|\(<form [^>]*netlify-honeypot="bot-field"\)>|\1 data-netlify-recaptcha="true">|g'
    echo "reCAPTCHA ON."
    echo "Set SITE_RECAPTCHA_KEY and SITE_RECAPTCHA_SECRET in Netlify or every"
    echo "submission will be rejected."
    ;;
  *)
    echo "usage: $0 on|off" >&2; exit 1 ;;
esac

echo
echo "forms with reCAPTCHA: $(grep -rl 'data-netlify-recaptcha' --include='*.html' . | wc -l) pages"
echo "Commit and push, then let Netlify redeploy."
