


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
// Login Form Submission & Redirect
const loginForm = document.querySelector("form");

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formMessage = document.querySelector("#form-message");
    
    if (formMessage) {
      formMessage.textContent = "Login successful!";
      formMessage.style.color = "green";
    }

    setTimeout(() => {
      window.location.href = "home.html";
    }, 1500);
  });
}

const counters = document.querySelectorAll(".counter");

if (counters.length > 0) {
  counters.forEach((counter) => {
    counter.textContent = "0";

    const updateCounter = () => {
      const target = +counter.getAttribute("data-target");
      const current = +counter.textContent;
      const increment = Math.ceil(target / 50);

      if (current < target) {
        counter.textContent = `${current + increment}`;
        setTimeout(updateCounter, 30);
      } else {
        counter.textContent = `${target}+`;
      }
    };

    updateCounter();
  });
}

/* Page Reveal Animation */

document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(
        "main > section"
    );

    sections.forEach((section) => {
        section.classList.add("reveal");
    });

    // Show sections immediately if reduced motion is preferred
    if (window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches) {
        sections.forEach((section) => {
            section.classList.add("active");
        });
        return;
    }

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.08
        }
    );

    sections.forEach((section) => {
        revealObserver.observe(section);
    });
});

/* Home page courses: search, category filter, favorites and ratings */
document.addEventListener("DOMContentLoaded", function () {
    const section = document.querySelector(".home-courses-original");
    if (!section) return;

    const search = section.querySelector("#home-course-search-input");
    const filter = section.querySelector("#home-category-filter");
    const noResults = section.querySelector("#home-no-results");
    const cards = [...section.querySelectorAll(".home-course-card")];

    function updateCourses() {
        const query = search.value.trim().toLowerCase();
        const category = filter.value;
        let visible = 0;

        cards.forEach(card => {
            const matchesText = card.textContent.toLowerCase().includes(query);
            const matchesCategory =
                category === "all" || card.dataset.category === category;

            card.hidden = !(matchesText && matchesCategory);
            if (!card.hidden) visible++;
        });

        noResults.hidden = visible !== 0;
    }

    search.addEventListener("input", updateCourses);
    filter.addEventListener("change", updateCourses);

    section.querySelectorAll(".home-favorite-btn").forEach(button => {
        button.addEventListener("click", function () {
            this.classList.toggle("active");
            this.textContent = this.classList.contains("active")
                ? "★ Favorited"
                : "☆ Favorite";
        });
    });

    section.querySelectorAll(".home-stars").forEach(stars => {
        const message = stars.parentElement.querySelector(".home-rating-message");

        stars.querySelectorAll("button").forEach(button => {
            button.addEventListener("click", function () {
                const rating = Number(this.dataset.rating);

                stars.querySelectorAll("button").forEach(star => {
                    star.classList.toggle(
                        "active",
                        Number(star.dataset.rating) <= rating
                    );
                });

                message.textContent = `You rated this course ${rating} out of 5 stars.`;
            });
        });
    });
});
