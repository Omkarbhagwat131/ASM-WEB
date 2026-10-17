(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isFacultyPage = /faculty\.html$/i.test(window.location.pathname);
  const skipPageMotion = /(?:^|\/)(?:home|about|faculty)\.html$/i.test(window.location.pathname);

  // Forms get the same gentle entrance motion on every page, including pages
  // whose other page-level animations are intentionally left untouched.
  if (!reduced) {
    document.querySelectorAll("form").forEach((form, index) => {
      form.classList.add("motion-form");
      form.style.setProperty("--form-motion-delay", `${Math.min(index, 3) * 90}ms`);
    });
  }

  if (!isFacultyPage) {
    const footer = document.createElement("footer");
    footer.className = "standard-footer";
    footer.innerHTML = `
      <div class="standard-footer-content">
        <div class="standard-footer-column">
          <h3>Audyogik Shikshan Mandal's NextGen Technical Campus</h3>
          <p>Institute of Management &amp; Engineering</p>
          <p>Committed to quality education, skill development and overall student growth.</p>
        </div>
        <div class="standard-footer-column">
          <h3>Academic Information</h3>
          <p>Computer Applications</p>
          <p>Management Studies</p>
          <p>Engineering &amp; Technology</p>
        </div>
        <div class="standard-footer-column">
          <h3>Contact Information</h3>
          <p>Talegaon Dabhade, Pune, Maharashtra</p>
          <p>Email: admission.asmnextgen@asmedu.org</p>
          <p>Phone: +91 90280 76028</p>
        </div>
      </div>
      <div class="standard-footer-bottom">
        <p>&copy; <span class="standard-footer-year">${new Date().getFullYear()}</span> ASM's NextGen Technical Campus. All Rights Reserved.</p>
        <p>Faculty Department | ASM</p>
      </div>`;
    const currentFooter = document.querySelector("body > footer");
    if (currentFooter) currentFooter.replaceWith(footer);
    else document.querySelector("main")?.insertAdjacentElement("afterend", footer);
  }

  const header = document.querySelector("body > header, .site-header");
  if (!reduced && !skipPageMotion) document.body.classList.add("motion-enabled");
  if (header && !reduced && !skipPageMotion) header.classList.add("motion-header");

  // Give pages without their own Faculty style sheet the same title entrance.
  if (!skipPageMotion) {
    const intro = document.querySelector("main > section:first-child, body > section:first-of-type");
    if (intro) {
      const label = intro.querySelector(".title-label, .eyebrow, .hero-label, .hero-kicker, .section-kicker");
      const title = intro.querySelector("h1, h2");
      const copy = title?.parentElement?.querySelector("p") || intro.querySelector("p");
      label?.classList.add("motion-title-label");
      title?.classList.add("motion-title");
      if (copy && copy !== title) copy.classList.add("motion-title-copy");
    }
  }

  const usesSiteShell = Boolean(document.querySelector('script[src*="site-shell.js"]'));
  const observer = "IntersectionObserver" in window && !reduced
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("motion-visible");
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12 })
    : null;

  const seen = new WeakSet();
  const observeMotion = (root = document) => {
    const selector = "main > section, main article, body > section, main [data-motion-card], main [class*='card']:not(.login-card)";
    const items = root.matches?.(selector)
      ? [root]
      : root.querySelectorAll?.(selector) || [];
    items.forEach((item, index) => {
      const isCard = item.matches("main [class*='card']:not(.login-card)");
      if (seen.has(item) || item.classList.contains("shell-reveal")) return;
      if (isFacultyPage || (skipPageMotion && !isCard)) return;
      if (usesSiteShell && item.matches("main > section")) return;
      seen.add(item);
      item.classList.add("motion-reveal");
      item.style.setProperty("--motion-delay", `${Math.min(index % 4, 3) * 65}ms`);
      if (reduced || !observer) item.classList.add("motion-visible");
      else observer.observe(item);
    });
  };

  observeMotion();
  const main = document.querySelector("main");
  if (main && "MutationObserver" in window) {
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) observeMotion(node);
      }));
    });
    mutations.observe(main, { childList: true, subtree: true });
  }
})();
