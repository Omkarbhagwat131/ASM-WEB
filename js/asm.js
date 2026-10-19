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

const courseDialog = document.querySelector(".course-dialog");
const courseCloseButton = courseDialog?.querySelector(".course-dialog-close");
const courseDialogTitle = courseDialog?.querySelector("#course-dialog-title");
const courseDialogCode = courseDialog?.querySelector("#course-dialog-code");

if (
  courseDialog instanceof HTMLDialogElement &&
  courseCloseButton instanceof HTMLButtonElement &&
  courseDialogTitle instanceof HTMLElement &&
  courseDialogCode instanceof HTMLElement
) {
  let lastCourseTrigger = null;

  document.querySelectorAll(".department-card .view-details-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".department-card");
      const courseCode = card?.querySelector(".department-code");
      const courseName = card?.querySelector("h3");
      const details = button.dataset.courseTarget
        ? document.getElementById(button.dataset.courseTarget)
        : null;

      if (!courseCode || !courseName || !details || !courseDialog.contains(details)) {
        console.error("Course details could not be opened because the course card is incomplete.");
        return;
      }

      courseDialog.querySelectorAll(".course-info").forEach((panel) => {
        panel.hidden = true;
      });
      details.hidden = false;
      courseDialogCode.textContent = courseCode.textContent.trim();
      courseDialogTitle.textContent = courseName.textContent.trim();
      lastCourseTrigger = button;
      courseDialog.showModal();
      courseCloseButton.focus();
    });
  });

  courseCloseButton.addEventListener("click", () => {
    courseDialog.close();
  });

  courseDialog.addEventListener("click", (event) => {
    if (event.target === courseDialog) {
      courseDialog.close();
    }
  });

  courseDialog.addEventListener("close", () => {
    if (lastCourseTrigger?.isConnected) {
      lastCourseTrigger.focus();
    }
  });
}
