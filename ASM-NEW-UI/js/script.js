// Shared site interactions used by the home page and every module page.
const menuButton = document.querySelector(".menu-toggle");
const mainNavigation = document.querySelector(".main-nav");

if (menuButton && mainNavigation) {
  // Toggle the compact navigation when its menu button is activated.
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    mainNavigation.classList.toggle("open", !isOpen);
  });

  // Close the compact navigation after a visitor chooses a destination.
  mainNavigation.querySelectorAll("a").forEach((link) => {
    // Reset the menu state after a navigation link is selected.
    link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation menu");
      mainNavigation.classList.remove("open");
    });
  });

  // Let keyboard users dismiss the open menu and return focus to its button.
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !mainNavigation.classList.contains("open")) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
    mainNavigation.classList.remove("open");
    menuButton.focus();
  });
}

// Reveal cards as they enter the screen instead of animating everything at once.
const revealItems = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  // Keep all content visible when reveal motion cannot or should not run.
  revealItems.forEach((item) => item.classList.add("visible"));
} else {
  // Reveal each item only once when it enters the viewport.
  const revealObserver = new IntersectionObserver((entries, observer) => {
    // Mark visible entries and stop observing them after their first reveal.
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  // Register each reveal target with the observer.
  revealItems.forEach((item) => revealObserver.observe(item));
}

// Give a simple count-up effect to number cards when they appear.
const counters = document.querySelectorAll("[data-count]");
if (counters.length && !prefersReducedMotion && "IntersectionObserver" in window) {
  // Start a counter animation once its element is visible.
  const counterObserver = new IntersectionObserver((entries, observer) => {
    // Animate only counters that have entered the viewport.
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const target = Number(element.dataset.count);
      const startTime = performance.now();
      const duration = 900;

      // Update the displayed count until it reaches the target value.
      function updateCounter(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        element.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3))).toLocaleString();
        if (progress < 1) requestAnimationFrame(updateCounter);
      }

      requestAnimationFrame(updateCounter);
      observer.unobserve(element);
    });
  }, { threshold: 0.7 });

  // Register all count-up elements with the observer.
  counters.forEach((counter) => counterObserver.observe(counter));
}

// Replace any existing toast with a temporary accessible status message.
function showToast(message) {
  const oldToast = document.querySelector(".toast");
  if (oldToast) oldToast.remove();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.textContent = message;
  document.body.append(toast);
  // Remove the temporary status message after it has been announced.
  window.setTimeout(() => toast.remove(), 3200);
}

// Read a saved list from localStorage and report malformed or unavailable data.
function getSavedList(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    if (!Array.isArray(value)) throw new TypeError(`${key} is not a list`);
    return value;
  } catch (error) {
    // Log malformed or unavailable saved data and tell the visitor it could not be read.
    console.error(`Could not read ${key} from localStorage:`, error);
    showToast("Saved browser data could not be read. Clear site data to reset saved items.");
    return [];
  }
}

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = new Date().getFullYear();
