(() => {
const menuToggle = document.querySelector(".menu-toggle");
const backToTopButton = document.querySelector("#home-back-to-top");

if (backToTopButton) {
  const updateBackToTopVisibility = () => {
    const isVisible = window.scrollY > 300;
    backToTopButton.hidden = !isVisible;
    backToTopButton.classList.toggle("is-visible", isVisible);
  };

  window.addEventListener("scroll", updateBackToTopVisibility, { passive: true });
  updateBackToTopVisibility();

  backToTopButton.addEventListener("click", () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  });
}

const homeDataReady = fetch("Data.home/home-data.json")
  .then((response) => {
    if (!response.ok) throw new Error("Could not load Data.home/home-data.json");
    return response.json();
  })
  .then((homeData) => {
    const readValue = (path) => path.split(".").reduce((value, key) => value?.[key], homeData);

    document.querySelectorAll("[data-home-text]").forEach((element) => {
      const value = readValue(element.dataset.homeText);
      if (value === undefined) return;

      const existingTextNode = [...element.childNodes].find((node) => node.nodeType === Node.TEXT_NODE);
      if (element.children.length > 0 && existingTextNode) {
        existingTextNode.nodeValue = ` ${value} `;
      } else {
        element.textContent = String(value);
      }
    });

    document.querySelectorAll("[data-home-attr]").forEach((element) => {
      element.dataset.homeAttr.split(",").forEach((binding) => {
        const separator = binding.indexOf(":");
        if (separator < 0) return;

        const attribute = binding.slice(0, separator).trim();
        const path = binding.slice(separator + 1).trim();
        const value = readValue(path);
        if (value !== undefined) element.setAttribute(attribute, String(value));
      });
    });

    document.querySelectorAll("[data-home-background]").forEach((element) => {
      const value = readValue(element.dataset.homeBackground);
      if (value) element.style.backgroundImage = `url("${value}")`;
    });

    window.homeData = homeData;

    const refreshContentFilters = () => {
      [
        ["#course-search-input", "input"],
        ["#category-filter-select", "change"],
        ["#life-search-input", "input"]
      ].forEach(([selector, eventName]) => {
        const element = document.querySelector(selector);
        if (element) element.dispatchEvent(new Event(eventName, { bubbles: true }));
      });
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", refreshContentFilters, { once: true });
    } else {
      setTimeout(refreshContentFilters, 0);
    }

    return homeData;
  })
  .catch((error) => {
    console.error("Homepage data could not be loaded:", error);
    return null;
  });

window.homeDataReady = homeDataReady;

const navigation = document.querySelector(".main-navigation");
const navigationLinks = document.querySelectorAll(".nav-link, .nav-department-option");
const currentYear = document.querySelector("#current-year");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen
      ? window.homeData?.header.menuOpen || ""
      : window.homeData?.header.menuClose || "");
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigationLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", window.homeData?.header.menuOpen || "");
      navigation.classList.remove("is-open");
    });
  });
}

const courseMenuItem = document.querySelector(".nav-course-item");
const courseMenuTrigger = courseMenuItem?.querySelector(":scope > .nav-link");
if (courseMenuItem && courseMenuTrigger) {
  const setCourseMenuOpen = (isOpen) => {
    courseMenuItem.classList.toggle("is-open", isOpen);
    courseMenuTrigger.setAttribute("aria-expanded", String(isOpen));
  };

  courseMenuItem.addEventListener("mouseenter", () => setCourseMenuOpen(true));
  courseMenuItem.addEventListener("mouseleave", () => {
    setCourseMenuOpen(courseMenuItem.contains(document.activeElement));
  });
  courseMenuItem.addEventListener("focusin", () => setCourseMenuOpen(true));
  courseMenuItem.addEventListener("focusout", (event) => {
    if (!event.relatedTarget || !courseMenuItem.contains(event.relatedTarget)) {
      setCourseMenuOpen(courseMenuItem.matches(":hover"));
    }
  });
}

const departmentSearch = document.querySelector("#department-search");
const departmentMenuToggle = document.querySelector("#department-menu-toggle");
const departmentMenu = document.querySelector("#department-menu");
const departmentSearchStatus = document.querySelector("#department-search-status");
const departmentOptions = document.querySelectorAll(".home-department-option");
const departmentCards = document.querySelectorAll(".home-department-results > article");

if (departmentSearch && departmentMenuToggle && departmentMenu) {
  const closeDepartmentMenu = () => {
    departmentMenu.hidden = true;
    departmentMenuToggle.setAttribute("aria-expanded", "false");
  };

  const filterDepartmentOptions = () => {
    const query = departmentSearch.value.trim().toLowerCase();
    let matchCount = 0;

    departmentOptions.forEach((option) => {
      const matches = option.textContent.toLowerCase().includes(query);
      option.hidden = !matches;
      if (matches) matchCount++;
    });

    departmentCards.forEach((card) => {
      card.hidden = Boolean(query) && !card.textContent.toLowerCase().includes(query);
    });

    departmentMenu.hidden = false;
    departmentMenuToggle.setAttribute("aria-expanded", "true");

    if (departmentSearchStatus) {
      departmentSearchStatus.textContent = query && matchCount === 0
        ? "No departments found."
        : "";
    }
  };

  departmentSearch.addEventListener("input", filterDepartmentOptions);

  departmentMenuToggle.addEventListener("click", () => {
    if (!departmentMenu.hidden) {
      closeDepartmentMenu();
      return;
    }

    departmentSearch.value = "";
    filterDepartmentOptions();
    departmentSearch.focus();
  });

  departmentOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const selectedCard = option.dataset.departmentTarget;

      departmentCards.forEach((card) => {
        card.hidden = false;
        card.classList.toggle("is-selected", card.id === selectedCard);
      });

      departmentSearch.value = "";
      filterDepartmentOptions();
      if (departmentSearchStatus) departmentSearchStatus.textContent = "";
      closeDepartmentMenu();
      document.getElementById(selectedCard)?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "center"
      });
    });
  });

  departmentSearch.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const firstVisibleOption = [...departmentOptions].find((option) => !option.hidden);
      if (firstVisibleOption) firstVisibleOption.click();
    }

    if (event.key === "Escape") closeDepartmentMenu();
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".home-department-toolbar")) closeDepartmentMenu();
  });
}

const observedSections = document.querySelectorAll("main > section[id]");
if ("IntersectionObserver" in window) {
  const revealTargets = document.querySelectorAll(
    ".home-page-section .home-page-hero h1, .home-page-section .home-section-title, .home-page-section .home-info-card, .home-page-section .course-card, .home-page-section .life-card, .home-about .department-card, .home-faculty-grid .faculty-card"
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

  revealTargets.forEach((target) => {
    target.classList.add("reveal-target");
    revealObserver.observe(target);
  });

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navigationLinks.forEach((link) => {
        const linkUrl = new URL(link.href);
        if (linkUrl.pathname === window.location.pathname && linkUrl.hash) {
          link.classList.toggle("active", linkUrl.hash === `#${entry.target.id}`);
        }
      });
    });
  }, { rootMargin: "-30% 0px -60% 0px" });

  observedSections.forEach((section) => sectionObserver.observe(section));
} else {
  document.querySelectorAll(
    ".home-page-section .home-page-hero h1, .home-page-section .home-section-title, .home-page-section .home-info-card, .home-page-section .course-card, .home-page-section .life-card, .home-about .department-card, .home-faculty-grid .faculty-card"
  ).forEach((target) => target.classList.add("reveal-target", "is-visible"));
}

const loginForm = document.querySelector("#login-form");
const loginEmail = document.querySelector("#login-email");
const loginPassword = document.querySelector("#login-password");
const loginMessage = document.querySelector("#login-message");
const passwordToggle = document.querySelector(".password-toggle");
const forgotPassword = document.querySelector("#forgot-password");

if (passwordToggle && loginPassword) {
  passwordToggle.addEventListener("click", () => {
    const showingPassword = loginPassword.type === "password";
    loginPassword.type = showingPassword ? "text" : "password";
    passwordToggle.textContent = showingPassword
      ? window.homeData?.hero.login.hidePassword || ""
      : window.homeData?.hero.login.showPassword || "";
    passwordToggle.setAttribute("aria-label", showingPassword
      ? window.homeData?.hero.login.hidePassword || ""
      : window.homeData?.hero.login.showPassword || "");
    passwordToggle.setAttribute("aria-pressed", String(showingPassword));
  });
}

if (loginForm && loginEmail && loginPassword && loginMessage) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    loginMessage.textContent = "Login is not connected to an account service yet.";
  });
}

if (forgotPassword && loginEmail && loginMessage) {
  forgotPassword.addEventListener("click", () => {
    if (!loginEmail.value.trim() || !loginEmail.validity.valid) {
      loginMessage.textContent = "Enter a valid email address first.";
      loginEmail.focus();
      return;
    }

    loginMessage.textContent = "Password reset is not connected to an email service yet.";
  });
}

const welcomeButton = document.querySelector("#welcome-button");
const welcomeMessage = document.querySelector("#welcome-message");

if (welcomeButton && welcomeMessage) {
  welcomeButton.addEventListener("click", () => {
    welcomeMessage.textContent =
      "Explore your future at ASM College!";
  });
}
})();
