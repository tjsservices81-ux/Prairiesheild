/* ============================================================
   PRAIRIE SHIELD — forms.js
   AJAX submission to Formspree with accessible success /
   error messaging, loading state and double-submit protection.
   Every form posts to the same Formspree endpoint (its action);
   the hidden form-name field says which page the lead came from.
   ============================================================ */

(function () {
  'use strict';

  var PHONE_DISPLAY = '(847) 269-2907';
  var PHONE_LINK = 'tel:+18472692907';

  function showMessage(box, type, html) {
    box.className = 'form-msg form-msg--' + type;
    box.innerHTML = html;
  }

  document.querySelectorAll('form[data-formspree]').forEach(function (form) {
    var msgBox = form.querySelector('.form-msg');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Block double submissions while a request is in flight
      if (form.dataset.submitting === '1') { return; }

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
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

      fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      })
        .then(function (res) {
          // Formspree answers 200 for an accepted submission, 4xx otherwise
          if (!res.ok) { throw new Error('HTTP ' + res.status); }

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
