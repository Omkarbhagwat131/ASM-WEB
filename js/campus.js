
"use strict";

const STORAGE_KEY = "asmCampusPreferences";

// 1. Update footer year automatically
function updateFooterYear() {
    const yearElement = document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// 2. Safely read saved preferences from localStorage
function loadPreferences() {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);

        if (!savedData) {
            return { expandedCards: [] };
        }

        const preferences = JSON.parse(savedData);

        if (
            !preferences ||
            typeof preferences !== "object" ||
            !Array.isArray(preferences.expandedCards)
        ) {
            return { expandedCards: [] };
        }

        return {
            expandedCards: preferences.expandedCards.filter(
                item => typeof item === "string"
            )
        };
    } catch (error) {
        console.warn("Could not load saved preferences.");
        return { expandedCards: [] };
    }
}

// 3. Save preferences safely
function savePreferences(preferences) {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(preferences)
        );
    } catch (error) {
        console.warn("Could not save preferences.");
    }
}

// 4. Debouncing: wait before filtering search results
function setupStudentLifeSearch() {
    const searchInput = document.getElementById("life-search-input");
    const searchMessage = document.getElementById("search-message");
    const lifeCards = document.querySelectorAll(".life-card");

    if (!searchInput || !searchMessage || lifeCards.length === 0) {
        return;
    }

    function filterCards() {
        const searchText = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        lifeCards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            const matches = cardText.includes(searchText);

            card.hidden = !matches;

            if (matches) {
                visibleCount++;
            }
        });

        if (searchText === "") {
            searchMessage.textContent = "";
        } else if (visibleCount === 0) {
            searchMessage.textContent =
                "No results found. Try another keyword.";
        } else {
            searchMessage.textContent =
                `${visibleCount} result${visibleCount === 1 ? "" : "s"} found.`;
        }
    }

    let debounceTimer;

    searchInput.addEventListener("input", function () {
        clearTimeout(debounceTimer);

        debounceTimer = setTimeout(filterCards, 250);
    });
}

// 5. Event delegation for all Learn more buttons
function setupInteractiveCards() {
    const lifeGrid = document.querySelector(".life-grid");

    if (!lifeGrid) {
        return;
    }

    const preferences = loadPreferences();
    const cardButtons = lifeGrid.querySelectorAll(".card-toggle");

    // Restore saved card preferences
    cardButtons.forEach(button => {
        const card = button.closest(".life-card");
        const heading = card?.querySelector("h3");
        const details = card?.querySelector(".card-details");

        if (!heading || !details) {
            return;
        }

        const isExpanded = preferences.expandedCards.includes(
            heading.textContent.trim()
        );

        details.hidden = !isExpanded;
        button.setAttribute("aria-expanded", String(isExpanded));
        button.textContent = isExpanded ? "Show less" : "Learn more";
    });

    // One listener handles all card buttons
    lifeGrid.addEventListener("click", function (event) {
        const button = event.target.closest(".card-toggle");

        if (!button || !lifeGrid.contains(button)) {
            return;
        }

        const card = button.closest(".life-card");
        const heading = card?.querySelector("h3");
        const details = card?.querySelector(".card-details");

        if (!heading || !details) {
            return;
        }

        const isExpanded =
            button.getAttribute("aria-expanded") === "true";

        const newExpandedState = !isExpanded;

        details.hidden = !newExpandedState;
        button.setAttribute(
            "aria-expanded",
            String(newExpandedState)
        );
        button.textContent = newExpandedState
            ? "Show less"
            : "Learn more";

        // Update and save the expanded card list
        const expandedCards = new Set(
            loadPreferences().expandedCards
        );

        if (newExpandedState) {
            expandedCards.add(heading.textContent.trim());
        } else {
            expandedCards.delete(heading.textContent.trim());
        }

        savePreferences({
            expandedCards: [...expandedCards]
        });
    });
}

// 6. Initialize features after the HTML loads
document.addEventListener("DOMContentLoaded", function () {
    updateFooterYear();
    setupStudentLifeSearch();
    setupInteractiveCards();
});
