/* ─────────────────────────────────────────────
   main.js — LML.cc Clone Engine (Pure JS)
   PRD: Particles, Cursor, Stagger, Parallax,
         Filter, Form, Transitions
   ───────────────────────────────────────────── */

/* ═══ CUSTOM CURSOR ═══ */
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

if (cur && ring) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top = my + 'px';
  });
  (function lerpRing() {
    rx += (mx - rx) * .1;
    ry += (my - ry) * .1;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(lerpRing);
  })();

  document.querySelectorAll('a, button, .project-card, .filter-tab, .nav-cta, .btn-accent, .btn-outline, .social-icon, .submit-btn')
    .forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });

  document.addEventListener('mousedown', () => ring.classList.add('click'));
  document.addEventListener('mouseup', () => ring.classList.remove('click'));
}

/* ═══ PARTICLES (PRD §1 — 10px, 0.5s fade) ═══ */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  const particles = [];
  const PARTICLE_COUNT = 60;

  function resize() {
    W = canvas.width = canvas.parentElement.offsetWidth;
    H = canvas.height = canvas.parentElement.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 2.5 + 1;
      this.vx = (Math.random() - .5) * .3;
      this.vy = (Math.random() - .5) * .3;
      this.alpha = 0;
      this.targetAlpha = Math.random() * .5 + .1;
      this.fadeSpeed = Math.random() * .008 + .005;
      this.fadingIn = true;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.fadingIn) {
        this.alpha += this.fadeSpeed;
        if (this.alpha >= this.targetAlpha) this.fadingIn = false;
      } else {
        this.alpha -= this.fadeSpeed * .5;
        if (this.alpha <= 0) this.reset();
      }
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,255,136,${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  // Connect nearby particles
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const a = (1 - dist / 150) * .08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,255,136,${a})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }
  }

  (function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  })();
})();

/* ═══ NAVIGATION ═══ */
const nav = document.getElementById('nav');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });
  navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  }));
}

// Active page
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link[data-page]').forEach(link => {
  if (link.dataset.page === currentPage) link.classList.add('active');
});

// Nav scroll state
window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', scrollY > 60);
}, { passive: true });

/* ═══ SCROLL PROGRESS ═══ */
const scrollBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  if (scrollBar) {
    const pct = scrollY / (document.body.scrollHeight - innerHeight) * 100;
    scrollBar.style.width = pct + '%';
  }
}, { passive: true });

/* ═══ FAB ═══ */
const fab = document.getElementById('fab');
if (fab) {
  window.addEventListener('scroll', () => {
    fab.classList.toggle('show', scrollY > 500);
  }, { passive: true });
  fab.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ═══ HERO TEXT STAGGER (PRD: 0.8s fade-up, 0.1s per word) ═══ */
(function () {
  const hero = document.querySelector('.hero-headline');
  if (!hero) return;
  const words = hero.querySelectorAll('.word');
  words.forEach((w, i) => {
    setTimeout(() => {
      w.style.transition = 'opacity .8s cubic-bezier(.25,.46,.45,.94), transform .8s cubic-bezier(.25,.46,.45,.94)';
      w.style.opacity = '1';
      w.style.transform = 'none';
    }, 400 + i * 100);
  });

  // Sub + CTA
  setTimeout(() => {
    document.querySelectorAll('.hero-sub, .hero-cta').forEach(el => el.classList.add('visible'));
  }, 800);
})();

/* ═══ SCROLL REVEAL ═══ */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: .08, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ═══ PARALLAX (PRD: Hero bg 20px, images 10px) ═══ */
(function () {
  const heroEl = document.querySelector('.hero');
  const canvas = document.getElementById('particles-canvas');
  if (!heroEl || !canvas) return;

  window.addEventListener('scroll', () => {
    const progress = Math.min(scrollY / heroEl.offsetHeight, 1);
    canvas.style.transform = `translateY(${progress * 20}px)`;
  }, { passive: true });
})();

/* ═══ COUNTERS ═══ */
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, to = +el.dataset.to, suffix = el.dataset.suffix || '';
    let start = 0;
    const run = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1600, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * to) + suffix;
      if (p < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
    counterObs.unobserve(el);
  });
}, { threshold: .5 });
document.querySelectorAll('[data-to]').forEach(el => counterObs.observe(el));

/* ═══ PROJECT FILTER TABS (PRD §4) ═══ */
(function () {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.project-card');
  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.filter;
      cards.forEach(card => {
        const match = cat === 'all' || card.dataset.cat === cat;
        card.style.display = match ? '' : 'none';
        if (match) {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity .5s, transform .5s';
            card.style.opacity = '1';
            card.style.transform = 'none';
          });
        }
      });
    });
  });
})();

/* ═══ SKILL BARS ANIMATION ═══ */
(function () {
  const skillGrid = document.getElementById('skills-grid');
  if (!skillGrid) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.sk-fill').forEach(bar => {
          bar.style.transform = `scaleX(${bar.dataset.w})`;
        });
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .2 });
  obs.observe(skillGrid);
})();

/* ═══ PAGE TRANSITIONS ═══ */
(function () {
  const overlay = document.getElementById('page-overlay');
  if (!overlay) return;

  // Enter animation
  overlay.classList.add('leave');
  overlay.addEventListener('animationend', function handler() {
    overlay.classList.remove('leave');
    overlay.removeEventListener('animationend', handler);
  });

  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto') ||
      href.startsWith('tel') || href.startsWith('http') || a.target === '_blank') return;
    a.addEventListener('click', e => {
      e.preventDefault();
      overlay.classList.remove('leave');
      overlay.classList.add('enter');
      setTimeout(() => { location.href = href; }, 450);
    });
  });
})();

/* ═══ CONTACT FORM (PRD §5 — animated checkmark) ═══ */
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.submit-btn');
    const original = btn.innerHTML;
    btn.innerHTML = '<span>Sending…</span>';
    btn.style.pointerEvents = 'none';
    setTimeout(() => {
      btn.classList.add('sent');
      btn.innerHTML = '<span>✓</span> Message sent!';
      form.reset();
      setTimeout(() => {
        btn.classList.remove('sent');
        btn.innerHTML = original;
        btn.style.pointerEvents = '';
      }, 4000);
    }, 1000);
  });
}

/* ═══ MAGNETIC HOVER ═══ */
document.querySelectorAll('.mag').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * .2;
    const y = (e.clientY - r.top - r.height / 2) * .2;
    el.style.transform = `translate(${x}px,${y}px)`;
  });
  el.addEventListener('mouseleave', () => el.style.transform = '');
});
