/* ============================================================
   CHANG.JH — Main Scripts
   ============================================================ */

(function () {
  'use strict';

  // ----------------------------------------------------------
  // Nav scroll effect — darken background on scroll
  // ----------------------------------------------------------
  const nav = document.getElementById('nav');

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // ----------------------------------------------------------
  // Scroll reveal — fade-in via IntersectionObserver
  // ----------------------------------------------------------
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -80px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => {
    revealObserver.observe(el);
  });

  // ----------------------------------------------------------
  // Active nav link — highlight based on scroll position
  // ----------------------------------------------------------
  const navLinks = document.querySelectorAll('.nav__links a');

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === '#' + id
            );
          });
        }
      });
    },
    { threshold: 0, rootMargin: '-45% 0px -50% 0px' }
  );

  document.querySelectorAll('section[id]').forEach((s) => {
    navObserver.observe(s);
  });

  // ----------------------------------------------------------
  // Smooth scroll for anchor links
  // ----------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return; // skip bare '#'

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const targetPos =
        target.getBoundingClientRect().top + window.pageYOffset - nav.offsetHeight;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    });
  });

  // ----------------------------------------------------------
  // Douyin QR Modal — open / close / ESC
  // ----------------------------------------------------------
  const modal = document.getElementById('douyin-modal');
  const trigger = document.getElementById('douyin-trigger');

  const openModal = () => {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    // Blur focused element inside modal before hiding
    if (document.activeElement && modal.contains(document.activeElement)) {
      document.activeElement.blur();
    }
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });

  modal.querySelectorAll('[data-close]').forEach((el) => {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // ----------------------------------------------------------
  // Ask AI floating button — step aside when the footer is in
  // view, keeping the ICP filing link unobstructed at the bottom
  // ----------------------------------------------------------
  const fabDock = document.querySelector('.ai-fab-dock');
  const footer = document.querySelector('.footer');

  if (fabDock && footer) {
    const footerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          fabDock.classList.toggle('is-hidden', entry.isIntersecting);
        });
      },
      { threshold: 0 }
    );
    footerObserver.observe(footer);
  }
})();
