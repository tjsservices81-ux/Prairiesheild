/* ============================================================
   PRAIRIE SHIELD Waterproofing & Foundation Repair — tracking.js
   GA4 + Google Ads event tracking.

   IMPORTANT — placeholder IDs. Before launch, follow
   GOOGLE-ADS-GA4-SETUP.md and replace:

     GA4 ID:                       G-XXXXXXXXXX
     Google Ads ID:                AW-XXXXXXXXX
     Google Ads conversion label:  XXXXXXXXXXX

   The gtag.js loader snippet is intentionally NOT active until a
   real GA4 ID is added. Events are still pushed to window.dataLayer
   so nothing breaks and testing is possible via the console.
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     STEP 1 (see GOOGLE-ADS-GA4-SETUP.md):
     Uncomment this block and replace G-XXXXXXXXXX / AW-XXXXXXXXX
     with your real IDs to activate Google tracking.

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');   // GA4 property
  gtag('config', 'AW-XXXXXXXXX');   // Google Ads account
  ---------------------------------------------------------- */

  window.dataLayer = window.dataLayer || [];

  // Current page's service, set via <body data-service="..."> on each page.
  var pageService = document.body.getAttribute('data-service') || 'general';
  var pagePath = window.location.pathname;

  /** Send an event to gtag if active, otherwise to the dataLayer. */
  function track(eventName, params) {
    params = params || {};
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    } else {
      window.dataLayer.push(Object.assign({ event: eventName }, params));
    }
  }

  /* ----------------------------------------------------------
     generate_lead — fired by forms.js after a successful
     form submission (exposed as window.gfTrackLead).
     ---------------------------------------------------------- */
  window.gfTrackLead = function (formName) {
    track('generate_lead', {
      service: pageService,
      page_path: pagePath,
      form_name: formName
    });

    /* STEP 2 (see GOOGLE-ADS-GA4-SETUP.md):
       Uncomment to also report a Google Ads conversion.

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', {
        send_to: 'AW-XXXXXXXXX/XXXXXXXXXXX'  // Ads ID / conversion label
      });
    }
    */
  };

  /** Manual CTA event (used by offers.js for save_offer). */
  window.gfTrackCta = function (ctaName, detail) {
    track('cta_click', {
      cta_text: ctaName,
      page_path: pagePath,
      service: pageService,
      cta_location: detail || 'page'
    });
  };

  /* ----------------------------------------------------------
     phone_call — any tel: link click.
     ---------------------------------------------------------- */
  document.addEventListener('click', function (e) {
    var tel = e.target.closest('a[href^="tel:"]');
    if (!tel) { return; }
    track('phone_call', {
      page_path: pagePath,
      service: pageService,
      button_location: tel.getAttribute('data-location') || 'page'
    });
  });

  /* ----------------------------------------------------------
     cta_click — Free Estimate / Get a Quote / Schedule
     Inspection / Emergency Help buttons (marked with data-cta).
     ---------------------------------------------------------- */
  document.addEventListener('click', function (e) {
    var cta = e.target.closest('[data-cta]');
    if (!cta) { return; }
    track('cta_click', {
      cta_text: (cta.textContent || '').trim(),
      page_path: pagePath,
      service: pageService,
      cta_location: cta.getAttribute('data-location') || 'page'
    });
  });

  /* ----------------------------------------------------------
     scroll_75 — once per page view at 75% depth.
     ---------------------------------------------------------- */
  var scrollFired = false;
  function onScroll() {
    if (scrollFired) { return; }
    var doc = document.documentElement;
    var scrollable = doc.scrollHeight - window.innerHeight;
    if (scrollable <= 0) { return; }
    if ((window.scrollY || doc.scrollTop) / scrollable >= 0.75) {
      scrollFired = true;
      track('scroll_75', { page_path: pagePath, service: pageService });
      window.removeEventListener('scroll', onScroll);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();
