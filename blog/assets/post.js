/* Shared article behaviour: reading progress, contents (long posts), share bar, "read next", back-to-top.
   No dependencies. Works from file:// too (no fetch). */
(function () {
  "use strict";
  var d = document, root = d.documentElement;
  var main = d.querySelector("main");
  if (!main) return;
  var ar = (root.lang || "ar").indexOf("ar") === 0;
  var T = ar
    ? { toc: "في المقال", share: "شارك المقال", copy: "نسخ الرابط", copied: "اتنسخ ✓", more: "اقرأ كمان", top: "لأعلى", native: "مشاركة", min: function (n) { return "قراية " + n + " دقايق"; } }
    : { toc: "On this page", share: "Share this post", copy: "Copy link", copied: "Copied ✓", more: "Read next", top: "Back to top", native: "Share", min: function (n) { return n + " min read"; } };
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function el(tag, cls, html) {
    var e = d.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* skip link + landmark id */
  if (!main.id) main.id = "main";
  var skip = el("a", "skip", ar ? "تخطي للمحتوى" : "Skip to content");
  skip.href = "#" + main.id;
  d.body.insertBefore(skip, d.body.firstChild);

  /* reading progress + back to top */
  var rp = el("div", "rp"), bar = el("i");
  rp.setAttribute("aria-hidden", "true");
  rp.appendChild(bar);
  d.body.insertBefore(rp, d.body.firstChild);
  var topBtn = el("button", "totop", "↑");
  topBtn.type = "button";
  topBtn.setAttribute("aria-label", T.top);
  d.body.appendChild(topBtn);
  var ticking = false;
  function update() {
    ticking = false;
    var h = root.scrollHeight - root.clientHeight, y = window.scrollY || root.scrollTop;
    bar.style.transform = "scaleX(" + (h > 0 ? Math.min(1, Math.max(0, y / h)) : 0) + ")";
    topBtn.classList.toggle("on", y > 700);
  }
  addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener("resize", update);
  update();
  topBtn.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });

  /* contents: only for posts with 4+ sections */
  var hs = [].slice.call(main.querySelectorAll("h2"));
  if (hs.length >= 4) {
    var det = el("details", "toc"), ol = el("ol"), links = [];
    det.open = innerWidth > 700;
    det.appendChild(el("summary", null, esc(T.toc)));
    hs.forEach(function (h, i) {
      h.id = h.id || "s" + (i + 1);
      var c = h.cloneNode(true), n = c.querySelector("i"), num = n ? n.textContent : String(i + 1);
      if (n) n.remove();
      var a = el("a", null, "<b></b><span></span>");
      a.href = "#" + h.id;
      a.querySelector("b").textContent = num;
      a.querySelector("span").textContent = c.textContent.trim();
      var li = el("li");
      li.appendChild(a);
      ol.appendChild(li);
      links.push(a);
    });
    det.appendChild(ol);
    var anchor = main.querySelector(".lead") || main.querySelector("header");
    if (anchor) anchor.after(det);
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          links.forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id); });
        });
      }, { rootMargin: "-15% 0px -75% 0px" });
      hs.forEach(function (h) { io.observe(h); });
    }
  }

  /* share bar */
  var url = (d.querySelector("link[rel=canonical]") || {}).href || location.href;
  var h1 = d.querySelector("h1");
  var title = (h1 ? h1.textContent : d.title).replace(/\s+/g, " ").trim();
  var share = el("section", "share");
  share.setAttribute("aria-label", T.share);
  share.appendChild(el("h3", null, esc(T.share)));
  var row = el("div", "share-row");
  function link(label, href) {
    var a = el("a", null, esc(label));
    a.href = href; a.target = "_blank"; a.rel = "noopener noreferrer";
    row.appendChild(a);
  }
  link("WhatsApp", "https://wa.me/?text=" + encodeURIComponent(title + " " + url));
  link("X", "https://twitter.com/intent/tweet?text=" + encodeURIComponent(title) + "&url=" + encodeURIComponent(url));
  link("Facebook", "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url));
  link("LinkedIn", "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(url));
  var toast = el("div", "ptoast");
  toast.setAttribute("role", "status");
  d.body.appendChild(toast);
  var tt;
  function say(msg) {
    toast.textContent = msg; toast.classList.add("on");
    clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove("on"); }, 1800);
  }
  var copy = el("button", null, esc(T.copy));
  copy.type = "button";
  copy.addEventListener("click", function () {
    function fallback() {
      var t = el("textarea"); t.value = url; t.style.position = "fixed"; t.style.opacity = "0";
      d.body.appendChild(t); t.select();
      try { d.execCommand("copy"); say(T.copied); } catch (e) {}
      t.remove();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(function () { say(T.copied); }, fallback);
    else fallback();
  });
  row.appendChild(copy);
  if (navigator.share) {
    var nat = el("button", null, esc(T.native));
    nat.type = "button";
    nat.addEventListener("click", function () { navigator.share({ title: title, url: url }).catch(function () {}); });
    row.insertBefore(nat, row.firstChild);
  }
  share.appendChild(row);
  main.appendChild(share);

  /* read next */
  var posts = window.BLOG_POSTS || [];
  var here = location.pathname.split("/").pop();
  var others = posts.filter(function (p) { return p.slug !== here; });
  if (others.length) {
    var fmt;
    try { fmt = new Intl.DateTimeFormat(ar ? "ar-EG" : "en", { day: "numeric", month: "long", year: "numeric" }); } catch (e) {}
    var more = el("section", "more");
    more.setAttribute("aria-label", T.more);
    more.appendChild(el("h3", null, esc(T.more)));
    var grid = el("div", "more-grid");
    others.slice(0, 3).forEach(function (p) {
      var when = fmt ? fmt.format(new Date(p.date)) : p.date;
      var a = el("a", null,
        '<img src="' + esc(p.img) + '" alt="" loading="lazy" width="640" height="360">' +
        "<span><b>" + esc(p.title) + "</b><small>" + esc(when) + " · " + esc(T.min(p.min)) + "</small></span>");
      a.href = p.slug;
      grid.appendChild(a);
    });
    more.appendChild(grid);
    main.appendChild(more);
  }
})();
