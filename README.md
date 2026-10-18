# A.ESSAM — Portfolio

[![Live](https://img.shields.io/badge/Live-amressam.is--a.dev-0B5965?style=for-the-badge)](https://amressam.is-a.dev/)
[![GitHub](https://img.shields.io/badge/GitHub-DEVVOLTX-00d4d4?style=for-the-badge)](https://github.com/DEVVOLTX)

> Software Engineering student | Game Developer | Cybersecurity Enthusiast | Full-Stack Developer

Based in **Kafr El Dawar, Egypt** 🇪🇬

## ✨ Features

- **4 themes — Midnight, Matrix, VoltX and Light** — picked from flat pill buttons in the header (icon-only circles on small screens); follows the system dark / light on the first visit, then remembers the choice
- **10 languages with a flag dropdown** — English, Arabic (RTL), Italian, Spanish, German, French, Russian, Korean, Japanese and Chinese; follows the browser language on the first visit, then remembers the choice
- **Mobile menu**, scroll-progress bar and active-section highlight in the nav
- **Skills as fanned neon glass cards** — three horizontal boards (languages, tools & engines, cybersecurity): swipe on touch, drag with the mouse, arrows or ← → keys, snap to a card, and the fan tilts and re-centres as you scroll; each card links to the tool's official site
- **Typing role switcher**, animated stats counters and a skills ticker
- **Collapsible project cards** (native `<details>`, no JS)
- **Playable game inside the portfolio** — HAND PLATFORMER (hand-tracking platformer) opens in an overlay from the hero button or the project card (`/#play` opens it directly). The page and the game talk via `postMessage`: live level/score in the overlay header, score toasts in the notification island, and a best-score + top-5 board on the project card shared through `localStorage`
- **Certificates** with verify links, a front/back flip card and a fullscreen viewer
- **Galleries** (logos, car posters, client work) with a keyboard- and swipe-friendly lightbox
- **Two CV versions** — the Download CV buttons open a chooser: `amr_essam_cv.pdf` (plain ATS / HR, single column) and `amr_essam_cv_designed.pdf` (dark, in the style of the site); the download shows a live progress "island" notification
- **SEO ready** — Open Graph / Twitter cards, JSON-LD, sitemap, robots, web manifest
- **Accessible** — skip link, visible focus, reduced-motion support, print stylesheet

## 🛠️ Tech

Plain HTML5, CSS3 and vanilla JavaScript — no build step, no dependencies.

## 📂 Structure

```
index.html        page markup
style.css         all styles (themes, RTL, print)
i18n.js          language data: flags, translations, toast messages
main.js          language switcher, theme, menu, galleries, lightbox, CV download
404.html          custom not-found page (uses root-absolute paths)
favicon/          icons + web manifest
images/           project, certificate, logo and poster images
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
