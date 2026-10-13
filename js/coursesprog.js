
/* 1. Live Course Search, Category Filtering & LocalStorage */

const courseSearchInput = document.querySelector("#course-search-input");
const categorySelect = document.querySelector("#course-category");
const courseCards = document.querySelectorAll(".course-card");
const noResultsMessage = document.querySelector("#no-results-msg");
const courseCount = document.querySelector("#course-count");
const selectedCourseMessage = document.querySelector("#selected-course");

const PREF_KEY = "asm-preferred-filter";

// Determine each card's category from its section heading
function getCourseCategory(card) {
    const grid = card.closest(".courses-grid");
    const heading = grid?.previousElementSibling;
    const headingText = heading?.textContent.toLowerCase() || "";

    if (headingText.includes("undergraduate")) {
        return "ug";
    }

    if (headingText.includes("postgraduate")) {
        return "pg";
    }

    if (headingText.includes("club")) {
        return "clubs";
    }

    return "other";
}

// Save search and category preference
function saveSearchPreference(query, category) {
    try {
        localStorage.setItem(
            PREF_KEY,
            JSON.stringify({
                searchQuery: query,
                selectedCategory: category
            })
        );
    } catch (error) {
        console.error("Could not save preference:", error);
    }
}

// Filter courses and update the result count
function filterCourses(query = "", selectedCategory = "all") {
    let matchCount = 0;
    const searchTerm = query.toLowerCase().trim();
    const category = selectedCategory.toLowerCase();

    courseCards.forEach((card) => {
        const searchableText = card.textContent.toLowerCase();
        const cardCategory = getCourseCategory(card);

        const matchesQuery = searchableText.includes(searchTerm);
        const matchesCategory =
            category === "all" || cardCategory === category;

        const isVisible = matchesQuery && matchesCategory;

        card.style.display = isVisible ? "" : "none";

        if (isVisible) {
            matchCount++;
        }
    });

    if (courseCount) {
        courseCount.textContent = `Results found: ${matchCount}`;
    }

    if (noResultsMessage) {
        noResultsMessage.style.display =
            matchCount === 0 ? "block" : "none";
    }
}

// Restore saved preferences
function restoreSearchPreference() {
    try {
        const saved = localStorage.getItem(PREF_KEY);

        if (saved) {
            const parsed = JSON.parse(saved);
            const validCategories = ["all", "UG", "PG", "Clubs"];

            if (courseSearchInput && typeof parsed.searchQuery === "string") {
                courseSearchInput.value = parsed.searchQuery;
            }

            if (
                categorySelect &&
                validCategories.includes(parsed.selectedCategory)
            ) {
                categorySelect.value = parsed.selectedCategory;
            }
        }
    } catch (error) {
        console.error("Could not restore preference:", error);
    }

    filterCourses(
        courseSearchInput?.value || "",
        categorySelect?.value || "all"
    );
}

// Live search
if (courseSearchInput) {
    courseSearchInput.addEventListener("input", () => {
        const query = courseSearchInput.value;
        const category = categorySelect?.value || "all";

        filterCourses(query, category);
        saveSearchPreference(query, category);
    });
}

// Category filter
if (categorySelect) {
    categorySelect.addEventListener("change", () => {
        const query = courseSearchInput?.value || "";
        const category = categorySelect.value;

        filterCourses(query, category);
        saveSearchPreference(query, category);
    });
}

// Add a Select Course button to each card
courseCards.forEach((card) => {
    if (card.querySelector(".select-course-btn")) {
        return;
    }

    const title = card.querySelector("h3");

    if (!title) {
        return;
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = "select-course-btn";
    button.textContent = "Select Course";
    button.style.marginTop = "12px";
    button.style.padding = "10px 16px";
    button.style.backgroundColor = "#003366";
    button.style.color = "#ffffff";
    button.style.border = "none";
    button.style.borderRadius = "6px";
    button.style.cursor = "pointer";

    button.addEventListener("click", () => {
        const category = getCourseCategory(card);
        const courseName = title.textContent.trim();

        if (selectedCourseMessage) {
            selectedCourseMessage.textContent =
                `You selected: ${courseName} (${category.toUpperCase()}).`;
        }
    });

    card.appendChild(button);
});

// 2. Back to Top Button
const backToTopBtn = document.querySelector("#back-to-top");

if (backToTopBtn) {
    function updateBackToTopButton() {
        backToTopBtn.style.display =
            window.scrollY > 200 ? "block" : "none";
    }

    window.addEventListener("scroll", updateBackToTopButton);

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    updateBackToTopButton();
}

// Initialize the page
restoreSearchPreference();