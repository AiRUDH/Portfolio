/* ─────────────────────────────────────────────
   main.js — Enhanced v2 Engine
   Haptics · Typewriter · Richer Particles ·
   Loader · Connect Hub · SEO-ready
   ───────────────────────────────────────────── */

/* ═══ HAPTIC FEEDBACK ═══ */
function haptic(ms = 10) {
  if ('vibrate' in navigator) navigator.vibrate(ms);
}

/* ═══ LOADER ═══ */
(function () {
  const loader = document.getElementById('loader');
  if (!loader) return;
  const fill = loader.querySelector('.loader-fill');
  let w = 0;
  const iv = setInterval(() => {
    w += Math.random() * 18 + 5;
    if (w > 100) w = 100;
    if (fill) fill.style.width = w + '%';
    if (w >= 100) {
      clearInterval(iv);
      setTimeout(() => {
        loader.classList.add('done');
        haptic(25);
        // Start hero animations after loader
        document.dispatchEvent(new Event('loaderDone'));
        setTimeout(() => loader.remove(), 600);
      }, 300);
    }
  }, 120);
})();

/* ═══ CUSTOM CURSOR ═══ */
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

if (cur && ring) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + 'px'; cur.style.top = my + 'px';
  });
  (function lerpRing() {
    rx += (mx - rx) * .1; ry += (my - ry) * .1;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(lerpRing);
  })();

  const hoverEls = 'a, button, .project-card, .filter-tab, .nav-cta, .btn-accent, .btn-outline, .social-icon, .submit-btn, .ca-btn, .skill-tag, .hero-cta, .hero-cta-sec, .form-toggle';
  document.querySelectorAll(hoverEls).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
  document.addEventListener('mousedown', () => ring.classList.add('click'));
  document.addEventListener('mouseup', () => ring.classList.remove('click'));
}

/* ═══ ENHANCED PARTICLES ═══ */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  const particles = [];
  const COUNT = Math.min(80, Math.round(innerWidth / 15));

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
      this.r = Math.random() * 2 + .5;
      this.vx = (Math.random() - .5) * .35;
      this.vy = (Math.random() - .5) * .35;
      this.alpha = 0;
      this.maxAlpha = Math.random() * .45 + .1;
      this.fadeSpeed = Math.random() * .006 + .003;
      this.fadingIn = true;
      // Color variation — accent green or cool blue
      this.hue = Math.random() > .7 ? 200 : 155;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.fadingIn) { this.alpha += this.fadeSpeed; if (this.alpha >= this.maxAlpha) this.fadingIn = false; }
      else { this.alpha -= this.fadeSpeed * .4; if (this.alpha <= 0) this.reset(); }
      if (this.x < -10 || this.x > W + 10 || this.y < -10 || this.y > H + 10) this.reset();
    }
    draw() {
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue},100%,50%,${this.alpha})`;
      ctx.fill();
      // Glow
      if (this.r > 1.5) {
        ctx.beginPath(); ctx.arc(this.x, this.y, this.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue},100%,50%,${this.alpha * .1})`;
        ctx.fill();
      }
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          const a = (1 - dist / 130) * .06;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,255,136,${a})`;
          ctx.lineWidth = .4;
          ctx.stroke();
        }
      }
    }
  }

  // Mouse interaction
  let pmx = -1000, pmy = -1000;
  canvas.parentElement.addEventListener('mousemove', e => {
    const r = canvas.parentElement.getBoundingClientRect();
    pmx = e.clientX - r.left; pmy = e.clientY - r.top;
  });
  canvas.parentElement.addEventListener('mouseleave', () => { pmx = -1000; pmy = -1000; });

  (function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      // Repel from mouse
      const dx = p.x - pmx, dy = p.y - pmy;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 120) { p.x += dx / d * 1.5; p.y += dy / d * 1.5; }
      p.update(); p.draw();
    });
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
    haptic(8);
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

window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', scrollY > 60);
}, { passive: true });

/* ═══ SCROLL PROGRESS ═══ */
const scrollBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  if (scrollBar) scrollBar.style.width = (scrollY / (document.body.scrollHeight - innerHeight) * 100) + '%';
}, { passive: true });

/* ═══ FAB ═══ */
const fab = document.getElementById('fab');
if (fab) {
  window.addEventListener('scroll', () => fab.classList.toggle('show', scrollY > 500), { passive: true });
  fab.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); haptic(12); });
}

/* ═══ HERO TEXT STAGGER ═══ */
function initHeroStagger() {
  const hero = document.querySelector('.hero-headline');
  if (!hero) return;
  const words = hero.querySelectorAll('.word');
  words.forEach((w, i) => {
    setTimeout(() => {
      w.style.transition = 'opacity .8s cubic-bezier(.25,.46,.45,.94), transform .8s cubic-bezier(.25,.46,.45,.94)';
      w.style.opacity = '1'; w.style.transform = 'none';
    }, 400 + i * 100);
  });
}
// If loader exists, wait; otherwise start immediately
if (document.getElementById('loader')) {
  document.addEventListener('loaderDone', initHeroStagger);
} else { initHeroStagger(); }

/* ═══ TYPEWRITER EFFECT ═══ */
(function () {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const phrases = (el.dataset.phrases || '').split('|');
  if (!phrases.length) return;
  let pi = 0, ci = 0, deleting = false;
  function type() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.substring(0, ++ci);
      if (ci === phrase.length) { setTimeout(() => { deleting = true; type(); }, 2000); return; }
    } else {
      el.textContent = phrase.substring(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(type, deleting ? 40 : 80);
  }
  // Delay start until after loader
  const start = () => setTimeout(type, 1200);
  if (document.getElementById('loader')) document.addEventListener('loaderDone', start);
  else start();
})();

/* ═══ SCROLL REVEAL ═══ */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: .08, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ═══ PARALLAX ═══ */
(function () {
  const heroEl = document.querySelector('.hero, .page-hero');
  const canvas = document.getElementById('particles-canvas');
  if (!heroEl || !canvas) return;
  window.addEventListener('scroll', () => {
    const p = Math.min(scrollY / heroEl.offsetHeight, 1);
    canvas.style.transform = `translateY(${p * 20}px)`;
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
      el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * to) + suffix;
      if (p < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
    counterObs.unobserve(el);
  });
}, { threshold: .5 });
document.querySelectorAll('[data-to]').forEach(el => counterObs.observe(el));

/* ═══ PROJECT FILTER ═══ */
(function () {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.project-card');
  if (!tabs.length || !cards.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      haptic(6);
      const cat = tab.dataset.filter;
      cards.forEach((card, i) => {
        const match = cat === 'all' || card.dataset.cat === cat;
        card.style.display = match ? '' : 'none';
        if (match) {
          card.style.opacity = '0'; card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.transition = 'opacity .5s, transform .5s';
            card.style.opacity = '1'; card.style.transform = 'none';
          }, i * 50);
        }
      });
    });
  });
})();

/* ═══ SKILL BARS ═══ */
(function () {
  const grid = document.getElementById('skills-grid');
  if (!grid) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.sk-fill').forEach(bar => { bar.style.transform = `scaleX(${bar.dataset.w})`; });
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .2 });
  obs.observe(grid);
})();

/* ═══ PAGE TRANSITIONS ═══ */
(function () {
  const overlay = document.getElementById('page-overlay');
  if (!overlay) return;
  overlay.classList.add('leave');
  overlay.addEventListener('animationend', function h() { overlay.classList.remove('leave'); overlay.removeEventListener('animationend', h); });
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('http') || a.target === '_blank') return;
    a.addEventListener('click', e => {
      e.preventDefault(); haptic(15);
      overlay.classList.remove('leave'); overlay.classList.add('enter');
      setTimeout(() => { location.href = href; }, 450);
    });
  });
})();

/* ═══ COLLAPSIBLE FORM TOGGLE ═══ */
(function () {
  const toggle = document.querySelector('.form-toggle');
  const form = document.querySelector('.collapsible-form');
  if (!toggle || !form) return;
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    form.classList.toggle('open');
    haptic(8);
  });
})();

/* ═══ CONTACT FORM ═══ */
const formEl = document.getElementById('contact-form');
if (formEl) {
  formEl.addEventListener('submit', e => {
    e.preventDefault(); haptic(15);
    const btn = formEl.querySelector('.submit-btn');
    const original = btn.innerHTML;
    btn.innerHTML = '<span>Sending…</span>'; btn.style.pointerEvents = 'none';
    setTimeout(() => {
      btn.classList.add('sent');
      btn.innerHTML = '<span style="font-size:1.4rem">✓</span> Message sent!';
      formEl.reset(); haptic(30);
      setTimeout(() => { btn.classList.remove('sent'); btn.innerHTML = original; btn.style.pointerEvents = ''; }, 4000);
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

/* ═══ HAPTIC ON ALL BUTTONS ═══ */
document.querySelectorAll('button, .btn-accent, .btn-outline, .nav-cta, .ca-btn').forEach(el => {
  el.addEventListener('click', () => haptic(10));
  el.addEventListener('touchstart', () => haptic(6), { passive: true });
});

/* ═══ ACTIVE STATE FOR TOUCH ═══ */
if ('ontouchstart' in window) {
  document.querySelectorAll('.project-card, .ca-btn, .btn-accent, .btn-outline, .stat-cell, .val-row, .proc-card').forEach(el => {
    el.addEventListener('touchstart', () => el.style.transform = 'scale(.97)', { passive: true });
    el.addEventListener('touchend', () => el.style.transform = '', { passive: true });
  });
}
