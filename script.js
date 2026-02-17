/*============================================================
  BELIEVERS' SANCTUARY THIKA - Shared Site Script
  Navigation · Scroll Animations · Utilities
============================================================*/
'use strict';

(function () {

  /* ── NAVIGATION ─────────────────────────────────────── */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const overlay   = document.getElementById('navOverlay');

  function navScroll() {
    const scrolled = window.scrollY > 40;
    navbar.classList.toggle('scrolled', scrolled);
  }
  window.addEventListener('scroll', navScroll, { passive: true });
  navScroll();

  function openMenu() {
    hamburger.classList.add('active');
    mobileNav.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  }
  function closeMenu() {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }
  function toggleMenu() {
    mobileNav.classList.contains('open') ? closeMenu() : openMenu();
  }

  if (hamburger) hamburger.addEventListener('click', toggleMenu);
  if (overlay)   overlay.addEventListener('click', closeMenu);

  // Close on resize
  window.addEventListener('resize', () => { if (window.innerWidth > 1024) closeMenu(); });

  // Active link highlight
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === currentPath || href === './' + currentPath || href.endsWith('/' + currentPath)) {
      a.classList.add('active');
    }
    // Home special case
    if ((currentPath === 'index.html' || currentPath === '') && (href === 'index.html' || href === './index.html' || href === '../index.html')) {
      a.classList.add('active');
    }
  });

  /* ── SCROLL ANIMATIONS ───────────────────────────────── */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        // Don't unobserve stagger parents so children all animate in
        if (!e.target.classList.contains('stagger')) io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal, .stagger').forEach(el => io.observe(el));

  /* ── COUNTER ANIMATION ───────────────────────────────── */
  const counters = document.querySelectorAll('.stat-num[data-count]');
  if (counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el  = e.target;
        const end = parseInt(el.dataset.count, 10);
        const sfx = el.dataset.suffix || '';
        const dur = 1600;
        const fps = 60;
        const steps = Math.round(dur / (1000 / fps));
        let step = 0;
        const timer = setInterval(() => {
          step++;
          const val = Math.round(end * easeOutQuart(step / steps));
          el.textContent = val + sfx;
          if (step >= steps) { el.textContent = end + sfx; clearInterval(timer); }
        }, 1000 / fps);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cio.observe(c));
  }

  function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

  /* ── NOTIFICATION SYSTEM ─────────────────────────────── */
  function showNotification(msg, type = 'info') {
    document.querySelector('.bst-notification')?.remove();
    const el = document.createElement('div');
    el.className = 'bst-notification';
    el.innerHTML = `<span>${msg}</span>`;
    el.style.cssText = `
      position:fixed;top:92px;right:32px;z-index:9999;
      background:${type === 'success' ? '#2D6A4F' : '#1C1C28'};
      color:#fff;padding:16px 24px;border-radius:6px;
      box-shadow:0 8px 32px rgba(0,0,0,.3);
      font-family:'DM Sans',sans-serif;font-size:.875rem;font-weight:500;
      border-left:3px solid ${type === 'success' ? '#52B788' : '#C8973A'};
      animation:slideIn .35s cubic-bezier(.4,0,.2,1);max-width:360px;line-height:1.5;
    `;
    const style = document.createElement('style');
    style.textContent = `@keyframes slideIn{from{transform:translateX(420px);opacity:0}to{transform:none;opacity:1}}@keyframes slideOut{to{transform:translateX(420px);opacity:0}}`;
    document.head.appendChild(style);
    document.body.appendChild(el);
    setTimeout(() => {
      el.style.animation = 'slideOut .35s forwards';
      setTimeout(() => el.remove(), 360);
    }, 5000);
  }

  // Expose globally
  window.BST = { showNotification };

  /* ── CONTACT FORM ────────────────────────────────────── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('[type=submit]');
      btn.textContent = 'Sending…';
      btn.disabled = true;
      setTimeout(() => {
        showNotification('✓ Thank you! We\'ll be in touch soon.', 'success');
        form.reset();
        btn.textContent = 'Send Message';
        btn.disabled = false;
      }, 900);
    });
  }

  /* ── PRAYER FORM ─────────────────────────────────────── */
  const prayerForm = document.getElementById('prayerForm');
  if (prayerForm) {
    prayerForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = prayerForm.querySelector('[type=submit]');
      btn.textContent = 'Submitting…';
      btn.disabled = true;
      setTimeout(() => {
        showNotification('✓ Your prayer request has been received. We\'re interceding for you.', 'success');
        prayerForm.reset();
        btn.textContent = 'Submit Prayer Request';
        btn.disabled = false;
      }, 900);
    });
  }

  /* ── SMOOTH SCROLL (in-page anchors) ────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const id = this.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
      closeMenu();
    });
  });

  /* ── PERFORMANCE ─────────────────────────────────────── */
  window.addEventListener('load', () => {
    if (window.performance?.timing) {
      const t = window.performance.timing;
      const load = t.loadEventEnd - t.navigationStart;
      if (load > 0) console.log(`%c⛪ BST · loaded in ${load}ms`, 'color:#C8973A;font-weight:600');
    }
  });

  /* ── EASTER EGG ──────────────────────────────────────── */
  let seq = [];
  const code = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  document.addEventListener('keydown', e => {
    seq = [...seq, e.key].slice(-10);
    if (seq.join('') === code.join('')) {
      showNotification('🙏 God bless you! You found the secret blessing!', 'success');
    }
  });

  console.log('%c⛪ Believers\' Sanctuary Thika', 'font-size:18px;font-weight:600;color:#C8973A;');
  console.log('%c✨ The Arena of Liberty - Gatitu, Thika, Kenya', 'color:#7A7A8C;font-size:13px;');

})();