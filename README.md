# A.ESSAM — Portfolio

[![Live](https://img.shields.io/badge/Live-amressam.is--a.dev-0B5965?style=for-the-badge)](https://amressam.is-a.dev/)
[![GitHub](https://img.shields.io/badge/GitHub-DEVVOLTX-00d4d4?style=for-the-badge)](https://github.com/DEVVOLTX)

> Software Engineering student | Game Developer | Cybersecurity Enthusiast | Full-Stack Developer

Based in **Kafr El Dawar, Egypt** 🇪🇬

## ✨ Features

- **Contact profile card** — a neumorphic card with the avatar, name and role; its button fans the social icons (Instagram, GitHub, TikTok, X, Discord, Telegram) out in an arc
- **2 themes — Crimson (cream paper, default) and Azure (dark app dashboard)** — picked from the pill buttons in the header (icon-only circles on small screens); the choice is remembered. Switching fades smoothly, and the toast messages are translated into all 10 languages. The other themes (Midnight, Matrix, VoltX, Nebula, Toxic, Ember, Light) are archived, unlinked, in `themes-archive/` — see its README to bring them back
- **Aurora hover buttons** — every button gets a rotating conic-gradient border in the theme's accent colors on hover / focus (disabled with reduced-motion)
- **Go Back button** — an animated pill whose arrow chip expands on hover (theme-aware, RTL-aware, reduced-motion safe), used on the 404 page and as the way back from the feedback page
- **Animations switch** — a toggle inside the theme menu (adapted from a Uiverse neo toggle, themed with the accent colour) that turns off decorative motion: bats, ticker, carousel scroll and glows. It follows the system reduced-motion setting on the first visit, then remembers the choice
- **UX pass** — based on the ui-ux-pro-max rules: every accent meets 4.5:1 contrast on its theme background (Light and Nebula accents were adjusted), no text under 12px, 44px touch targets on touch devices, `touch-action: manipulation` on controls, and width/height on all certificate images to avoid layout shift
- **10 languages with a flag dropdown** — English, Arabic (RTL), Italian, Spanish, German, French, Russian, Korean, Japanese and Chinese; follows the browser language on the first visit, then remembers the choice
- **Mobile menu**, scroll-progress bar and active-section highlight in the nav
- **Skills as fanned neon glass cards** — three horizontal boards (languages, tools & engines, cybersecurity): swipe on touch, drag with the mouse, arrows or ← → keys, snap to a card, and the fan tilts and re-centres as you scroll; each card links to the tool's official site
- **Typing role switcher**, animated stats counters and a skills ticker
- **Featured projects carousel** — the five projects with previews (HAND PLATFORMER, ZENITH, AGE CALCULATOR, SALAH STORE, FORGE FITNESS) sit in a scroll-snap carousel with arrows and dots; a "View all projects" button reveals the remaining collapsible project cards
- **Website Updates button** — a floating pill that opens a popup with a link to the WhatsApp channel for update notices (translated into all 10 languages)
- **Collapsible project cards** (native `<details>`, no JS)
- **Playable game inside the portfolio** — HAND PLATFORMER (hand-tracking platformer) opens in an overlay from the hero button or the project card (`/#play` opens it directly). The page and the game talk via `postMessage`: live level/score in the overlay header, score toasts in the notification island, and a best-score + top-5 board on the project card shared through `localStorage`
- **Certificates as folder cards** (`certs.css` + `certs.js`) — each card is a colour-coded folder with the certificate peeking out; tapping it opens a bottom sheet (centred card on desktop) with the full certificate, download, fullscreen, front/back flip (Cisco), copy credential ID, verify link, Share on X and a copy-link that reopens the same certificate (`?cert=js1`). To add one, copy a card in `index.html` and change its `data-*` attributes
- **Galleries** (logos, car posters, client work) with a keyboard- and swipe-friendly lightbox
- **Two CV versions** — the Download CV buttons open a chooser: `amr_essam_cv.pdf` (plain ATS / HR, single column) and `amr_essam_cv_designed.pdf` (dark, in the style of the site); the download shows a live progress "island" notification
- **SEO ready** — Open Graph / Twitter cards, JSON-LD, sitemap, robots, web manifest
- **Accessible** — skip link, visible focus, reduced-motion support, print stylesheet

## 🛠️ Tech

Plain HTML5, CSS3 and vanilla JavaScript — no build step, no dependencies.

## 📂 Structure

```
index.html        page markup
style.css         base styles (tokens, layout, RTL, print) — theme rules live in themes/
themes/            one CSS file per live theme: crimson.css, azure.css
themes-archive/   unlinked: one CSS file per removed theme + JS/markup + how to restore them
i18n.js          language data: flags, translations, toast messages
main.js          language switcher, theme, menu, galleries, lightbox, CV download
404.html          custom not-found page (uses root-absolute paths)
favicon/          icons + web manifest
images/           project, certificate, logo and poster images (+ bat-sprite.png: 4-frame pixel-bat sheet, used only by the archived Nebula theme)
play/hand-platformer/   the game (index.html, PWA manifest, service worker, icons), embedded with ?embed=1
sitemap.xml  robots.txt  CNAME
```

## 🚀 Projects

| #   | Project              | Type                                                     | Tech                       |
| --- | -------------------- | -------------------------------------------------------- | -------------------------- |
| 01  | **ANDERMAGIC**       | 2D platformer                                            | Godot 4.6, GDScript        |
| 02  | **HIDE AND SINK**    | Multiplayer game                                         | Game design, Itch.io       |
| 03  | **CAR-WASH BOOKING** | Full-stack web app                                       | PHP, JS, MySQL             |
| 04  | **SALAH STORE**      | Gaming top-up storefront                                 | HTML/CSS, JS (Arabic UI)   |
| 05  | **AGE CALCULATOR**   | Arabic age & Hijri tool                                  | Vanilla JS                 |
| 06  | **HAND PLATFORMER**  | Webcam hand-controlled platformer (playable on the site) | MediaPipe, Canvas, JS, PWA |
| 07  | **ZENITH**           | Arabic study planner for Thanaweya Amma students        | Next.js, TypeScript, PWA   |

## 🎓 Certificates

1. **TOFAS JavaScript Level 1 & 2** — Sprix Inc. & Hiroshima University
2. **Networking Basics** — Cisco Networking Academy
3. **EF SET English Certificate** — B1 Intermediate
4. **Cybersecurity Fundamentals** — IBM SkillsBuild

## 💻 Run locally

```bash
python -m http.server 8000   # then open http://localhost:8000
```

(Use a server rather than opening the file directly so the CV download and fonts behave like production.)

## 📬 Contact

- **Email**: amrt6509@gmail.com
- **GitHub**: [@DEVVOLTX](https://github.com/DEVVOLTX)
- **Instagram**: [@3am_our1430](https://www.instagram.com/3am_our1430)
- **TikTok**: [@amr_taha62](https://www.tiktok.com/@amr_taha62)
- **X**: [@Amr2043275](https://x.com/Amr2043275)
- **Discord**: `amr_taha62`
- **Telegram**: [@Amour_64x](https://t.me/Amour_64x)

## 📜 License

© 2026 AMR ESSAM. All rights reserved.
