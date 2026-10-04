'use strict';
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const EMAIL = 'amrt6509@gmail.com';
const SITE = 'https://devvoltx.github.io/Amr/';

/* ---------- Toast ---------- */
const toast = $('#toast');
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ---------- Theme ---------- */
const themeBtn = $('#theme');
const root = document.documentElement;
const syncTheme = () => { themeBtn.textContent = root.dataset.theme === 'dark' ? '🌙' : '☀️'; };
themeBtn.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
  syncTheme();
});
syncTheme();

/* ---------- Typing effect ---------- */
(function typing() {
  const el = $('#typed');
  const roles = ['Full-Stack Developer', 'Game Developer', 'Cybersecurity Enthusiast', 'Graphic Designer'];
  let role = 0, chars = roles[0].length, deleting = true;
  (function tick() {
    const word = roles[role];
    chars += deleting ? -1 : 1;
    el.textContent = word.slice(0, chars);
    let delay = deleting ? 45 : 100;
    if (!deleting && chars === word.length) { deleting = true; delay = 1800; }
    else if (deleting && chars === 0) { deleting = false; role = (role + 1) % roles.length; delay = 300; }
    setTimeout(tick, delay);
  })();
})();

/* ---------- Ticker (duplicate items for a seamless loop) ---------- */
const ticker = $('#ticker');
ticker.innerHTML += ticker.innerHTML;

/* ---------- Galleries + lightbox ---------- */
const logos = [1, 2, 3, 4, 5, 6].map(n => ({ src: `images/logo${n}.jpg`, alt: `Logo design ${n}` }));
const cars = [
  ['BMW M4 Competition'], ['Lamborghini Revuelto'], ['BMW M5'], ['Bugatti Tourbillon'],
  ['Porsche 911 GT3 RS', true], ['Pagani Huayra Roadster BC'], ['McLaren 750S'], ['Koenigsegg Jesko Attack', true],
].map(([name, wide], i) => ({ src: `images/car${i + 1}.jpg`, alt: name, caption: name, wide }));
const clients = [
  { src: 'images/client1.jpg', alt: 'Hamo Samy artist poster', tag: 'GRAPHIC DESIGN', caption: 'HAMO SAMY — ARTIST', desc: 'Personal branding poster with Photoshop & Illustrator' },
  { src: 'images/client2.jpg', alt: 'Mohammed cinematic edit by Amr Essam', tag: 'PHOTO EDITING', caption: 'MOHAMMED — EDIT BY AMR', desc: 'Cinematic character edit with neon lighting effects' },
];

const lightbox = $('#lightbox');
const lbImg = $('img', lightbox);
let current = [], index = 0;

function showSlide() {
  const item = current[index];
  lbImg.src = item.src;
  lbImg.alt = item.alt;
  $('#lb-count').textContent = `${index + 1} / ${current.length}`;
}
function openLightbox(items, i) {
  current = items; index = i; showSlide();
  if (lightbox.showModal) lightbox.showModal(); else window.open(items[i].src);
}
const step = dir => { index = (index + dir + current.length) % current.length; showSlide(); };

function renderGallery(id, items) {
  const box = $(id);
  box.innerHTML = items.map((it, i) => `
    <button class="shot${it.wide ? ' wide' : ''}" data-i="${i}" aria-label="Open ${it.alt}">
      <img src="${it.src}" alt="${it.alt}" loading="lazy" decoding="async">
      <span class="cap">${it.tag ? `<small>${it.tag}</small>` : ''}${it.caption || '⤢ VIEW'}${it.desc ? `<em>${it.desc}</em>` : ''}</span>
    </button>`).join('');
  box.addEventListener('click', e => {
    const btn = e.target.closest('.shot');
    if (btn) openLightbox(items, +btn.dataset.i);
  });
}
renderGallery('#logos', logos);
renderGallery('#cars', cars);
renderGallery('#clients', clients);

$('#lb-prev').addEventListener('click', () => step(-1));
$('#lb-next').addEventListener('click', () => step(1));
$('#lb-close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.close(); });
document.addEventListener('keydown', e => {
  if (!lightbox.open) return;
  if (e.key === 'ArrowLeft') step(-1);
  if (e.key === 'ArrowRight') step(1);
});

/* ---------- Scroll reveal + counters ---------- */
function countUp(el) {
  const target = +el.dataset.count, start = performance.now(), duration = 900;
  (function frame(now) {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(target * t);
    if (t < 1) requestAnimationFrame(frame);
  })(start);
}
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      if (target.dataset.count) countUp(target); else target.classList.add('in');
      io.unobserve(target);
    });
  }, { threshold: 0.1 });
  $$('.reveal, [data-count]').forEach(el => io.observe(el));
} else {
  $$('.reveal').forEach(el => el.classList.add('in'));
}

/* ---------- Actions ---------- */
$('#copy').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(EMAIL); showToast('✓ Email copied'); }
  catch (e) { showToast(EMAIL); }
});
$('#share').addEventListener('click', async () => {
  try {
    if (navigator.share) await navigator.share({ title: 'Amr Essam — Portfolio', url: SITE });
    else { await navigator.clipboard.writeText(SITE); showToast('✓ Link copied'); }
  } catch (e) { /* share cancelled */ }
});

const topBtn = $('#top');
window.addEventListener('scroll', () => topBtn.classList.toggle('show', scrollY > 500), { passive: true });
topBtn.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
