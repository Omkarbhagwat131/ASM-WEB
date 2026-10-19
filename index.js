(() => {
  "use strict";

  // ========================================
  // 1. Load Homepage JSON Data
  // ========================================
  const homeDataReady = fetch("Data.home/home-data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Could not load home-data.json. HTTP status: ${response.status}`
        );
      }

      return response.json();
    })
    .then((homeData) => {
      const readValue = (path) =>
        path.split(".").reduce((value, key) => value?.[key], homeData);

      // Update text from JSON
      document.querySelectorAll("[data-home-text]").forEach((element) => {
        const value = readValue(element.dataset.homeText);

        if (value === undefined || value === null) return;

        if (element.children.length > 0) {
          const textNode = [...element.childNodes].find(
            (node) => node.nodeType === Node.TEXT_NODE
          );

          if (textNode) {
            textNode.nodeValue = ` ${value} `;
          } else {
            element.appendChild(document.createTextNode(` ${value} `));
          }
        } else {
          element.textContent = String(value);
        }
      });

      // Update HTML attributes from JSON
      document.querySelectorAll("[data-home-attr]").forEach((element) => {
        element.dataset.homeAttr.split(",").forEach((binding) => {
          const separator = binding.indexOf(":");
          if (separator < 0) return;

          const attribute = binding.slice(0, separator).trim();
          const path = binding.slice(separator + 1).trim();
          const value = readValue(path);

          if (value !== undefined && value !== null) {
            element.setAttribute(attribute, String(value));
          }
        });
      });

      // Update background images from JSON
      document.querySelectorAll("[data-home-background]").forEach((element) => {
        const value = readValue(element.dataset.homeBackground);

        if (value) {
          element.style.backgroundImage = `url("${value}")`;
        }
      });

      window.homeData = homeData;

      // Refresh search and filter controls after JSON data loads
      const refreshContentFilters = () => {
        [
          ["#course-search-input", "input"],
          ["#category-filter-select", "change"],
          ["#course-category", "change"],
          ["#life-search-input", "input"]
        ].forEach(([selector, eventName]) => {
          const element = document.querySelector(selector);

          if (element) {
            element.dispatchEvent(
              new Event(eventName, { bubbles: true })
            );
          }
        });
      };

      refreshContentFilters();

      return homeData;
    })
    .catch((error) => {
      console.error("Homepage JSON data could not be loaded:", error);
      return null;
    });

  window.homeDataReady = homeDataReady;

  // ========================================
  // 2. Back To Top Button
  // ========================================
  const backToTopButton = document.querySelector("#home-back-to-top");

  if (backToTopButton) {
    const updateBackToTopVisibility = () => {
      const isVisible = window.scrollY > 300;

      backToTopButton.hidden = !isVisible;
      backToTopButton.classList.toggle("is-visible", isVisible);
    };

    window.addEventListener("scroll", updateBackToTopVisibility, {
      passive: true
    });

    updateBackToTopVisibility();

    backToTopButton.addEventListener("click", () => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      window.scrollTo({
        top: 0,
        behavior: reducedMotion ? "auto" : "smooth"
      });
    });
  }

  // ========================================
  // 3. Footer Current Year
  // ========================================
  const currentYear = document.querySelector("#current-year");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // ========================================
  // 4. Mobile Navigation
  // ========================================
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-navigation");
  const navigationLinks = document.querySelectorAll(
    ".nav-link, .nav-department-option"
  );

  const closeMobileMenu = () => {
    if (!menuToggle || !navigation) return;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute(
      "aria-label",
      window.homeData?.header?.menuOpen || "Open menu"
    );

    navigation.classList.remove("is-open");
  };

  let navigationScrollFrame = 0;
  let navigationRevealTimer = 0;
  let previousScrollBehavior = "";

  const scrollToSection = (target, updateHistory = true) => {
    if (navigationScrollFrame) {
      cancelAnimationFrame(navigationScrollFrame);
      navigationScrollFrame = 0;
    } else {
      previousScrollBehavior = document.documentElement.style.scrollBehavior;
    }
    if (navigationRevealTimer) {
      clearTimeout(navigationRevealTimer);
      navigationRevealTimer = 0;
    }

    if (updateHistory && target.id) {
      window.history.pushState(null, "", `#${target.id}`);
    }

    const root = document.documentElement;
    root.style.scrollBehavior = "auto";
    const scrollPadding = Number.parseFloat(
      window.getComputedStyle(root).scrollPaddingTop
    ) || 0;
    const scrollMargin = Number.parseFloat(
      window.getComputedStyle(target).scrollMarginTop
    ) || 0;
    const start = window.scrollY;
    const destination = Math.max(
      0,
      start + target.getBoundingClientRect().top - scrollPadding - scrollMargin
    );
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const revealTarget = target.querySelector(":scope > .home-page-hero") || target;
    revealTarget.classList.remove("nav-reveal");
    void revealTarget.offsetWidth;
    revealTarget.classList.add("nav-reveal");
    navigationRevealTimer = window.setTimeout(() => {
      revealTarget.classList.remove("nav-reveal");
      navigationRevealTimer = 0;
    }, 700);

    if (prefersReducedMotion || Math.abs(destination - start) < 2) {
      root.scrollTop = destination;
      root.style.scrollBehavior = previousScrollBehavior;
      return;
    }

    const duration = 650;
    const startedAt = performance.now();
    const animateScroll = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      root.scrollTop = start + (destination - start) * easedProgress;

      if (progress < 1) {
        navigationScrollFrame = window.requestAnimationFrame(animateScroll);
      } else {
        navigationScrollFrame = 0;
        root.style.scrollBehavior = previousScrollBehavior;
      }
    };

    navigationScrollFrame = window.requestAnimationFrame(animateScroll);
  };

  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen
          ? window.homeData?.header?.menuOpen || "Open menu"
          : window.homeData?.header?.menuClose || "Close menu"
      );

      navigation.classList.toggle("is-open", !isOpen);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1080) {
        closeMobileMenu();
      }
    });
  }

  navigationLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (link.hash && link.origin === window.location.origin) {
        const target = document.getElementById(link.hash.slice(1));
        if (target) {
          event.preventDefault();
          scrollToSection(target);

          const activeLink = link.classList.contains("nav-link")
            ? link
            : link.closest(".nav-department-item")?.querySelector(":scope > .nav-link");
          navigationLinks.forEach((navigationLink) => {
            navigationLink.classList.toggle("active", navigationLink === activeLink);
          });
        }
      }

      closeMobileMenu();
    });
  });

  window.addEventListener("popstate", () => {
    const target = document.getElementById(window.location.hash.slice(1));
    if (target) scrollToSection(target, false);
  });

  // ========================================
  // 5. Courses Dropdown Menu
  // ========================================
  const courseMenuItem = document.querySelector(".nav-course-item");
  const courseMenuTrigger = courseMenuItem?.querySelector(
    ":scope > .nav-link"
  );

  if (courseMenuItem && courseMenuTrigger) {
    const setCourseMenuOpen = (isOpen) => {
      courseMenuItem.classList.toggle("is-open", isOpen);
      courseMenuTrigger.setAttribute("aria-expanded", String(isOpen));
    };

    courseMenuItem.addEventListener("mouseenter", () => {
      setCourseMenuOpen(true);
    });

    courseMenuItem.addEventListener("mouseleave", () => {
      setCourseMenuOpen(
        courseMenuItem.contains(document.activeElement)
      );
    });

    courseMenuItem.addEventListener("focusin", () => {
      setCourseMenuOpen(true);
    });

    courseMenuItem.addEventListener("focusout", (event) => {
      if (
        !event.relatedTarget ||
        !courseMenuItem.contains(event.relatedTarget)
      ) {
        setCourseMenuOpen(courseMenuItem.matches(":hover"));
      }
    });
  }

  // ========================================
  // 6. Department Search and Menu
  // ========================================
  const departmentSearch = document.querySelector("#department-search");
  const departmentMenuToggle = document.querySelector(
    "#department-menu-toggle"
  );
  const departmentMenu = document.querySelector("#department-menu");
  const departmentSearchStatus = document.querySelector(
    "#department-search-status"
  );

  const departmentOptions = document.querySelectorAll(
    ".home-department-option"
  );

  const departmentCards = document.querySelectorAll(
    ".home-department-results > article"
  );

  if (departmentSearch && departmentMenuToggle && departmentMenu) {
    const closeDepartmentMenu = () => {
      departmentMenu.hidden = true;
      departmentMenuToggle.setAttribute("aria-expanded", "false");
    };

    const filterDepartmentOptions = () => {
      const query = departmentSearch.value.trim().toLowerCase();
      let matchCount = 0;

      departmentOptions.forEach((option) => {
        const matches = option.textContent
          .toLowerCase()
          .includes(query);

        option.hidden = !matches;

        if (matches) matchCount++;
      });

      departmentCards.forEach((card) => {
        card.hidden =
          Boolean(query) &&
          !card.textContent.toLowerCase().includes(query);
      });

      departmentMenu.hidden = false;
      departmentMenuToggle.setAttribute("aria-expanded", "true");

      if (departmentSearchStatus) {
        departmentSearchStatus.textContent =
          query && matchCount === 0
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

        if (!selectedCard) return;

        departmentCards.forEach((card) => {
          card.hidden = false;
          card.classList.toggle(
            "is-selected",
            card.id === selectedCard
          );
        });

        departmentSearch.value = "";
        filterDepartmentOptions();

        if (departmentSearchStatus) {
          departmentSearchStatus.textContent = "";
        }

        closeDepartmentMenu();

        document.getElementById(selectedCard)?.scrollIntoView({
          behavior: window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches
            ? "auto"
            : "smooth",
          block: "center"
        });
      });
    });

    departmentSearch.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const firstVisibleOption = [...departmentOptions].find(
          (option) => !option.hidden
        );

        if (firstVisibleOption) {
          event.preventDefault();
          firstVisibleOption.click();
        }
      }

      if (event.key === "Escape") {
        closeDepartmentMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".home-department-toolbar")) {
        closeDepartmentMenu();
      }
    });
  }

  // ========================================
  // 7. Scroll Reveal Animations
  // ========================================
  const revealSelector = [
    ".home-page-section .home-page-hero h1",
    ".home-page-section .home-section-title",
    ".home-page-section .home-info-card",
    ".home-page-section .course-card",
    ".home-page-section .life-card",
    ".home-about .department-card",
    ".home-faculty-grid .faculty-card"
  ].join(", ");

  const revealTargets = document.querySelectorAll(revealSelector);
  const observedSections = document.querySelectorAll("main > section[id], #home");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    revealTargets.forEach((target) => {
      target.classList.add("reveal-target");
      revealObserver.observe(target);
    });

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navigationLinks.forEach((link) => {
            try {
              const linkUrl = new URL(link.href, window.location.href);

              if (
                linkUrl.pathname === window.location.pathname &&
                linkUrl.hash
              ) {
                link.classList.toggle(
                  "active",
                  linkUrl.hash === `#${entry.target.id}`
                );
              }
            } catch (error) {
              console.warn("Navigation link could not be checked:", error);
            }
          });
        });
      },
      {
        rootMargin: "-30% 0px -60% 0px"
      }
    );

    observedSections.forEach((section) => {
      sectionObserver.observe(section);
    });
  } else {
    revealTargets.forEach((target) => {
      target.classList.add("reveal-target", "is-visible");
    });
  }

  // ========================================
  // 8. Login Password Show / Hide
  // ========================================
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

      const label = showingPassword
        ? window.homeData?.hero?.login?.hidePassword || "Hide password"
        : window.homeData?.hero?.login?.showPassword || "Show password";

      passwordToggle.textContent = label;
      passwordToggle.setAttribute("aria-label", label);
      passwordToggle.setAttribute("aria-pressed", String(showingPassword));
    });
  }

  if (loginForm && loginEmail && loginPassword && loginMessage) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      loginMessage.textContent =
        "Login is not connected to an account service yet.";
    });
  }

  if (forgotPassword && loginEmail && loginMessage) {
    forgotPassword.addEventListener("click", () => {
      if (
        !loginEmail.value.trim() ||
        !loginEmail.validity.valid
      ) {
        loginMessage.textContent =
          "Enter a valid email address first.";

        loginEmail.focus();
        return;
      }

      loginMessage.textContent =
        "Password reset is not connected to an email service yet.";
    });
  }

  // ========================================
  // 9. Welcome Button
  // ========================================
  const welcomeButton = document.querySelector("#welcome-button");
  const welcomeMessage = document.querySelector("#welcome-message");

  if (welcomeButton && welcomeMessage) {
    welcomeButton.addEventListener("click", () => {
      welcomeMessage.textContent =
        "Explore your future at ASM College!";
    });
  }

  // ========================================
  // 10. Test Button (only if it exists)
  // ========================================
  const testButton = document.getElementById("myButton");

  if (testButton) {
    testButton.addEventListener("click", () => {
      alert("Your project is working!");
    });
  }

  // Check JavaScript execution in browser console
  console.log("index.js loaded successfully.");
})();