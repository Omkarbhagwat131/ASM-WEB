/* Program search, type filtering, and saved preferences */

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("program-search");
    const typeSelect = document.getElementById("program-type-filter");
    const status = document.getElementById("program-filter-status");
    const programCards = document.querySelectorAll("#career-path .department-card");
    const preferenceKey = "asm-admission-program-preferences";

    if (searchInput && typeSelect && status && programCards.length > 0) {
        function savePreferences() {
            try {
                localStorage.setItem(preferenceKey, JSON.stringify({
                    search: searchInput.value,
                    type: typeSelect.value
                })); 
            } catch (error) {
                console.error("Could not save admission program preferences:", error);
            }
        }

        function filterPrograms() {
            const searchText = searchInput.value.trim().toLowerCase();
            const selectedType = typeSelect.value;
            let visibleCount = 0;

            programCards.forEach(function (card) {
                const title = card.querySelector("h3");
                const matchesTitle = title && title.textContent.toLowerCase().includes(searchText);
                const matchesType =
                    selectedType === "all" || card.dataset.programType === selectedType;
                const isVisible = matchesTitle && matchesType;

                card.hidden = !isVisible;
                if (isVisible) {
                    visibleCount += 1;
                }
            });

            status.textContent = visibleCount === 0
                ? "No programs match your search."
                : visibleCount + (visibleCount === 1 ? " program found." : " programs found.");
            savePreferences();
        }

        try {
            const savedPreferences = localStorage.getItem(preferenceKey);
            if (savedPreferences) {
                const preferences = JSON.parse(savedPreferences);
                if (preferences && typeof preferences.search === "string") {
                    searchInput.value = preferences.search;
                }
                if (preferences && ["all", "ug", "pg"].includes(preferences.type)) {
                    typeSelect.value = preferences.type;
                }
            }
        } catch (error) {
            console.error("Could not load admission program preferences:", error);
        }

        searchInput.addEventListener("input", filterPrograms);
        typeSelect.addEventListener("change", filterPrograms);
        filterPrograms();
    }
});

/* ADMISSION MODULE - Event 1: Card hover */

document.addEventListener("DOMContentLoaded", function () {
    const programCards = document.querySelectorAll(
        "#admission-process .department-card, #eligibility-criteria .department-card"
    );

    programCards.forEach(function (card) {
        card.addEventListener("mouseenter", function () {
            card.style.transform = "translateY(-5px)";
            card.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.15)";
            card.style.transition =
                "transform 0.3s, box-shadow 0.3s";
        });

        card.addEventListener("mouseleave", function () {
            card.style.transform = "";
            card.style.boxShadow = "";
        });
    });
});

/* ADMISSION MODULE - Event 2: Card click */

document.addEventListener("DOMContentLoaded", function () {
    const programCards = document.querySelectorAll(
        "#admission-process .department-card, #eligibility-criteria .department-card"
    );

    programCards.forEach(function (card) {
        card.addEventListener("click", function () {
            const heading = card.querySelector("h3");

            if (heading) {
                alert("You selected: " + heading.textContent);
            }
        });
    });
});