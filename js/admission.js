document.addEventListener("DOMContentLoaded", () => {
    // DAY 5: Program search and category filtering
    const searchInput = document.querySelector("#program-search");
    const categorySelect = document.querySelector("#program-category");
    const resetButton = document.querySelector("#reset-program-filters");
    const emptyMessage = document.querySelector("#program-empty-message");
    const programCards = document.querySelectorAll("[data-program-card]");

    const categoryKey = "asm-admission-category";
    const selectedProgramKey = "asm-selected-program";

    // Safely read browser preferences
    function readPreference(key, fallback) {
        try {
            return localStorage.getItem(key) || fallback;
        } catch (error) {
            console.warn("Could not read browser preference:", error);
            return fallback;
        }
    }

    // Safely save browser preferences
    function savePreference(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.warn("Could not save browser preference:", error);
        }
    }

    // DAY 5: Restore the last selected program
    function markSelectedProgram(programName) {
        programCards.forEach((card) => {
            const heading = card.querySelector("h3");
            const isSelected =
                heading && heading.textContent.trim() === programName;

            card.style.outline = isSelected
                ? "3px solid #1d4ed8"
                : "";
            card.style.outlineOffset = isSelected ? "3px" : "";
        });
    }

    const savedProgram = readPreference(selectedProgramKey, "");

    if (savedProgram) {
        markSelectedProgram(savedProgram);
    }

    // Restore the saved category, accepting only valid values
    const savedCategory = readPreference(categoryKey, "all");
    const validCategories = ["all", "ug", "pg"];

    if (
        categorySelect &&
        validCategories.includes(savedCategory)
    ) {
        categorySelect.value = savedCategory;
    }

    // Search and category filtering work together
    function filterPrograms() {
        if (!searchInput || !categorySelect) {
            return;
        }

        const searchTerm = searchInput.value.trim().toLowerCase();
        const selectedCategory = categorySelect.value;
        let visibleCount = 0;

        programCards.forEach((card) => {
            const heading = card.querySelector("h3");
            const description = card.querySelector("p");

            const searchableText = [
                heading ? heading.textContent : "",
                description ? description.textContent : ""
            ].join(" ").toLowerCase();

            const matchesSearch = searchableText.includes(searchTerm);
            const matchesCategory =
                selectedCategory === "all" ||
                card.dataset.category === selectedCategory;

            const isVisible = matchesSearch && matchesCategory;

            card.hidden = !isVisible;

            if (isVisible) {
                visibleCount++;
            }
        });

        if (emptyMessage) {
            emptyMessage.hidden = visibleCount !== 0;
        }

        savePreference(categoryKey, selectedCategory);
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterPrograms);
    }

    if (categorySelect) {
        categorySelect.addEventListener("change", filterPrograms);
    }

    if (resetButton) {
        resetButton.addEventListener("click", () => {
            if (searchInput) {
                searchInput.value = "";
            }

            if (categorySelect) {
                categorySelect.value = "all";
            }

            filterPrograms();
        });
    }

    // Display the correct initial results
    filterPrograms();

    // DAY 4: Admission Process card hover and click interactions
    const processCards = document.querySelectorAll(
        "#admission-process .department-card"
    );

    processCards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
            card.style.transform = "translateY(-5px)";
            card.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.15)";
            card.style.transition = "transform 0.3s, box-shadow 0.3s";
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
            card.style.boxShadow = "";
        });

        card.addEventListener("click", () => {
            const heading = card.querySelector("h3");

            if (heading) {
                alert(`You selected: ${heading.textContent.trim()}`);
            }
        });
    });

    // Remember which program the user selects
    // Event delegation: one listener handles both program cards
    const programsSection = document.querySelector("#programs-section");

    if (programsSection) {
        programsSection.addEventListener("click", (event) => {
            const card = event.target.closest("[data-program-card]");

            if (!card || !programsSection.contains(card)) {
                return;
            }

            const heading = card.querySelector("h3");

            if (heading) {
                const programName = heading.textContent.trim();

                savePreference(selectedProgramKey, programName);
                markSelectedProgram(programName);
            }
        });
    }
});