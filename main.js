'use strict';
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const EMAIL = 'amrt6509@gmail.com';
const SITE = 'https://devvoltx.github.io/Amr/';

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

/* ---------- Language (EN / AR) ---------- */
let lang = root.lang === 'ar' ? 'ar' : 'en';
const ROLES = {
  en: ['Full-Stack Developer', 'Game Developer', 'Cybersecurity Enthusiast', 'Graphic Designer'],
  ar: ['مطوّر Full-Stack', 'مطوّر ألعاب', 'مهتم بالأمن السيبراني', 'مصمم جرافيك'],
};
const AR = {
  nav_about: 'نبذة', nav_projects: 'المشاريع', nav_skills: 'المهارات', nav_certs: 'الشهادات', nav_contact: 'تواصل',
  nav_cv: 'السيرة ↓',
  tagline: 'مهندس برمجيات ومطوّر مبدع',
  lead: 'طالب هندسة برمجيات من كفر الدوار، مصر. أبني تجارب رقمية غامرة وأنظمة آمنة ومشاريع بصرية إبداعية.',
  hire: 'وظّفني ✉', download_cv: 'تحميل السيرة الذاتية ↓', view_work: 'شاهد أعمالي ←',
  stat_projects: 'مشاريع', stat_certs: 'شهادات', stat_logos: 'شعارات', stat_cars: 'بوسترات سيارات',
  about_title: 'أبني أنظمة قوية، وأصنع ألعابًا غامرة، <span>وأكسر الحصون الرقمية.</span>',
  about_text: 'خبرتي تغطي الـ stack كاملًا، من واجهات المستخدم إلى معماريات الباك إند ومحركات الألعاب. أتعامل مع الهندسة كوسيلة لصنع تجارب تفاعلية وبنية تحتية آمنة، وليس مجرد كود.',
  sk_web: 'الويب واللغات', sk_tools: 'الأدوات والمحركات', sk_sec: 'الأمن السيبراني',
  contact_big: 'لنبنِ<br><span>المستقبل معًا</span>',
  copy_email: 'نسخ الإيميل', share: 'مشاركة البورتفوليو ⤢',
};
const i18nEls = $$('[data-i18n]');
i18nEls.forEach(el => { el.dataset.en = el.innerHTML; });
const langBtn = $('#lang');
function setLang(next) {
  lang = next;
  root.lang = next;
  root.dir = next === 'ar' ? 'rtl' : 'ltr';
  i18nEls.forEach(el => { el.innerHTML = next === 'ar' ? AR[el.dataset.i18n] : el.dataset.en; });
  langBtn.textContent = next === 'ar' ? 'EN' : 'AR';
  try { localStorage.setItem('lang', next); } catch (e) {}
}
langBtn.addEventListener('click', () => {
  setLang(lang === 'ar' ? 'en' : 'ar');
  if (typeof say === 'function') say(lang === 'ar' ? 'langAr' : 'langEn', 'message', { icon: 'globe', duration: 1800 });
});
if (lang === 'ar') setLang('ar'); else langBtn.textContent = 'AR';

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

const MSG = {
  en: {
    site: ['Opening official site', ''],
    welcome: ['Welcome', 'Thanks for visiting my portfolio.'],
    copied: ['Email copied', 'amrt6509@gmail.com is on your clipboard.'],
    copyFail: ['Couldn’t copy', 'Email: amrt6509@gmail.com'],
    linkCopied: ['Link copied', 'Portfolio link is on your clipboard.'],
    cv: ['Downloading CV', 'amr_essam_cv.pdf'],
    cvDone: ['CV downloaded', 'Saved to your downloads.'],
    cvStarted: ['Download started', 'Check your downloads.'],
    dark: ['Dark mode', 'Easy on the eyes.'], light: ['Light mode', 'Bright and clean.'],
    langEn: ['Language: English', 'Switched to English.'], langAr: ['اللغة: العربية', 'تم التبديل إلى العربية.'],
  },
  ar: {
    site: ['فتح الموقع الرسمي', ''],
    welcome: ['أهلًا بيك', 'شكرًا لزيارتك البورتفوليو.'],
    copied: ['تم نسخ الإيميل', 'amrt6509@gmail.com اتنسخ.'],
    copyFail: ['تعذّر النسخ', 'الإيميل: amrt6509@gmail.com'],
    linkCopied: ['تم نسخ الرابط', 'رابط البورتفوليو اتنسخ.'],
    cv: ['جاري تحميل السيرة الذاتية', 'amr_essam_cv.pdf'],
    cvDone: ['تم تحميل السيرة الذاتية', 'اتحفظت في التنزيلات.'],
    cvStarted: ['بدأ التحميل', 'شوف التنزيلات.'],
    dark: ['الوضع الداكن', 'مريح للعين.'], light: ['الوضع الفاتح', 'ساطع ونظيف.'],
    langEn: ['Language: English', 'Switched to English.'], langAr: ['اللغة: العربية', 'تم التبديل إلى العربية.'],
  },
};
const say = (key, type, extra = {}) => { const [title, text] = MSG[lang][key]; return showIsland({ type, title, text, ...extra }); };

/* ---------- Typing effect ---------- */
(function typing() {
  const el = $('#typed');
  let role = 0, chars = ROLES.en[0].length, deleting = true;
  (function tick() {
    const roles = ROLES[lang];
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

$$('a[download]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); downloadCV(a.getAttribute('href')); }));

/* welcome island, once per browser session, after the loader has faded */
try {
  if (!sessionStorage.getItem('welcomed')) {
    sessionStorage.setItem('welcomed', '1');
    setTimeout(() => say('welcome', 'message', { icon: 'sparkles', duration: 5000 }), 1900);
  }
} catch (e) {}
