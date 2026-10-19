 document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".counter");

  counters.forEach((counter) => {
    const target = +counter.getAttribute("data-target");
    let current = 0;
    const increment = Math.ceil(target / 40);

    const updateCounter = () => {
      current += increment;
      if (current >= target) {
        counter.textContent = `${target}+`;
      } else {
        counter.textContent = `${current}`;
        setTimeout(updateCounter, 40);
      }
    };

    updateCounter();
  });

  setupPlacementCarousel();
});

function setupPlacementCarousel() {
  const carousel = document.querySelector(".placement-carousel");

  if (!carousel) {
    return;
  }

  const slides = Array.from(carousel.querySelectorAll(".placement-slide"));
  const indicators = Array.from(
    carousel.querySelectorAll(".placement-carousel-indicator")
  );
  const pauseButton = carousel.querySelector(
    '[data-carousel-action="toggle"]'
  );
  const mediaPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );
  const rotationDuration = 5000;

  if (slides.length < 2 || indicators.length !== slides.length || !pauseButton) {
    return;
  }

  let activeIndex = 0;
  let rotationTimer = null;
  let rotationPaused = mediaPreference.matches;
  let pointerInside = false;
  let focusInside = false;

  function showSlide(index) {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.hidden = slideIndex !== activeIndex;
    });

    indicators.forEach((indicator, indicatorIndex) => {
      indicator.setAttribute(
        "aria-current",
        String(indicatorIndex === activeIndex)
      );
    });
  }

  function stopRotation() {
    window.clearInterval(rotationTimer);
    rotationTimer = null;
  }

  function startRotation() {
    if (
      rotationPaused ||
      document.hidden ||
      pointerInside ||
      focusInside ||
      rotationTimer !== null
    ) {
      return;
    }

    rotationTimer = window.setInterval(() => {
      showSlide(activeIndex + 1);
    }, rotationDuration);
  }

  function setRotationPaused(paused) {
    rotationPaused = paused;
    pauseButton.textContent = paused ? "Play" : "Pause";
    pauseButton.setAttribute(
      "aria-label",
      paused ? "Start automatic rotation" : "Pause automatic rotation"
    );

    if (paused) {
      stopRotation();
    } else {
      startRotation();
    }
  }

  carousel
    .querySelector('[data-carousel-action="previous"]')
    ?.addEventListener("click", () => showSlide(activeIndex - 1));

  carousel
    .querySelector('[data-carousel-action="next"]')
    ?.addEventListener("click", () => showSlide(activeIndex + 1));

  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => showSlide(index));
  });

  pauseButton.addEventListener("click", () => {
    setRotationPaused(!rotationPaused);
  });

  carousel.addEventListener("mouseenter", () => {
    pointerInside = true;
    stopRotation();
  });

  carousel.addEventListener("mouseleave", () => {
    pointerInside = false;
    startRotation();
  });

  carousel.addEventListener("focusin", () => {
    focusInside = true;
    stopRotation();
  });

  carousel.addEventListener("focusout", (event) => {
    focusInside = carousel.contains(event.relatedTarget);

    if (!focusInside) {
      startRotation();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopRotation();
    } else {
      startRotation();
    }
  });

  mediaPreference.addEventListener("change", (event) => {
    if (event.matches) {
      setRotationPaused(true);
    }
  });

  startRotation();
}