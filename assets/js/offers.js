/* ============================================================
   FIRST CHOICE — offers.js
   Save-an-offer system. No coupon codes are shown or stored:
   the saved offer is identified by its plain-English name, which
   is attached automatically to estimate form submissions.
   ============================================================ */

(function () {
  'use strict';

  var KEY = 'fc_saved_offer';
  var REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function getSaved() {
    try { return window.localStorage.getItem(KEY) || ''; }
    catch (e) { return ''; }   // private mode / storage disabled
  }

  function setSaved(name) {
    try { window.localStorage.setItem(KEY, name); return true; }
    catch (e) { return false; }
  }

  /* ---------- Confetti (light, one burst, self-cleaning) ---------- */
  function confetti(originEl) {
    if (REDUCE_MOTION || !originEl) { return; }
    var rect = originEl.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    var colors = ['#D4AF37', '#B22234', '#0B2D5C', '#E9CF7A', '#FFFFFF'];

    for (var i = 0; i < 18; i++) {
      var p = document.createElement('span');
      p.className = 'confetti-piece';
      p.style.background = colors[i % colors.length];
      p.style.left = cx + 'px';
      p.style.top = cy + 'px';
      document.body.appendChild(p);

      var angle = (Math.PI * 2 * i) / 18 + (Math.random() - 0.5) * 0.4;
      var dist = 70 + Math.random() * 80;
      var dx = Math.cos(angle) * dist;
      var dy = Math.sin(angle) * dist - 40;

      p.animate(
        [
          { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
          { transform: 'translate(' + dx + 'px,' + dy + 'px) rotate(' + (Math.random() * 540 - 270) + 'deg)', opacity: 0 }
        ],
        { duration: 650 + Math.random() * 200, easing: 'cubic-bezier(0.22,0.61,0.36,1)' }
      ).onfinish = (function (node) {
        return function () { if (node.parentNode) { node.parentNode.removeChild(node); } };
      })(p);
    }
  }

  /* ---------- Button rendering ---------- */
  function renderButton(btn, savedName) {
    var offerName = btn.getAttribute('data-offer');
    var isThis = savedName && savedName === offerName;
    var label = btn.querySelector('.save-label');
    if (!label) { return; }
    if (isThis) {
      btn.classList.add('is-saved');
      btn.setAttribute('aria-pressed', 'true');
      label.textContent = btn.hasAttribute('data-applied-label') ? '✔ Offer Applied' : '✔ Offer Saved';
    } else {
      btn.classList.remove('is-saved');
      btn.setAttribute('aria-pressed', 'false');
      label.textContent = btn.getAttribute('data-idle-label') || 'Save Offer';
    }
  }

  function refreshAll() {
    var saved = getSaved();
    document.querySelectorAll('.btn-save').forEach(function (btn) { renderButton(btn, saved); });
    // Carry the saved offer into every estimate form
    document.querySelectorAll('input[name="offer"]').forEach(function (input) {
      input.value = saved || 'None';
    });
    // Status text belongs to the card that owns the saved offer, not to
    // every card on the page.
    document.querySelectorAll('[data-offer-status]').forEach(function (el) {
      var card = el.closest('.voucher, .discount-card') || el.parentNode;
      var own = card ? card.querySelector('.btn-save') : null;
      var isOwn = !!own && own.getAttribute('data-offer') === saved;
      el.textContent = (saved && isOwn) ? '✔ Saved — it will be applied to your estimate' : '';
    });
    // The promo flag above the form steps aside once something is saved —
    // the banner inside the form is making the same point from then on.
    document.querySelectorAll('[data-offer-flag]').forEach(function (flag) {
      flag.classList.toggle('is-hidden', !!saved);
    });
    // "Your Saved Offer" banner above every estimate form
    document.querySelectorAll('[data-offer-banner]').forEach(function (banner) {
      var value = banner.querySelector('[data-offer-value]');
      var hint = banner.querySelector('[data-offer-hint]');
      banner.classList.toggle('is-saved', !!saved);
      if (value) {
        value.textContent = saved ? '✔ ' + saved : 'No offer saved yet';
      }
      if (hint) {
        hint.innerHTML = saved
          ? 'This offer will be included with your request.'
          : '<a href="/special-offers/">View special offers &rarr;</a>';
      }
    });
  }

  function init() {
    var buttons = document.querySelectorAll('.btn-save');
    if (!buttons.length && !document.querySelector('input[name="offer"]')
        && !document.querySelector('[data-offer-banner]')) { return; }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var offerName = btn.getAttribute('data-offer');
        if (!offerName) { return; }

        if (getSaved() === offerName) { return; }   // already saved

        btn.classList.add('is-morphing');
        window.setTimeout(function () { btn.classList.remove('is-morphing'); }, 220);

        if (!setSaved(offerName)) {
          var live = btn.parentNode.querySelector('[data-offer-status]');
          if (live) { live.textContent = 'Your browser is blocking storage, so we cannot save this offer. Just mention it when you contact us.'; }
          return;
        }
        refreshAll();
        confetti(btn);

        if (typeof window.gfTrackCta === 'function') { window.gfTrackCta('save_offer', offerName); }
      });
    });

    // Voucher downloads: the file is served directly via the download
    // attribute, so this only records the interaction.
    document.querySelectorAll('[data-download-voucher]').forEach(function (link) {
      link.addEventListener('click', function () {
        link.classList.add('is-downloaded');
        // .dl-label, not just any span — main.js appends a ripple span too
        var lbl = link.querySelector('.dl-label');
        if (lbl) { lbl.textContent = '✔ Voucher Saved'; }
        confetti(link);
        if (typeof window.gfTrackCta === 'function') {
          window.gfTrackCta('save_voucher', link.getAttribute('download') || 'voucher');
        }
      });
    });

    refreshAll();
    window.fcRefreshOffers = refreshAll;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
