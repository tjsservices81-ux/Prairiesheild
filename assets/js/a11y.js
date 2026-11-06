/* Prairie Shield — built-in accessibility menu.
   Loaded in <head> (no defer) so saved settings are applied to <html> before
   the page paints; the launcher and panel are built once the DOM is ready.
   No third-party widget: only the Google Translate element is fetched, and
   only after a visitor picks a language other than English. */
(function () {
  'use strict';

  var KEY = 'ps-a11y';
  var root = document.documentElement;

  // ---------- Settings model ----------
  var TOGGLES = ['highlightTitle', 'highlightLinks', 'dyslexia', 'letterSpacing', 'lineHeight',
    'fontWeight', 'textAlign', 'mute', 'pageRead', 'readingGuide', 'pauseAnim', 'bigCursor'];
  var CLASS = {
    highlightTitle: 'a11y-hl-titles', highlightLinks: 'a11y-hl-links', dyslexia: 'a11y-dyslexia',
    letterSpacing: 'a11y-letter', lineHeight: 'a11y-line', fontWeight: 'a11y-bold', textAlign: 'a11y-align',
    mute: 'a11y-mute', pageRead: 'a11y-read', readingGuide: 'a11y-rguide', pauseAnim: 'a11y-pause',
    bigCursor: 'a11y-cursor'
  };
  var CONTRASTS = { dark: 'a11y-c-dark', light: 'a11y-c-light', high: 'a11y-c-high' };
  var SATS = { high: 'a11y-s-high', low: 'a11y-s-low', mono: 'a11y-s-mono' };
  var PROFILES = {
    epilepsy: { pauseAnim: true, sat: 'low', mute: true },
    seizure: { pauseAnim: true, sat: 'low' },
    adhd: { readingGuide: true, pauseAnim: true },
    lowVision: { font: 130, contrast: 'high', highlightTitle: true, fontWeight: true, bigCursor: true }
  };

  function defaults() {
    var d = { font: 100, contrast: '', sat: '', profile: '' };
    TOGGLES.forEach(function (k) { d[k] = false; });
    return d;
  }

  // Read the saved settings before anything is written, so a fresh page load
  // never replaces them with the defaults.
  var state = defaults();
  try {
    var saved = JSON.parse(window.localStorage.getItem(KEY) || 'null');
    if (saved && typeof saved === 'object') {
      Object.keys(state).forEach(function (k) { if (k in saved) { state[k] = saved[k]; } });
    }
  } catch (e) { /* storage blocked: run with defaults */ }

  function save() {
    try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  // ---------- Apply settings to <html> ----------
  var dyslexiaLoaded = false;
  function loadDyslexiaFont() {
    if (dyslexiaLoaded) { return; }
    dyslexiaLoaded = true;
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap';
    document.head.appendChild(l);
  }

  function apply() {
    TOGGLES.forEach(function (k) { root.classList.toggle(CLASS[k], !!state[k]); });
    Object.keys(CONTRASTS).forEach(function (k) { root.classList.toggle(CONTRASTS[k], state.contrast === k); });
    Object.keys(SATS).forEach(function (k) { root.classList.toggle(SATS[k], state.sat === k); });
    root.classList.toggle('a11y-filter', !!(state.contrast || state.sat));
    root.classList.toggle('a11y-zoomed', state.font !== 100);
    root.style.setProperty('--a11y-zoom', String(state.font / 100));
    if (state.dyslexia) { loadDyslexiaFont(); }
    if (document.body) { applyRuntime(); }
  }

  // Behaviour that needs the DOM: muting, pausing, the reading guide, speech.
  function eachMedia(fn) {
    Array.prototype.forEach.call(document.querySelectorAll('video, audio'), fn);
  }
  function applyRuntime() {
    eachMedia(function (m) {
      if (state.mute) { m.muted = true; }
      if (state.pauseAnim && !m.paused) { m.pause(); }
    });
    guide.style.display = state.readingGuide ? 'block' : 'none';
    if (!state.pageRead && window.speechSynthesis) { window.speechSynthesis.cancel(); clearReading(); }
    if (hint) { hint.hidden = !state.pageRead; }
  }

  apply();

  // ---------- Language / Google Translate ----------
  var LANGS = [
    ['en', 'English', 'English'], ['es', 'Spanish', 'Español'], ['fa', 'Persian (Farsi)', 'فارسی'],
    ['hy', 'Armenian', 'Հայերեն'], ['zh-CN', 'Chinese', '中文'], ['ko', 'Korean', '한국어'],
    ['ru', 'Russian', 'Русский'], ['vi', 'Vietnamese', 'Tiếng Việt'], ['tl', 'Tagalog', 'Tagalog'],
    ['ar', 'Arabic', 'العربية']
  ];
  function currentLang() {
    var m = document.cookie.match(/(?:^|;\s*)googtrans=\/[^/]*\/([^;]+)/);
    var code = m ? decodeURIComponent(m[1]) : 'en';
    return LANGS.some(function (l) { return l[0] === code; }) ? code : 'en';
  }
  function setLangCookie(value) {
    var host = location.hostname;
    var parts = host.split('.');
    var parent = parts.length > 2 ? parts.slice(-2).join('.') : host;
    var domains = ['', '; domain=' + host, '; domain=.' + parent];
    domains.forEach(function (d) {
      document.cookie = value
        ? 'googtrans=' + value + '; path=/' + d
        : 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT' + d;
    });
  }
  function loadTranslate() {
    window.psGoogleTranslateInit = function () {
      /* global google */
      new google.translate.TranslateElement({ pageLanguage: 'en', autoDisplay: false }, 'ps-gt');
    };
    var holder = document.createElement('div');
    holder.id = 'ps-gt';
    holder.hidden = true;
    document.body.appendChild(holder);
    var s = document.createElement('script');
    s.src = 'https://translate.google.com/translate_a/element.js?cb=psGoogleTranslateInit';
    s.async = true;
    document.body.appendChild(s);
  }
  function protectFromTranslation() {
    var sel = 'a[href^="tel:"], a[href^="mailto:"], .site-header__brand, .site-footer__brand, address, ' +
      '.site-header__phone, .site-header__logo, .site-footer__tagline, [itemprop="telephone"], [itemprop="address"]';
    Array.prototype.forEach.call(document.querySelectorAll(sel), function (el) {
      el.setAttribute('translate', 'no');
      el.classList.add('notranslate');
    });
  }

  // ---------- Small DOM helpers ----------
  function h(tag, attrs, html) {
    var el = document.createElement(tag);
    if (attrs) { Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); }); }
    if (html != null) { el.innerHTML = html; }
    return el;
  }
  function svg(paths, size) {
    size = size || 22;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + paths + '</svg>';
  }
  var I = {
    person: '<circle cx="12" cy="4.2" r="1.9"/><path d="M4.5 8.2c2.4.7 4.9 1 7.5 1s5.1-.3 7.5-1"/><path d="M12 9.2v5.3"/><path d="M8.6 21l3.4-6.5 3.4 6.5"/>',
    reset: '<path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1"/><path d="M3.5 4v4.5H8"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z"/>',
    chevron: '<path d="M6 9l6 6 6-6"/>',
    epilepsy: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    seizure: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    adhd: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    minus: '<path d="M5 12h14"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    heading: '<path d="M6 4v16M18 4v16M6 12h12"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    font: '<path d="M4 20L10 4h1l6 16M6.5 14h8"/><path d="M17 9h3"/>',
    spacing: '<path d="M7 7l-3 5 3 5M17 7l3 5-3 5"/><path d="M10 12h4"/>',
    lineh: '<path d="M10 6h10M10 12h10M10 18h10"/><path d="M5 4v16M3 6l2-2 2 2M3 18l2 2 2-2"/>',
    bold: '<path d="M7 4h6a4 4 0 0 1 0 8H7zM7 12h7a4 4 0 0 1 0 8H7z"/>',
    align: '<path d="M4 6h16M4 10h10M4 14h16M4 18h10"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    contrast: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18a9 9 0 0 0 0-18z" fill="currentColor"/>',
    drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
    dropOff: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M4 4l16 16"/>',
    mono: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18"/><path d="M12 8h6M12 12h9M12 16h6"/>',
    mute: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l4 6M21 9l-4 6"/>',
    speak: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
    guide: '<rect x="3" y="9" width="18" height="6" rx="1.5"/><path d="M3 5h18M3 19h18"/>',
    pause: '<circle cx="12" cy="12" r="9"/><path d="M10 9v6M14 9v6"/>',
    cursor: '<path d="M5 3l14 7-6 2-2 6z"/>'
  };

  var launcher, panel, guide, guideTop, guideBottom, hint, langList, langBtn, fontValue;
  var tileEls = {};

  function tile(id, icon, label, group) {
    var b = h('button', { type: 'button', class: 'a11y-tile', 'aria-pressed': 'false', 'data-key': id },
      '<span class="a11y-tile__icon">' + svg(I[icon], 24) + '</span><span class="a11y-tile__label">' + label + '</span>');
    b.addEventListener('click', function () { onTile(group, id); });
    tileEls[(group || 'toggle') + ':' + id] = b;
    return b;
  }
  function card(title, body) {
    var c = h('section', { class: 'a11y-card', 'aria-label': title });
    c.appendChild(h('h3', { class: 'a11y-card__title' }, title));
    c.appendChild(body);
    return c;
  }
  function grid(items) {
    var g = h('div', { class: 'a11y-grid' });
    items.forEach(function (t) { g.appendChild(t); });
    return g;
  }

  // ---------- Interactions ----------
  function onTile(group, id) {
    if (group === 'profile') {
      var p = PROFILES[id];
      if (state.profile === id) {
        // Turn the profile's own settings back off.
        Object.keys(p).forEach(function (k) {
          if (k === 'font') { state.font = 100; }
          else if (k === 'contrast' || k === 'sat') { if (state[k] === p[k]) { state[k] = ''; } }
          else { state[k] = false; }
        });
        state.profile = '';
      } else {
        if (state.profile) { onTile('profile', state.profile); }
        Object.keys(p).forEach(function (k) { state[k] = p[k]; });
        state.profile = id;
      }
    } else if (group === 'contrast' || group === 'sat') {
      state[group] = state[group] === id ? '' : id;
    } else {
      state[id] = !state[id];
    }
    commit();
  }

  function commit() {
    apply();
    save();
    render();
  }

  function render() {
    Object.keys(tileEls).forEach(function (key) {
      var parts = key.split(':');
      var on = parts[0] === 'profile' ? state.profile === parts[1]
        : parts[0] === 'contrast' || parts[0] === 'sat' ? state[parts[0]] === parts[1]
        : !!state[parts[1]];
      tileEls[key].setAttribute('aria-pressed', on ? 'true' : 'false');
      tileEls[key].classList.toggle('is-on', on);
    });
    if (fontValue) { fontValue.textContent = state.font + '%'; }
  }

  function resetAll() {
    var d = defaults();
    Object.keys(d).forEach(function (k) { state[k] = d[k]; });
    commit();
  }

  function setFont(delta) {
    state.font = Math.min(160, Math.max(80, state.font + delta));
    commit();
  }

  function openPanel() {
    panel.hidden = false;
    // Next frame so the slide-in transition runs.
    requestAnimationFrame(function () { panel.classList.add('is-open'); });
    launcher.setAttribute('aria-expanded', 'true');
    panel.querySelector('.a11y-head__close').focus();
  }
  function closePanel() {
    panel.classList.remove('is-open');
    launcher.setAttribute('aria-expanded', 'false');
    setTimeout(function () { if (!panel.classList.contains('is-open')) { panel.hidden = true; } }, 250);
    launcher.focus();
  }

  // ---------- Page read ----------
  var reading = null;
  function clearReading() {
    if (reading) { reading.classList.remove('a11y-reading'); reading = null; }
  }
  function onReadClick(e) {
    if (!state.pageRead || !window.speechSynthesis) { return; }
    if (e.target.closest('#a11y-panel, #a11y-launcher')) { return; }
    var el = e.target.closest('p, h1, h2, h3, h4, h5, h6, li, blockquote, figcaption, td, th, dt, dd, label, button, a');
    if (!el) { return; }
    var text = (el.innerText || '').trim();
    if (!text) { return; }
    window.speechSynthesis.cancel();
    clearReading();
    reading = el;
    el.classList.add('a11y-reading');
    var u = new SpeechSynthesisUtterance(text);
    u.lang = document.documentElement.lang || 'en-US';
    u.onend = u.onerror = function () { if (reading === el) { clearReading(); } };
    window.speechSynthesis.speak(u);
  }

  // ---------- Reading guide ----------
  function moveGuide(y) {
    var half = 34;
    guideTop.style.height = Math.max(0, y - half) + 'px';
    guideBottom.style.top = (y + half) + 'px';
  }

  // ---------- Build ----------
  function build() {
    protectFromTranslation();

    launcher = h('button', {
      type: 'button', id: 'a11y-launcher', class: 'a11y-launcher notranslate', translate: 'no',
      'aria-label': 'Open accessibility menu', 'aria-expanded': 'false', 'aria-controls': 'a11y-panel'
    }, svg(I.person, 28));

    panel = h('div', {
      id: 'a11y-panel', class: 'a11y-panel notranslate', translate: 'no', role: 'dialog',
      'aria-modal': 'false', 'aria-labelledby': 'a11y-title'
    });
    panel.hidden = true;

    var head = h('div', { class: 'a11y-head' },
      '<span class="a11y-head__icon">' + svg(I.person, 22) + '</span>' +
      '<h2 class="a11y-head__title" id="a11y-title">Accessibility menu</h2>');
    var resetBtn = h('button', { type: 'button', class: 'a11y-head__btn', 'aria-label': 'Reset all settings', title: 'Reset all settings' }, svg(I.reset, 20));
    var closeBtn = h('button', { type: 'button', class: 'a11y-head__btn a11y-head__close', 'aria-label': 'Close accessibility menu', title: 'Close' }, svg(I.close, 20));
    resetBtn.addEventListener('click', resetAll);
    closeBtn.addEventListener('click', closePanel);
    head.appendChild(resetBtn);
    head.appendChild(closeBtn);
    panel.appendChild(head);

    var body = h('div', { class: 'a11y-body' });
    panel.appendChild(body);

    // 1. Language
    var lang = currentLang();
    var langName = LANGS.filter(function (l) { return l[0] === lang; })[0];
    var langWrap = h('div', { class: 'a11y-lang' });
    langBtn = h('button', { type: 'button', class: 'a11y-lang__btn', 'aria-expanded': 'false', 'aria-controls': 'a11y-lang-list' },
      '<span class="a11y-lang__globe">' + svg(I.globe, 22) + '</span>' +
      '<span class="a11y-lang__current">' + langName[1] + ' (' + langName[2] + ')</span>' +
      '<span class="a11y-lang__chev">' + svg(I.chevron, 20) + '</span>');
    langList = h('ul', { class: 'a11y-lang__list', id: 'a11y-lang-list' });
    langList.hidden = true;
    LANGS.forEach(function (l) {
      var li = h('li');
      var b = h('button', { type: 'button', class: 'a11y-lang__opt', lang: l[0], 'aria-current': l[0] === lang ? 'true' : 'false' },
        '<span>' + l[1] + '</span><span class="a11y-lang__native" dir="auto">' + l[2] + '</span>');
      b.addEventListener('click', function () {
        if (l[0] === currentLang()) { return; }
        setLangCookie(l[0] === 'en' ? '' : '/en/' + l[0]);
        location.reload();
      });
      li.appendChild(b);
      langList.appendChild(li);
    });
    langBtn.addEventListener('click', function () {
      var open = langList.hidden;
      langList.hidden = !open;
      langBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    langWrap.appendChild(langBtn);
    langWrap.appendChild(langList);
    langWrap.appendChild(h('p', { class: 'a11y-note' }, 'Translations are automatic and may not be exact.'));
    body.appendChild(card('Language', langWrap));

    // 2. Profiles
    body.appendChild(card('Accessibility profiles', grid([
      tile('epilepsy', 'epilepsy', 'Epilepsy Safe Mode', 'profile'),
      tile('seizure', 'seizure', 'Seizure Safe', 'profile'),
      tile('adhd', 'adhd', 'ADHD', 'profile'),
      tile('lowVision', 'eye', 'Low Vision', 'profile')
    ])));

    // 3. Text and reading
    var textWrap = h('div');
    var fontRow = h('div', { class: 'a11y-font' });
    fontRow.appendChild(h('span', { class: 'a11y-font__label' }, '<span class="a11y-tile__icon">' + svg(I.font, 24) + '</span>Adjust font size'));
    var ctrl = h('div', { class: 'a11y-font__ctrl' });
    var minus = h('button', { type: 'button', class: 'a11y-font__btn', 'aria-label': 'Decrease font size' }, svg(I.minus, 20));
    fontValue = h('span', { class: 'a11y-font__value', 'aria-live': 'polite' }, state.font + '%');
    var plus = h('button', { type: 'button', class: 'a11y-font__btn', 'aria-label': 'Increase font size' }, svg(I.plus, 20));
    minus.addEventListener('click', function () { setFont(-10); });
    plus.addEventListener('click', function () { setFont(10); });
    ctrl.appendChild(minus); ctrl.appendChild(fontValue); ctrl.appendChild(plus);
    fontRow.appendChild(ctrl);
    textWrap.appendChild(fontRow);
    textWrap.appendChild(grid([
      tile('highlightTitle', 'heading', 'Highlight Title'),
      tile('highlightLinks', 'link', 'Highlight Links'),
      tile('dyslexia', 'font', 'Dyslexia Font'),
      tile('letterSpacing', 'spacing', 'Letter Spacing'),
      tile('lineHeight', 'lineh', 'Line Height'),
      tile('fontWeight', 'bold', 'Font Weight'),
      tile('textAlign', 'align', 'Text Align')
    ]));
    body.appendChild(card('Text and reading', textWrap));

    // 4. Color and contrast
    body.appendChild(card('Color and contrast', grid([
      tile('dark', 'moon', 'Dark Contrast', 'contrast'),
      tile('light', 'sun', 'Light Contrast', 'contrast'),
      tile('high', 'contrast', 'High Contrast', 'contrast'),
      tile('high', 'drop', 'High Saturation', 'sat'),
      tile('low', 'dropOff', 'Low Saturation', 'sat'),
      tile('mono', 'mono', 'Monochrome', 'sat')
    ])));

    // 5. Navigation and interaction
    body.appendChild(card('Navigation and interaction', grid([
      tile('mute', 'mute', 'Mute Sounds'),
      tile('pageRead', 'speak', 'Page Read'),
      tile('readingGuide', 'guide', 'Reading Guide'),
      tile('pauseAnim', 'pause', 'Pause Animations'),
      tile('bigCursor', 'cursor', 'Big Cursor')
    ])));

    // 6. Reset
    var resetAllBtn = h('button', { type: 'button', class: 'a11y-reset' }, svg(I.reset, 20) + '<span>Reset all settings</span>');
    resetAllBtn.addEventListener('click', resetAll);
    body.appendChild(resetAllBtn);

    // Reading guide overlay + page-read hint
    guide = h('div', { class: 'a11y-guide', 'aria-hidden': 'true' });
    guideTop = h('div', { class: 'a11y-guide__shade a11y-guide__shade--top' });
    guideBottom = h('div', { class: 'a11y-guide__shade a11y-guide__shade--bottom' });
    guide.appendChild(guideTop);
    guide.appendChild(guideBottom);
    moveGuide(window.innerHeight / 2);
    hint = h('div', { class: 'a11y-hint notranslate', translate: 'no', role: 'status' }, 'Page Read is on: click any text to hear it.');

    document.body.appendChild(guide);
    document.body.appendChild(hint);
    document.body.appendChild(launcher);
    document.body.appendChild(panel);

    launcher.addEventListener('click', function () {
      if (panel.classList.contains('is-open')) { closePanel(); } else { openPanel(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('is-open')) { closePanel(); }
    });
    document.addEventListener('click', onReadClick, true);
    document.addEventListener('pointermove', function (e) { if (state.readingGuide) { moveGuide(e.clientY); } }, { passive: true });
    document.addEventListener('touchmove', function (e) {
      if (state.readingGuide && e.touches[0]) { moveGuide(e.touches[0].clientY); }
    }, { passive: true });

    // Keep muting/pausing media added after load.
    if ('MutationObserver' in window) {
      new MutationObserver(function () { if (state.mute || state.pauseAnim) { applyRuntime(); } })
        .observe(document.body, { childList: true, subtree: true });
    }
    document.addEventListener('play', function (e) {
      if (state.mute) { e.target.muted = true; }
      if (state.pauseAnim && e.target.pause) { e.target.pause(); }
    }, true);

    if (currentLang() !== 'en') { loadTranslate(); }

    applyRuntime();
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
