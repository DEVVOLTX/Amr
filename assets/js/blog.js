"use strict";
/* Blog section: category filter with live counts + empty state. Cards stay in the HTML (SEO + no-JS friendly). */
(function () {
  var group = document.getElementById("blog-filter");
  var list = document.getElementById("blog-list");
  var empty = document.getElementById("blog-empty");
  if (!group || !list) return;
  var cards = [].slice.call(list.querySelectorAll(".blog-card"));
  var btns = [].slice.call(group.querySelectorAll(".pf"));

  function count(f) {
    return cards.filter(function (c) { return f === "all" || c.dataset.cat === f; }).length;
  }
  btns.forEach(function (b) {
    var em = b.querySelector("em");
    if (em) em.textContent = count(b.dataset.f);
  });

  function apply(f) {
    var shown = 0;
    cards.forEach(function (c) {
      var ok = f === "all" || c.dataset.cat === f;
      c.hidden = !ok;
      c.classList.remove("is-in");
      if (ok) {
        shown++;
        void c.offsetWidth;
        c.classList.add("is-in");
      }
    });
    btns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.f === f)); });
    if (empty) empty.hidden = shown > 0;
  }
  group.addEventListener("click", function (e) {
    var b = e.target.closest(".pf");
    if (b) apply(b.dataset.f);
  });
})();
