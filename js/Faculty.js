
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
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

    // Check that the required HTML elements exist.
    const requiredElements = [
        searchInput, facultyGrid, searchMessage, noResults,
        facultyModal, modalPhoto, modalName, modalDetails,
        closeModalButton, enquiryForm, formStatus
    ];

    if (requiredElements.some(element => !element)) {
        console.error("Required HTML elements are missing.");
        return;
    }

    // 1. Load faculty information from the JSON file.
    async function loadFacultyData() {
        try {
            const response = await fetch("data/faculty.json");

            if (!response.ok) {
                throw new Error("Could not load faculty.json");
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error("Faculty JSON must contain an array.");
            }

            facultyData = data;
            renderFaculty(facultyData);

            try {
                searchInput.value =
                    localStorage.getItem(STORAGE_KEY) || "";
            } catch (error) {
                console.warn("Could not restore search preference.");
            }

            searchFaculty();

        } catch (error) {
            console.error("Faculty JSON loading error:", error);

            loadingMessage.textContent =
                "Could not load faculty data. Check the JSON file path and use Live Server.";

            searchMessage.textContent =
                "Faculty information could not be loaded.";
        }
    }

    // 2. Create faculty cards dynamically using JSON data.
    function renderFaculty(list) {
        facultyGrid.querySelectorAll(".faculty-card")
            .forEach(card => card.remove());

        list.forEach(faculty => {
            const card = document.createElement("article");
            card.className = "faculty-card";
            card.dataset.facultyId = String(faculty.id);

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

            const name = document.createElement("h3");
            name.textContent = faculty.name || "Name not available";

            
               card.append(
    photoWrapper,
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

            const button = document.createElement("button");
            button.className = "view-details";
            button.type = "button";
            button.textContent = "View Details";

            card.appendChild(button);
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

    // 3. Search by name, designation, department, qualification or experience.
    function searchFaculty() {
        const searchText = searchInput.value.trim().toLowerCase();
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

            const matches = searchableText.includes(searchText);

            card.style.display = matches ? "" : "none";

            if (matches) {
                visibleCount++;
            }
        });

        noResults.style.display = visibleCount === 0 ? "block" : "none";

        searchMessage.textContent = searchText
            ? `${visibleCount} faculty members found.`
            : "Meet our experienced and dedicated faculty members!";

        try {
            localStorage.setItem(STORAGE_KEY, searchInput.value);
        } catch (error) {
            console.warn("Could not save search preference.");
        }
    }

    searchInput.addEventListener("input", searchFaculty);

    // 4. Open the faculty details popup.
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
            "Subjects Taught: " + (faculty.subjects || []).join(", ")
        ].filter(Boolean).forEach(detail => {
            const paragraph = document.createElement("p");
            paragraph.textContent = detail;
            modalDetails.appendChild(paragraph);
        });

        facultyModal.style.display = "flex";
        document.body.style.overflow = "hidden";
        closeModalButton.focus();
    }

    // Event delegation supports dynamically created cards.
    facultyGrid.addEventListener("click", event => {
        const button = event.target.closest(".view-details");

        if (!button || !facultyGrid.contains(button)) {
            return;
        }

        const card = button.closest(".faculty-card");

        if (!card) {
            return;
        }

        const faculty = facultyData.find(
            item => String(item.id) === card.dataset.facultyId
        );

        openFacultyModal(faculty);
    });

    // 5. Close popup using button, backdrop or Escape key.
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

    document.addEventListener("keydown", event => {
        if (
            event.key === "Escape" &&
            facultyModal.style.display === "flex"
        ) {
            closeFacultyModal();
        }
    });

    // 6. Enquiry form validation.
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

        const errorMessage = rule.validate(input.value, input);

        errorElement.textContent = errorMessage;
        input.setAttribute("aria-invalid", errorMessage ? "true" : "false");

        return errorMessage === "";
    }

    fieldRules.forEach(rule => {
        const input = document.getElementById(rule.id);

        input.addEventListener("blur", () => {
            validateField(rule);
        });

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

            if (firstInvalid) {
                firstInvalid.focus();
            }

            return;
        }

        formStatus.classList.add("success");
        formStatus.textContent =
            "Validation successful. This demo does not send your enquiry. A backend is required to submit it.";

        enquiryForm.reset();

        fieldRules.forEach(rule => {
            document.getElementById(rule.errorId).textContent = "";
            document.getElementById(rule.id).removeAttribute("aria-invalid");
        });
    });

    // Start loading faculty information.
    loadFacultyData();
});
