/* ============================================================
   PRAIRIE SHIELD Waterproofing & Foundation Repair — main.js
   Navigation, FAQ accordions, scroll reveals, count-up stats,
   header shadow, sticky mobile bar, sliders, ripples, footer year.

   Progressive enhancement: every feature is additive. Content is
   fully visible and usable without JavaScript, and each init runs
   independently so one failure cannot break the others.
   ============================================================ */

(function () {
  'use strict';

  var REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer copyright year ---------- */
  function initYear() {
    document.querySelectorAll('.js-year').forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* ---------- Rolling offer expiration (end of next month) ---------- */
  function initOfferDates() {
    var nodes = document.querySelectorAll('.js-offer-expires');
    if (!nodes.length) { return; }
    var now = new Date();
    var end = new Date(now.getFullYear(), now.getMonth() + 2, 0);
    var txt = end.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    nodes.forEach(function (el) { el.textContent = txt; });
  }

  /* ---------- Mobile navigation ---------- */
  function initNav() {
    var navToggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('site-nav');
    if (!navToggle || !nav) { return; }

    function setOpen(open) {
      nav.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      // Lock on <html>: overflow:hidden on <body> would break the sticky header
      document.documentElement.classList.toggle('nav-open', open);
    }

    navToggle.addEventListener('click', function () {
      setOpen(!nav.classList.contains('is-open'));
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { setOpen(false); }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        navToggle.focus();
      }
    });
  }

  /* ---------- Services submenu ---------- */
  function initSubnav() {
    document.querySelectorAll('.subnav-toggle').forEach(function (btn) {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (!panel) { return; }
      btn.addEventListener('click', function () {
        var open = panel.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      document.addEventListener('click', function (e) {
        if (!panel.classList.contains('is-open')) { return; }
        if (btn.contains(e.target) || panel.contains(e.target)) { return; }
        panel.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- FAQ accordions ---------- */
  function initFaq() {
    document.querySelectorAll('.faq-item__toggle').forEach(function (btn) {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      var item = btn.closest('.faq-item');
      if (!panel || !item) { return; }
      // Enable animated collapse only now that JS runs — without JS every
      // answer stays expanded and indexable.
      item.classList.add('faq-anim');
      panel.classList.add('is-collapsed');
      btn.setAttribute('aria-expanded', 'false');
      btn.addEventListener('click', function () {
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        panel.classList.toggle('is-collapsed', expanded);
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var targets = document.querySelectorAll('[data-anim]');
    if (!targets.length || REDUCE_MOTION || !('IntersectionObserver' in window)) { return; }

    var CLASS_MAP = { left: 'reveal-left', right: 'reveal-right', scale: 'reveal-scale' };
    var pending = [];

    function show(el) { el.classList.add('is-visible'); }

    // Once an element has finished revealing, drop the reveal classes so its
    // own hover transitions apply again and nothing is left composited.
    function settle(e) {
      var el = e.currentTarget;
      if (e.target !== el || e.animationName.indexOf('reveal') !== 0) { return; }
      el.classList.remove('reveal', 'reveal-left', 'reveal-right', 'reveal-scale', 'is-visible');
      el.style.removeProperty('--reveal-delay');
      el.removeEventListener('animationend', settle);
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        var el = entry.target;
        // Items inside a horizontal slider reveal together: cards scrolled
        // off to the side would otherwise never intersect the viewport.
        if (el.classList.contains('slider__track')) {
          Array.prototype.forEach.call(el.children, show);
        } else {
          show(el);
        }
        observer.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

    targets.forEach(function (el) {
      // Skip anything already on screen so first paint is never delayed
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) { return; }
      el.classList.add(CLASS_MAP[el.getAttribute('data-anim')] || 'reveal');
      var group = el.parentElement;
      if (group && group.classList.contains('stagger-group')) {
        var idx = Array.prototype.indexOf.call(group.children, el);
        el.style.setProperty('--reveal-delay', (Math.min(idx % 8, 5) * 85) + 'ms');
      }
      el.addEventListener('animationend', settle);
      pending.push(el);
      // Observe the slider track rather than each card inside it
      var track = el.parentElement && el.parentElement.classList.contains('slider__track')
        ? el.parentElement : null;
      observer.observe(track || el);
    });

    // Safety net: content must never stay invisible. Anything the observer
    // missed (fast scrolling, layout shifts from collapsing FAQs, horizontal
    // sliders) is revealed once the user has scrolled past it.
    function sweep() {
      var remaining = false;
      pending.forEach(function (el) {
        // Already revealing, or finished and settled
        if (el.classList.contains('is-visible') || !el.matches('.reveal, .reveal-left, .reveal-right, .reveal-scale')) { return; }
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) { el.classList.add('is-visible'); }
        else { remaining = true; }
      });
      if (!remaining) { window.removeEventListener('scroll', onScrollSweep); }
    }
    var sweepTimer = null;
    function onScrollSweep() {
      if (sweepTimer) { return; }
      sweepTimer = window.setTimeout(function () { sweepTimer = null; sweep(); }, 250);
    }
    window.addEventListener('scroll', onScrollSweep, { passive: true });
    window.addEventListener('load', sweep);
  }

  /* ---------- Count-up statistics ---------- */
  function initCountUp() {
    var els = document.querySelectorAll('[data-countup]');
    if (!els.length || REDUCE_MOTION || !('IntersectionObserver' in window)) { return; }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        var el = entry.target;
        observer.unobserve(el);
        var original = el.textContent;
        var m = original.match(/^(\D*)(\d[\d,]*)([\s\S]*)$/);
        if (!m) { return; }                       // non-numeric value — leave as-is
        var prefix = m[1], suffix = m[3];
        var target = parseInt(m[2].replace(/,/g, ''), 10);
        var hasComma = m[2].indexOf(',') !== -1;
        var start = null;
        function frame(ts) {
          if (start === null) { start = ts; }
          var p = Math.min((ts - start) / 650, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var val = Math.round(target * eased);
          el.textContent = prefix + (hasComma ? val.toLocaleString('en-US') : String(val)) + suffix;
          if (p < 1) { window.requestAnimationFrame(frame); }
          else { el.textContent = original; }     // guarantee the exact original value
        }
        window.requestAnimationFrame(frame);
      });
    }, { threshold: 0.4 });

    els.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Header shadow ---------- */
  function initHeaderShadow() {
    var header = document.querySelector('.site-header');
    if (!header) { return; }
    var ticking = false;
    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 4);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---------- Sticky mobile bar slide-in ---------- */
  function initMobileBar() {
    var bar = document.querySelector('.mobile-bar');
    if (!bar || REDUCE_MOTION || window.scrollY > 8) { return; }
    if (document.documentElement.scrollHeight <= window.innerHeight + 60) { return; }
    bar.classList.add('mobile-bar--waiting');
    var shown = false;
    function show() {
      if (shown) { return; }
      shown = true;
      bar.classList.remove('mobile-bar--waiting');
      window.removeEventListener('scroll', onScroll);
    }
    function onScroll() { if (window.scrollY > 8) { show(); } }
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Testimonial / card sliders ---------- */
  function initSliders() {
    document.querySelectorAll('.slider').forEach(function (slider) {
      var track = slider.querySelector('.slider__track');
      var prev = slider.querySelector('[data-slide="prev"]');
      var next = slider.querySelector('[data-slide="next"]');
      if (!track) { return; }
      function step() {
        var first = track.firstElementChild;
        return first ? first.getBoundingClientRect().width + 18 : 300;
      }
      if (prev) { prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: REDUCE_MOTION ? 'auto' : 'smooth' }); }); }
      if (next) { next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: REDUCE_MOTION ? 'auto' : 'smooth' }); }); }
    });
  }

  /* ---------- Button ripple ---------- */
  function initRipple() {
    if (REDUCE_MOTION) { return; }
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.btn');
      if (!btn || btn.disabled) { return; }
      var rect = btn.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height);
      var span = document.createElement('span');
      span.className = 'ripple';
      span.style.width = span.style.height = size + 'px';
      span.style.left = (e.clientX - rect.left - size / 2) + 'px';
      span.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(span);
      window.setTimeout(function () { if (span.parentNode) { span.parentNode.removeChild(span); } }, 620);
    });
  }

  /* ---------- Image load shimmer ---------- */
  function initImgShimmer() {
    document.querySelectorAll('.img-shimmer').forEach(function (wrap) {
      var img = wrap.querySelector('img');
      if (!img) { wrap.classList.add('is-loaded'); return; }
      if (img.complete) { wrap.classList.add('is-loaded'); return; }
      img.addEventListener('load', function () { wrap.classList.add('is-loaded'); });
      img.addEventListener('error', function () { wrap.classList.add('is-loaded'); });
    });
  }

  /* ---------- Boot ---------- */
  [initYear, initOfferDates, initNav, initSubnav, initFaq, initReveal, initCountUp,
   initHeaderShadow, initMobileBar, initSliders, initRipple, initImgShimmer].forEach(function (fn) {
    try { fn(); } catch (err) {
      if (window.console && console.error) { console.error('main.js init failed:', err); }
    }
  });
})();
