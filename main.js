// Safe on any page: every block exits quietly if its elements are missing.
const $ = id => document.getElementById(id);

// ── LOADER ──
(function () {
  const bar = $('loaderBar'), pct = $('loaderPct'), loader = $('loader');
  if (!bar || !pct || !loader) return;
  let p = 0;
  const iv = setInterval(() => {
    p = Math.min(100, p + Math.random() * 18);
    bar.style.width = p + '%';
    pct.textContent = Math.floor(p) + '%';
    if (p === 100) {
      clearInterval(iv);
      setTimeout(() => { loader.classList.add('hide'); setTimeout(() => loader.remove(), 700); }, 300);
    }
  }, 80);
})();

// ── CUSTOM CURSOR ──
(function () {
  const outer = $('cursor-outer'), inner = $('cursor-inner');
  if (!outer || !inner) return;
  let mx = 0, my = 0, ox = 0, oy = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    inner.style.left = mx + 'px'; inner.style.top = my + 'px';
  });
  (function loop() {
    ox += (mx - ox) * 0.12; oy += (my - oy) * 0.12;
    outer.style.left = ox + 'px'; outer.style.top = oy + 'px';
    requestAnimationFrame(loop);
  })();
})();

// ── STARFIELD (ice-blue stars) ──
(function () {
  const c = $('stars');
  if (!c) return;
  const ctx = c.getContext('2d');
  let stars = [];
  const resize = () => { c.width = innerWidth; c.height = innerHeight; };
  const init = () => {
    stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      r: Math.random() * 1.2 + 0.2, a: Math.random(), s: Math.random() * 0.003 + 0.001
    }));
  };
  (function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    stars.forEach(s => {
      s.a += s.s;
      const al = (Math.sin(s.a) + 1) / 2 * 0.7 + 0.1;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(185,220,229,${al})`; ctx.fill();
    });
    requestAnimationFrame(draw);
  })();
  resize(); init();
  addEventListener('resize', () => { resize(); init(); });
})();

// ── PROJECT TOGGLE ──
function toggleProject(el) { el.nextElementSibling.classList.toggle('open'); }

// ── TYPING EFFECT ──
(function () {
  const el = $('typed');
  if (!el) return;
  const roles = ['Full-Stack Developer', 'Game Developer', 'Cybersecurity Enthusiast'];
  let ri = 0, ci = 0, del = false;
  (function type() {
    const w = roles[ri];
    if (!del) {
      el.textContent = w.slice(0, ++ci);
      if (ci === w.length) { setTimeout(() => { del = true; type(); }, 1800); return; }
    } else {
      el.textContent = w.slice(0, --ci);
      if (ci === 0) { del = false; ri = (ri + 1) % roles.length; }
    }
    setTimeout(type, del ? 60 : 120);
  })();
})();

// ── BACK TO TOP ──
(function () {
  const btn = $('btt');
  if (!btn) return;
  addEventListener('scroll', () => btn.classList.toggle('show', scrollY > 400));
  btn.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
})();

// ── 3D TILT ──
(function () {
  document.querySelectorAll('.skill-card, .cert-card, .logo-card, .car-card, .edu-card').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const rx = ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -10;
      const ry = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 10;
      el.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(10px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
})();

// ── SCROLL REVEAL (class-based, so hover/tilt keep working) ──
(function () {
  const els = document.querySelectorAll('.project-item, .skill-card, .cert-card, .logo-card, .car-card, .edu-card, .sec-label');
  if (!els.length) return;
  els.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.classList.add('in');
      setTimeout(() => el.classList.remove('reveal', 'in'), 700);
      io.unobserve(el);
    });
  }, { threshold: 0.1 });
  els.forEach(el => io.observe(el));
})();

// ── PARALLAX STARS ──
(function () {
  const c = $('stars');
  if (!c) return;
  document.addEventListener('mousemove', e => {
    const tx = (e.clientX / innerWidth - 0.5) * 20, ty = (e.clientY / innerHeight - 0.5) * 20;
    c.style.transform = `translate(${tx}px, ${ty}px) scale(1.03)`;
  });
})();
