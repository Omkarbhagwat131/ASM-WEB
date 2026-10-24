
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const departmentFilter = document.getElementById("departmentFilter");
    const facultyGrid = document.getElementById("facultyGrid");
    const searchMessage = document.getElementById("searchMessage");
    const noResults = document.getElementById("noResults");
    const loadingMessage = document.getElementById("loadingMessage");

    const facultyModal = document.getElementById("facultyModal");
    const modalPhoto = document.getElementById("modalPhoto");
    const modalName = document.getElementById("modalName");
    const modalDetails = document.getElementById("modalDetails");
    const closeModalButton = document.getElementById("closeModal");

    const enquiryForm = document.getElementById("enquiryForm");
    const formStatus = document.getElementById("formStatus");

    const STORAGE_KEY = "facultySearchPreference";
    let facultyData = [];

    // Check required HTML elements.
    const requiredElements = [
        searchInput, facultyGrid, searchMessage, noResults,
        loadingMessage, facultyModal, modalPhoto, modalName,
        modalDetails, closeModalButton, enquiryForm, formStatus
    ];

    if (requiredElements.some(element => !element)) {
        console.error("Required HTML elements are missing.");
        return;
    }

    // 1. Load faculty data from JSON.
    async function loadFacultyData() {
        try {
            const response = await fetch("data/faculty.json");

            if (!response.ok) {
                throw new Error("Could not load data/faculty.json");
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error("Faculty JSON must contain an array.");
            }

            facultyData = data;
            populateDepartmentFilter();
            renderFaculty(facultyData);

            try {
                searchInput.value = localStorage.getItem(STORAGE_KEY) || "";
            } catch (error) {
                console.warn("Could not restore search preference.");
            }

            searchFaculty();

        } catch (error) {
            console.error("Faculty JSON loading error:", error);
            loadingMessage.textContent =
                "Could not load faculty data. Check the JSON path and use Live Server.";
            searchMessage.textContent =
                "Faculty information could not be loaded.";
        }
    }

    function populateDepartmentFilter() {
        if (!departmentFilter) return;

        [...new Set(facultyData.map(faculty => faculty.department).filter(Boolean))]
            .sort((first, second) => first.localeCompare(second))
            .forEach(department => {
                const option = document.createElement("option");
                option.value = department;
                option.textContent = department;
                departmentFilter.appendChild(option);
            });
    }

    // 2. Create faculty cards and clickable three-dots menu.
    function renderFaculty(list) {
        facultyGrid.querySelectorAll(".faculty-card").forEach(card => {
            card.remove();
        });

        list.forEach(faculty => {
            const card = document.createElement("article");
            card.className = "faculty-card";
            card.dataset.facultyId = String(faculty.id);

            // Faculty photo.
            const photoWrapper = document.createElement("div");
            photoWrapper.className = "faculty-photo";

            const image = document.createElement("img");
            image.src = faculty.image || "";
            image.alt = faculty.imageAlt || faculty.name || "Faculty photo";
            image.loading = "lazy";

            image.addEventListener("error", () => {
                console.warn("Faculty image could not be loaded:", faculty.image);
            });

            photoWrapper.appendChild(image);

            // Three-dots menu.
            const menu = document.createElement("div");
            menu.className = "faculty-card-menu";

            const dotsButton = document.createElement("button");
            dotsButton.type = "button";
            dotsButton.className = "three-dots-btn";
            dotsButton.textContent = "\u22EE";
            dotsButton.setAttribute(
                "aria-label",
                "More options for " + (faculty.name || "faculty member")
            );
            dotsButton.setAttribute("aria-haspopup", "true");
            dotsButton.setAttribute("aria-expanded", "false");

            // Dropdown.
            const dropdown = document.createElement("div");
            dropdown.className = "faculty-dropdown";

            const linkedInLink = document.createElement("a");
            linkedInLink.textContent = "LinkedIn Profile";

            const linkedinUrl = (faculty.linkedin || "").trim();
            let validLinkedInUrl = "";

            try {
                const parsedUrl = new URL(linkedinUrl);

                if (
                    ["https:", "http:"].includes(parsedUrl.protocol) &&
                    (
                        parsedUrl.hostname === "linkedin.com" ||
                        parsedUrl.hostname.endsWith(".linkedin.com")
                    )
                ) {
                    validLinkedInUrl = parsedUrl.href;
                }
            } catch (error) {
                // No valid URL is available.
            }

            if (validLinkedInUrl) {
                linkedInLink.href = validLinkedInUrl;
                linkedInLink.target = "_blank";
                linkedInLink.rel = "noopener noreferrer";
            } else {
                linkedInLink.href = "#";
                linkedInLink.addEventListener("click", event => {
                    event.preventDefault();
                    alert("LinkedIn profile URL is not available for this faculty member.");
                });
            }

            dropdown.appendChild(linkedInLink);
            menu.append(dotsButton, dropdown);

            // Faculty details.
            const name = document.createElement("h3");
            name.textContent = faculty.name || "Name not available";

            card.append(
                photoWrapper,
                menu,
                name,
                createParagraph("designation", faculty.designation),
                createParagraph("department", faculty.department),
                createParagraph("qualification", faculty.qualification),
                createParagraph("experience", faculty.experience),
                createParagraph(
                    "subjects",
                    "Subjects Taught: " + (faculty.subjects || []).join(", ")
                )
            );

            // View Details button.
            const detailsButton = document.createElement("button");
            detailsButton.type = "button";
            detailsButton.className = "view-details";
            detailsButton.textContent = "View Details";

            card.appendChild(detailsButton);
            facultyGrid.insertBefore(card, noResults);
        });

        loadingMessage.style.display = "none";
    }

    function createParagraph(className, value) {
        const paragraph = document.createElement("p");
        paragraph.className = className;
        paragraph.textContent = value || "";
        return paragraph;
    }

    // 3. Search faculty.
    function searchFaculty() {
        const searchText = searchInput.value.trim().toLowerCase();
        const selectedDepartment = departmentFilter?.value || "all";
        let visibleCount = 0;

        facultyGrid.querySelectorAll(".faculty-card").forEach(card => {
            const faculty = facultyData.find(
                item => String(item.id) === card.dataset.facultyId
            );

            const searchableText = faculty
                ? [
                    faculty.name,
                    faculty.designation,
                    faculty.department,
                    faculty.qualification,
                    faculty.experience
                ].join(" ").toLowerCase()
                : "";

            const matchesSearch = searchableText.includes(searchText);
            const matchesDepartment = selectedDepartment === "all" ||
                faculty?.department === selectedDepartment;
            const matches = matchesSearch && matchesDepartment;
            card.style.display = matches ? "" : "none";

            if (matches) {
                visibleCount++;
            }
        });

        noResults.style.display = visibleCount === 0 ? "block" : "none";

        searchMessage.textContent = searchText || selectedDepartment !== "all"
            ? `${visibleCount} faculty members found.`
            : "Meet our experienced and dedicated faculty members!";

        try {
            localStorage.setItem(STORAGE_KEY, searchInput.value);
        } catch (error) {
            console.warn("Could not save search preference.");
        }
    }

    searchInput.addEventListener("input", searchFaculty);
    departmentFilter?.addEventListener("change", searchFaculty);

    // 4. Three-dots click handler.
    facultyGrid.addEventListener("click", event => {
        const dotsButton = event.target.closest(".three-dots-btn");

        if (dotsButton) {
            event.preventDefault();
            event.stopPropagation();

            const currentMenu = dotsButton.closest(".faculty-card-menu");

            if (!currentMenu) return;

            const wasOpen = currentMenu.classList.contains("open");

            // Close every open menu first.
            document.querySelectorAll(".faculty-card-menu.open").forEach(menu => {
                menu.classList.remove("open");

                const button = menu.querySelector(".three-dots-btn");
                if (button) {
                    button.setAttribute("aria-expanded", "false");
                }
            });

            // Open the clicked menu if it was previously closed.
            if (!wasOpen) {
                currentMenu.classList.add("open");
                dotsButton.setAttribute("aria-expanded", "true");
            }

            return;
        }

        // Close menu when clicking another area inside the faculty grid.
        if (!event.target.closest(".faculty-card-menu")) {
            closeAllMenus();
        }
    });

    // Close menu when clicking outside the faculty grid/menu.
    document.addEventListener("click", event => {
        if (!event.target.closest(".faculty-card-menu")) {
            closeAllMenus();
        }
    });

    function closeAllMenus() {
        document.querySelectorAll(".faculty-card-menu.open").forEach(menu => {
            menu.classList.remove("open");

            const button = menu.querySelector(".three-dots-btn");
            if (button) {
                button.setAttribute("aria-expanded", "false");
            }
        });
    }

    // 5. View Details popup.
    function openFacultyModal(faculty) {
        if (!faculty) {
            console.warn("Faculty details not found.");
            return;
        }

        modalPhoto.src = faculty.image || "";
        modalPhoto.alt = faculty.imageAlt || faculty.name || "Faculty photo";
        modalName.textContent = faculty.name || "Faculty Details";
        modalDetails.replaceChildren();

        [
            faculty.designation,
            faculty.department,
            faculty.qualification,
            faculty.experience,
            (faculty.subjects || []).length
                ? "Subjects Taught: " + faculty.subjects.join(", ")
                : ""
        ].filter(Boolean).forEach(detail => {
            const paragraph = document.createElement("p");
            paragraph.textContent = detail;
            modalDetails.appendChild(paragraph);
        });

        facultyModal.style.display = "flex";
        document.body.style.overflow = "hidden";
        closeModalButton.focus();
    }

    facultyGrid.addEventListener("click", event => {
        const button = event.target.closest(".view-details");

        if (!button || !facultyGrid.contains(button)) return;

        const card = button.closest(".faculty-card");
        if (!card) return;

        const faculty = facultyData.find(
            item => String(item.id) === card.dataset.facultyId
        );

        openFacultyModal(faculty);
    });

    // 6. Close popup.
    function closeFacultyModal() {
        facultyModal.style.display = "none";
        document.body.style.overflow = "";
    }

    closeModalButton.addEventListener("click", closeFacultyModal);

    facultyModal.addEventListener("click", event => {
        if (event.target === facultyModal) {
            closeFacultyModal();
        }
    });

    // Escape closes the popup and dropdown menu.
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            if (facultyModal.style.display === "flex") {
                closeFacultyModal();
            }
            closeAllMenus();
        }
    });

    // 7. Enquiry form validation.
    const fieldRules = [
        {
            id: "enquiryName",
            errorId: "nameError",
            validate: value =>
                value.trim().length >= 2 && value.trim().length <= 60
                    ? ""
                    : "Name must contain 2–60 characters."
        },
        {
            id: "enquiryEmail",
            errorId: "emailError",
            validate: (value, input) =>
                value.trim() && !input.validity.typeMismatch
                    ? ""
                    : "Enter a valid email address."
        },
        {
            id: "enquiryPhone",
            errorId: "phoneError",
            validate: value =>
                /^[6-9][0-9]{9}$/.test(value.trim())
                    ? ""
                    : "Enter a valid 10-digit Indian mobile number."
        },
        {
            id: "enquirySubject",
            errorId: "subjectError",
            validate: value =>
                value.trim().length >= 3 && value.trim().length <= 100
                    ? ""
                    : "Subject must contain 3–100 characters."
        },
        {
            id: "enquiryMessage",
            errorId: "messageError",
            validate: value =>
                value.trim().length >= 10 && value.trim().length <= 1000
                    ? ""
                    : "Message must contain 10–1000 characters."
        }
    ];

    function validateField(rule) {
        const input = document.getElementById(rule.id);
        const errorElement = document.getElementById(rule.errorId);

        if (!input || !errorElement) {
            console.error("Missing form field or error element:", rule.id);
            return false;
        }

        const errorMessage = rule.validate(input.value, input);
        errorElement.textContent = errorMessage;
        input.setAttribute("aria-invalid", errorMessage ? "true" : "false");

        return errorMessage === "";
    }

    fieldRules.forEach(rule => {
        const input = document.getElementById(rule.id);
        if (!input) {
            console.error("Missing form input:", rule.id);
            return;
        }

        input.addEventListener("blur", () => validateField(rule));

        input.addEventListener("input", () => {
            if (input.getAttribute("aria-invalid") === "true") {
                validateField(rule);
            }
        });
    });

    enquiryForm.addEventListener("submit", event => {
        event.preventDefault();

        const allValid = fieldRules
            .map(rule => validateField(rule))
            .every(Boolean);

        formStatus.className = "form-status";
        formStatus.textContent = "";

        if (!allValid) {
            formStatus.classList.add("error");
            formStatus.textContent =
                "Please correct the highlighted fields and try again.";

            const firstInvalid =
                enquiryForm.querySelector('[aria-invalid="true"]');

            if (firstInvalid) firstInvalid.focus();
            return;
        }

        formStatus.classList.add("success");
        formStatus.textContent =
            "Validation successful. This demo does not send your enquiry. A backend is required to submit it.";

        enquiryForm.reset();

        fieldRules.forEach(rule => {
            const errorElement = document.getElementById(rule.errorId);
            const input = document.getElementById(rule.id);

            if (errorElement) errorElement.textContent = "";
            if (input) input.removeAttribute("aria-invalid");
        });
    });

    // Start loading faculty information.
    loadFacultyData();
});
// Dark Mode Functionality
document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("themeToggle");

    if (!themeToggle) return;

    // Load saved theme
    const savedTheme = localStorage.getItem("facultyTheme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

    // Update button text
    function updateThemeButton() {
        if (document.body.classList.contains("dark-mode")) {
            themeToggle.textContent = "☀️ Light Mode";
        } else {
            themeToggle.textContent = "🌙 Dark Mode";
        }
    }

    updateThemeButton();

    // Toggle theme on click
    themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");

        const isDark =
            document.body.classList.contains("dark-mode");

        localStorage.setItem(
            "facultyTheme",
            isDark ? "dark" : "light"
        );

        updateThemeButton();
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const openButton = document.getElementById("openEnquiryBtn");
    const enquiryForm = document.getElementById("enquiry");

    if (!openButton || !enquiryForm) return;

    openButton.addEventListener("click", function () {
        enquiryForm.classList.remove("form-open");

        void enquiryForm.offsetWidth;

        enquiryForm.classList.add("form-open");

        enquiryForm.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});
