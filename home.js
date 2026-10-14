const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-navigation");
const navigationLinks = document.querySelectorAll(".nav-link");
const currentYear = document.querySelector("#current-year");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigationLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
      navigation.classList.remove("is-open");
    });
  });
}

const observedSections = document.querySelectorAll("main section[id]");
if ("IntersectionObserver" in window) {
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
    passwordToggle.textContent = showingPassword ? "Hide" : "Show";
    passwordToggle.setAttribute("aria-label", showingPassword ? "Hide password" : "Show password");
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
