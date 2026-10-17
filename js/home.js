
"use strict";

/* ==========================================
   ASM NEXTGEN TECHNICAL CAMPUS - HOME PAGE
========================================== */

// ES6: const, let, arrow function
const HOME_DATA_URL = "../data/home.json";

const STORAGE_KEYS = Object.freeze({
  loginEmail: "asmHomeRememberedEmail",
  loginRole: "asmHomeSelectedRole"
});

const DEFAULT_DATA = {
  courses: [
    {
      title: "Master of Computer Applications",
      shortName: "MCA",
      description: "Develop skills in software development, databases and modern technologies.",
      category: "postgraduate"
    },
    {
      title: "Master of Business Administration",
      shortName: "MBA",
      description: "Build management, leadership and business decision-making skills.",
      category: "postgraduate"
    },
    {
      title: "Engineering Programs",
      shortName: "Engineering",
      description: "Explore technical education, innovation and practical learning.",
      category: "undergraduate"
    },
    {
      title: "Bachelor of Computer Applications",
      shortName: "BCA",
      description: "Learn programming, computer systems, web technologies and application development.",
      category: "undergraduate"
    },
    {
      title: "Bachelor of Business Administration",
      shortName: "BBA",
      description: "Explore marketing, finance, human resources and business management.",
      category: "undergraduate"
    },
    {
      title: "Bachelor of Commerce",
      shortName: "B.Com",
      description: "Study accounting, commerce, finance and business-related subjects.",
      category: "undergraduate"
    }
  ],

  highlights: [
    {
      number: "42+",
      title: "Years of Excellence",
      description: "A legacy of education and learning."
    },
    {
      number: "Industry",
      title: "Focused Learning",
      description: "Learning connected with industry needs."
    },
    {
      number: "Career",
      title: "Development",
      description: "Opportunities to build professional skills."
    }
  ],

  events: [
    {
      title: "Technical Activities",
      description: "Participate in technical learning and project activities."
    },
    {
      title: "Campus Events",
      description: "Explore college events, seminars and student activities."
    },
    {
      title: "Student & Alumni Meet",
      description: "Join the campus community for networking, shared learning and alumni interaction."
    }
  ],

  testimonials: [
    {
      name: "ASM Student",
      course: "Student",
      message: "Learning activities and practical projects help students develop their skills."
    },
    {
      name: "ASM Graduate",
      course: "Alumni",
      message: "Supportive mentors and hands-on learning helped me prepare for my next career step."
    },
    {
      name: "ASM Learner",
      course: "Student",
      message: "The campus experience encourages collaboration, confidence and continuous learning."
    }
  ]
};

// ES6: Object.assign()
const homeConfig = Object.assign(
  {},
  {
    collegeName: "ASM NextGen Technical Campus",
    tagline: "Institute of Management & Engineering"
  }
);

let homeData = {};
let currentCourses = [];
let selectedCategory = "all";


// ==========================================
// 1. DOM CONTENT LOADED
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  initializeHomePage();
});

const initializeHomePage = async () => {
  try {
    setupCurrentYear();
    setupNavigation();
    setupLoginForm();
    setupPasswordToggle();
    setupExploreButton();
    setupEnquiryForm();
    setupCampusImage();
    restorePreferences();

    await loadHomeData();
  } catch (error) {
    console.error("Home page initialization failed:", error);
  }
};


// ==========================================
// 2. CURRENT YEAR - DOM MANIPULATION
// ==========================================

const setupCurrentYear = () => {
  const yearElement = document.querySelector("#current-year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
};


// ==========================================
// 3. MOBILE NAVIGATION - EVENT HANDLING
// ==========================================

const setupNavigation = () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-navigation");

  if (!menuToggle || !navigation) return;

  menuToggle.addEventListener("click", () => {
    const isExpanded =
      menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    navigation.classList.toggle("is-open", !isExpanded);
  });

  // Event delegation for navigation links
  navigation.addEventListener("click", (event) => {
    const link = event.target.closest("a");

    if (!link) return;

    navigation.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
};


// ==========================================
// 4. CAMPUS IMAGE - ERROR HANDLING
// ==========================================

const setupCampusImage = () => {
  const campusImage = document.querySelector("#campus-background");

  if (!campusImage) return;

  campusImage.addEventListener("error", () => {
    console.error("Campus image could not be loaded.");
    campusImage.classList.add("image-unavailable");
  });
};


// ==========================================
// 5. LOGIN ANIMATION
// Building first appears clear.
// After a delay, login card appears and
// the background becomes blurred.
// ==========================================

const startLoginAnimation = () => {
  const hero = document.querySelector(".hero");
  const loginCard = document.querySelector(".login-card");

  if (!hero || !loginCard) return;

  // Initial state: clear background, hidden login
  hero.classList.remove("login-visible");
  loginCard.setAttribute("aria-hidden", "true");

  // ES6: setTimeout arrow function
  window.setTimeout(() => {
    hero.classList.add("login-visible");
    loginCard.setAttribute("aria-hidden", "false");
  }, 1800);
};


// ==========================================
// 6. LOGIN FORM + VALIDATION
// ==========================================

const setupLoginForm = () => {
  const loginForm = document.querySelector("#login-form");

  if (!loginForm) return;

  const emailInput = loginForm.querySelector("#login-email");
  const passwordInput = loginForm.querySelector("#login-password");
  const roleInput = loginForm.querySelector("#login-role");
  const rememberCheckbox = loginForm.querySelector("#remember-email");
  const messageElement = loginForm.querySelector("#login-message");

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    try {
      const email = emailInput?.value.trim() ?? "";
      const password = passwordInput?.value ?? "";
      const role = roleInput?.value ?? "";

      if (!role) {
        showMessage(messageElement, "Please select your login role.", "error");
        roleInput?.focus();
        return;
      }

      if (!emailInput?.checkValidity()) {
        showMessage(messageElement, "Please enter a valid email address.", "error");
        emailInput?.focus();
        return;
      }

      if (password.length < 6) {
        showMessage(messageElement, "Password must contain at least 6 characters.", "error");
        passwordInput?.focus();
        return;
      }

      // Remember only the email, never the password.
      if (rememberCheckbox?.checked) {
        localStorage.setItem(STORAGE_KEYS.loginEmail, email);
      } else {
        localStorage.removeItem(STORAGE_KEYS.loginEmail);
      }

      localStorage.setItem(STORAGE_KEYS.loginRole, role);

      showMessage(
        messageElement,
        "Form validated successfully. Connect your authentication system to sign in.",
        "success"
      );

      // Demo only: this does not authenticate a real user.
    } catch (error) {
      console.error("Login form error:", error);
      showMessage(messageElement, "Unable to process login. Please try again.", "error");
    }
  });
};


// ==========================================
// 7. PASSWORD SHOW / HIDE
// Event delegation
// ==========================================

const setupPasswordToggle = () => {
  const toggleButton = document.querySelector("#toggle-password");
  const passwordInput = document.querySelector("#login-password");

  if (!toggleButton || !passwordInput) return;

  toggleButton.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";

    passwordInput.type = isPassword ? "text" : "password";
    toggleButton.textContent = isPassword ? "Hide" : "Show";
    toggleButton.setAttribute("aria-pressed", String(isPassword));
  });
};


// ==========================================
// 8. RESTORE PREFERENCES - LOCAL STORAGE
// ==========================================

const restorePreferences = () => {
  try {
    const savedEmail = localStorage.getItem(STORAGE_KEYS.loginEmail);
    const savedRole = localStorage.getItem(STORAGE_KEYS.loginRole);

    const emailInput = document.querySelector("#login-email");
    const rememberCheckbox = document.querySelector("#remember-email");
    const roleInput = document.querySelector("#login-role");

    if (savedEmail && emailInput && rememberCheckbox) {
      emailInput.value = savedEmail;
      rememberCheckbox.checked = true;
    }

    if (savedRole && roleInput) {
      roleInput.value = savedRole;
    }
  } catch (error) {
    console.error("Could not restore saved preferences:", error);
  }
};


// ==========================================
// 9. LOAD JSON DATA - ASYNC / AWAIT
// ==========================================

const loadHomeData = async () => {
  try {
    const response = await fetch(HOME_DATA_URL);

    if (!response.ok) {
      throw new Error(`Unable to load home.json: HTTP ${response.status}`);
    }

    const data = await response.json();

    // Destructuring
    const {
      courses = DEFAULT_DATA.courses,
      highlights = DEFAULT_DATA.highlights,
      events = DEFAULT_DATA.events,
      testimonials = DEFAULT_DATA.testimonials
    } = data;

    // Spread operator
    homeData = {
      ...DEFAULT_DATA,
      ...data,
      courses,
      highlights,
      events,
      testimonials
    };

    currentCourses = [...homeData.courses];

    renderCourses(currentCourses);
    renderHighlights(homeData.highlights);
    renderEvents(homeData.events);
    renderTestimonials(homeData.testimonials);

    setupCourseSearch();
    setupCourseFilter();
    setupEnquiryForm();

  } catch (error) {
    console.error("JSON loading error:", error);

    // Fallback data keeps the page usable if JSON fails.
    homeData = { ...DEFAULT_DATA };
    currentCourses = [...DEFAULT_DATA.courses];

    renderCourses(currentCourses);
    renderHighlights(homeData.highlights);
    renderEvents(homeData.events);
    renderTestimonials(homeData.testimonials);

    showDataMessage(
      "Some sample content is displayed because home.json could not be loaded."
    );
  }
};


// ==========================================
// 10. DYNAMIC DOM - COURSE CARDS
// Template literals + map()
// ==========================================

const renderCourses = (courses) => {
  const coursesGrid = document.querySelector("#courses-container");

  if (!coursesGrid) return;

  if (!courses.length) {
    coursesGrid.innerHTML =
      '<p class="empty-state">No courses match your search.</p>';
    return;
  }

  coursesGrid.innerHTML = courses
    .map((course) => {
      const {
        title = "Course",
        shortName = "",
        description = "",
        category = "all"
      } = course;

      return `
        <article class="course-card">
          <span class="course-category">${escapeHTML(category)}</span>
          <h3>${escapeHTML(title)}</h3>
          <p class="course-short-name">${escapeHTML(shortName)}</p>
          <p>${escapeHTML(description)}</p>
          <a class="course-link" href="coursesprog.html">
            Explore Course →
          </a>
        </article>
      `;
    })
    .join("");
};


// ==========================================
// 11. HIGHLIGHTS
// ==========================================

const renderHighlights = (highlights) => {
  const highlightsGrid = document.querySelector("#highlights-grid");

  if (!highlightsGrid) return;

  highlightsGrid.innerHTML = highlights
    .map(({ number = "", title = "", description = "" }) => `
      <article class="highlight-card">
        <h3>${escapeHTML(number)}</h3>
        <h4>${escapeHTML(title)}</h4>
        <p>${escapeHTML(description)}</p>
      </article>
    `)
    .join("");
};


// ==========================================
// 12. EVENTS
// ==========================================

const renderEvents = (events) => {
  const eventsGrid = document.querySelector("#events-container");

  if (!eventsGrid) return;

  eventsGrid.innerHTML = events
    .map(({ title = "", description = "" }) => `
      <article class="event-card">
        <h3>${escapeHTML(title)}</h3>
        <p>${escapeHTML(description)}</p>
        <a class="card-know-more" href="campus.html">Know More <span aria-hidden="true">&rarr;</span></a>
      </article>
    `)
    .join("");
};


// ==========================================
// 13. TESTIMONIALS
// ==========================================

const renderTestimonials = (testimonials) => {
  const testimonialsGrid = document.querySelector("#testimonials-container");

  if (!testimonialsGrid) return;

  testimonialsGrid.innerHTML = testimonials
    .map(({ name = "", course = "", message = "" }) => `
      <article class="testimonial-card">
        <p>“${escapeHTML(message)}”</p>
        <h3>${escapeHTML(name)}</h3>
        <span>${escapeHTML(course)}</span>
        <a class="card-know-more" href="about.html">Know More <span aria-hidden="true">&rarr;</span></a>
      </article>
    `)
    .join("");
};


// ==========================================
// 14. COURSE SEARCH - FILTER()
// ==========================================

const setupCourseSearch = () => {
  const searchInput = document.querySelector("#course-search");

  if (!searchInput) return;

  searchInput.addEventListener("input", () => {
    applyCourseFilters();
  });
};


// ==========================================
// 15. COURSE CATEGORY FILTER
// ==========================================

const setupCourseFilter = () => {
  const filterSelect = document.querySelector("#course-filter");

  if (!filterSelect) return;

  // Restore saved preference
  try {
    const savedCategory = localStorage.getItem("asmCourseCategory");

    if (
      savedCategory &&
      [...filterSelect.options].some((option) => option.value === savedCategory)
    ) {
      filterSelect.value = savedCategory;
      selectedCategory = savedCategory;
    }
  } catch (error) {
    console.error("Could not restore course filter:", error);
  }

  filterSelect.addEventListener("change", () => {
    selectedCategory = filterSelect.value;

    try {
      localStorage.setItem("asmCourseCategory", selectedCategory);
    } catch (error) {
      console.error("Could not save course filter:", error);
    }

    applyCourseFilters();
  });
};


const applyCourseFilters = () => {
  const searchInput = document.querySelector("#course-search");
  const searchText = searchInput?.value.trim().toLowerCase() ?? "";

  // filter() + some()
  const filteredCourses = currentCourses.filter((course) => {
    const searchableText = [
      course.title,
      course.shortName,
      course.description,
      course.category
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchableText.includes(searchText);

    const matchesCategory =
      selectedCategory === "all" ||
      course.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  renderCourses(filteredCourses);
};


// ==========================================
// 16. EXPLORE CAMPUS BUTTON
// ==========================================

const setupExploreButton = () => {
  const exploreButton = document.querySelector("#explore-campus");

  if (!exploreButton) return;

  exploreButton.addEventListener("click", () => {
    const campusSection = document.querySelector("#campus-section");

    campusSection?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
};


// ==========================================
// 17. ENQUIRY FORM VALIDATION
// ==========================================

const setupEnquiryForm = () => {
  const enquiryForm = document.querySelector("#enquiry-form");

  if (!enquiryForm || enquiryForm.dataset.initialized === "true") return;

  enquiryForm.dataset.initialized = "true";

  enquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = enquiryForm.querySelector("#enquiry-name");
    const email = enquiryForm.querySelector("#enquiry-email");
    const message = enquiryForm.querySelector("#enquiry-message");
    const status = enquiryForm.querySelector("#enquiry-status");

    if (!name?.value.trim() || !email?.checkValidity() || !message?.value.trim()) {
      showMessage(status, "Please complete all fields correctly.", "error");
      return;
    }

    showMessage(
      status,
      "Your form is valid. Connect a backend to submit enquiries.",
      "success"
    );

    enquiryForm.reset();
  });
};


// ==========================================
// 18. SAFE HTML OUTPUT
// ==========================================

const escapeHTML = (value) => {
  return String(value).replace(/[&<>"']/g, (character) => {
    const replacements = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return replacements[character];
  });
};


// ==========================================
// 19. STATUS / ERROR MESSAGES
// ==========================================

const showMessage = (element, message, type) => {
  if (!element) return;

  element.textContent = message;
  element.className = `form-message ${type}`;
};

const showDataMessage = (message) => {
  const status = document.querySelector("#home-data-status");

  if (status) {
    status.textContent = message;
    status.hidden = false;
  }
};


// Start animation after DOM elements are ready.
document.addEventListener("DOMContentLoaded", startLoginAnimation);

