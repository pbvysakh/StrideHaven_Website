// Stride Haven Engineering Solutions — site scripts

document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  // Highlight active nav link based on current page
  var here = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === here || (here === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // Contact form -> mailto handoff (static site, no backend)
  var form = document.getElementById('contact-form');
  if (form) {
    var field = function (name) {
      var el = form.elements[name];
      return el ? el.value.trim() : '';
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = field('name');
      var email = field('email');
      var message = field('message');

      // Basic inline validation on the required fields (name, email, message)
      var missing = [];
      if (!name) missing.push('name');
      if (!email) missing.push('email');
      if (!message) missing.push('message');
      var successBox = document.getElementById('form-success');

      if (missing.length) {
        if (successBox) {
          successBox.style.display = 'block';
          successBox.classList.add('is-error');
          successBox.textContent = 'Please fill in your name, email and requirement before sending.';
        }
        missing.forEach(function (n) {
          var el = form.elements[n];
          if (el) el.classList.add('field-error');
        });
        return;
      }

      var company = field('company');
      var country = field('country');
      var industry = field('industry');
      var phone = field('phone');

      var subject = encodeURIComponent('Website enquiry from ' + (company || name));
      var bodyLines = [
        'Name: ' + name,
        'Company: ' + (company || '-'),
        'Country: ' + (country || '-'),
        'Industry: ' + (industry || '-'),
        'Email: ' + email,
        'Phone: ' + (phone || '-'),
        '',
        'Requirement:',
        message
      ];
      var body = encodeURIComponent(bodyLines.join('\n'));

      if (successBox) {
        successBox.style.display = 'block';
        successBox.classList.remove('is-error');
        successBox.textContent = "Thanks — your email client should now be open with your enquiry ready to send.";
      }

      window.location.href = 'mailto:info@stride-haven.com?subject=' + subject + '&body=' + body;
    });

    // Clear the error highlight as soon as the person starts fixing a field
    form.querySelectorAll('input, textarea').forEach(function (el) {
      el.addEventListener('input', function () { el.classList.remove('field-error'); });
    });
  }

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Sticky header shadow on scroll ----
  var header = document.querySelector('.site-header');
  if (header) {
    var onScrollHeader = function () {
      if (window.scrollY > 8) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
    };
    onScrollHeader();
    window.addEventListener('scroll', onScrollHeader, { passive: true });
  }

  // ---- Scroll-reveal for cards, stats, photo bands and similar blocks ----
  var revealSelectors = [
    '.card', '.solution-card', '.stat', '.partner-chip', '.cap-item',
    '.photo-band', '.workflow-step', '.product-group', '.numbered-row',
    '.split-panel--photo'
  ];
  var revealEls = document.querySelectorAll(revealSelectors.join(','));
  if ('IntersectionObserver' in window && revealEls.length) {
    revealEls.forEach(function (el, i) {
      el.classList.add('reveal');
      // small stagger within each row/group so items don't all pop at once
      el.style.transitionDelay = (Math.min(i % 6, 6) * 60) + 'ms';
    });
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  // ---- Animated stat counters (5+, 100+, 50+, 24/7, etc.) ----
  var statSpans = document.querySelectorAll('.stat-num span');
  if ('IntersectionObserver' in window && statSpans.length) {
    var animateCount = function (span) {
      var raw = span.textContent.trim();
      var match = raw.match(/^(\d+)(.*)$/);
      if (!match) return; // no leading number, leave as-is
      var target = parseInt(match[1], 10);
      var suffix = match[2];
      var duration = 1200;
      var startTime = null;
      var step = function (timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.round(eased * target);
        span.textContent = current + suffix;
        if (progress < 1) window.requestAnimationFrame(step);
        else span.textContent = target + suffix;
      };
      window.requestAnimationFrame(step);
    };
    var statObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    statSpans.forEach(function (span) { statObserver.observe(span); });
  }

  // ---- Back-to-top button ----
  var backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>';
  document.body.appendChild(backToTop);
  var onScrollTop = function () {
    if (window.scrollY > 500) backToTop.classList.add('is-visible');
    else backToTop.classList.remove('is-visible');
  };
  onScrollTop();
  window.addEventListener('scroll', onScrollTop, { passive: true });
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---- Smooth scroll for same-page anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href').slice(1);
      var target = id && document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
