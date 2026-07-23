/* ============================================================
   CHETAN KAMATAGI — Modern Portfolio JavaScript
   Features: Particles, Custom Cursor, Scroll Animations,
             Counter, Role Rotator, Filter, Theme Toggle
   ============================================================ */

// ─── Utility ───────────────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ─── 1. Particle Canvas ─────────────────────────────────────
(function initParticles() {
  const canvas = $('#particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouse = { x: -999, y: -999 };
  const PARTICLE_COUNT = 80;
  const COLORS = ['139,92,246', '6,182,212', '236,72,153'];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(initial) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : H + 10;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = -(Math.random() * 0.4 + 0.1);
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.life = 0;
      this.maxLife = Math.random() * 300 + 100;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life++;

      // Mouse repulsion
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 80) {
        this.x += (dx / dist) * 1.5;
        this.y += (dy / dist) * 1.5;
      }

      if (this.y < -10 || this.life > this.maxLife) this.reset(false);
    }
    draw() {
      ctx.save();
      const alpha = Math.min(this.opacity, Math.sin((this.life / this.maxLife) * Math.PI) * this.opacity);
      ctx.globalAlpha = alpha;
      ctx.shadowBlur = 6;
      ctx.shadowColor = `rgba(${this.color},0.8)`;
      ctx.fillStyle = `rgba(${this.color},1)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function initParticlesArr() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 100) * 0.12;
          ctx.strokeStyle = `rgba(139,92,246,1)`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('resize', () => { resize(); });
  resize();
  initParticlesArr();
  animate();
})();

// ─── 2. Custom Cursor ───────────────────────────────────────
(function initCursor() {
  const cursor = $('#cursor');
  const follower = $('#cursor-follower');
  if (!cursor || !follower) return;

  let fx = 0, fy = 0, mx = 0, my = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  function animateFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Cursor state on interactive elements
  $$('a, button, .filter-btn, .stag, .project-card, .award-card, .exp-card, .contact-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '20px';
      cursor.style.height = '20px';
      follower.style.width = '56px';
      follower.style.height = '56px';
      follower.style.borderColor = 'var(--cyan)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '10px';
      cursor.style.height = '10px';
      follower.style.width = '36px';
      follower.style.height = '36px';
      follower.style.borderColor = 'var(--purple-light)';
    });
  });
})();

// ─── 3. Header Scroll Effect ────────────────────────────────
(function initHeader() {
  const header = $('#header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
})();

// ─── 4. Mobile Menu ─────────────────────────────────────────
(function initMobileMenu() {
  const btn = $('#mobile-menu-btn');
  const nav = $('#mobile-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    nav.classList.toggle('open');
  });

  $$('.mobile-nav__link').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      nav.classList.remove('open');
    });
  });
})();

// ─── 5. ScrollSpy Navigation ────────────────────────────────
(function initScrollSpy() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav__link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id || link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => observer.observe(s));
})();

// ─── 6. Scroll Reveal Animations ────────────────────────────
(function initReveal() {
  const revealEls = $$('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));
})();

// ─── 7. Role Rotator ────────────────────────────────────────
(function initRoleRotator() {
  const el = $('#role-rotator');
  if (!el) return;

  const roles = [
    'AI/ML Engineer',
    'NLP & RAG Developer',
    'SAP SD Consultant @ IBM',
    'Python Developer',
    'Generative AI Enthusiast',
    'LLM App Builder',
  ];
  let idx = 0;

  function typeRole(text, cb) {
    el.textContent = '';
    let i = 0;
    const typeInterval = setInterval(() => {
      el.textContent += text[i++];
      if (i >= text.length) {
        clearInterval(typeInterval);
        setTimeout(() => eraseRole(cb), 2200);
      }
    }, 55);
  }

  function eraseRole(cb) {
    const typeInterval = setInterval(() => {
      el.textContent = el.textContent.slice(0, -1);
      if (!el.textContent) {
        clearInterval(typeInterval);
        cb();
      }
    }, 30);
  }

  function cycle() {
    idx = (idx + 1) % roles.length;
    typeRole(roles[idx], cycle);
  }

  typeRole(roles[0], cycle);
})();

// ─── 8. Animated Counter ────────────────────────────────────
(function initCounters() {
  const counters = $$('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const isFloat = String(target).includes('.');
        const duration = 1800;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = eased * target;
          el.textContent = isFloat ? current.toFixed(1) : Math.floor(current);
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

// ─── 9. Project Filter ──────────────────────────────────────
(function initProjectFilter() {
  const filterBtns = $$('.filter-btn');
  const cards = $$('.project-card');
  const grid = $('#projects-grid');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach(card => {
        const cat = card.dataset.category;
        const shouldShow = filter === 'all' || cat === filter;

        if (shouldShow) {
          card.style.display = 'flex';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = '';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            if (!shouldShow) card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
})();

// ─── 10. Dark / Light Mode Toggle ───────────────────────────
(function initTheme() {
  const toggle = $('#theme-toggle');
  const icon = $('#theme-icon');
  const root = document.documentElement;

  const saved = localStorage.getItem('ck-theme');
  if (saved === 'light') {
    root.classList.add('light');
    icon.className = 'fa-solid fa-moon';
  } else {
    icon.className = 'fa-solid fa-sun';
  }

  if (!toggle) return;
  toggle.addEventListener('click', () => {
    root.classList.toggle('light');
    const isLight = root.classList.contains('light');
    localStorage.setItem('ck-theme', isLight ? 'light' : 'dark');
    icon.className = isLight ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  });
})();

// ─── 11. Back to Top Button ─────────────────────────────────
(function initBackToTop() {
  const btn = $('#back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ─── 12. Smooth Anchor Navigation ───────────────────────────
(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const targetId = a.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = 90;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

// ─── 13. Award Card — Open link on click ────────────────────
// Award cards are <a> tags — already handled natively.

// ─── 14. Tilt effect on project cards ───────────────────────
(function initTiltEffect() {
  const cards = $$('.project-card, .exp-card, .award-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotY = ((x - centerX) / centerX) * 6;
      const rotX = -((y - centerY) / centerY) * 6;
      card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
      card.style.transition = 'transform 0.05s';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'all 0.4s var(--ease)';
    });
  });
})();

// ─── 15. Active hero image ring pulse on hover ──────────────
(function initHeroImageInteraction() {
  const img = $('#hero-img');
  if (!img) return;
  img.addEventListener('mouseenter', () => {
    img.style.boxShadow = '0 0 80px rgba(139,92,246,0.5), 0 0 40px rgba(6,182,212,0.3)';
  });
  img.addEventListener('mouseleave', () => {
    img.style.boxShadow = '';
  });
})();

// ─── 16. Page Load Entrance ─────────────────────────────────
(function initPageEntrance() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    // Trigger hero reveals after load
    setTimeout(() => {
      $$('.hero .reveal-up, .hero .reveal-right').forEach(el => {
        el.classList.add('visible');
      });
    }, 100);
  });
})();
