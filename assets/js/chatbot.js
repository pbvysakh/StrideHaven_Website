/* ==========================================================================
   Stride Haven — guided enquiry assistant
   A scripted (rule-based) chat: no AI, no backend, no cookies.
   It qualifies the enquiry in a few steps, then hands it to Stride Haven's
   team on WhatsApp or by email with everything pre-filled.
   To change the contact details or wording, edit CONFIG below.
   ========================================================================== */
(function () {
  'use strict';

  var CONFIG = {
    whatsapp: '971523466612',            // international format, digits only
    email: 'sales@stride-haven.com',
    phoneDisplay: '+971 65 575 684',
    phoneLink: '+97165575684',
    name: 'Stride Haven Assistant',
    tagline: 'Typically replies within one working day',
    logo: 'assets/img/logo-symbol.png'
  };

  var AREAS = [
    { id: 'instrumentation', label: 'Instrumentation', page: 'instrumentation-solutions.html' },
    { id: 'analytical', label: 'Analyzers / water quality', page: 'analytical-solutions.html' },
    { id: 'horiba', label: 'HORIBA analyzers', page: null },
    { id: 'gas', label: 'Gas & flame detection', page: 'gas-detection-solutions.html' },
    { id: 'automation', label: 'PLC / SCADA / automation', page: 'automation-solutions.html' },
    { id: 'iiot', label: 'IIoT & remote monitoring', page: 'iiot-solutions.html' },
    { id: 'engineering', label: 'Engineering documentation', page: 'engineering-services.html' },
    { id: 'manufacturing', label: 'Panels & skids', page: 'manufacturing-solutions.html' },
    { id: 'unsure', label: 'Not sure yet', page: null }
  ];

  var STAGES = [
    'New project / tender',
    'Replacement or upgrade',
    'Service or calibration',
    'Budgetary price only'
  ];

  var FAQS = [
    {
      q: 'Where are you located?',
      a: 'Our office and workshop are at LV60B Phase 2, Hamriya Free Zone, Sharjah, UAE. We support projects across the UAE, Middle East and Africa.'
    },
    {
      q: 'Are you a HORIBA distributor?',
      a: 'We supply and support HORIBA process and water quality analyzers, such as the UV500 ATEX, UV300 and EL200. Every unit is sourced through authorized channels, with full traceability back to the manufacturer.'
    },
    {
      q: 'Which industries do you serve?',
      a: 'Oil and gas, petrochemical, power, water and wastewater treatment, desalination, utilities, and food and beverage.'
    },
    {
      q: 'Do you build panels in-house?',
      a: 'Yes. We design and build analyzer panels, instrument panels and skid-mounted systems in Sharjah, with FAT and inspection support.'
    }
  ];

  var ICON = {
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1 1 21 12z"/><line x1="8.5" y1="10.5" x2="15.5" y2="10.5"/><line x1="8.5" y1="13.8" x2="13" y2="13.8"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>',
    restart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.4-5.7"/><polyline points="4 4 4 9 9 9"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.8-1.4a.5.5 0 0 0 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3z"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/></svg>'
  };

  var state, els = {};
  var page = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();

  function reset() {
    state = { intent: '', area: '', stage: '', detail: '', name: '', company: '', contact: '' };
  }

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function build() {
    els.launcher = el('button', 'sh-chat-launcher',
      ICON.chat + '<span class="sh-label">Chat with us</span><span class="sh-dot" aria-hidden="true"></span>');
    els.launcher.type = 'button';
    els.launcher.setAttribute('aria-controls', 'sh-chat');
    els.launcher.setAttribute('aria-expanded', 'false');
    els.launcher.setAttribute('aria-label', 'Open chat with Stride Haven');

    els.panel = el('section', 'sh-chat');
    els.panel.id = 'sh-chat';
    els.panel.setAttribute('role', 'dialog');
    els.panel.setAttribute('aria-label', 'Chat with Stride Haven');
    els.panel.setAttribute('aria-hidden', 'true');

    var head = el('div', 'sh-chat-head',
      '<div class="sh-chat-avatar"><img src="' + CONFIG.logo + '" alt="" width="28" height="28"></div>' +
      '<div class="sh-chat-title"><strong>' + esc(CONFIG.name) + '</strong><span>' + esc(CONFIG.tagline) + '</span></div>');
    var wa = el('a', '', ICON.wa);
    wa.href = 'https://wa.me/' + CONFIG.whatsapp;
    wa.target = '_blank';
    wa.rel = 'noopener';
    wa.setAttribute('aria-label', 'Chat on WhatsApp instead');
    wa.title = 'Chat on WhatsApp';
    var restart = el('button', '', ICON.restart);
    restart.type = 'button';
    restart.setAttribute('aria-label', 'Start over');
    restart.title = 'Start over';
    var close = el('button', '', ICON.close);
    close.type = 'button';
    close.setAttribute('aria-label', 'Close chat');
    head.appendChild(wa);
    head.appendChild(restart);
    head.appendChild(close);

    els.log = el('div', 'sh-chat-log');
    els.log.setAttribute('role', 'log');
    els.log.setAttribute('aria-live', 'polite');
    els.actions = el('div', 'sh-chat-actions');
    els.form = el('form', 'sh-chat-form');
    els.form.hidden = true;
    els.form.setAttribute('novalidate', '');
    els.error = el('div', 'sh-chat-error');
    els.error.setAttribute('role', 'alert');
    var foot = el('div', 'sh-chat-foot', 'Automated assistant &middot; your details go only to Stride Haven');

    els.panel.appendChild(head);
    els.panel.appendChild(els.log);
    els.panel.appendChild(els.actions);
    els.panel.appendChild(els.error);
    els.panel.appendChild(els.form);
    els.panel.appendChild(foot);
    document.body.appendChild(els.launcher);
    document.body.appendChild(els.panel);

    els.launcher.addEventListener('click', open);
    close.addEventListener('click', hide);
    restart.addEventListener('click', function () { els.log.innerHTML = ''; start(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && els.panel.classList.contains('is-open')) hide();
    });
  }

  var started = false;
  function open() {
    els.panel.classList.add('is-open');
    els.panel.setAttribute('aria-hidden', 'false');
    els.launcher.setAttribute('aria-expanded', 'true');
    if (!started) { started = true; start(); }
    setTimeout(function () {
      var f = els.panel.querySelector('.sh-chip, .sh-chat-form:not([hidden]) input, .sh-chat-form:not([hidden]) textarea');
      if (f) f.focus();
    }, 250);
  }
  function hide() {
    els.panel.classList.remove('is-open');
    els.panel.setAttribute('aria-hidden', 'true');
    els.launcher.setAttribute('aria-expanded', 'false');
    els.launcher.focus();
  }

  function scroll() { els.log.scrollTop = els.log.scrollHeight; }

  function say(text, cls) {
    var m = el('div', 'sh-msg sh-msg--bot' + (cls ? ' ' + cls : ''));
    m.innerHTML = text;
    els.log.appendChild(m);
    scroll();
    return m;
  }
  function you(text) {
    var m = el('div', 'sh-msg sh-msg--user');
    m.textContent = text;
    els.log.appendChild(m);
    scroll();
  }

  // Bot "types" briefly, then shows its messages and the next options.
  function bot(lines, next) {
    clear();
    var t = say('<span class="sh-typing" aria-label="typing"><i></i><i></i><i></i></span>');
    setTimeout(function () {
      t.remove();
      (Array.isArray(lines) ? lines : [lines]).forEach(function (l) { say(l); });
      if (next) next();
    }, 450);
  }

  function clear() {
    els.actions.innerHTML = '';
    els.form.hidden = true;
    els.form.innerHTML = '';
    els.error.textContent = '';
  }

  function chips(list) {
    els.actions.innerHTML = '';
    list.forEach(function (c) {
      var b = el('button', 'sh-chip' + (c.cls ? ' ' + c.cls : ''), (c.icon || '') + esc(c.label));
      b.type = 'button';
      b.addEventListener('click', function () {
        if (!c.silent) you(c.label);
        c.go();
      });
      els.actions.appendChild(b);
    });
    var first = els.actions.querySelector('.sh-chip');
    if (first && els.panel.classList.contains('is-open')) first.focus({ preventScroll: true });
    scroll();
  }

  function ask(opts) {
    // opts: { placeholder, multiline, optional, validate, done }
    els.form.innerHTML = '';
    var field = el(opts.multiline ? 'textarea' : 'input');
    if (!opts.multiline) field.type = opts.type || 'text';
    if (opts.multiline) field.rows = 2;
    field.placeholder = opts.placeholder;
    field.setAttribute('aria-label', opts.placeholder);
    field.maxLength = opts.multiline ? 600 : 120;
    if (opts.autocomplete) field.autocomplete = opts.autocomplete;
    var btn = el('button', '', ICON.send);
    btn.type = 'submit';
    btn.setAttribute('aria-label', 'Send');
    els.form.appendChild(field);
    els.form.appendChild(btn);
    els.form.hidden = false;
    els.form.onsubmit = function (e) {
      e.preventDefault();
      var v = field.value.trim();
      if (!v && !opts.optional) { els.error.textContent = 'Please type an answer, or use the options above.'; field.focus(); return; }
      if (v && opts.validate) {
        var err = opts.validate(v);
        if (err) { els.error.textContent = err; field.focus(); return; }
      }
      els.error.textContent = '';
      you(v || 'Skip');
      opts.done(v);
    };
    if (opts.multiline) {
      field.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); els.form.requestSubmit ? els.form.requestSubmit() : els.form.onsubmit(e); }
      });
    }
    if (opts.optional) {
      chips([{ label: 'Skip this step', cls: 'sh-chip--ghost', go: function () { opts.done(''); } }]);
    }
    if (els.panel.classList.contains('is-open')) setTimeout(function () { field.focus(); }, 60);
  }

  function pageArea() {
    for (var i = 0; i < AREAS.length; i++) if (AREAS[i].page === page) return AREAS[i];
    return null;
  }

  /* ---------------- Conversation ---------------- */

  function start() {
    reset();
    var greet = 'Hi, welcome to Stride Haven Engineering Solutions. 👋';
    var here = pageArea();
    bot([greet, 'How can we help you today?'], function () {
      var list = [
        { label: 'Start a project / get a quote', cls: 'sh-chip--primary', go: function () { state.intent = 'Project / quotation'; askArea(); } },
        { label: 'Technical or product question', go: function () { state.intent = 'Technical question'; askArea(); } },
        { label: 'Service or calibration support', go: function () { state.intent = 'Service / calibration'; state.stage = 'Service or calibration'; askArea(); } },
        { label: 'Quick questions', go: faqs },
        { label: 'Talk to someone now', go: talkNow }
      ];
      if (here) {
        list.splice(1, 0, {
          label: 'Ask about ' + here.label.toLowerCase(),
          go: function () { state.intent = 'Project / quotation'; state.area = here.label; askStage(); }
        });
      }
      chips(list);
    });
  }

  function askArea() {
    bot('Which area is this about?', function () {
      chips(AREAS.map(function (a) {
        return { label: a.label, go: function () { state.area = a.label; state.stage ? askDetail() : askStage(); } };
      }));
    });
  }

  function askStage() {
    bot('Got it. What stage is the requirement at?', function () {
      chips(STAGES.map(function (s) {
        return { label: s, go: function () { state.stage = s; askDetail(); } };
      }));
    });
  }

  function askDetail() {
    bot(['Briefly describe what you need.', 'For example: application, quantity, measuring range, hazardous area class or site location. You can attach datasheets later on WhatsApp or email.'], function () {
      ask({
        placeholder: 'Your requirement…',
        multiline: true,
        optional: true,
        done: function (v) { state.detail = v; askName(); }
      });
    });
  }

  function askName() {
    bot('Thanks. What is your name?', function () {
      ask({
        placeholder: 'Full name',
        autocomplete: 'name',
        validate: function (v) { return v.length < 2 ? 'Please enter your name.' : ''; },
        done: function (v) { state.name = v; askCompany(); }
      });
    });
  }

  function askCompany() {
    bot('And your company?', function () {
      ask({
        placeholder: 'Company name',
        autocomplete: 'organization',
        optional: true,
        done: function (v) { state.company = v; askContact(); }
      });
    });
  }

  function askContact() {
    bot('What is the best email or phone number to reach you?', function () {
      ask({
        placeholder: 'Email or phone',
        autocomplete: 'email',
        validate: function (v) {
          var isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
          var isPhone = /^[+()\d\s-]{7,}$/.test(v) && v.replace(/\D/g, '').length >= 7;
          return isEmail || isPhone ? '' : 'Please enter a valid email address or phone number.';
        },
        done: function (v) { state.contact = v; summary(); }
      });
    });
  }

  function message() {
    var lines = [
      'New enquiry from the Stride Haven website',
      '',
      'Name: ' + state.name,
      'Company: ' + (state.company || '-'),
      'Contact: ' + state.contact,
      'Enquiry type: ' + (state.intent || '-'),
      'Area: ' + (state.area || '-'),
      'Stage: ' + (state.stage || '-'),
      '',
      'Requirement:',
      state.detail || '-',
      '',
      'Sent from: ' + page
    ];
    return lines.join('\n');
  }

  function summary() {
    var rows = [
      ['Name', state.name], ['Company', state.company || '-'], ['Contact', state.contact],
      ['Area', state.area || '-'], ['Stage', state.stage || '-'], ['Requirement', state.detail || '-']
    ];
    var html = '<strong>Your enquiry</strong>\n' + rows.map(function (r) { return esc(r[0]) + ': ' + esc(r[1]); }).join('\n');
    bot(['Here is your enquiry. Choose how to send it and our engineering team will get back to you.'], function () {
      say(html, 'sh-msg--summary');
      sendOptions();
    });
  }

  function sendOptions() {
    var text = message();
    var subject = 'Website enquiry: ' + (state.area || state.intent || 'General') + ' — ' + (state.company || state.name);
    chips([
      {
        label: 'Send on WhatsApp', cls: 'sh-chip--wa', icon: '', silent: true,
        go: function () {
          window.open('https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
          done('WhatsApp');
        }
      },
      {
        label: 'Send by email', cls: 'sh-chip--primary', silent: true,
        go: function () {
          window.location.href = 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(text);
          done('email');
        }
      },
      { label: 'Edit my answers', cls: 'sh-chip--ghost', go: function () { els.log.innerHTML = ''; start(); } }
    ]);
  }

  function done(channel) {
    bot([
      'Your ' + channel + ' app should now be open with the enquiry filled in. Just press send.',
      'If nothing opened, call us on <a href="tel:' + CONFIG.phoneLink + '">' + CONFIG.phoneDisplay + '</a> or email <a href="mailto:' + CONFIG.email + '">' + CONFIG.email + '</a>.'
    ], function () {
      chips([
        { label: 'Send another way', go: sendOptions, silent: true },
        { label: 'Start a new enquiry', cls: 'sh-chip--ghost', go: function () { els.log.innerHTML = ''; start(); } }
      ]);
    });
  }

  function faqs() {
    bot('Pick a question:', function () {
      var list = FAQS.map(function (f) {
        return { label: f.q, go: function () { bot(f.a, faqAfter); } };
      });
      list.push({ label: 'Back to start', cls: 'sh-chip--ghost', go: function () { els.log.innerHTML = ''; start(); } });
      chips(list);
    });
  }

  function faqAfter() {
    chips([
      { label: 'Another question', go: faqs },
      { label: 'Start a project / get a quote', cls: 'sh-chip--primary', go: function () { state.intent = 'Project / quotation'; askArea(); } }
    ]);
  }

  function talkNow() {
    bot([
      'You can reach our team directly:',
      'WhatsApp: <a href="https://wa.me/' + CONFIG.whatsapp + '" target="_blank" rel="noopener">+971 52 346 6612</a>\nPhone: <a href="tel:' + CONFIG.phoneLink + '">' + CONFIG.phoneDisplay + '</a>\nEmail: <a href="mailto:' + CONFIG.email + '">' + CONFIG.email + '</a>'
    ], function () {
      chips([
        { label: 'Open WhatsApp', cls: 'sh-chip--wa', silent: true, go: function () { window.open('https://wa.me/' + CONFIG.whatsapp, '_blank', 'noopener'); } },
        { label: 'Leave my details instead', go: function () { state.intent = 'Call back request'; askArea(); } }
      ]);
    });
  }

  function init() {
    if (document.getElementById('sh-chat')) return;
    reset();
    build();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
