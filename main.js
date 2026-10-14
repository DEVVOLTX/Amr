'use strict';
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const EMAIL = 'amrt6509@gmail.com';
const SITE = 'https://amressam.is-a.dev/';

/* ---------- Theme ---------- */
const themeBtn = $('#theme');
const root = document.documentElement;
const syncTheme = () => { themeBtn.textContent = root.dataset.theme === 'dark' ? '🌙' : '☀️'; };
themeBtn.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
  syncTheme();
  if (typeof say === 'function') say(root.dataset.theme, 'message', { icon: root.dataset.theme === 'dark' ? 'moon' : 'sun', duration: 1800 });
});
syncTheme();

/* ---------- Language (EN / AR / IT / ES / KO / JA / ZH) ----------
   Text lives in i18n.js. English is the markup itself; other languages override it by data-i18n key. */
const LANG_CODES = LANGS.map(l => l.code);
let lang = LANG_CODES.includes(root.lang) ? root.lang : 'en';
const TITLE_EN = document.title;
const i18nEls = $$('[data-i18n]');
i18nEls.forEach(el => { el.dataset.en = el.innerHTML; });
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let restartTyping = null; // set by the typing effect below
const langBtn = $('#lang'), langMenu = $('#lang-menu');
langMenu.innerHTML = LANGS.map(l => `
  <li role="presentation"><button class="lang-opt" type="button" role="option" data-lang="${l.code}" lang="${l.code}" aria-selected="false">${FLAGS[l.code]}<b>${l.label}</b><small>${l.name}</small></button></li>`).join('');
const langOpts = $$('.lang-opt', langMenu);

function setLang(next, persist = true) {
  lang = next;
  root.lang = next;
  root.dir = next === 'ar' ? 'rtl' : 'ltr';
  i18nEls.forEach(el => { el.innerHTML = (TR[next] && TR[next][el.dataset.i18n]) ?? el.dataset.en; });
  const meta = LANGS.find(l => l.code === next);
  langBtn.innerHTML = `${FLAGS[next]}<span>${meta.label}</span>`;
  langOpts.forEach(o => o.setAttribute('aria-selected', String(o.dataset.lang === next)));
  document.title = TITLES[next] || TITLE_EN;
  if (reduceMotion) $('#typed').textContent = ROLES[next][0]; // typing effect is off, keep the static role in sync
  else if (restartTyping) restartTyping(); // re-type the role in the new language right away
  if (persist) { try { localStorage.setItem('lang', next); } catch (e) {} }
}
const setLangMenu = open => { langMenu.hidden = !open; langBtn.setAttribute('aria-expanded', String(open)); };
langBtn.addEventListener('click', () => setLangMenu(langMenu.hidden));
langMenu.addEventListener('click', e => {
  const opt = e.target.closest('[data-lang]');
  if (!opt) return;
  setLangMenu(false);
  langBtn.focus();
  if (opt.dataset.lang === lang) return;
  setLang(opt.dataset.lang);
  say('lang', 'message', { icon: 'globe', duration: 1800 });
});
document.addEventListener('click', e => { if (!langMenu.hidden && !e.target.closest('.lang-wrap')) setLangMenu(false); });
document.addEventListener('keydown', e => {
  if (langMenu.hidden) return;
  if (e.key === 'Escape') { setLangMenu(false); langBtn.focus(); return; }
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    const i = langOpts.indexOf(document.activeElement);
    const n = e.key === 'ArrowDown' ? (i + 1) % langOpts.length : (i <= 0 ? langOpts.length - 1 : i - 1);
    langOpts[n].focus();
  }
});
setLang(lang, false);

/* ---------- Notification island ---------- */
const island = $('#island');
const islCard = $('.isl-card', island);
const ISL_ICONS = { /* 24x24 stroke icons (Lucide-style) */
  check:    '<path d="M20 6 9 17l-5-5"/>',
  up:       '<path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>',
  down:     '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
  mail:     '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  dollar:   '<circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/>',
  alert:    '<circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
  moon:     '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  sun:      '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  globe:    '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  external: '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  gamepad:  '<line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><rect width="20" height="12" x="2" y="6" rx="2"/>',
  sparkles: '<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.13-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.13a.5.5 0 0 1 .96 0L14.06 8.5a2 2 0 0 0 1.44 1.44l6.13 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.13a.5.5 0 0 1-.96 0z"/>',
};
const svgIcon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${ISL_ICONS[name]}</svg>`;
const ISL_TYPES = {
  success:  { icon: 'check',  c1: '#34d399', c2: '#22c55e' },
  loading:  { icon: '',       c1: '#8b5cf6', c2: '#6366f1', spin: true },
  upload:   { icon: 'up',     c1: '#3b82f6', c2: '#22d3ee' },
  download: { icon: 'down',   c1: '#3b82f6', c2: '#22d3ee' },
  message:  { icon: 'mail',   c1: '#8b5cf6', c2: '#a78bfa' },
  payment:  { icon: 'dollar', c1: '#34d399', c2: '#22c55e' },
  error:    { icon: 'alert',  c1: '#fb7185', c2: '#f43f5e' },
};
let islTimer, islDuration = 3200, islSeq = 0;

function paintIsland({ type = 'success', title = '', text = '', icon, progress = null }) {
  const t = ISL_TYPES[type] || ISL_TYPES.success;
  const ico = $('.isl-ico', island);
  ico.className = 'isl-ico' + (t.spin ? ' spin' : '');
  const name = icon || t.icon;
  ico.innerHTML = ISL_ICONS[name] ? svgIcon(name) : (icon || '');
  ico.style.setProperty('--c1', t.c1);
  ico.style.setProperty('--c2', t.c2);
  $('.isl-title', island).textContent = title;
  const sub = $('.isl-sub', island);
  sub.textContent = text;
  sub.hidden = !text;
  islCard.classList.toggle('has-bar', progress !== null);
  island.style.setProperty('--p', (progress ?? 0) + '%');
}
function armIsland() {
  clearTimeout(islTimer);
  if (islDuration > 0) islTimer = setTimeout(hideIsland, islDuration);
}
function hideIsland() { clearTimeout(islTimer); island.classList.remove('show'); }

/* showIsland({ type, title, text, icon, progress, duration })  // icon: optional name from ISL_ICONS -> { update(patch), close() }
   progress: 0-100 shows the bar and keeps the island open until you update/close it. */
function showIsland(opts) {
  const id = ++islSeq;
  const state = { ...opts };
  islDuration = state.progress != null ? 0 : (state.duration ?? 3200);
  const wasOpen = island.classList.contains('show');
  paintIsland(state);
  if (wasOpen) { // morph: replay the content swap
    islCard.classList.remove('swap'); void islCard.offsetWidth; islCard.classList.add('swap');
  }
  island.classList.add('show');
  armIsland();
  return {
    update(patch) {
      if (id !== islSeq) return;
      Object.assign(state, patch);
      islDuration = state.progress != null ? 0 : (state.duration ?? 3200);
      paintIsland(state);
      if (patch.type || patch.title) { islCard.classList.remove('swap'); void islCard.offsetWidth; islCard.classList.add('swap'); }
      armIsland();
    },
    close() { if (id === islSeq) hideIsland(); },
  };
}
$('.isl-x', island).addEventListener('click', hideIsland);
island.addEventListener('mouseenter', () => clearTimeout(islTimer));
island.addEventListener('mouseleave', armIsland);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && island.classList.contains('show') && !(lightbox && lightbox.open)) hideIsland(); });

const say = (key, type, extra = {}) => { const [title, text] = MSG[lang][key]; return showIsland({ type, title, text, ...extra }); };

/* ---------- Typing effect ---------- */
(function typing() {
  const el = $('#typed');
  if (reduceMotion) return; // keep the static role
  let role = 0, chars = ROLES.en[0].length, deleting = true, timer;
  function tick() {
    const roles = ROLES[lang];
    const word = roles[role];
    chars += deleting ? -1 : 1;
    el.textContent = word.slice(0, chars);
    let delay = deleting ? 45 : 100;
    if (!deleting && chars === word.length) { deleting = true; delay = 1800; }
    else if (deleting && chars === 0) { deleting = false; role = (role + 1) % roles.length; delay = 300; }
    timer = setTimeout(tick, delay);
  }
  restartTyping = () => { clearTimeout(timer); role = 0; chars = 0; deleting = false; el.textContent = ''; tick(); };
  tick();
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
  $('#lb-count').textContent = current.length > 1 ? `${index + 1} / ${current.length}` : '';
  $('#lb-prev').hidden = $('#lb-next').hidden = current.length < 2;
  [1, -1].forEach(d => { const n = current[(index + d + current.length) % current.length]; if (n) new Image().src = n.src; });
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

let touchX = null;
lightbox.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', e => {
  if (touchX === null || current.length < 2) return;
  const dx = e.changedTouches[0].clientX - touchX; touchX = null;
  if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
}, { passive: true });
$('#lb-prev').addEventListener('click', () => step(-1));
$('#lb-next').addEventListener('click', () => step(1));
$('#lb-close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.close(); });
document.addEventListener('keydown', e => {
  if (!lightbox.open) return;
  if (e.key === 'ArrowLeft') step(-1);
  if (e.key === 'ArrowRight') step(1);
});

/* ---------- Certificate flip (front / back) ---------- */
const certFlip = $('#certFlip');
const certPages = [
  { src: 'images/cisco-front.jpg', alt: 'Cisco Networking Basics certificate, front' },
  { src: 'images/cisco-back.jpg', alt: 'Cisco Networking Basics certificate, back' },
];
const flipCert = () => certFlip.classList.toggle('flipped');
certFlip.addEventListener('click', flipCert);
$('#cert-flip-btn').addEventListener('click', flipCert);
$('#cert-full-btn').addEventListener('click', () => openLightbox(certPages, certFlip.classList.contains('flipped') ? 1 : 0));

/* ---------- Certificate images (lightbox) ---------- */
$$('[data-cert-img]').forEach(btn => {
  btn.addEventListener('click', () => openLightbox([{ src: btn.dataset.certImg, alt: btn.dataset.certAlt }], 0));
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
  try { await navigator.clipboard.writeText(EMAIL); say('copied', 'success'); }
  catch (e) { say('copyFail', 'error'); }
});
$('#share').addEventListener('click', async () => {
  try {
    if (navigator.share) await navigator.share({ title: 'Amr Essam — Portfolio', url: SITE });
    else { await navigator.clipboard.writeText(SITE); say('linkCopied', 'success'); }
  } catch (e) { /* share cancelled */ }
});

const topBtn = $('#top');
window.addEventListener('scroll', () => topBtn.classList.toggle('show', scrollY > 500), { passive: true });
topBtn.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

/* ---------- CV download with live progress ----------
   Streams the file with fetch() so the island shows the real bytes received.
   The bar is eased over at least ~0.9s so a very fast download is still visible.
   If fetch is unavailable (e.g. opened from file://) it falls back to a normal download. */
let cvBusy = false;
const fmtSize = (n, unit) => unit === 'MB' ? (n / 1048576).toFixed(1) : Math.max(1, Math.round(n / 1024));
const sleep = ms => new Promise(r => setTimeout(r, ms));
function saveFile(url, name) {
  const a = document.createElement('a');
  a.href = url; a.download = name; document.body.append(a); a.click(); a.remove();
}
async function downloadCV(href) {
  if (cvBusy) return;
  cvBusy = true;
  const name = href.split('/').pop();
  const note = showIsland({ type: 'download', title: MSG[lang].cv[0], text: name, progress: 0 });
  const t0 = performance.now(), MIN = 900;
  let loaded = 0, total = 0, shown = 0, finished = false, lastText = '';

  (function render() {
    const elapsed = performance.now() - t0;
    const real = total ? Math.min(loaded / total, .99) : Math.min(elapsed / 2500, .9);
    shown = Math.max(shown, Math.min(finished ? 1 : real, elapsed / MIN));
    const pct = Math.round(shown * 100);
    const unit = total >= 1048576 ? 'MB' : 'KB';
    const text = total
      ? `${pct}% · ${fmtSize(Math.min(loaded, total), unit)} / ${fmtSize(total, unit)} ${unit}`
      : `${pct}%`;
    if (text !== lastText) { lastText = text; note.update({ progress: pct, text }); }
    if (!(finished && shown >= 1)) setTimeout(render, 50);
  })();

  let blob = null;
  try {
    const res = await fetch(href);
    if (!res.ok || !res.body) throw new Error('bad response');
    total = res.headers.get('content-encoding') ? 0 : +res.headers.get('content-length') || 0;
    const reader = res.body.getReader(), chunks = [];
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value); loaded += value.length;
    }
    blob = new Blob(chunks, { type: 'application/pdf' });
  } catch (e) { /* fall back to a plain download below */ }

  finished = true;
  while (shown < 1) await sleep(30);
  await sleep(250); // let the full bar be seen

  if (blob) {
    const url = URL.createObjectURL(blob);
    saveFile(url, name);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    const [title, text] = MSG[lang].cvDone;
    note.update({ type: 'success', title, text, progress: null });
  } else {
    saveFile(href, name);
    const [title, text] = MSG[lang].cvStarted;
    note.update({ type: 'success', title, text, progress: null });
  }
  cvBusy = false;
}
/* skill cards open the tool's official site; the island says where */
$$('a.skill').forEach(a => a.addEventListener('click', () => {
  showIsland({ type: 'message', title: MSG[lang].site[0], text: a.hostname.replace(/^www\./, ''), icon: 'external', duration: 2200 });
}));

/* CV buttons open the chooser (ATS / designed). Without JS the link still downloads the ATS version. */
$$('a[download]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); a.hasAttribute('data-cv-choose') ? openCvModal(a) : downloadCV(a.getAttribute('href')); }));

/* welcome island, once per browser session, after the loader has faded */
try {
  if (!sessionStorage.getItem('welcomed')) {
    sessionStorage.setItem('welcomed', '1');
    setTimeout(() => say('welcome', 'message', { icon: 'sparkles', duration: 5000 }), 1900);
  }
} catch (e) {}

/* ---------- Mobile menu ---------- */
const menuBtn = $('#menu-btn'), menu = $('#menu');
const setMenu = open => {
  menu.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
};
menuBtn.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
addEventListener('resize', () => { if (innerWidth >= 800) setMenu(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); menuBtn.focus(); } });
document.addEventListener('click', e => { if (menu.classList.contains('open') && !e.target.closest('nav')) setMenu(false); });

/* ---------- Scroll progress + active section in the nav ---------- */
const bar = $('#progress');
const onScroll = () => {
  const h = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${h > 0 ? Math.min(scrollY / h, 1) : 0})`;
};
addEventListener('scroll', onScroll, { passive: true }); onScroll();
{
  const links = $$('.links > a');
  const secs = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
  let ticking = false;
  const spy = () => {
    ticking = false;
    const atEnd = innerHeight + scrollY >= document.documentElement.scrollHeight - 4;
    let cur = null;
    secs.forEach(sec => { if (sec.getBoundingClientRect().top <= innerHeight * 0.4) cur = sec; });
    if (atEnd) cur = secs[secs.length - 1];
    links.forEach(a => {
      const on = !!cur && a.getAttribute('href') === '#' + cur.id;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(spy); } }, { passive: true });
  addEventListener('resize', spy);
  spy();
}

/* ---------- Playable game: HAND PLATFORMER ----------
   The game lives in play/hand-platformer/ (same origin) and opens in an overlay. It talks to this page with postMessage:
   level / over / win / saved / escape. Scores and the leaderboard are shared through localStorage (same origin),
   so the card above always shows the latest results, even from another tab. Nothing loads until the first click. */
const GAME_URL = 'play/hand-platformer/index.html?embed=1';
const gm = $('#game-modal'), gmFrame = $('#gm-frame'), gmStage = $('#gm-stage'), gmLive = $('#gm-live');
const gmLoad = $('#gm-loading'), gmClose = $('#gm-close'), gmFull = $('#gm-full');
const gmBackground = () => $$('nav, main, footer, #top');
let gmOpener = null;

function readGame() {
  try {
    const lb = JSON.parse(localStorage.getItem('hcp_lb'));
    return { best: +localStorage.getItem('hcp_best') || 0, lb: Array.isArray(lb) ? lb : [] };
  } catch (e) { return { best: 0, lb: [] }; }
}
function renderBoard() {
  const { best, lb } = readGame();
  $$('[data-game-best]').forEach(el => { el.textContent = best; });
  $$('[data-game-chip]').forEach(el => { el.hidden = !best; });
  const list = $('#gm-lb');
  list.replaceChildren(...lb.slice(0, 5).map(r => {
    const li = document.createElement('li'), name = document.createElement('span'), pts = document.createElement('b');
    name.textContent = String(r.n ?? 'Player').slice(0, 12); pts.textContent = +r.s || 0;
    li.append(name, pts); return li;
  }));
  $('#gm-none').hidden = lb.length > 0;
}

function openGame(from) {
  if (!gm.hidden) return;
  gmOpener = from || document.activeElement;
  gmLive.textContent = '';
  gmLoad.hidden = false;
  gm.hidden = false;
  document.body.classList.add('game-open');
  gmBackground().forEach(el => { el.inert = true; });
  gmFull.hidden = !document.fullscreenEnabled;
  gmFrame.src = GAME_URL; // the game (and MediaPipe) only download now
  gmClose.focus();
}
function closeGame() {
  if (gm.hidden) return;
  if (document.fullscreenElement) document.exitFullscreen();
  gm.hidden = true;
  gmFrame.src = 'about:blank'; // unloading the frame also switches the camera off
  document.body.classList.remove('game-open');
  gmBackground().forEach(el => { el.inert = false; });
  if (gmOpener && gmOpener.focus) gmOpener.focus();
  renderBoard();
}
gmFrame.addEventListener('load', () => {
  if (gm.hidden || gmFrame.getAttribute('src') !== GAME_URL) return;
  gmLoad.hidden = true;
  gmFrame.focus();
  try { gmFrame.contentWindow.focus(); } catch (e) {}
});
$$('[data-play]').forEach(b => b.addEventListener('click', () => openGame(b)));
gmClose.addEventListener('click', closeGame);
gmFull.addEventListener('click', () => { if (document.fullscreenElement) document.exitFullscreen(); else gmStage.requestFullscreen?.(); });
gm.addEventListener('click', e => { if (e.target === gm) closeGame(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !gm.hidden && !document.fullscreenElement) closeGame(); });

addEventListener('message', e => {
  const m = e.data;
  if (e.origin !== location.origin || e.source !== gmFrame.contentWindow || !m || m.src !== 'hcp') return;
  const t = MSG[lang];
  const toast = (key, type, score) => showIsland({ type, icon: 'gamepad', title: t[key][0], text: `${t[key][1]}${score != null ? ': ' + score : ''}`, duration: 4200 });
  switch (m.type) {
    case 'ready': gmLoad.hidden = true; break;
    case 'level': gmLive.textContent = `🎮 ${m.level}/${m.of}  ★ ${m.score}`; break;
    case 'over': renderBoard(); (m.score > 0 && m.score >= m.best) ? toast('gameBest', 'success', m.score) : toast('gameOver', 'error', m.score); break;
    case 'win': renderBoard(); (m.score >= m.best) ? toast('gameBest', 'success', m.score) : toast('gameWin', 'success', m.score); break;
    case 'saved': renderBoard(); toast('gameSaved', 'success'); break;
    case 'best': renderBoard(); break;
    case 'escape': closeGame(); break;
  }
});
addEventListener('storage', e => { if (e.key === 'hcp_best' || e.key === 'hcp_lb') renderBoard(); });
renderBoard();
/* share link: https://…/#play opens the game straight away */
if (location.hash === '#play') setTimeout(() => openGame(), 1500);

/* ---------- Arc-lightning hover button (.btn.arc) ----------
   Two jagged bolts leave the top corners and chase the pointer while it hovers the button.
   Touch: a short flash at the tap point. Keyboard focus: bolts aim at the centre. Reduced motion: border glow only. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  $$('.btn.arc').forEach(btn => {
    const cv = document.createElement('canvas'); cv.setAttribute('aria-hidden', 'true'); btn.prepend(cv);
    const ctx = cv.getContext('2d');
    let w = 0, h = 0, raf = 0, last = 0, tx = 0, ty = 0, on = false, color = '#00D4E8', core = '#E8FDFF';
    const size = () => { const r = btn.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2); w = r.width; h = r.height; cv.width = w * d; cv.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    const bolt = (x0, y0, x1, y1, amp) => {            // midpoint displacement = a jagged line
      let p = [[x0, y0], [x1, y1]];
      for (let i = 0; i < 5; i++) {
        const n = [p[0]];
        for (let k = 1; k < p.length; k++) {
          const [ax, ay] = p[k - 1], [bx, by] = p[k], dx = bx - ax, dy = by - ay, l = Math.hypot(dx, dy) || 1, o = (Math.random() - .5) * amp;
          n.push([(ax + bx) / 2 - dy / l * o, (ay + by) / 2 + dx / l * o], p[k]);
        }
        p = n; amp *= .55;
      }
      return p;
    };
    const line = (p, lw, a, blur, c) => { ctx.beginPath(); p.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.lineJoin = 'round'; ctx.lineWidth = lw; ctx.globalAlpha = a; ctx.shadowBlur = blur; ctx.shadowColor = color; ctx.strokeStyle = c; ctx.stroke(); };
    const tick = t => {
      if (!on) return;
      raf = requestAnimationFrame(tick);
      if (t - last < 70) return; last = t;               // ~14 fps flicker reads as electricity
      ctx.clearRect(0, 0, w, h);
      const amp = Math.max(10, Math.min(w, h) * .55);
      [[3, 3], [w - 3, 3]].forEach(([ox, oy]) => { const p = bolt(ox, oy, tx, ty, amp); line(p, 3, .35, 10, color); line(p, 1.2, .95, 4, core); });
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    };
    const start = (x, y) => { if (reduce) return; size(); color = getComputedStyle(btn).getPropertyValue('--accent').trim() || color; core = document.documentElement.dataset.theme === 'light' ? '#04323a' : '#E8FDFF'; tx = x; ty = y; on = true; cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); };
    const stop = () => { on = false; cancelAnimationFrame(raf); ctx.clearRect(0, 0, w, h); };
    const aim = e => { const r = btn.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top; };
    btn.addEventListener('pointerenter', e => { const r = btn.getBoundingClientRect(); start(e.clientX - r.left, e.clientY - r.top); });
    btn.addEventListener('pointermove', aim);
    btn.addEventListener('pointerleave', stop);
    btn.addEventListener('pointerdown', e => { if (e.pointerType === 'touch') { const r = btn.getBoundingClientRect(); start(e.clientX - r.left, e.clientY - r.top); setTimeout(stop, 380); } });
    btn.addEventListener('focus', () => { if (btn.matches(':focus-visible')) { const r = btn.getBoundingClientRect(); start(r.width / 2, r.height / 2); } });
    btn.addEventListener('blur', stop);
    btn.addEventListener('click', stop);
  });
})();


/* ---------- CV chooser modal ---------- */
const cvModal = $('#cvModal');
let cvOpener = null;
const cvBackground = () => $$('nav, main, footer, #top');
function openCvModal(from) {
  if (!cvModal.hidden) return;
  cvOpener = from || document.activeElement;
  cvModal.hidden = false;
  document.body.classList.add('game-open');           // same scroll lock as the game overlay
  cvBackground().forEach(el => { el.inert = true; });
  $('.cv-option', cvModal).focus();
}
function closeCvModal(restore = true) {
  if (cvModal.hidden) return;
  cvModal.hidden = true;
  document.body.classList.remove('game-open');
  cvBackground().forEach(el => { el.inert = false; });
  if (restore && cvOpener && cvOpener.focus) cvOpener.focus();
}
$$('.cv-option', cvModal).forEach(b => b.addEventListener('click', () => {
  const file = b.dataset.cv;
  closeCvModal(false);                                 // close first so the progress island is visible
  downloadCV(file);
}));
$('#cvm-close').addEventListener('click', () => closeCvModal());
cvModal.addEventListener('click', e => { if (e.target === cvModal) closeCvModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !cvModal.hidden) closeCvModal(); });
