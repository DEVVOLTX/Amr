# Themes archive (not linked from the site)

The live site only ships two themes: **Crimson** (default) and **Azure**.
Everything that belonged to the other themes was moved here, untouched, so it can come back later:

| File | What it holds |
| --- | --- |
| `midnight.css`, `matrix.css`, `voltx.css`, `nebula.css`, `toxic.css`, `ember.css`, `light.css` | **One file per theme** — every CSS rule of that theme, cut out of `style.css`, `themes-extra.css` and `chat.css` (Nebula's file also has the pixel-bat styles + keyframes). Rules shared with Crimson/Azure stayed in the live files. |
| `_fonts.css` | The Google Fonts the old themes used (the live site no longer loads them). |
| `teal-theme.css` | The old standalone teal theme sheet (it was already unlinked before the cleanup). |
| `theme-config.js` | The original `THEME_ICO` + `THEMES` objects from `main.js` (all 9 themes). |
| `theme-pills.html` | The 7 theme-menu buttons + the Nebula bat markup. |
| `feedback-themes.txt` | The theme colours / theme list that `feedback.html` used to have. |

Not moved (still in place, harmless): `images/bat-sprite.png` and the toast texts of every theme in `i18n.js`.

## Bring a theme back

1. Move (or link in place) the theme's file, e.g. `themes-archive/matrix.css`, and add
   `<link rel="stylesheet" href="themes-archive/matrix.css" />` in `index.html` next to the `themes/crimson.css` / `themes/azure.css` links
   (after `themes-extra.css`). Add the fonts it needs from `_fonts.css` if any (see that file).
2. `index.html`: paste the theme's button from `theme-pills.html` into `<div class="theme-pills">`.
   For Nebula also paste the bat `<div class="bat-sky">` right after `<body>`.
3. `main.js`: copy the theme's icon (`THEME_ICO`) and entry (`THEMES`) from `theme-config.js`.
   If you restore **Light**, change the `=== "crimson"` check in the button-particle code (search `core =`) back to `"light"` too.
4. The inline script in `index.html` `<head>` and `404.html` only accept `crimson` / `azure` — add the new id there.
   `feedback.html`: add the colours from `feedback-themes.txt` and the id to its `THEMES` map / regex.
5. Restoring *all* themes at once: link every file in this folder (except `teal-theme.css`) as in step 1 and paste the whole `theme-config.js` over the config block in `main.js`.
