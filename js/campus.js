
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



/* 7. Load campus information from JSON */
async function loadCampusData() {
    try {
        const response = await fetch("data/campus.json");

        if (!response.ok) {
            throw new Error("Unable to load campus.json");
        }

        const campusData = await response.json();

        console.log("Campus JSON data loaded successfully:", campusData);

        return campusData;
    } catch (error) {
        console.error("Error loading campus data:", error);
        return null;
    }
}

/* 8. Display Student Life data */

function displayStudentLife(items) {
    const container = document.getElementById(
        "json-student-life-container"
    );

    if (!container || !Array.isArray(items)) return;

    container.replaceChildren();

    items.forEach(item => {
        const card = document.createElement("article");
        card.className = "life-card";

        // 1. Title
        const heading = document.createElement("h3");
        heading.textContent = item.title;
        card.appendChild(heading);

        // 2. Image
        const imageButton = document.createElement("button");
        imageButton.type = "button";
        imageButton.className = "activity-image-button";
        imageButton.setAttribute(
            "aria-label",
            `View ${item.title} photo`
        );

        const image = document.createElement("img");
        image.src = item.image;
        image.alt = item.title;
        image.className = "activity-image";
        image.loading = "lazy";

        imageButton.appendChild(image);
        card.appendChild(imageButton);

        // 3. Description
        const description = document.createElement("p");
        description.textContent = item.description;
        card.appendChild(description);

        // 4. Click image to view larger photo
        imageButton.addEventListener("click", () => {
            const overlay = document.createElement("div");
            overlay.className = "activity-photo-overlay";

            const largeImage = document.createElement("img");
            largeImage.src = item.image;
            largeImage.alt = item.title;
            largeImage.className = "activity-large-image";

            const closeButton = document.createElement("button");
            closeButton.type = "button";
            closeButton.className = "activity-photo-close";
            closeButton.textContent = "×";
            closeButton.setAttribute("aria-label", "Close photo");

            function closePhoto() {
                overlay.remove();
                document.removeEventListener("keydown", handleEscape);
            }

            function handleEscape(event) {
                if (event.key === "Escape") {
                    closePhoto();
                }
            }

            closeButton.addEventListener("click", closePhoto);

            overlay.addEventListener("click", event => {
                if (event.target === overlay) {
                    closePhoto();
                }
            });

            overlay.append(largeImage, closeButton);
            document.body.appendChild(overlay);
            document.addEventListener("keydown", handleEscape);
        });

        container.appendChild(card);
    });
}


/* 9. Display Gallery data */

function displayGallery(items) {
    const mainContainer = document.getElementById(
        "asm-campus-gallery-container"
    );

    const exploreContainer = document.getElementById(
        "explore-campus-gallery-container"
    );

    const exploreButton = document.getElementById(
        "explore-campus-button"
    );

    if (!mainContainer || !exploreContainer || !Array.isArray(items)) {
        return;
    }

    mainContainer.replaceChildren();
    exploreContainer.replaceChildren();

    // First image: college building
    const mainImage = items.find(
        item => item.id === "campus"
    );

    // Remaining images: Explore College Campus
    const otherImages = items.filter(
    item => item.id !== "campus" && item.image
);

    // Reuse the existing gallery card and lightbox functionality
    function createGalleryCard(item) {
        const card = document.createElement("article");
        card.className = "gallery-card";

        const imageButton = document.createElement("button");
        imageButton.type = "button";
        imageButton.className = "gallery-image-button";
        imageButton.setAttribute(
            "aria-label",
            `View ${item.title || "Campus photo"}`
        );

        const image = document.createElement("img");
        image.src = item.image;
        image.alt = item.title || "Campus photo";
        image.loading = "lazy";

        image.addEventListener("error", () => {
            console.error("Image could not load:", item.image);
        });

        imageButton.appendChild(image);


// Display only the campus image without text
card.appendChild(imageButton);

        // Open photo in lightbox
        imageButton.addEventListener("click", () => {
            if (document.getElementById("campus-image-lightbox")) {
                return;
            }

            const overlay = document.createElement("div");
            overlay.id = "campus-image-lightbox";
            overlay.className = "gallery-lightbox";
            overlay.setAttribute("role", "dialog");
            overlay.setAttribute("aria-modal", "true");

            const contentBox = document.createElement("div");
            contentBox.className = "lightbox-content";

            const largeImage = document.createElement("img");
            largeImage.className = "lightbox-image";
            largeImage.src = item.image;
            largeImage.alt = item.title || "Campus photo";

            const title = document.createElement("h2");
            title.className = "lightbox-title";
            title.textContent = item.title || "Campus photo";

            const caption = document.createElement("p");
            caption.className = "lightbox-caption";
            caption.textContent = item.description || "";

            const closeButton = document.createElement("button");
            closeButton.type = "button";
            closeButton.textContent = "Close ✕";

            function closeLightbox() {
                overlay.remove();
                imageButton.focus();
            }

            closeButton.addEventListener("click", closeLightbox);

            overlay.addEventListener("click", event => {
                if (event.target === overlay) {
                    closeLightbox();
                }
            });

            overlay.addEventListener("keydown", event => {
                if (event.key === "Escape") {
                    closeLightbox();
                }
            });

            contentBox.append(
                largeImage,
                title,
                caption,
                closeButton
            );

            overlay.appendChild(contentBox);
            document.body.appendChild(overlay);
            closeButton.focus();
        });

        return card;
    }

    // Display only the main college building initially
    if (mainImage) {
        mainContainer.appendChild(createGalleryCard(mainImage));
    }

    // Prepare the remaining photos in the hidden gallery
    otherImages.forEach(item => {
        exploreContainer.appendChild(createGalleryCard(item));
    });

    // Show or hide the additional photos
    // Hide extra photos when the page first loads
exploreContainer.hidden = true;

if (exploreButton) {
    exploreButton.hidden = otherImages.length === 0;
    exploreButton.setAttribute("aria-expanded", "false");
    exploreButton.textContent = "Explore College Campus";
       

        exploreButton.onclick = () => {
            const isExpanded =
                exploreButton.getAttribute("aria-expanded") === "true";

            exploreContainer.hidden = isExpanded;
            exploreButton.setAttribute(
                "aria-expanded",
                String(!isExpanded)
            );

            exploreButton.textContent = isExpanded
                ? "Explore College Campus"
                : "Show Less";
        };
    }
}


/* 11. Initialize the page */
document.addEventListener("DOMContentLoaded", async function () {
    const campusData = await loadCampusData();

    if (!campusData) return;

    displayStudentLife(campusData.studentLife || []);
    displayGallery(campusData.gallery || []);
});
