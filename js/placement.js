const initializePlacement = () => {
  
  // 1. COUNTER ANIMATION LOGIC
  const counters = document.querySelectorAll(".counter");
  
  counters.forEach((counter) => {
    const target = +counter.getAttribute("data-target");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      counter.innerText = `${target}+`;
      return;
    }
    counter.innerText = "0";

    const updateCounter = () => {
      const count = +counter.innerText.replace("+", "");
      const increment = Math.ceil(target / 50);

      if (count < target) {
        counter.innerText = `${Math.ceil(count + increment)}`;
        setTimeout(updateCounter, 30);
      } else {
        counter.innerText = `${target}+`;
      }
    };

    updateCounter();
  });


  // 2. STUDENT FILTER LOGIC (All / MCA / BCA)
  const filterButtons = document.querySelectorAll(".filter-btn");
  const studentCards = document.querySelectorAll(".student-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => {
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
      });
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      const category = button.getAttribute("data-filter");

      studentCards.forEach((card) => {
        const studentCategory = card.getAttribute("data-category");
        card.hidden = category !== "all" && studentCategory !== category;
      });
    });
  });

  const menuToggle = document.querySelector(".placement-menu-toggle");
  const placementNavigation = document.querySelector("#placement-nav-links");

  if (menuToggle && placementNavigation) {
    const closeMenu = () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
      placementNavigation.classList.remove("is-open");
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen
        ? "Open navigation menu"
        : "Close navigation menu");
      placementNavigation.classList.toggle("is-open", !isOpen);
    });

    placementNavigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 680) closeMenu();
    });
  }

  const backToTopButton = document.querySelector("#placement-back-to-top");
  if (backToTopButton) {
    const updateBackToTopVisibility = () => {
      backToTopButton.classList.toggle("is-visible", window.scrollY > 320);
    };

    window.addEventListener("scroll", updateBackToTopVisibility, { passive: true });
    updateBackToTopVisibility();
    backToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
      });
    });
  }


  // 3. DOWNLOAD BROCHURE VIA PRINT TO PDF
  const brochureBtn = document.getElementById("download-brochure");
  if (brochureBtn) {
    brochureBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.print();
    });
  }

};

document.addEventListener("DOMContentLoaded", () => {
  if (window.homeDataReady) {
    window.homeDataReady.then(initializePlacement);
  } else {
    initializePlacement();
  }
});