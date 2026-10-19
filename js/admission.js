/* Admission cards, program filtering, and saved preferences */

function escapeAdmissionHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };
        return entities[character];
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("program-search");
    const typeSelect = document.getElementById("program-type-filter");
    const status = document.getElementById("program-filter-status");
    const preferenceKey = "asm-admission-program-preferences";

    if (!searchInput || !typeSelect || !status) {
        return;
    }

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

        document.querySelectorAll("#career-path .department-card").forEach(function (card) {
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
    document.addEventListener("admissionprogramsloaded", filterPrograms);
    filterPrograms();
});

document.addEventListener("click", function (event) {
    const card = event.target.closest(
        "#admission-process-grid .department-card, #eligibility-grid .department-card"
    );
    const heading = card && card.querySelector("h3");

    if (heading) {
        alert("You selected: " + heading.textContent);
    }
});

async function loadAdmissionCards() {
    try {
        const response = await fetch("./admission.json");
        if (!response.ok) {
            throw new Error("Could not load admission.json: " + response.status);
        }

        const admissionData = await response.json();
        const programGrid = document.getElementById("program-grid");
        const eligibilityGrid = document.getElementById("eligibility-grid");
        const processGrid = document.getElementById("admission-process-grid");

        if (!programGrid || !eligibilityGrid || !processGrid) {
            throw new Error("One or more admission card containers could not be found");
        }
        if (
            !Array.isArray(admissionData.programs) ||
            !Array.isArray(admissionData.eligibility) ||
            !Array.isArray(admissionData.admissionProcess)
        ) {
            throw new Error("admission.json must include programs, eligibility, and admissionProcess arrays");
        }

        programGrid.innerHTML = admissionData.programs.map(function (program) {
            return `
                <div class="department-card"
                     data-program-type="${escapeAdmissionHtml(program.type)}">
                    <div class="card-icon">
                        <i class="${escapeAdmissionHtml(program.icon)}"></i>
                    </div>
                    <span class="card-label">${escapeAdmissionHtml(program.label)}</span>
                    <h3>${escapeAdmissionHtml(program.title)}</h3>
                    <p>${escapeAdmissionHtml(program.description)}</p>
                    <ul class="department-feature-list">
                        ${program.features.map(function (feature) {
                            return `<li>${escapeAdmissionHtml(feature)}</li>`;
                        }).join("")}
                    </ul>
                </div>
            `;
        }).join("");

        eligibilityGrid.innerHTML = admissionData.eligibility.map(function (item) {
            return `
                <div class="department-card eligibility-card">
                    <div class="card-icon"><i class="${escapeAdmissionHtml(item.icon)}"></i></div>
                    <h3>${escapeAdmissionHtml(item.title)}</h3>
                    <p>${escapeAdmissionHtml(item.description)}</p>
                </div>
            `;
        }).join("");

        processGrid.innerHTML = admissionData.admissionProcess.map(function (step) {
            return `
                <div class="department-card">
                    <div class="card-icon">
                        <i class="${escapeAdmissionHtml(step.icon)}"></i>
                    </div>
                    <h3>${escapeAdmissionHtml(step.title)}</h3>
                    <p>${escapeAdmissionHtml(step.description)}</p>
                </div>
            `;
        }).join("");

        document.dispatchEvent(new Event("admissionprogramsloaded"));
    } catch (error) {
        console.error("Error loading admission cards:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadAdmissionCards);
