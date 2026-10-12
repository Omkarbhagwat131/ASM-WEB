// 1. Live Course Search, Category Filtering & LocalStorage Preference Feature
const courseSearchInput = document.querySelector("#course-search-input");
const categorySelect = document.querySelector("#category-filter-select");
const courseCards = document.querySelectorAll(".course-card");
const noResultsMessage = document.querySelector("#no-results-msg");

const PREF_KEY = "asm-preferred-filter";

const saveSearchPreference = (query, category) => {
    try {
        const preferences = { searchQuery: query, selectedCategory: category, timestamp: new Date() };
        localStorage.setItem(PREF_KEY, JSON.stringify(preferences));
    } catch (error) {
        console.error("Could not save preference to localStorage:", error);
    }
};

const filterCourses = (query = "", selectedCategory = "all") => {
    let matchCount = 0;

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