/* ============================================================
   PRAIRIE SHIELD — forms.js
   AJAX submission for Netlify Forms with accessible success /
   error messaging, loading state and double-submit protection.
   Works alongside Netlify's built-in reCAPTCHA.
   ============================================================ */

(function () {
  'use strict';

  var PHONE_DISPLAY = '(847) 269-2907';
  var PHONE_LINK = 'tel:+18472692907';

  function encode(formData) {
    var pairs = [];
    formData.forEach(function (value, key) {
      pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    });
    return pairs.join('&');
  }

  function showMessage(box, type, html) {
    box.className = 'form-msg form-msg--' + type;
    box.innerHTML = html;
  }

  document.querySelectorAll('form[data-netlify="true"]').forEach(function (form) {
    var msgBox = form.querySelector('.form-msg');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Block double submissions while a request is in flight
      if (form.dataset.submitting === '1') { return; }

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      /* Netlify rejects a submission with a missing captcha token, but the
         rejection does not always come back as an error status — so catching
         it here is the difference between the customer fixing it and the
         customer being told their request was sent when it was not. */
      var slot = form.querySelector('[data-netlify-recaptcha]');
      if (slot && window.grecaptcha && typeof window.grecaptcha.getResponse === 'function') {
        var widget = slot.getAttribute('data-widget-id');
        var token;
        try {
          token = widget ? window.grecaptcha.getResponse(Number(widget)) : window.grecaptcha.getResponse();
        } catch (err) { token = null; }
        if (!token) {
          if (msgBox) {
            showMessage(msgBox, 'error',
              '<strong>Please confirm you are not a robot.</strong> ' +
              'Tick the box above the button, then send again.');
          }
          slot.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      var originalText = submitBtn ? submitBtn.textContent : '';
      form.dataset.submitting = '1';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      var formData = new FormData(form);
      var formName = formData.get('form-name') || form.getAttribute('name') || 'unknown';

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode(formData)
      })
        .then(function (res) {
          /* Netlify answers a good submission with 200, and a captcha or
             spam rejection with 4xx. A 3xx here is the redirect to the
             thank-you page, which also means it was accepted. */
          if (!res.ok && !(res.status >= 300 && res.status < 400)) {
            throw new Error('HTTP ' + res.status);
          }

          if (typeof window.gfTrackLead === 'function') {
            window.gfTrackLead(formName);
          }

          var savedOffer = formData.get('offer');
          var offerLine = (savedOffer && savedOffer !== 'None')
            ? ' Your saved offer (' + savedOffer + ') has been included with your request.'
            : '';

          if (msgBox) {
            showMessage(
              msgBox,
              'success',
              '<strong>Thank you — your request has been sent.</strong>' + offerLine +
              ' We will contact you shortly. Need help right now? Call ' +
              '<a href="' + PHONE_LINK + '" data-location="form-success">' + PHONE_DISPLAY + '</a>.'
            );
          }
          form.reset();
          // Restore the hidden offer value that reset() just cleared
          if (typeof window.fcRefreshOffers === 'function') { window.fcRefreshOffers(); }
        })
        .catch(function () {
          if (msgBox) {
            showMessage(
              msgBox,
              'error',
              '<strong>Sorry, that did not send.</strong> ' +
              'Nothing has reached us, so please do not wait on a reply. ' +
              'Try again, or call us now on ' +
              '<a href="' + PHONE_LINK + '" data-location="form-error">' + PHONE_DISPLAY + '</a>.'
            );
          }
        })
        .finally(function () {
          form.dataset.submitting = '';
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
          }
        });
    });
  });
})();
