document.addEventListener("DOMContentLoaded", async () => {
  let config;
  try {
    const response = await fetch("../data/site.json");
    if (!response.ok) throw new Error("Site configuration unavailable.");
    config = await response.json();
  } catch (error) {
    console.error(error);
    return;
  }

  const page = location.pathname.split("/").pop().toLowerCase();
  const brand = config.brand || {};
  const routes = Array.isArray(config.navigation) ? config.navigation : [];
  const header = document.createElement("header");
  header.className = "site-header";

  const shellBrand = document.createElement("div");
  shellBrand.className = "shell-brand";
  const homeLink = document.createElement("a");
  homeLink.href = "home.html";
  homeLink.setAttribute("aria-label", (brand.name || "ASM") + " home");
  const logo = document.createElement("img");
  logo.className = "shell-logo";
  logo.src = brand.logo || "../image/asm-logo.png";
  logo.alt = brand.logoAlt || "ASM College logo";
  homeLink.append(logo);

  const title = document.createElement("div");
  title.className = "shell-title";
  const name = document.createElement("h1");
  name.textContent = brand.name || "ASM NextGen Technical Campus";
  const institute = document.createElement("p");
  institute.textContent = brand.institute || "";
  const locationText = document.createElement("p");
  locationText.className = "shell-location";
  locationText.textContent = brand.location || "";
  title.append(name, institute, locationText);

  const anniversary = document.createElement("img");
  anniversary.className = "shell-anniversary";
  anniversary.src = brand.anniversaryLogo || "../image/42-years.png";
  anniversary.alt = brand.anniversaryAlt || "ASM anniversary";

  shellBrand.append(homeLink, title, anniversary);
  const toggle = document.createElement("button");
  toggle.className = "shell-menu-toggle";
  toggle.type = "button";
  toggle.textContent = "Menu";
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", "site-navigation");

  const nav = document.createElement("nav");
  nav.className = "shell-navigation";
  nav.id = "site-navigation";
  nav.setAttribute("aria-label", "Main navigation");
  routes.forEach((route) => {
    if (!route || !route.href || !route.label) return;
    const link = document.createElement("a");
    link.href = route.href;
    link.textContent = route.label;
    if (page === route.href.toLowerCase()) {
      link.className = "active";
      link.setAttribute("aria-current", "page");
    }
    nav.append(link);
  });
  header.append(shellBrand, toggle, nav);

  document.querySelectorAll("body > header, body > nav").forEach((element) => element.remove());
  document.body.prepend(header);
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  });
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  const year = document.querySelector("#current-year");
  if (year) year.textContent = new Date().getFullYear();
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("shell-visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.1 });
    document.querySelectorAll("main > section").forEach((section) => {
      section.classList.add("shell-reveal");
      observer.observe(section);
    });
  }
});
