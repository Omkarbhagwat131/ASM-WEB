document.addEventListener("DOMContentLoaded", () => {
    loadFacultyData();
});

let facultyData = [];
let lastFocusedElement = null;

const elements = {
    searchInput: document.getElementById("searchInput"),
    departmentFilter: document.getElementById("departmentFilter"),
    facultyGrid: document.getElementById("facultyGrid"),
    loadingMessage: document.getElementById("loadingMessage"),
    noResults: document.getElementById("noResults"),
    searchMessage: document.getElementById("searchMessage"),

    modal: document.getElementById("facultyModal"),
    modalPhoto: document.getElementById("modalFacultyPhoto"),
    modalName: document.getElementById("modalFacultyName"),
    modalDesignation: document.getElementById("modalFacultyDesignation"),
    modalDepartment: document.getElementById("modalFacultyDepartment"),
    modalQualification: document.getElementById("modalFacultyQualification"),
    modalExperience: document.getElementById("modalFacultyExperience")
};

// Load faculty information from JSON
async function loadFacultyData() {
    try {
        showLoading(true);

        const response = await fetch("../data/faculty.json");

        if (!response.ok) {
            throw new Error(`Unable to load faculty data. Status: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Faculty JSON must contain an array.");
        }

        facultyData = data;

        populateDepartments();
        restoreSearchPreferences();
        renderFaculty();
        setupModal();
        setupSearchPreferences();

    } catch (error) {
        console.error("Faculty loading error:", error);

        elements.facultyGrid.replaceChildren();

        if (elements.loadingMessage) {
            elements.loadingMessage.hidden = true;
        }

        if (elements.noResults) {
            elements.noResults.hidden = false;
            elements.noResults.textContent =
                "Unable to load faculty information. Please check the JSON file and try again.";
        }
    }
}

// Show or hide loading message
function showLoading(isLoading) {
    if (elements.loadingMessage) {
        elements.loadingMessage.hidden = !isLoading;
    }

    if (isLoading && elements.noResults) {
        elements.noResults.hidden = true;
    }
}

// Create department filter options
function populateDepartments() {
    if (!elements.departmentFilter) return;

    const currentValue = elements.departmentFilter.value;

    elements.departmentFilter.replaceChildren();

    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "All Departments";
    elements.departmentFilter.appendChild(allOption);

    const departments = [
        ...new Set(
            facultyData
                .map(faculty => faculty.department)
                .filter(Boolean)
        )
    ].sort();

    departments.forEach(department => {
        const option = document.createElement("option");
        option.value = department;
        option.textContent = department;
        elements.departmentFilter.appendChild(option);
    });

    if (
        currentValue === "all" ||
        departments.includes(currentValue)
    ) {
        elements.departmentFilter.value = currentValue || "all";
    }
}

// Restore saved search preferences
function restoreSearchPreferences() {
    try {
        const savedSearch = localStorage.getItem("facultySearch") || "";
        const savedDepartment =
            localStorage.getItem("facultyDepartment") || "all";

        if (elements.searchInput) {
            elements.searchInput.value = savedSearch;
        }

        if (
            elements.departmentFilter &&
            [...elements.departmentFilter.options].some(
                option => option.value === savedDepartment
            )
        ) {
            elements.departmentFilter.value = savedDepartment;
        }
    } catch (error) {
        console.warn("Could not restore search preferences:", error);
    }
}

// Save search preferences
function setupSearchPreferences() {
    if (elements.searchInput) {
        elements.searchInput.addEventListener("input", () => {
            saveSearchPreferences();
            renderFaculty();
        });
    }

    if (elements.departmentFilter) {
        elements.departmentFilter.addEventListener("change", () => {
            saveSearchPreferences();
            renderFaculty();
        });
    }

    // Event delegation for faculty cards and menu buttons
    if (elements.facultyGrid) {
        elements.facultyGrid.addEventListener("click", event => {
            const detailsButton = event.target.closest(".view-details-btn");
            const menuButton = event.target.closest(".three-dots-btn");
            const linkedinButton = event.target.closest(".linkedin-link");

            if (detailsButton) {
                openFacultyModal(Number(detailsButton.dataset.id));
            }

            if (menuButton) {
                const menu = menuButton.parentElement.querySelector(
                    ".faculty-menu"
                );

                if (!menu) return;

                const isOpen = !menu.hidden;

                document.querySelectorAll(".faculty-menu").forEach(item => {
                    item.hidden = true;
                });

                document.querySelectorAll(".three-dots-btn").forEach(button => {
                    button.setAttribute("aria-expanded", "false");
                });

                menu.hidden = isOpen;
                menuButton.setAttribute("aria-expanded", String(!isOpen));
            }

            if (linkedinButton) {
                const url = linkedinButton.dataset.url;

                if (url) {
                    window.open(url, "_blank", "noopener,noreferrer");
                }
            }
        });
    }

    // Close menus when clicking elsewhere
    document.addEventListener("click", event => {
        if (!event.target.closest(".faculty-menu-wrapper")) {
            document.querySelectorAll(".faculty-menu").forEach(menu => {
                menu.hidden = true;
            });

            document.querySelectorAll(".three-dots-btn").forEach(button => {
                button.setAttribute("aria-expanded", "false");
            });
        }
    });
}

function saveSearchPreferences() {
    try {
        if (elements.searchInput) {
            localStorage.setItem(
                "facultySearch",
                elements.searchInput.value
            );
        }

        if (elements.departmentFilter) {
            localStorage.setItem(
                "facultyDepartment",
                elements.departmentFilter.value
            );
        }
    } catch (error) {
        console.warn("Could not save search preferences:", error);
    }
}

// Filter and render faculty cards
function renderFaculty() {
    if (!elements.facultyGrid) return;

    const searchTerm = elements.searchInput
        ? elements.searchInput.value.trim().toLowerCase()
        : "";

    const selectedDepartment = elements.departmentFilter
        ? elements.departmentFilter.value
        : "all";

    const filteredFaculty = facultyData.filter(faculty => {
        const searchableText = [
            faculty.name,
            faculty.designation,
            faculty.department,
            faculty.qualification,
            faculty.experience,
            ...(Array.isArray(faculty.subjects) ? faculty.subjects : [])
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        const matchesSearch = searchableText.includes(searchTerm);

        const matchesDepartment =
            selectedDepartment === "all" ||
            faculty.department === selectedDepartment;

        return matchesSearch && matchesDepartment;
    });

    elements.facultyGrid.replaceChildren();

    filteredFaculty.forEach(faculty => {
        elements.facultyGrid.appendChild(createFacultyCard(faculty));
    });

    showLoading(false);

    if (elements.noResults) {
        elements.noResults.hidden = filteredFaculty.length > 0;
        elements.noResults.textContent = "No faculty members found. Try another search.";
    }

    if (elements.searchMessage) {
        elements.searchMessage.textContent =
            `${filteredFaculty.length} faculty member(s) found`;
    }

    setupRevealAnimation();
}

// Create an individual faculty card
function createFacultyCard(faculty) {
    const card = document.createElement("article");
    card.className = "faculty-card reveal";

    const photoContainer = document.createElement("div");
    photoContainer.className = "faculty-photo";

    const image = document.createElement("img");
    image.alt = faculty.imageAlt || faculty.name || "Faculty member";
    image.loading = "lazy";
    image.decoding = "async";

    if (faculty.image) {
        const cleanPath = faculty.image.replace(/^\/+/, "");
        image.src = new URL("../" + cleanPath, document.baseURI).href;
    } else {
        image.hidden = true;
    }

    image.addEventListener("error", () => {
        image.hidden = true;

        if (!photoContainer.querySelector(".photo-fallback")) {
            const fallback = document.createElement("span");
            fallback.className = "photo-fallback";
            fallback.textContent = "👨‍🏫";
            photoContainer.appendChild(fallback);
        }
    });

    photoContainer.appendChild(image);

    const information = document.createElement("div");
    information.className = "faculty-info";

    const name = document.createElement("h3");
    name.textContent = faculty.name || "Faculty Member";

    const designation = document.createElement("p");
    designation.className = "faculty-designation";
    designation.textContent = faculty.designation || "Faculty";

    const department = document.createElement("p");
    department.className = "faculty-department";
    department.textContent = `Department: ${faculty.department || "Not specified"}`;

    const qualification = document.createElement("p");
    qualification.className = "faculty-qualification";
    qualification.textContent =
        `Qualification: ${faculty.qualification || "Not specified"}`;

    const experience = document.createElement("p");
    experience.className = "faculty-experience";
    experience.textContent =
        `Experience: ${faculty.experience || "Not specified"}`;

    const actions = document.createElement("div");
    actions.className = "faculty-actions";

    const detailsButton = document.createElement("button");
    detailsButton.type = "button";
    detailsButton.className = "view-details-btn";
    detailsButton.textContent = "View Details";
    detailsButton.dataset.id = faculty.id;
    detailsButton.setAttribute("aria-label", `View details for ${faculty.name}`);

    actions.appendChild(detailsButton);

    // Three-dot menu
    const menuWrapper = document.createElement("div");
    menuWrapper.className = "faculty-menu-wrapper";

    const menuButton = document.createElement("button");
    menuButton.type = "button";
    menuButton.className = "three-dots-btn";
    menuButton.textContent = "⋮";
    menuButton.setAttribute("aria-label", `More options for ${faculty.name}`);
    menuButton.setAttribute("aria-expanded", "false");

    const menu = document.createElement("div");
    menu.className = "faculty-menu";
    menu.hidden = true;

    const menuDetails = document.createElement("button");
    menuDetails.type = "button";
    menuDetails.className = "view-details-btn";
    menuDetails.textContent = "View Details";
    menuDetails.dataset.id = faculty.id;

    menu.appendChild(menuDetails);

    if (faculty.linkedin) {
        const linkedinLink = document.createElement("button");
        linkedinLink.type = "button";
        linkedinLink.className = "linkedin-link";
        linkedinLink.textContent = "LinkedIn Profile";
        linkedinLink.dataset.url = faculty.linkedin;
        menu.appendChild(linkedinLink);
    }

    menuWrapper.append(menuButton, menu);
    actions.appendChild(menuWrapper);

    information.append(
        name,
        designation,
        department,
        qualification,
        experience,
        actions
    );

    card.append(photoContainer, information);

    return card;
}

// Set up entrance animation
function setupRevealAnimation() {
    const cards = elements.facultyGrid
        ? elements.facultyGrid.querySelectorAll(".reveal:not(.is-visible)")
        : [];

    if (!("IntersectionObserver" in window)) {
        cards.forEach(card => card.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                currentObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    cards.forEach(card => observer.observe(card));
}

// Open faculty details modal
function openFacultyModal(id) {
    const faculty = facultyData.find(item => Number(item.id) === id);

    if (!faculty || !elements.modal) return;

    lastFocusedElement = document.activeElement;

    if (elements.modalPhoto) {
        elements.modalPhoto.alt = faculty.imageAlt || faculty.name || "Faculty member";
        elements.modalPhoto.loading = "lazy";
        elements.modalPhoto.decoding = "async";

        if (faculty.image) {
            const cleanPath = faculty.image.replace(/^\/+/, "");
            elements.modalPhoto.src =
                new URL("../" + cleanPath, document.baseURI).href;
            elements.modalPhoto.hidden = false;
        } else {
            elements.modalPhoto.removeAttribute("src");
            elements.modalPhoto.hidden = true;
        }
    }

    if (elements.modalName) {
        elements.modalName.textContent = faculty.name || "Faculty Member";
    }

    if (elements.modalDesignation) {
        elements.modalDesignation.textContent =
            faculty.designation || "Not specified";
    }

    if (elements.modalDepartment) {
        elements.modalDepartment.textContent =
            faculty.department || "Not specified";
    }

    if (elements.modalQualification) {
        elements.modalQualification.textContent =
            faculty.qualification || "Not specified";
    }

    if (elements.modalExperience) {
        elements.modalExperience.textContent =
            faculty.experience || "Not specified";
    }

    elements.modal.hidden = false;
    elements.modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const closeButton = elements.modal.querySelector(".faculty-modal-close");

    if (closeButton) {
        closeButton.focus();
    }
}

// Close modal
function closeFacultyModal() {
    if (!elements.modal) return;

    elements.modal.hidden = true;
    elements.modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus();
    }
}

// Set up modal close events
function setupModal() {
    if (!elements.modal) return;

    const closeButton = elements.modal.querySelector(".faculty-modal-close");

    if (closeButton) {
        closeButton.addEventListener("click", closeFacultyModal);
    }

    elements.modal.addEventListener("click", event => {
        if (event.target === elements.modal) {
            closeFacultyModal();
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !elements.modal.hidden) {
            closeFacultyModal();
        }
    });
}
