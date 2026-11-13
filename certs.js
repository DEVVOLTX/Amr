/* Certificates: opens the detail sheet for a folder card, handles flip / fullscreen / copy / share.
   Self-contained: reads each card's data-* attributes, so adding a certificate = adding one card in index.html. */
(function () {
  "use strict";
  var dlg = document.getElementById("certDialog");
  var list = document.getElementById("cert-list");
  if (!dlg || !list || typeof dlg.showModal !== "function") return;

  /* UI strings (the card text itself is translated by i18n.js) */
  var T = {
    en: { image: "Image", full: "Fullscreen", flip: "Flip", share: "Share on X", link: "Copy certificate link", id: "Copy ID", copied: "Copied", verify: "Verify", close: "Close" },
    ar: { image: "صورة", full: "ملء الشاشة", flip: "اقلب", share: "شارك على X", link: "انسخ رابط الشهادة", id: "نسخ الـ ID", copied: "تم النسخ", verify: "تحقق", close: "إغلاق" },
    it: { image: "Immagine", full: "Schermo intero", flip: "Gira", share: "Condividi su X", link: "Copia il link del certificato", id: "Copia ID", copied: "Copiato", verify: "Verifica", close: "Chiudi" },
    es: { image: "Imagen", full: "Pantalla completa", flip: "Girar", share: "Compartir en X", link: "Copiar enlace del certificado", id: "Copiar ID", copied: "Copiado", verify: "Verificar", close: "Cerrar" },
    de: { image: "Bild", full: "Vollbild", flip: "Drehen", share: "Auf X teilen", link: "Zertifikatslink kopieren", id: "ID kopieren", copied: "Kopiert", verify: "Prüfen", close: "Schließen" },
    fr: { image: "Image", full: "Plein écran", flip: "Retourner", share: "Partager sur X", link: "Copier le lien du certificat", id: "Copier l’ID", copied: "Copié", verify: "Vérifier", close: "Fermer" },
    ru: { image: "Картинка", full: "Во весь экран", flip: "Перевернуть", share: "Поделиться в X", link: "Скопировать ссылку на сертификат", id: "Копировать ID", copied: "Скопировано", verify: "Проверить", close: "Закрыть" },
    ko: { image: "이미지", full: "전체 화면", flip: "뒤집기", share: "X에 공유", link: "인증서 링크 복사", id: "ID 복사", copied: "복사됨", verify: "확인", close: "닫기" },
    ja: { image: "画像", full: "全画面", flip: "裏返す", share: "X で共有", link: "証明書のリンクをコピー", id: "ID をコピー", copied: "コピーしました", verify: "検証", close: "閉じる" },
    zh: { image: "图片", full: "全屏", flip: "翻转", share: "分享到 X", link: "复制证书链接", id: "复制 ID", copied: "已复制", verify: "验证", close: "关闭" }
  };
  function t(k) {
    var l = (document.documentElement.lang || "en").slice(0, 2);
    return (T[l] || T.en)[k] || T.en[k];
  }
  function applyLang() {
    dlg.querySelectorAll("[data-ct]").forEach(function (el) {
      var s = t(el.getAttribute("data-ct"));
      if (el.hasAttribute("data-ct-label")) el.setAttribute("aria-label", s);
      else el.textContent = s;
    });
  }
  new MutationObserver(applyLang).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  applyLang();

  var q = function (s) { return dlg.querySelector(s); };
  var el = {
    cat: q(".cd-cat"), title: q(".cd-title"), sub: q(".cd-sub"), tags: q(".cd-tags"),
    stage: q(".cd-stage"), front: q("img.front"), back: q("img.back"),
    dl: q(".cd-dl"), full: q(".cd-full"), flip: q(".cd-flip"),
    note: q(".cd-note"), id: q(".cd-id"), idText: q(".cd-id-text"),
    verify: q(".cd-verify"), share: q(".cd-share"), link: q(".cd-link"), x: q(".cd-x"), grab: q(".cd-grab")
  };
  var cur = null, opener = null, timers = [];

  function flash(btn) {
    var span = btn.querySelector("[data-ct]");
    var key = span.getAttribute("data-ct"), was = t(key);
    span.textContent = t("copied");
    btn.classList.add("done");
    timers.push(setTimeout(function () { span.textContent = was; btn.classList.remove("done"); }, 1600));
  }
  function copy(text, btn) {
    function ok() { flash(btn); }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(ok, fallback);
    } else fallback();
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta); ta.select();
      try { if (document.execCommand("copy")) ok(); } catch (e) {}
      ta.remove();
    }
  }
  function certUrl() {
    return location.origin + location.pathname + "?cert=" + encodeURIComponent(cur.key) + "#certificates";
  }

  function open(btn) {
    var d = btn.dataset, card = btn.closest(".cf");
    cur = { key: d.cert, title: d.title, issuer: d.issuer, img: d.img, id: d.id || "", verify: d.verify || "" };
    opener = btn;
    el.cat.textContent = card.querySelector(".cf-cat").textContent;
    el.title.textContent = d.title;
    el.sub.textContent = d.issuer + " · " + card.querySelector("time").textContent;
    el.tags.textContent = "";
    (d.tags ? d.tags.split("|") : []).forEach(function (s) {
      var li = document.createElement("li"); li.textContent = s; el.tags.appendChild(li);
    });
    el.tags.hidden = !d.tags;
    el.front.src = d.img; el.front.alt = d.alt || d.title;
    el.stage.dataset.side = "front";
    if (d.back) { el.back.src = d.back; el.back.alt = (d.alt || d.title) + " (back)"; el.back.hidden = false; }
    else { el.back.removeAttribute("src"); el.back.hidden = true; }
    el.flip.hidden = !d.back;
    el.dl.href = d.img;
    el.dl.setAttribute("download", d.cert + ".webp");
    el.note.textContent = d.note || "";
    el.id.hidden = !d.id;
    el.idText.textContent = d.id ? "ID: " + d.id.slice(0, 8) + "…" + d.id.slice(-4) : "";
    el.verify.hidden = !d.verify;
    if (d.verify) el.verify.href = d.verify;
    dlg.showModal();
    dlg.scrollTop = 0;
  }
  function close() { if (dlg.open) dlg.close(); }

  list.addEventListener("click", function (e) {
    var b = e.target.closest(".cf-btn");
    if (b) open(b);
  });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) close(); }); /* backdrop */
  el.x.addEventListener("click", close);
  dlg.addEventListener("close", function () {
    timers.forEach(clearTimeout); timers = [];
    if (document.fullscreenElement) document.exitFullscreen();
    dlg.querySelectorAll(".done").forEach(function (n) { n.classList.remove("done"); });
    applyLang();
    if (opener) opener.focus({ preventScroll: true });
  });

  el.flip.addEventListener("click", function () {
    el.stage.dataset.side = el.stage.dataset.side === "back" ? "front" : "back";
  });
  el.full.addEventListener("click", function () {
    if (el.stage.requestFullscreen) el.stage.requestFullscreen().catch(function () { window.open(cur.img, "_blank", "noopener"); });
    else window.open(cur.img, "_blank", "noopener");
  });
  el.id.addEventListener("click", function () { copy(cur.id, el.id); });
  el.link.addEventListener("click", function () { copy(certUrl(), el.link); });
  el.share.addEventListener("click", function () {
    var u = "https://x.com/intent/post?text=" + encodeURIComponent(cur.title + " — " + cur.issuer) + "&url=" + encodeURIComponent(certUrl());
    window.open(u, "_blank", "noopener");
  });

  /* drag the grab handle down to close (phones) */
  var y0 = null;
  el.grab.addEventListener("pointerdown", function (e) { y0 = e.clientY; el.grab.setPointerCapture(e.pointerId); });
  el.grab.addEventListener("pointermove", function (e) {
    if (y0 === null) return;
    var dy = Math.max(0, e.clientY - y0);
    dlg.style.transform = "translateY(" + dy + "px)";
  });
  function end(e) {
    if (y0 === null) return;
    var dy = e.clientY - y0; y0 = null;
    dlg.style.transform = "";
    if (dy > 90) close();
  }
  el.grab.addEventListener("pointerup", end);
  el.grab.addEventListener("pointercancel", function () { y0 = null; dlg.style.transform = ""; });

  /* ?cert=<key> opens that certificate straight away (the link from "Copy certificate link") */
  try {
    var k = new URLSearchParams(location.search).get("cert");
    if (k) {
      var b = list.querySelector('.cf-btn[data-cert="' + CSS.escape(k) + '"]');
      if (b) {
        document.getElementById("certificates").scrollIntoView();
        open(b);
      }
    }
  } catch (e) {}
})();
