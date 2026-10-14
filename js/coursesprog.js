// 1. Live Course Search, Category Filtering, Headings Visibility & Mouse Events
const courseSearchInput = document.querySelector("#course-search-input");
const categorySelect = document.querySelector("#category-filter-select");
const courseCards = document.querySelectorAll(".course-card");
const noResultsMessage = document.querySelector("#no-results-msg");

// Headings and Sections Elements
const ugHeading = document.querySelector("#ug-heading");
const ugSection = document.querySelector("#ug-section");
const pgHeading = document.querySelector("#pg-heading");
const pgSection = document.querySelector("#pg-section");
const clubsHeading = document.querySelector("#clubs-heading");
const clubsSection = document.querySelector("#clubs-section");

const PREF_KEY = "asm-preferred-filter";

// Function to save user preference safely with Error Handling & JSON.stringify
const saveSearchPreference = (query, category) => {
    try {
        const preferences = { searchQuery: query, selectedCategory: category, timestamp: new Date() };
        localStorage.setItem(PREF_KEY, JSON.stringify(preferences));
    } catch (error) {
        console.error("Could not save preference to localStorage:", error);
    }
};

// Core Filtering Logic combining Search, Category Filter and Dynamic Heading Display
const filterCourses = (query = "", selectedCategory = "all") => {
    let matchCount = 0;

    // Show or hide specific section headings based on selected category
    if (ugHeading && ugSection) {
        const showUg = selectedCategory === "all" || selectedCategory === "ug";
        ugHeading.style.display = showUg ? "block" : "none";
        ugSection.style.display = showUg ? "grid" : "none";
    }

    if (pgHeading && pgSection) {
        const showPg = selectedCategory === "all" || selectedCategory === "pg";
        pgHeading.style.display = showPg ? "block" : "none";
        pgSection.style.display = showPg ? "grid" : "none";
    }

    if (clubsHeading && clubsSection) {
        const showClubs = selectedCategory === "all" || selectedCategory === "clubs";
        clubsHeading.style.display = showClubs ? "block" : "none";
        clubsSection.style.display = showClubs ? "grid" : "none";
    }

    courseCards.forEach((card) => {
        const courseTitle = card.querySelector("h3") ? card.querySelector("h3").textContent.toLowerCase() : "";
        const courseBadge = card.querySelector(".badge") ? card.querySelector(".badge").textContent.toLowerCase() : "";
        const courseDesc = card.querySelector("p") ? card.querySelector("p").textContent.toLowerCase() : "";
        
        const cardCategory = card.getAttribute("data-category") || "ug";

        const matchesQuery = courseTitle.includes(query) || courseBadge.includes(query) || courseDesc.includes(query);
        const matchesCategory = selectedCategory === "all" || cardCategory === selectedCategory;

        if (matchesQuery && matchesCategory) {
            card.style.display = "flex";
            matchCount++;
        } else {
            card.style.display = "none";
        }
    });

    if (noResultsMessage) {
        noResultsMessage.style.display = matchCount === 0 ? "block" : "none";
    }
};

// Function to restore preference on page load with try/catch error handling
const restoreSearchPreference = () => {
    try {
        const saved = localStorage.getItem(PREF_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.searchQuery && courseSearchInput) {
                courseSearchInput.value = parsed.searchQuery;
            }
            if (parsed.selectedCategory && categorySelect) {
                categorySelect.value = parsed.selectedCategory;
            }
            filterCourses(parsed.searchQuery || "", parsed.selectedCategory || "all");
        }
    } catch (error) {
        console.error("Invalid JSON in localStorage:", error);
        localStorage.removeItem(PREF_KEY);
    }
};

if (courseCards.length > 0) {
    restoreSearchPreference();

    // Mouse Events Integration (mouseenter & mouseleave interactive effect)
    courseCards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
            card.style.backgroundColor = "#e8f1f8"; // Pale blue tint on hover using new theme color
            card.style.borderColor = "#103f68";
        });

        card.addEventListener("mouseleave", () => {
            card.style.backgroundColor = "#ffffff"; // Back to white when mouse leaves
            card.style.borderColor = "var(--border-color)";
        });
    });

    if (courseSearchInput) {
        courseSearchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();
            const currentCategory = categorySelect ? categorySelect.value : "all";
            filterCourses(query, currentCategory);
            saveSearchPreference(query, currentCategory);
        });
    }

    if (categorySelect) {
        categorySelect.addEventListener("change", (e) => {
            const selectedCategory = e.target.value;
            const currentQuery = courseSearchInput ? courseSearchInput.value.toLowerCase().trim() : "";
            filterCourses(currentQuery, selectedCategory);
            saveSearchPreference(currentQuery, selectedCategory);
        });
    }
}