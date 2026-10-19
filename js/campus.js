

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

// 4. Open campus-life photos in a full-image preview
function setupLifeImagePreview() {
    const gallery = document.querySelector(".life-gallery-grid");
    const dialog = document.querySelector(".life-image-dialog");
    const previewImage = dialog?.querySelector("img");
    const previewCaption = dialog?.querySelector("figcaption");
    const closeButton = dialog?.querySelector(".life-image-dialog-close");

    if (!gallery || !(dialog instanceof HTMLDialogElement) ||
        !previewImage || !previewCaption || !closeButton) {
        return;
    }

    let lastTrigger = null;

    gallery.addEventListener("click", function (event) {
        const trigger = event.target.closest(".life-gallery-open");

        if (!trigger || !gallery.contains(trigger)) {
            return;
        }

        const thumbnail = trigger.querySelector("img");
        const caption = trigger.closest("figure")?.querySelector("figcaption");

        if (!thumbnail || !caption) {
            return;
        }

        lastTrigger = trigger;
        previewImage.src = thumbnail.currentSrc || thumbnail.src;
        previewImage.alt = thumbnail.alt;
        previewCaption.textContent = caption.textContent.trim();
        dialog.showModal();
        closeButton.focus();
    });

    closeButton.addEventListener("click", function () {
        dialog.close();
    });

    dialog.addEventListener("click", function (event) {
        if (event.target === dialog) {
            dialog.close();
        }
    });

    dialog.addEventListener("close", function () {
        previewImage.removeAttribute("src");
        previewImage.alt = "";

        if (lastTrigger?.isConnected) {
            lastTrigger.focus();
        }
    });
}

// 5. Initialize all features after the HTML loads
document.addEventListener("DOMContentLoaded", function () {
    updateFooterYear();
    setupStudentLifeSearch();
    setupInteractiveCards();
    setupLifeImagePreview();
});