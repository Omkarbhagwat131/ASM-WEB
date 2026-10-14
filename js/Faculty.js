
document.addEventListener("DOMContentLoaded", function () {
    const facultyGrid = document.getElementById("facultyGrid");
    const searchInput = document.getElementById("searchInput");
    const searchMessage = document.getElementById("searchMessage");
    const noResults = document.getElementById("noResults");

    const modal = document.getElementById("facultyModal");
    const closeModal = document.getElementById("closeModal");
    const modalPhoto = document.getElementById("modalPhoto");
    const modalName = document.getElementById("modalName");
    const modalDetails = document.getElementById("modalDetails");

    let facultyMembers = [];

    // JSON file path: ASM-WEB/data/faculty.json
    fetch("./data/faculty.json")
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Could not load faculty.json");
            }
            return response.json();
        })
        .then(function (data) {
            facultyMembers = data;
            displayFaculty(facultyMembers);
        })
        .catch(function (error) {
            console.error("Faculty loading error:", error);
            facultyGrid.innerHTML =
                "<p>Unable to load faculty details. Please check the JSON file path and try again.</p>";
        });

    function displayFaculty(members) {
        facultyGrid.innerHTML = "";

        if (noResults) {
            noResults.hidden = members.length !== 0;
        }

        members.forEach(function (faculty) {
            const card = document.createElement("article");
            card.className = "faculty-card";

            const menu = document.createElement("div");
            menu.className = "faculty-menu";

            const dots = document.createElement("button");
            dots.className = "menu-dots";
            dots.type = "button";
            dots.textContent = "⋮";
            dots.setAttribute("aria-label", "Open faculty links");
            dots.setAttribute("aria-expanded", "false");
            dots.addEventListener("click", function () {
                toggleFacultyMenu(dots);
            });

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

            const photoWrapper = document.createElement("div");
            photoWrapper.className = "faculty-photo";

            const photo = document.createElement("img");
            photo.src = faculty.image;
            photo.alt = faculty.name;
            photo.loading = "lazy";

            photo.onerror = function () {
                photo.alt = "Faculty photo unavailable";
            };

            photoWrapper.appendChild(photo);

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
            experience.textContent = "Experience: " + faculty.experience;

            const detailsButton = document.createElement("button");
            detailsButton.className = "view-details";
            detailsButton.type = "button";
            detailsButton.textContent = "View Details";

            detailsButton.addEventListener("click", function () {
                showFacultyDetails(faculty);
            });

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

            facultyGrid.appendChild(card);
        });
    }

    // Search faculty by name
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const query = searchInput.value.trim().toLowerCase();

            const filteredMembers = facultyMembers.filter(function (faculty) {
                return faculty.name.toLowerCase().includes(query);
            });

            displayFaculty(filteredMembers);

            if (searchMessage) {
                searchMessage.textContent = query
                    ? "Showing " + filteredMembers.length + " matching faculty member(s)."
                    : "Search faculty by entering their name.";
            }
        });
    }

    // Show faculty details in popup
    function showFacultyDetails(faculty) {
        modalPhoto.src = faculty.image;
        modalPhoto.alt = faculty.name;
        modalName.textContent = faculty.name;
        modalDetails.replaceChildren();

        const details = [
            ["Designation", faculty.designation],
            ["Department", faculty.department],
            ["Qualification", faculty.qualification],
            ["Experience", faculty.experience]
        ];

        details.forEach(function (item) {
            const paragraph = document.createElement("p");
            const label = document.createElement("strong");

            label.textContent = item[0] + ": ";
            paragraph.append(label, document.createTextNode(item[1] || "Not provided"));

            modalDetails.appendChild(paragraph);
        });

        modal.classList.add("show");
        modal.setAttribute("aria-hidden", "false");
    }

    function hideModal() {
        modal.classList.remove("show");
        modal.setAttribute("aria-hidden", "true");
    }

    if (closeModal) {
        closeModal.addEventListener("click", hideModal);
    }

    if (modal) {
        modal.addEventListener("click", function (event) {
            if (event.target === modal) {
                hideModal();
            }
        });
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && modal) {
            hideModal();
        }
    });
});
