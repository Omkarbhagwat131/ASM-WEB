// 1. Live Course Search, Category Filtering & LocalStorage Preference Feature
const courseSearchInput = document.querySelector("#course-search-input");
const categorySelect = document.querySelector("#category-filter-select");
const courseCards = document.querySelectorAll(".course-card");
const noResultsMessage = document.querySelector("#no-results-msg");

// LocalStorage Preference Key
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

// Core Filtering Logic using Array / NodeList methods combining Search & Category Filter
const filterCourses = (query = "", selectedCategory = "all") => {
    let matchCount = 0;

    courseCards.forEach((card) => {
        const courseTitle = card.querySelector("h3") ? card.querySelector("h3").textContent.toLowerCase() : "";
        const courseBadge = card.querySelector(".badge") ? card.querySelector(".badge").textContent.toLowerCase() : "";
        const courseDesc = card.querySelector("p") ? card.querySelector("p").textContent.toLowerCase() : "";
        
        // Get category from data-category attribute
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
        console.error("Invalid JSON in localStorage, resetting preference:", error);
        localStorage.removeItem(PREF_KEY);
    }
};

if (courseCards.length > 0) {
    // Restore preference when page loads
    restoreSearchPreference();

    // Event listener for live searching
    if (courseSearchInput) {
        courseSearchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();
            const currentCategory = categorySelect ? categorySelect.value : "all";
            filterCourses(query, currentCategory);
            saveSearchPreference(query, currentCategory);
        });
    }

    // Event listener for category dropdown selection
    if (categorySelect) {
        categorySelect.addEventListener("change", (e) => {
            const selectedCategory = e.target.value;
            const currentQuery = courseSearchInput ? courseSearchInput.value.toLowerCase().trim() : "";
            filterCourses(currentQuery, selectedCategory);
            saveSearchPreference(currentQuery, selectedCategory);
        });
    }
}

// 2. Back to Top Button Feature
const backToTopBtn = document.querySelector("#back-to-top");

if (backToTopBtn) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 200) {
            backToTopBtn.style.display = "block";
        } else {
            backToTopBtn.style.display = "none";
        }
    });

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}