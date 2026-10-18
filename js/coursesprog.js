"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector("#course-search-input");
  const categoryFilter = document.querySelector("#category-filter-select, #course-category");
  const noResultsMessage = document.querySelector("#no-results-msg");
  const courseCount = document.querySelector("#course-count");
  const selectedCourseMessage = document.querySelector("#selected-course");
  const backToTopButton = document.querySelector("#back-to-top");
  const preferenceKey = "asm-preferred-filter";

  const setResultStatus = (count) => {
    if (courseCount) courseCount.textContent = `Results found: ${count}`;
    if (noResultsMessage) {
      noResultsMessage.hidden = count !== 0;
      noResultsMessage.style.display = count === 0 ? "block" : "none";
    }
  };

  const readPreference = () => {
    try {
      const preference = JSON.parse(localStorage.getItem(preferenceKey) || "{}");
      const validCategories = ["all", "ug", "pg", "clubs"];
      return {
        query: typeof preference.searchQuery === "string" ? preference.searchQuery : "",
        category: validCategories.includes(String(preference.selectedCategory).toLowerCase())
          ? String(preference.selectedCategory).toLowerCase()
          : "all"
      };
    } catch (error) {
      console.error("Could not restore course search preference:", error);
      return { query: "", category: "all" };
    }
  };

  const savePreference = (query, category) => {
    try {
      localStorage.setItem(preferenceKey, JSON.stringify({
        searchQuery: query,
        selectedCategory: category
      }));
    } catch (error) {
      console.error("Could not save course search preference:", error);
    }
  };

  const reportSelection = (card) => {
    if (!selectedCourseMessage) return;
    const title = card.querySelector("h3")?.textContent.trim() || "Course";
    const category = card.dataset.category || "course";
    selectedCourseMessage.textContent = `You selected: ${title} (${category.toUpperCase()}).`;
  };

  const dynamicSections = {
    ug: document.querySelector("#ug-section"),
    pg: document.querySelector("#pg-section"),
    clubs: document.querySelector("#clubs-section")
  };

  if (Object.values(dynamicSections).some(Boolean)) {
    initializeDynamicCourses();
  } else {
    initializeStaticCourses();
  }

  initializeBackToTop();

  function initializeStaticCourses() {
    const cards = [...document.querySelectorAll(".course-card")];
    if (cards.length === 0) return;
    const quickFilters = [...document.querySelectorAll("[data-course-filter]")];

    const getCategory = (card) => {
      if (card.dataset.category) return card.dataset.category.toLowerCase();
      const grid = card.closest(".courses-grid, .home-course-grid");
      const heading = grid?.previousElementSibling?.textContent.toLowerCase() || "";
      if (heading.includes("postgraduate")) return "pg";
      if (heading.includes("club")) return "clubs";
      return "ug";
    };

    const filterCards = (query = "", selectedCategory = "all") => {
      const searchTerm = query.trim().toLowerCase();
      const category = selectedCategory.toLowerCase();
      let matchCount = 0;

      cards.forEach((card) => {
        const matches = card.textContent.toLowerCase().includes(searchTerm)
          && (category === "all" || getCategory(card) === category);
        if (card.closest(".home-course-grid")) {
          card.classList.toggle("is-filtered-out", !matches);
          card.style.removeProperty("display");
        } else {
          card.style.display = matches ? "" : "none";
        }
        if (matches) matchCount += 1;
      });

      quickFilters.forEach((button) => {
        const isActive = button.dataset.courseFilter === category;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });

      document.querySelectorAll(".home-course-grid").forEach((grid) => {
        const heading = grid.previousElementSibling;
        const section = grid.closest(".home-content-block");
        const headingText = heading?.textContent.toLowerCase() || "";
        const sectionCategory = headingText.includes("postgraduate")
          ? "pg"
          : headingText.includes("club")
            ? "clubs"
            : "ug";
        if (section) section.hidden = category !== "all" && category !== sectionCategory;
      });

      setResultStatus(matchCount);
    };

    const preference = readPreference();
    if (searchInput) searchInput.value = preference.query;
    if (categoryFilter) categoryFilter.value = preference.category;

    cards.forEach((card) => {
      if (card.querySelector(".select-course-btn")) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "select-course-btn home-small-button";
      button.textContent = "Select Course";
      button.addEventListener("click", () => reportSelection(card));
      card.appendChild(button);
    });

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        const query = searchInput.value;
        const category = categoryFilter?.value || "all";
        filterCards(query, category);
        savePreference(query, category);
      });
    }

    if (categoryFilter) {
      categoryFilter.addEventListener("change", () => {
        const query = searchInput?.value || "";
        const category = categoryFilter.value;
        filterCards(query, category);
        savePreference(query, category);
      });
    }

    quickFilters.forEach((button) => {
      const category = button.dataset.courseFilter;
      const count = cards.filter((card) => category === "all" || getCategory(card) === category).length;
      const countElement = button.querySelector("[data-course-filter-count]");
      if (countElement) countElement.textContent = String(count);

      button.addEventListener("click", () => {
        if (!categoryFilter || !["all", "ug", "pg", "clubs"].includes(category)) return;
        categoryFilter.value = category;
        categoryFilter.dispatchEvent(new Event("change", { bubbles: true }));
      });
    });

    filterCards(preference.query, preference.category);
  }

  async function initializeDynamicCourses() {
    const {
      ug: ugSection,
      pg: pgSection,
      clubs: clubsSection
    } = dynamicSections;
    const headings = {
      ug: document.querySelector("#ug-heading"),
      pg: document.querySelector("#pg-heading"),
      clubs: document.querySelector("#clubs-heading")
    };
    const modal = document.querySelector("#course-modal");
    const modalCloseButton = document.querySelector("#modal-close-btn");
    const requiredModalElements = [
      modal,
      modalCloseButton,
      document.querySelector("#modal-badge"),
      document.querySelector("#modal-title"),
      document.querySelector("#modal-desc"),
      document.querySelector("#modal-duration"),
      document.querySelector("#modal-seats"),
      document.querySelector("#modal-eligibility"),
      document.querySelector("#modal-fees"),
      document.querySelector("#modal-highlights-list"),
      document.querySelector("#modal-action-btn")
    ];

    if (
      !ugSection ||
      !pgSection ||
      !clubsSection ||
      requiredModalElements.some((element) => !element)
    ) {
      console.error("The dynamic course page is missing required sections or modal elements.");
      return;
    }

    const modalBadge = document.querySelector("#modal-badge");
    const modalTitle = document.querySelector("#modal-title");
    const modalDescription = document.querySelector("#modal-desc");
    const modalDuration = document.querySelector("#modal-duration");
    const modalSeats = document.querySelector("#modal-seats");
    const modalEligibility = document.querySelector("#modal-eligibility");
    const modalFees = document.querySelector("#modal-fees");
    const modalHighlights = document.querySelector("#modal-highlights-list");
    const modalAction = document.querySelector("#modal-action-btn");
    const sections = { ug: ugSection, pg: pgSection, clubs: clubsSection };
    let courses = [];

    const appendDetail = (list, label, value) => {
      const item = document.createElement("li");
      const name = document.createElement("strong");
      const detail = document.createElement("span");
      name.textContent = `${label}:`;
      detail.textContent = value || "Not specified";
      item.append(name, detail);
      list.appendChild(item);
    };

    const createCourseCard = (course) => {
      const card = document.createElement("article");
      card.className = "course-card";
      card.dataset.category = course.category;
      card.dataset.title = course.title.toLowerCase();
      card.dataset.desc = course.description.toLowerCase();
      card.dataset.badge = course.badge.toLowerCase();

      const image = document.createElement("img");
      image.className = "course-card-image";
      image.src = course.image;
      image.alt = course.imageAlt;
      image.loading = "lazy";
      image.decoding = "async";

      const overview = document.createElement("div");
      const metadata = document.createElement("div");
      metadata.className = "course-card-meta";
      const badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = course.badge;
      const rating = document.createElement("span");
      rating.textContent = `★ ${course.rating} (${course.reviewsCount})`;
      metadata.append(badge, rating);

      const title = document.createElement("h3");
      title.textContent = course.title;
      const description = document.createElement("p");
      description.textContent = course.description;
      overview.append(metadata, title, description);

      const details = document.createElement("ul");
      details.className = "course-details";
      appendDetail(details, "Duration", course.duration);
      appendDetail(details, "Seats", course.seats);

      const actions = document.createElement("div");
      actions.className = "card-actions";
      const quickViewButton = document.createElement("button");
      quickViewButton.type = "button";
      quickViewButton.className = "btn btn-outline quick-view-btn";
      quickViewButton.dataset.courseId = course.id;
      quickViewButton.textContent = "Quick View";
      actions.appendChild(quickViewButton);

      if (course.category !== "clubs") {
        const syllabusButton = document.createElement("button");
        syllabusButton.type = "button";
        syllabusButton.className = "btn btn-outline download-pdf-btn";
        syllabusButton.dataset.courseTitle = course.title;
        syllabusButton.textContent = "Syllabus";
        actions.appendChild(syllabusButton);
      }

      const selectButton = document.createElement("button");
      selectButton.type = "button";
      selectButton.className = "btn btn-outline select-course-btn";
      selectButton.textContent = "Select Course";
      actions.appendChild(selectButton);

      const applyLink = document.createElement("a");
      applyLink.className = "btn course-apply-link";
      applyLink.href = course.actionUrl || "addmission.html";
      applyLink.textContent = course.category === "clubs" ? "Join Club" : "Apply Now";

      card.append(image, overview, details, actions, applyLink);
      return card;
    };

    const renderCourses = () => {
      Object.values(sections).forEach((section) => section.replaceChildren());
      courses.forEach((course) => {
        if (!sections[course.category]) {
          console.error("Course has an unsupported category:", course.category);
          return;
        }
        sections[course.category].appendChild(createCourseCard(course));
      });
    };

    const filterCourses = (query = "", selectedCategory = "all") => {
      const term = query.trim().toLowerCase();
      const category = selectedCategory.toLowerCase();
      let matchCount = 0;

      Object.entries(sections).forEach(([sectionCategory, section]) => {
        const showSection = category === "all" || category === sectionCategory;
        section.hidden = !showSection;
        if (headings[sectionCategory]) headings[sectionCategory].hidden = !showSection;
      });

      document.querySelectorAll(".course-card").forEach((card) => {
        const matchesQuery = [card.dataset.title, card.dataset.desc, card.dataset.badge]
          .some((value) => value.includes(term));
        const matchesCategory = category === "all" || card.dataset.category === category;
        const isVisible = matchesQuery && matchesCategory;
        card.hidden = !isVisible;
        if (isVisible) matchCount += 1;
      });

      setResultStatus(matchCount);
    };

    const applyPreference = () => {
      const preference = readPreference();
      if (searchInput) searchInput.value = preference.query;
      if (categoryFilter) categoryFilter.value = preference.category;
      filterCourses(preference.query, preference.category);
    };

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        const query = searchInput.value;
        const category = categoryFilter?.value || "all";
        filterCourses(query, category);
        savePreference(query, category);
      });
    }

    if (categoryFilter) {
      categoryFilter.addEventListener("change", () => {
        const query = searchInput?.value || "";
        const category = categoryFilter.value;
        filterCourses(query, category);
        savePreference(query, category);
      });
    }

    const clearButton = document.querySelector("#clear-search-btn");
    if (clearButton) {
      clearButton.addEventListener("click", () => {
        if (searchInput) searchInput.value = "";
        if (categoryFilter) categoryFilter.value = "all";
        filterCourses("", "all");
        try {
          localStorage.removeItem(preferenceKey);
        } catch (error) {
          console.error("Could not clear course search preference:", error);
        }
      });
    }

    const closeModal = () => {
      modal.style.display = "none";
    };

    modalCloseButton.addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeModal();
    });

    document.addEventListener("click", (event) => {
      const button = event.target.closest(".quick-view-btn, .download-pdf-btn, .select-course-btn");
      if (!button) return;

      const card = button.closest(".course-card");
      if (!card) return;

      if (button.classList.contains("select-course-btn")) {
        reportSelection(card);
        return;
      }

      if (button.classList.contains("download-pdf-btn")) {
        alert(`Syllabus for "${button.dataset.courseTitle}" is not available yet.`);
        return;
      }

      const course = courses.find((item) => item.id === button.dataset.courseId);
      if (!course) {
        console.error("Course details were not found for the selected card.");
        return;
      }

      modalBadge.textContent = course.badge;
      modalTitle.textContent = course.title;
      modalDescription.textContent = course.description;
      modalDuration.textContent = course.duration;
      modalSeats.textContent = course.seats;
      modalEligibility.textContent = course.eligibility;
      modalFees.textContent = course.fees;
      modalHighlights.replaceChildren();
      (course.highlights || []).forEach((highlight) => {
        const item = document.createElement("li");
        item.textContent = highlight;
        modalHighlights.appendChild(item);
      });
      modalAction.href = course.actionUrl || "addmission.html";
      modalAction.textContent = course.category === "clubs" ? "Join Club" : "Apply Now";
      modal.style.display = "flex";
      modalCloseButton.focus();
    });

    try {
      const response = await fetch("data/courses.json");
      if (!response.ok) throw new Error(`Could not load data/courses.json (${response.status}).`);
      const data = await response.json();
      if (!Array.isArray(data.courses)) throw new Error("Course data must contain a courses array.");
      courses = data.courses;
      renderCourses();
      applyPreference();
    } catch (error) {
      console.error("Course data could not be loaded:", error);
      if (noResultsMessage) {
        noResultsMessage.hidden = false;
        noResultsMessage.style.display = "block";
        noResultsMessage.textContent = "Course information could not be loaded. Check the data file and use Live Server.";
      }
    }
  }

  function initializeBackToTop() {
    if (!backToTopButton) return;
    const updateVisibility = () => {
      backToTopButton.style.display = window.scrollY > 250 ? "block" : "none";
    };
    window.addEventListener("scroll", updateVisibility);
    backToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
      });
    });
    updateVisibility();
  }
});
