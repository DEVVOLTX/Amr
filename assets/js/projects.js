/* Projects: desktop category filter (All / Web / Games / Tools & Apps).
   Works on the featured cards and on the "more projects" rows; phones keep the carousel. */
(() => {
  const bar = document.getElementById("proj-filter");
  if (!bar) return;
  const cards = [...document.querySelectorAll("#projects .feat-card, #projects #more-projects > details")];
  const more = document.getElementById("more-projects");
  const moreBtn = document.getElementById("more-btn");
  const allWrap = document.querySelector("#projects .feat-all");
  const desktop = matchMedia("(min-width: 980px)");
  const section = document.getElementById("projects");
  let current = "all";

  function apply(f) {
    current = f;
    if (section) section.classList.toggle("pj-filtered", f !== "all"); // a filter also reveals the extra card
    bar.querySelectorAll(".pf").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.f === f)));
    let moreMatches = 0;
    cards.forEach((c) => {
      const ok = f === "all" || (c.dataset.cat || "").split(" ").includes(f);
      c.classList.toggle("is-out", !ok);
      if (ok) {
        c.classList.remove("is-in");
        void c.offsetWidth; // restart the entrance animation
        c.classList.add("is-in");
      }
      if (ok && c.parentElement === more) moreMatches++;
      if (!ok && c.tagName === "DETAILS") c.open = false;
    });
    // a filter shows everything that matches, so the "more" list opens by itself
    if (moreBtn && more) {
      const wantOpen = f !== "all" && moreMatches > 0;
      if (wantOpen !== !more.hidden) moreBtn.click();
    }
    if (allWrap) allWrap.classList.toggle("is-out", f !== "all");
    // while a filter is on, the matching extras open by themselves, so the button + divider step aside
    if (moreBtn) moreBtn.classList.toggle("is-out", f !== "all" && desktop.matches);
    sep.classList.toggle("is-out", f !== "all");
  }

  // Desktop: the "View all projects" button sits in the filter row, after a divider (phones keep it under the carousel)
  const sep = document.createElement("span");
  sep.className = "pf-sep";
  sep.setAttribute("aria-hidden", "true");
  function placeMoreBtn(isDesktop) {
    if (!moreBtn || !allWrap) return;
    if (isDesktop) {
      bar.append(sep, moreBtn);
      allWrap.style.display = "none";
    } else {
      allWrap.append(moreBtn);
      sep.remove();
      allWrap.style.display = "";
    }
  }
  placeMoreBtn(desktop.matches);

  bar.addEventListener("click", (e) => {
    const b = e.target.closest(".pf");
    if (b) apply(b.dataset.f);
  });
  // leaving desktop width: show everything again so the phone carousel is complete
  desktop.addEventListener("change", (e) => {
    if (!e.matches && current !== "all") apply("all");
    placeMoreBtn(e.matches);
    if (moreBtn) moreBtn.classList.remove("is-out");
  });
})();
