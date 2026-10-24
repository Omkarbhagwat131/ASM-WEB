// 1. Live Course Search, Category Filtering & LocalStorage Preference Feature
const courseSearchInput = document.querySelector("#course-search-input");
const categorySelect = document.querySelector("#category-filter-select");
const courseCards = document.querySelectorAll(".course-card");
const noResultsMessage = document.querySelector("#no-results-msg");

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

const favoriteButtons = document.querySelectorAll(".favorite-btn");

favoriteButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        button.classList.toggle("active");

        if (button.classList.contains("active")) {
            button.textContent = "❤️ Added to Favorites";
        } else {
            button.textContent = "♡ Add to Favorites";
        }
    });
}); 



document.querySelectorAll(".course-rating").forEach(function(ratingBox) {
    const stars = ratingBox.querySelectorAll(".stars span");
    const message = ratingBox.querySelector(".rating-message");

    const courseCard = ratingBox.closest(".course-card");
    const courseName = courseCard.querySelector(".badge").textContent.trim();
    const storageKey = "course-rating-" + courseName;

    function showRating(rating) {
        stars.forEach(function(star) {
            star.classList.toggle(
                "active",
                Number(star.dataset.rating) <= rating
            );
        });
    }

    const savedRating = localStorage.getItem(storageKey);

    if (savedRating !== null) {
        showRating(Number(savedRating));
        message.textContent = "Your rating: " + savedRating + "/5 stars";
    }

    stars.forEach(function(star) {
        star.addEventListener("click", function() {
            if (localStorage.getItem(storageKey) !== null) {
                message.textContent = "You have already rated this course.";
                return;
            }

            const rating = Number(star.dataset.rating);

            localStorage.setItem(storageKey, rating);
            showRating(rating);
            message.textContent = "Thank you! Your rating: " + rating + "/5 stars";
        });
    });
});
