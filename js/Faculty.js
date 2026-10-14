/* =========================================================
   Faculty.js  -  Day 4 + Day 5 (Vanilla JavaScript only)
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    // ---------- DOM elements ----------
    const facultyGrid = document.getElementById("facultyGrid");
    const searchInput = document.getElementById("searchInput");
    const searchMessage = document.getElementById("searchMessage");
    const noResults = document.getElementById("noResults");

    const modal = document.getElementById("facultyModal");
    const closeModalBtn = document.getElementById("closeModal");
    const modalPhoto = document.getElementById("modalPhoto");
    const modalName = document.getElementById("modalName");
    const modalDetails = document.getElementById("modalDetails");

    const enquiryForm = document.getElementById("enquiryForm");
    const enquiryStatus = document.getElementById("enquiryStatus");

    // ---------- State ----------
    let facultyMembers = [];
    let lastFocusedElement = null;

    const STORAGE_KEYS = {
        search: "facultySearch",
        department: "facultyDepartment"
    };

    // ---------- localStorage helpers ----------
    const saveToStorage = (key, value) => {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.warn("localStorage not available:", error);
        }
    };

    const loadFromStorage = (key) => {
        try {
            return localStorage.getItem(key) || "";
        } catch (error) {
            console.warn("localStorage not available:", error);
            return "";
        }
    };

    // Remove extra "Experience: " if JSON already has it
    const cleanExperience = (value) =>
        String(value || "").replace(/^Experience:\s*/i, "").trim();

    // ---------- Department dropdown (same row as search bar) ----------
    let departmentFilter = document.getElementById("departmentFilter");

    if (!departmentFilter) {
        departmentFilter = document.createElement("select");
        departmentFilter.id = "departmentFilter";
        departmentFilter.setAttribute("aria-label", "Filter faculty by department");

        Object.assign(departmentFilter.style, {
            flex: "0 1 230px",
            minWidth: "180px",
            padding: "14px 20px",
            border: "1px solid #d9eaf7",
            borderRadius: "30px",
            fontFamily: "inherit",
            fontSize: "16px",
            background: "#ffffff",
            color: "#172b3f",
            boxShadow: "0 4px 15px rgba(23, 43, 63, 0.06)",
            cursor: "pointer"
        });

        // One horizontal row: search bar + department
        const filterRow = document.createElement("div");
        Object.assign(filterRow.style, {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px"
        });

        Object.assign(searchInput.style, {
            flex: "1 1 280px",
            maxWidth: "420px",
            width: "auto"
        });

        searchInput.parentNode.insertBefore(filterRow, searchInput);
        filterRow.append(searchInput, departmentFilter);
    }

    const buildDepartmentOptions = (members) => {
        const departments = [...new Set(members.map((f) => f.department))].sort();

        departmentFilter.innerHTML = "";

        const allOption = document.createElement("option");
        allOption.value = "";
        allOption.textContent = "All Departments";
        departmentFilter.appendChild(allOption);

        departments.forEach((dept) => {
            const option = document.createElement("option");
            option.value = dept;
            option.textContent = dept;
            departmentFilter.appendChild(option);
        });
    };

    // ---------- Load JSON data ----------
    const loadFaculty = async () => {
        try {
            const response = await fetch("./data/faculty.json");

            if (!response.ok) {
                throw new Error(`Could not load faculty.json (status ${response.status})`);
            }

            facultyMembers = await response.json();

            buildDepartmentOptions(facultyMembers);

            // Restore saved preferences
            searchInput.value = loadFromStorage(STORAGE_KEYS.search);
            const savedDept = loadFromStorage(STORAGE_KEYS.department);
            if ([...departmentFilter.options].some((o) => o.value === savedDept)) {
                departmentFilter.value = savedDept;
            }

            applyFilters();
        } catch (error) {
            console.error("Faculty loading error:", error);
            facultyGrid.innerHTML = "";
            const message = document.createElement("p");
            message.textContent =
                "Unable to load faculty details. Please check the JSON file path and try again.";
            facultyGrid.appendChild(message);
        }
    };

    // ---------- Render cards ----------
    const createCard = (faculty) => {
        const card = document.createElement("article");
        card.className = "faculty-card";
        card.dataset.id = faculty.id;

        // Three-dot menu
        const menu = document.createElement("div");
        menu.className = "faculty-menu";

        const dots = document.createElement("button");
        dots.className = "menu-dots";
        dots.type = "button";
        dots.textContent = "⋮";
        dots.setAttribute("aria-label", "Open faculty links");
        dots.setAttribute("aria-expanded", "false");

        const menuLinks = document.createElement("div");
        menuLinks.className = "menu-links";

        if (faculty.linkedin) {
            const linkedin = document.createElement("a");
            linkedin.href = faculty.linkedin;
            linkedin.target = "_blank";
            linkedin.rel = "noopener noreferrer";
            linkedin.textContent = "LinkedIn Profile";
            menuLinks.appendChild(linkedin);
        }

        menu.append(dots, menuLinks);

        // Photo
        const photoWrapper = document.createElement("div");
        photoWrapper.className = "faculty-photo";

        const photo = document.createElement("img");
        photo.src = faculty.image;
        photo.alt = faculty.name;
        photo.loading = "lazy";
        photo.onerror = () => {
            photo.alt = "Faculty photo unavailable";
        };
        photoWrapper.appendChild(photo);

        // Text details
        const name = document.createElement("h3");
        name.textContent = faculty.name;

        const designation = document.createElement("p");
        designation.className = "designation";
        designation.textContent = faculty.designation;

        const department = document.createElement("p");
        department.className = "department";
        department.textContent = faculty.department;

        const qualification = document.createElement("p");
        qualification.className = "qualification";
        qualification.textContent = faculty.qualification;

        const experience = document.createElement("p");
        experience.className = "experience";
        experience.textContent = `Experience: ${cleanExperience(faculty.experience)}`;

        // View Details button (click handled by event delegation)
        const detailsButton = document.createElement("button");
        detailsButton.className = "view-details";
        detailsButton.type = "button";
        detailsButton.textContent = "View Details";
        detailsButton.dataset.id = faculty.id;

        card.append(
            menu,
            photoWrapper,
            name,
            designation,
            department,
            qualification,
            experience,
            detailsButton
        );

        return card;
    };

    const displayFaculty = (members) => {
        facultyGrid.innerHTML = "";

        if (noResults) {
            noResults.hidden = members.length !== 0;
        }

        members.forEach((faculty) => {
            facultyGrid.appendChild(createCard(faculty));
        });
    };

    // ---------- Search + Department filter ----------
    const applyFilters = () => {
        const query = searchInput.value.trim().toLowerCase();
        const selectedDept = departmentFilter.value;

        const filtered = facultyMembers.filter((faculty) => {
            const matchesName = faculty.name.toLowerCase().includes(query);
            const matchesDept = !selectedDept || faculty.department === selectedDept;
            return matchesName && matchesDept;
        });

        displayFaculty(filtered);

        if (searchMessage) {
            searchMessage.textContent =
                query || selectedDept
                    ? `Showing ${filtered.length} matching faculty member(s).`
                    : "Search faculty by entering their name.";
        }
    };

    searchInput.addEventListener("input", () => {
        saveToStorage(STORAGE_KEYS.search, searchInput.value);
        applyFilters();
    });

    departmentFilter.addEventListener("change", () => {
        saveToStorage(STORAGE_KEYS.department, departmentFilter.value);
        applyFilters();
    });

    // ---------- Three-dot menu helpers ----------
    const closeAllMenus = () => {
        document.querySelectorAll(".faculty-menu.open").forEach((menu) => {
            menu.classList.remove("open");
            const btn = menu.querySelector(".menu-dots");
            if (btn) btn.setAttribute("aria-expanded", "false");
        });
    };

    const toggleMenu = (dotsButton) => {
        const menu = dotsButton.closest(".faculty-menu");
        const wasOpen = menu.classList.contains("open");

        closeAllMenus();

        if (!wasOpen) {
            menu.classList.add("open");
            dotsButton.setAttribute("aria-expanded", "true");
        }
    };

    // ---------- Modal ----------
    const showFacultyDetails = (faculty) => {
        lastFocusedElement = document.activeElement;

        modalPhoto.src = faculty.image;
        modalPhoto.alt = faculty.name;
        modalName.textContent = faculty.name;
        modalDetails.replaceChildren();

        const details = [
            ["Designation", faculty.designation],
            ["Department", faculty.department],
            ["Qualification", faculty.qualification],
            ["Experience", cleanExperience(faculty.experience)],
            ["Subjects", Array.isArray(faculty.subjects) ? faculty.subjects.join(", ") : ""]
        ];

        details.forEach(([label, value]) => {
            const paragraph = document.createElement("p");
            const strong = document.createElement("strong");
            strong.textContent = `${label}: `;
            paragraph.append(strong, document.createTextNode(value || "Not provided"));
            modalDetails.appendChild(paragraph);
        });

        modal.classList.add("show");
        modal.style.display = "flex"; // works even if CSS .modal.show is missing
        modal.setAttribute("aria-hidden", "false");
        closeModalBtn.focus();
    };

    const hideModal = () => {
        modal.classList.remove("show");
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");

        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    };

    closeModalBtn.addEventListener("click", hideModal);

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            hideModal();
        }
    });

    // ---------- EVENT DELEGATION: one listener for all cards ----------
    facultyGrid.addEventListener("click", (event) => {
        // Three-dot button
        const dotsButton = event.target.closest(".menu-dots");
        if (dotsButton) {
            toggleMenu(dotsButton);
            return;
        }

        // View Details button
        const detailsButton = event.target.closest(".view-details");
        if (detailsButton) {
            const id = Number(detailsButton.dataset.id);
            const faculty = facultyMembers.find((f) => f.id === id);

            if (faculty) {
                showFacultyDetails(faculty);
            }
        }
    });

    // Close menus when clicking outside
    document.addEventListener("click", (event) => {
        if (!event.target.closest(".faculty-menu")) {
            closeAllMenus();
        }
    });

    // Escape key closes menus and modal
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeAllMenus();

            if (modal.classList.contains("show")) {
                hideModal();
            }
        }
    });

    // ---------- Enquiry form validation ----------
    if (enquiryForm && enquiryStatus) {
        const showStatus = (message, isError) => {
            enquiryStatus.textContent = message;
            enquiryStatus.style.color = isError ? "#c0392b" : "#1e8449";
        };

        enquiryForm.addEventListener("submit", (event) => {
            event.preventDefault(); // stop page reload

            const name = document.getElementById("enquiryName").value.trim();
            const email = document.getElementById("enquiryEmail").value.trim();
            const phone = document.getElementById("enquiryPhone").value.trim();
            const subject = document.getElementById("enquirySubject").value;
            const message = document.getElementById("enquiryMessage").value.trim();

            if (name.length < 3) {
                showStatus("Please enter a valid name (minimum 3 characters).", true);
                return;
            }

            if (!/^\S+@\S+\.\S+$/.test(email)) {
                showStatus("Please enter a valid email address.", true);
                return;
            }

            if (!/^[0-9]{10}$/.test(phone)) {
                showStatus("Mobile number must be exactly 10 digits.", true);
                return;
            }

            if (subject === "") {
                showStatus("Please select an enquiry type.", true);
                return;
            }

            if (message.length < 10) {
                showStatus("Message must be at least 10 characters.", true);
                return;
            }

            showStatus("Thank you! Your enquiry has been submitted.", false);
            enquiryForm.reset();
        });
    }

    // ---------- Start ----------
    loadFaculty();
});