

"use strict";

// 1. Automatically update the footer year
function updateFooterYear() {
    const yearElement = document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// 2. Search Student Life cards
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

        lifeCards.forEach(function (card) {
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
                visibleCount +
                (visibleCount === 1
                    ? " result found."
                    : " results found.");
        }
    }

    searchInput.addEventListener("input", filterCards);
}

// 3. Interactive cards
function setupInteractiveCards() {
    const cardButtons = document.querySelectorAll(".card-toggle");

    cardButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const card = button.closest(".life-card");

            if (!card) {
                return;
            }

            const details = card.querySelector(".card-details");

            if (!details) {
                return;
            }

            const isExpanded =
                button.getAttribute("aria-expanded") === "true";

            details.hidden = isExpanded;

            button.setAttribute(
                "aria-expanded",
                String(!isExpanded)
            );

            button.textContent = isExpanded
                ? "Learn more"
                : "Show less";
        });
    });
}

// 4. Initialize all features after the HTML loads
document.addEventListener("DOMContentLoaded", function () {
    updateFooterYear();
    setupStudentLifeSearch();
    setupInteractiveCards();
});