// The campus welcome page links the shared motion, counters and navigation behavior.
// Assign each home card its entrance order and add its pointer interactions.
document.querySelectorAll(".home-module").forEach((card, index) => {
  // Tilt the hovered card slightly while respecting reduced-motion preferences.
  card.addEventListener("pointermove", (event) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = card.getBoundingClientRect();
    const moveX = (event.clientX - bounds.left - bounds.width / 2) / 24;
    const moveY = (event.clientY - bounds.top - bounds.height / 2) / 24;
    card.style.setProperty("--pointer-x", `${moveX}px`);
    card.style.setProperty("--pointer-y", `${moveY}px`);
  });

  // Clear the temporary pointer offsets when the pointer leaves a card.
  card.addEventListener("pointerleave", () => {
    card.style.removeProperty("--pointer-x");
    card.style.removeProperty("--pointer-y");
  });

  card.style.setProperty("--card-order", index);
});
