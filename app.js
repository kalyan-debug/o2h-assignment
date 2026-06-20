/**
 * TaskFlow – app.js
 * Modules: DarkMode | MobileMenu | FormValidation | BlogAPI
 */

'use strict';

/* ──────────────────────────────────────────────────────────
   1. DARK MODE
   ────────────────────────────────────────────────────────── */
const DarkMode = (() => {
  const STORAGE_KEY = 'tf-theme';
  const html        = document.documentElement;
  const toggle      = document.getElementById('dark-mode-toggle');

  const iconLight = '<i class="fa-solid fa-moon" aria-hidden="true"></i>';
  const iconDark  = '<i class="fa-solid fa-sun"  aria-hidden="true"></i>';

  function apply(theme) {
    html.setAttribute('data-theme', theme);
    toggle.innerHTML = theme === 'dark' ? iconDark : iconLight;
    toggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }

  function init() {
    // Respect saved preference, then system preference
    const saved  = localStorage.getItem(STORAGE_KEY);
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    apply(saved ?? system);

    toggle.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      apply(next);
      localStorage.setItem(STORAGE_KEY, next);
    });
  }

  return { init };
})();


/* ──────────────────────────────────────────────────────────
   2. MOBILE MENU
   ────────────────────────────────────────────────────────── */
const MobileMenu = (() => {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  function toggle() {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    hamburger.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    // Animate bars
    const bars = hamburger.querySelectorAll('.bar');
    if (isOpen) {
      bars[0].style.cssText = 'transform: rotate(45deg) translate(5px, 5px)';
      bars[1].style.cssText = 'opacity: 0';
      bars[2].style.cssText = 'transform: rotate(-45deg) translate(5px, -5px)';
    } else {
      bars.forEach(b => (b.style.cssText = ''));
    }
  }

  function close() {
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation menu');
    hamburger.querySelectorAll('.bar').forEach(b => (b.style.cssText = ''));
  }

  function init() {
    hamburger.addEventListener('click', toggle);

    // Close when a link is tapped
    navLinks.querySelectorAll('.nav-link').forEach(link =>
      link.addEventListener('click', close)
    );

    // Close on outside click
    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        close();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) close();
    });
  }

  return { init };
})();


/* ──────────────────────────────────────────────────────────
   3. FORM VALIDATION
   ────────────────────────────────────────────────────────── */
const FormValidation = (() => {
  const form       = document.getElementById('contact-form');
  const submitBtn  = document.getElementById('submit-btn');
  const successMsg = document.getElementById('form-success');

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const fields = [
    {
      id:       'name',
      errorId:  'name-error',
      validate: v => v.trim().length < 2 ? 'Please enter your full name.' : '',
    },
    {
      id:       'email',
      errorId:  'email-error',
      validate: v => !EMAIL_RE.test(v.trim()) ? 'Please enter a valid email address.' : '',
    },
    {
      id:       'message',
      errorId:  'message-error',
      validate: v => v.trim().length < 10 ? 'Message must be at least 10 characters.' : '',
    },
  ];

  function showError(field, msg) {
    const el = document.getElementById(field.errorId);
    const input = document.getElementById(field.id);
    el.textContent = msg;
    input.classList.toggle('error', !!msg);
    input.setAttribute('aria-invalid', !!msg);
  }

  function validateField(field) {
    const input = document.getElementById(field.id);
    const msg   = field.validate(input.value);
    showError(field, msg);
    return !msg;
  }

  function init() {
    if (!form) return;

    // Validate on blur (inline feedback)
    fields.forEach(f => {
      document.getElementById(f.id).addEventListener('blur', () => validateField(f));
      document.getElementById(f.id).addEventListener('input', () => {
     if (document.getElementById(f.errorId).textContent) {
     showError(f, ''); // Quietly clear error text, validate only on next Blur or Submit
  }
   });
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const allValid = fields.every(validateField);
      if (!allValid) {
        // Focus first invalid field
        const firstErr = fields.find(f => !validateField(f));
        if (firstErr) document.getElementById(firstErr.id).focus();
        return;
      }

      // Simulate async submit
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      setTimeout(() => {
        form.reset();
        fields.forEach(f => showError(f, ''));
        submitBtn.textContent = 'Send message';
        submitBtn.disabled = false;
        successMsg.hidden = false;
        successMsg.focus();
        // Hide success message after 5 s
        setTimeout(() => { successMsg.hidden = true; }, 5000);
      }, 1200);
    });
  }

  return { init };
})();


/* ──────────────────────────────────────────────────────────
   4. BLOG API — JSONPlaceholder
   ────────────────────────────────────────────────────────── */
const BlogAPI = (() => {
  const grid      = document.getElementById('blog-grid');
  const errorBox  = document.getElementById('blog-error');
  const retryBtn  = document.getElementById('blog-retry');
  const API_URL   = 'https://jsonplaceholder.typicode.com/posts?_limit=6';

  // Truncate text to N words
  function truncate(str, words) {
    const arr = str.trim().split(/\s+/);
    return arr.length <= words ? str : arr.slice(0, words).join(' ') + '…';
  }

  // Capitalise first letter
  function capitalise(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function buildCard(post) {
    const article = document.createElement('article');
    article.className = 'blog-card';
    article.setAttribute('role', 'listitem');

    const heading = capitalise(post.title);
    const body    = capitalise(post.body);

    article.innerHTML = `
      <span class="blog-post-id" aria-label="Post ${post.id}">Post #${post.id}</span>
      <h3>${truncate(heading, 8)}</h3>
      <p>${truncate(body, 22)}</p>
      <span class="blog-read-more" aria-hidden="true">
        Read more <i class="fa-solid fa-arrow-right"></i>
      </span>
    `;

    // Lazy load: observer for entrance animation
    article.style.opacity = '0';
    article.style.transform = 'translateY(16px)';
    article.style.transition = 'opacity .4s ease, transform .4s ease';
    return article;
  }

  function showSkeletons() {
    grid.innerHTML = '';
    grid.setAttribute('aria-busy', 'true');
    for (let i = 0; i < 6; i++) {
      const sk = document.createElement('div');
      sk.className = 'blog-skeleton';
      sk.setAttribute('aria-hidden', 'true');
      grid.appendChild(sk);
    }
  }

  function showError() {
    grid.innerHTML = '';
    grid.removeAttribute('aria-busy');
    errorBox.hidden = false;
  }

  async function fetchPosts() {
    errorBox.hidden = true;
    showSkeletons();

    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const posts = await res.json();

      grid.innerHTML = '';
      grid.setAttribute('role', 'list');
      grid.removeAttribute('aria-busy');

      const cards = posts.map(buildCard);
      cards.forEach(c => grid.appendChild(c));

      // Intersection observer for staggered reveal
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }, i * 80);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      cards.forEach(c => observer.observe(c));

    } catch (err) {
      console.error('[BlogAPI]', err);
      showError();
    }
  }

  function init() {
    fetchPosts();
    retryBtn.addEventListener('click', fetchPosts);
  }

  return { init };
})();


/* ──────────────────────────────────────────────────────────
   5. NAVBAR SCROLL SHADOW
   ────────────────────────────────────────────────────────── */
const NavScroll = (() => {
  const navbar = document.querySelector('.navbar');
  function init() {
    const update = () => {
      navbar.style.boxShadow = window.scrollY > 8
        ? '0 2px 16px rgba(0,0,0,.08)'
        : 'none';
    };
    window.addEventListener('scroll', update, { passive: true });
  }
  return { init };
})();


/* ──────────────────────────────────────────────────────────
   BOOT
   ────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  DarkMode.init();
  MobileMenu.init();
  FormValidation.init();
  BlogAPI.init();
  NavScroll.init();
});
