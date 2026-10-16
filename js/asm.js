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
        link.classList.toggle("active", link.hash === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: "-30% 0px -60% 0px" });

  observedSections.forEach((section) => sectionObserver.observe(section));
}

// View Details buttons for all department cards
document.querySelectorAll(".view-details-btn").forEach(function (button) {
    button.addEventListener("click", function () {
        const detailsId = button.getAttribute("aria-controls");
        const details = document.getElementById(detailsId);

        if (!details) return;

        const isHidden = details.hidden;

        details.hidden = !isHidden;
        button.setAttribute("aria-expanded", String(isHidden));
        button.textContent = isHidden ? "Hide Details" : "View Details";
    });
});
