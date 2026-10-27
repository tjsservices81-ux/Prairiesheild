/* ============================================================
   PRAIRIE SHIELD — Contract Builder (internal)

   Everything happens in the browser. Nothing is uploaded, stored
   or transmitted: the PDFs are built client-side with jsPDF and
   handed straight to the download folder.

   Sending is deliberately the one manual step. A static site has
   no server, and a browser cannot attach a file to an email on its
   own. So this opens a pre-written email in the default mail app
   and the two PDFs get attached by hand. See admin/README.md for
   how to automate that later if it becomes a chore.
   ============================================================ */

(function () {
  'use strict';

  var BIZ = 'Prairie Shield Waterproofing & Foundation Repair';
  var PHONE = '(847) 942-0209';
  var EMAIL = 'info@prairieshieldwaterproofing.com';
  var SITE = 'www.prairieshieldwaterproofing.com';

  var NAVY = [11, 45, 92];
  var GOLD = [212, 175, 55];
  var RED = [178, 34, 52];
  var INK = [22, 32, 44];
  var SOFT = [62, 80, 100];

  var SERVICES = [
    'Foundation Repair', 'Foundation Crack Repair', 'Bowed or Bowing Wall Repair',
    'Helical and Push Piers', 'Basement Waterproofing', 'Sump Pump Installation',
    'French Drain & Drain Tile', 'Crawl Space Encapsulation', 'Emergency Basement Flooding',
    'Tuckpointing', 'Brick Repair', 'Brick Replacement', 'Stone Repair', 'Stone Restoration',
    'Lintel Replacement', 'Chimney Repair', 'Chimney Rebuilds', 'Porch Repair', 'Step Repair',
    'Concrete Repair', 'Concrete Resurfacing', 'Masonry Restoration', 'Masonry Cleaning',
    'Masonry Sealing', 'Mortar Joint Repair', 'Block Wall Repair', 'Retaining Wall Repair',
    'Parapet Wall Repair', 'Commercial Masonry', 'Residential Masonry'
  ];

  var DEFAULT_WARRANTY =
    'Qualifying work is backed by a 30-year warranty. The exact coverage for this project ' +
    'is set out in the written warranty terms supplied with this contract. Warranty coverage ' +
    'is subject to those written terms.';

  /* Programs open and close constantly — Chicago's own Home Repair Program is not
     taking new registrations in 2026 — so this points people at the offices and phone
     lines that route them to whatever is actually running, rather than naming schemes
     that may already have closed. */
  var DEFAULT_FINANCING = [
    'Paying for foundation and masonry work is a real obstacle for a lot of households, and',
    'there is help available that most people never hear about. Below are the places to start.',
    '',
    'None of these are run by us and we receive nothing from them. Programs open and close',
    'through the year, so call and ask what is running now rather than assuming.',
    '',
    '@@HUD-approved housing counseling — free',
    'A counselor will go through your situation and point you at what you actually qualify for.',
    'It is free, and an agency that charges you for it is not HUD-approved.',
    'Phone: 1-800-569-4287  |  Online: hud.gov/findacounselor',
    '',
    '@@Chicago 311',
    'The city\'s own line for current home repair and home assistance programs.',
    'Phone: 311 (or 312-744-5000 from outside the city)  |  Online: 311.chicago.gov',
    '',
    '@@211 — statewide help line',
    'Free, confidential, 24 hours. Connects you to local assistance of every kind,',
    'including home repair, utilities and emergency funds.',
    'Phone: dial 211  |  Online: 211.org',
    '',
    '@@City of Chicago Department of Housing',
    'Publishes the current homeowner assistance programs and when registration opens.',
    'Online: chicago.gov/doh',
    '',
    '@@Illinois Housing Development Authority (IHDA)',
    'State-level homeowner assistance and home repair programs.',
    'Online: ihda.org',
    '',
    '@@A word of warning',
    'Anyone who asks for an up-front fee to "get you a grant" is running a scam.',
    'Genuine assistance programs and HUD counseling never charge to tell you what',
    'you qualify for.'
  ].join('\n');

  var DEFAULT_TERMS = [
    '1. This contract covers only the scope of work described above. Anything found once work',
    '   is under way that falls outside it will be quoted separately and in writing before it',
    '   is carried out. No additional work is chargeable without the customer\'s written approval.',
    '',
    '2. The customer is responsible for providing reasonable access to the work area and for',
    '   moving personal property out of it before the start date.',
    '',
    '3. Where permits are required they will be obtained before work begins. Permit fees are',
    '   included in the contract price unless stated otherwise above.',
    '',
    '4. Start dates are estimates. Weather, permit timescales and conditions found on opening up',
    '   can move them. The customer will be told as soon as we know.',
    '',
    '5. Payment is due per the schedule above. Title to materials passes on payment in full.',
    '',
    '6. Either party may cancel in writing. Cancellation terms and any right-to-cancel period',
    '   required by law are set out in the notice accompanying this contract.'
  ].join('\n');

  /* The real lockup, not a typeset imitation. Loaded once into a data URL
     because jsPDF's addImage is synchronous and cannot wait on a fetch.
     If it fails for any reason the header falls back to set type, so a
     missing image can never stop a contract being produced. */
  var LOGO = null;
  (function preloadLogo() {
    var img = new Image();
    img.onload = function () {
      try {
        var c = document.createElement('canvas');
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        c.getContext('2d').drawImage(img, 0, 0);
        LOGO = { data: c.toDataURL('image/png'), w: img.naturalWidth, h: img.naturalHeight };
      } catch (e) { LOGO = null; }
    };
    img.src = '/assets/images/logo-white.png';
  })();

  var $ = function (s) { return document.querySelector(s); };
  var form = $('#contract-form');
  if (!form) { return; }

  /* ---------- populate ---------- */
  var checks = $('#service-checks');
  SERVICES.forEach(function (name, i) {
    var id = 'svc-' + i;
    var l = document.createElement('label');
    l.innerHTML = '<input type="checkbox" name="services" value="' + name + '" id="' + id + '">' +
                  '<span>' + name + '</span>';
    checks.appendChild(l);
  });

  form.elements.warranty.value = DEFAULT_WARRANTY;
  form.elements.terms.value = DEFAULT_TERMS;
  form.elements.financing_body.value = DEFAULT_FINANCING;
  form.elements.contract_date.value = new Date().toISOString().slice(0, 10);

  var incFin = $('#inc_financing');
  var btnFin = $('#btn-financing');
  var btnFinEmail = $('#btn-fin-email');
  incFin.addEventListener('change', function () {
    btnFin.disabled = !incFin.checked;
    btnFinEmail.disabled = !incFin.checked;
  });

  /* ---------- helpers ---------- */
  function val(n) { var e = form.elements[n]; return e ? e.value.trim() : ''; }

  function picked() {
    return Array.prototype.slice
      .call(form.querySelectorAll('input[name="services"]:checked'))
      .map(function (c) { return c.value; });
  }

  function prettyDate(iso) {
    if (!iso) { return ''; }
    var d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function say(msg, isErr) {
    var el = $('#status');
    el.textContent = msg;
    el.classList.toggle('is-error', !!isErr);
  }

  function required() {
    var missing = [];
    [['cust_name', 'customer name'], ['cust_email', 'email address'],
     ['cust_address', 'property address'], ['scope', 'scope of work'],
     ['total', 'total price']].forEach(function (p) {
      if (!val(p[0])) { missing.push(p[1]); }
    });
    if (missing.length) {
      say('Still needed: ' + missing.join(', ') + '.', true);
      return false;
    }
    return true;
  }

  /* ---------- shared PDF furniture ---------- */
  function newDoc() {
    var jsPDF = window.jspdf && window.jspdf.jsPDF;
    if (!jsPDF) { say('The PDF library did not load. Check your connection and reload.', true); return null; }
    return new jsPDF({ unit: 'pt', format: 'letter' });
  }

  var M = 54;                 // page margin
  var W = 612;                // letter width in points

  function header(doc, title, sub) {
    doc.setFillColor.apply(doc, NAVY);
    doc.rect(0, 0, W, 86, 'F');
    doc.setFillColor.apply(doc, GOLD);
    doc.rect(0, 86, W, 4, 'F');

    if (LOGO) {
      var h = 58;
      doc.addImage(LOGO.data, 'PNG', M, 14, LOGO.w * (h / LOGO.h), h);
    } else {
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(17);
      doc.text('PRAIRIE SHIELD', M, 36);
      doc.setFontSize(8.5);
      doc.setTextColor(212, 175, 55);
      doc.text('WATERPROOFING & FOUNDATION REPAIR', M, 50);
    }

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(title, W - M, 36, { align: 'right' });
    if (sub) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(200, 215, 234);
      doc.text(sub, W - M, 50, { align: 'right' });
    }
    return 120;
  }

  function footer(doc) {
    var pages = doc.internal.getNumberOfPages();
    for (var i = 1; i <= pages; i++) {
      doc.setPage(i);
      doc.setDrawColor(210, 220, 232);
      doc.setLineWidth(0.7);
      doc.line(M, 736, W - M, 736);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor.apply(doc, SOFT);
      doc.text(BIZ + '  ·  ' + PHONE + '  ·  ' + SITE, M, 750);
      doc.text('Page ' + i + ' of ' + pages, W - M, 750, { align: 'right' });
    }
  }

  function sectionTitle(doc, y, text) {
    if (y > 690) { doc.addPage(); y = 70; }
    doc.setFillColor.apply(doc, GOLD);
    doc.rect(M, y - 9, 3, 12, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor.apply(doc, NAVY);
    doc.text(text.toUpperCase(), M + 10, y);
    return y + 16;
  }

  function body(doc, y, text, size) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(size || 9.5);
    doc.setTextColor.apply(doc, INK);
    var lines = doc.splitTextToSize(text, W - M * 2);
    for (var i = 0; i < lines.length; i++) {
      if (y > 718) { doc.addPage(); y = 70; }
      doc.text(lines[i], M, y);
      y += (size || 9.5) * 1.45;
    }
    return y + 6;
  }

  function row(doc, y, label, value) {
    if (!value) { return y; }
    if (y > 718) { doc.addPage(); y = 70; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor.apply(doc, SOFT);
    doc.text(label, M, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor.apply(doc, INK);
    var lines = doc.splitTextToSize(value, W - M * 2 - 140);
    for (var i = 0; i < lines.length; i++) {
      if (y > 718) { doc.addPage(); y = 70; }
      doc.text(lines[i], M + 140, y);
      y += 14;
    }
    return y + 2;
  }

  function fileSafe(s) {
    return (s || 'customer').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  /* ---------- contract PDF ---------- */
  function contractPages(doc) {
    var y = header(doc, 'WORK CONTRACT', val('job_no') || null);

    y = sectionTitle(doc, y, 'Parties');
    y = row(doc, y, 'Contractor', BIZ);
    y = row(doc, y, '', PHONE + '  ·  ' + EMAIL);
    y += 4;
    y = row(doc, y, 'Customer', val('cust_name'));
    y = row(doc, y, 'Property', val('cust_address'));
    y = row(doc, y, 'Email', val('cust_email') + (val('cust_email2') ? ', ' + val('cust_email2') : ''));
    y = row(doc, y, 'Phone', val('cust_phone'));
    y = row(doc, y, 'Date of contract', prettyDate(val('contract_date')));
    y += 8;

    var svc = picked();
    if (svc.length) {
      y = sectionTitle(doc, y, 'Services');
      y = body(doc, y, svc.join(' · '));
    }

    y = sectionTitle(doc, y, 'Scope of work');
    y = body(doc, y, val('scope'));

    if (val('exclusions')) {
      y = sectionTitle(doc, y, 'Not included');
      y = body(doc, y, val('exclusions'));
    }

    y = sectionTitle(doc, y, 'Price and payment');
    y = row(doc, y, 'Total contract price', val('total'));
    y = row(doc, y, 'Discount applied', val('discount'));
    y = row(doc, y, 'Deposit', val('deposit'));
    y = row(doc, y, 'Balance', val('balance'));
    y = row(doc, y, 'Start (estimated)', val('start_date'));
    y = row(doc, y, 'Duration (estimated)', val('duration'));
    if (val('payment_terms')) { y = body(doc, y + 4, val('payment_terms')); }

    if (val('warranty')) {
      y = sectionTitle(doc, y, 'Warranty');
      y = body(doc, y, val('warranty'));
    }

    if (val('terms')) {
      y = sectionTitle(doc, y, 'Terms and conditions');
      y = body(doc, y, val('terms'), 9);
    }

    /* signatures — keep them whole on one page */
    if (y > 600) { doc.addPage(); y = 70; }
    y = sectionTitle(doc, y + 10, 'Agreement');
    y = body(doc, y, 'By signing below both parties agree to the scope, price and terms set out in this contract.');
    y += 22;

    doc.setDrawColor.apply(doc, SOFT);
    doc.setLineWidth(0.8);
    var colW = (W - M * 2 - 30) / 2;
    [['Customer', M], ['Prairie Shield', M + colW + 30]].forEach(function (c) {
      doc.line(c[1], y, c[1] + colW, y);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor.apply(doc, SOFT);
      doc.text('SIGNATURE — ' + c[0].toUpperCase(), c[1], y + 12);
      doc.line(c[1], y + 48, c[1] + colW, y + 48);
      doc.text('PRINT NAME', c[1], y + 60);
      doc.line(c[1], y + 96, c[1] + colW, y + 96);
      doc.text('DATE', c[1], y + 108);
    });

  }

  /* ---------- financing pages ---------- */
  function financingPages(doc) {
    var y = header(doc, 'FINANCIAL HELP', 'Paying for home repairs');

    doc.setFillColor(253, 248, 232);
    doc.rect(M, y - 14, W - M * 2, 44, 'F');
    doc.setFillColor.apply(doc, GOLD);
    doc.rect(M, y - 14, 3, 44, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor.apply(doc, NAVY);
    doc.text('Where to go for help with the cost of home repairs', M + 12, y + 4);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor.apply(doc, SOFT);
    doc.text('Prepared for ' + (val('cust_name') || 'you') + ' by ' + BIZ, M + 12, y + 19);
    y += 50;

    val('financing_body').split('\n').forEach(function (line) {
      if (y > 712) { doc.addPage(); y = 70; }
      if (line.indexOf('@@') === 0) {
        y += 8;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor.apply(doc, RED);
        doc.text(line.slice(2), M, y);
        y += 15;
      } else if (!line.trim()) {
        y += 7;
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor.apply(doc, INK);
        doc.splitTextToSize(line, W - M * 2).forEach(function (l) {
          if (y > 718) { doc.addPage(); y = 70; }
          doc.text(l, M, y);
          y += 13.5;
        });
      }
    });

  }

  /* ---------- cover letter: the message, as a branded page ---------- */
  function coverPage(doc) {
    var y = header(doc, 'YOUR CONTRACT', prettyDate(val('contract_date')));

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor.apply(doc, SOFT);
    doc.text(val('cust_name'), M, y);
    y += 13;
    doc.splitTextToSize(val('cust_address'), 260).forEach(function (l) {
      doc.text(l, M, y); y += 13;
    });
    y += 16;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12.5);
    doc.setTextColor.apply(doc, NAVY);
    doc.text('Hello ' + (val('cust_name').split(' ')[0] || 'there') + ',', M, y);
    y += 22;

    y = body(doc, y, letterText(), 10);

    y += 14;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor.apply(doc, INK);
    doc.text('Many thanks,', M, y); y += 16;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor.apply(doc, NAVY);
    doc.text(BIZ, M, y); y += 14;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor.apply(doc, SOFT);
    doc.text(PHONE + '  ·  ' + EMAIL, M, y);

    /* what is in this document */
    y += 34;
    if (y > 640) { doc.addPage(); y = 70; }
    doc.setFillColor(242, 245, 249);
    var boxH = 68;
    doc.rect(M, y, W - M * 2, boxH, 'F');
    doc.setFillColor.apply(doc, GOLD);
    doc.rect(M, y, 3, boxH, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor.apply(doc, NAVY);
    doc.text('WHAT IS IN THIS DOCUMENT', M + 12, y + 18);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor.apply(doc, INK);
    doc.text('1.  This letter', M + 12, y + 36);
    doc.text('2.  Your work contract — please read, sign and date', M + 12, y + 51);
  }

  /* ---------- the message ---------- */
  /* One wording, used twice: set as a branded page at the front of the PDF,
     and as the plain text of the email carrying it. They should never drift
     apart, so neither gets its own copy. */
  function letterText() {
    var t = 'Thank you for choosing ' + BIZ + '.\n\n'
      + 'This document contains the contract for the work at ' + val('cust_address') + '.\n\n'
      + 'Total: ' + val('total')
      + (val('discount') ? '\nDiscount applied: ' + val('discount') : '')
      + (val('deposit') ? '\nDeposit: ' + val('deposit') : '')
      + (val('start_date') ? '\nEstimated start: ' + val('start_date') : '')
      + '\n\nPlease read it through, and if you are happy, sign and date it and send a copy back. '
      + 'If anything is unclear or does not match what we discussed, call me before you sign — '
      + 'it is far easier to fix now than later.';

    if (incFin.checked) {
      t += '\n\nI am also sending you a separate email with information on where to go for help '
         + 'with the cost of home repairs. Look out for it — it is nothing to do with this '
         + 'contract and nothing is owed for it.';
    }

    t += '\n\nAny questions at all, call ' + PHONE + '.';
    return t;
  }

  function emailBody() {
    return 'Hello ' + (val('cust_name').split(' ')[0] || '') + ',\n\n'
      + letterText()
      + '\n\nMany thanks,\n' + BIZ + '\n' + PHONE + '\n' + SITE;
  }

  /* Sent on its own, deliberately. Money worries are a private thing, and
     burying this at the bottom of a contract email makes it look like a
     sales angle. On its own it reads as what it is. */
  function financingEmailBody() {
    return 'Hello ' + (val('cust_name').split(' ')[0] || '') + ',\n\n'
      + 'As promised, here is the information on help with the cost of home repairs.\n\n'
      + 'The attached sheet lists where to go — including free HUD-approved housing '
      + 'counseling, which costs nothing and will tell you what you actually qualify for.\n\n'
      + 'None of these are run by us and we receive nothing from them. There is no obligation '
      + 'and it changes nothing about your contract. It is simply there in case it helps.\n\n'
      + 'One thing worth knowing: anyone who asks for a fee up front to "get you a grant" is '
      + 'running a scam. Genuine help never charges you to find out what you qualify for.\n\n'
      + 'Any questions, call ' + PHONE + '.\n\n'
      + 'Many thanks,\n' + BIZ + '\n' + PHONE + '\n' + SITE;
  }

  /* ---------- builders ---------- */
  /* Everything in one file. jsPDF appends pages to a single document, so
     there is nothing to merge — the cover, the contract and the financing
     sheet are just written one after another, and the footer is numbered
     across the lot at the end. */
  function buildAll(parts) {
    var doc = newDoc();
    if (!doc) { return null; }
    if (parts.cover) { coverPage(doc); }
    if (parts.contract) { if (parts.cover) { doc.addPage(); } contractPages(doc); }
    if (parts.financing) { if (parts.cover || parts.contract) { doc.addPage(); } financingPages(doc); }
    footer(doc);
    return doc;
  }

  function send(doc, name) {
    if (!doc) { return false; }
    doc.save('prairie-shield-' + name + '-' + fileSafe(val('cust_name')) + '.pdf');
    return true;
  }

  /* ---------- actions ---------- */
  $('#btn-all').addEventListener('click', function () {
    if (!required()) { return; }
    if (send(buildAll({ cover: true, contract: true }), 'contract')) {
      say('Contract PDF downloaded — letter and contract in one file.');
    }
  });

  $('#btn-contract').addEventListener('click', function () {
    if (!required()) { return; }
    if (send(buildAll({ contract: true }), 'contract')) { say('Contract only — downloaded.'); }
  });

  btnFin.addEventListener('click', function () {
    if (send(buildAll({ financing: true }), 'help-paying')) {
      say('Financial help PDF downloaded — send it as its own email.');
    }
  });

  $('#btn-fin-email').addEventListener('click', function () {
    if (!val('cust_email')) { say('Need the customer email address first.', true); return; }
    var to = val('cust_email') + (val('cust_email2') ? ',' + val('cust_email2') : '');
    window.location.href = 'mailto:' + encodeURIComponent(to)
      + '?subject=' + encodeURIComponent('Help with the cost of home repairs — ' + BIZ)
      + '&body=' + encodeURIComponent(financingEmailBody());
    say('Second email opened. Attach the financial help PDF, then send.');
  });

  $('#btn-email').addEventListener('click', function () {
    if (!required()) { return; }
    var to = val('cust_email') + (val('cust_email2') ? ',' + val('cust_email2') : '');
    var subj = 'Your contract from ' + BIZ
             + (val('job_no') ? ' — ' + val('job_no') : '');
    var href = 'mailto:' + encodeURIComponent(to)
             + '?subject=' + encodeURIComponent(subj)
             + '&body=' + encodeURIComponent(emailBody());
    if (href.length > 1800) {
      say('That email is too long for some mail apps. Shorten the scope of work, or copy the text from the preview.', true);
    }
    window.location.href = href;
    say('Email opened. Attach the PDF you downloaded, then send.');
  });

  $('#btn-preview').addEventListener('click', function () {
    var card = $('#preview-card');
    var svc = picked();
    var esc = function (s) {
      return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };
    var html = '<h3>Parties</h3><dl>'
      + '<dt>Contractor</dt><dd>' + BIZ + '</dd>'
      + '<dt>Customer</dt><dd>' + esc(val('cust_name')) + '</dd>'
      + '<dt>Property</dt><dd>' + esc(val('cust_address')) + '</dd>'
      + '<dt>Email</dt><dd>' + esc(val('cust_email')) + '</dd>'
      + '</dl>';
    if (svc.length) { html += '<h3>Services</h3><p>' + esc(svc.join(' · ')) + '</p>'; }
    html += '<h3>Scope of work</h3><p>' + esc(val('scope')) + '</p>';
    if (val('exclusions')) { html += '<h3>Not included</h3><p>' + esc(val('exclusions')) + '</p>'; }
    html += '<h3>Price</h3><dl>'
      + '<dt>Total</dt><dd>' + esc(val('total')) + '</dd>'
      + (val('deposit') ? '<dt>Deposit</dt><dd>' + esc(val('deposit')) + '</dd>' : '')
      + (val('discount') ? '<dt>Discount</dt><dd>' + esc(val('discount')) + '</dd>' : '')
      + '</dl>';
    html += '<h3>The email they will get</h3><p>' + esc(emailBody()) + '</p>';
    $('#preview').innerHTML = html;
    card.hidden = false;
    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    say('Preview updated.');
  });
})();
