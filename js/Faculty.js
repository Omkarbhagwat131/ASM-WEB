document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const facultyGrid = document.getElementById("facultyGrid");
    const searchMessage = document.getElementById("searchMessage");
    const noResults = document.getElementById("noResults");

    const facultyModal = document.getElementById("facultyModal");
    const modalPhoto = document.getElementById("modalPhoto");
    const modalName = document.getElementById("modalName");
    const modalDetails = document.getElementById("modalDetails");
    const closeModal = document.getElementById("closeModal");

    const facultyCards = document.querySelectorAll(".faculty-card");

    // SEARCH FACULTY
    searchInput.addEventListener("input", function () {
        const searchText = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        facultyCards.forEach(function (card) {
            const facultyName = card.querySelector("h3").textContent.toLowerCase();
            const designation = card.querySelector(".designation").textContent.toLowerCase();
            const department = card.querySelector(".department").textContent.toLowerCase();

            const matches =
                facultyName.includes(searchText) ||
                designation.includes(searchText) ||
                department.includes(searchText);

            card.style.display = matches ? "flex" : "none";

            if (matches) {
                visibleCount++;
            }
        });

        noResults.style.display = visibleCount === 0 ? "block" : "none";

        searchMessage.textContent = searchText
            ? visibleCount + " faculty member(s) found."
            : "Search faculty by entering their name.";
    });

        // VIEW DETAILS BUTTONS
    document.querySelectorAll(".view-details").forEach(function (button) {
        button.addEventListener("click", function () {
            const card = button.closest(".faculty-card");

            const photo = card.querySelector(".faculty-photo img");
            const name = card.querySelector("h3").textContent;
            const designation = card.querySelector(".designation").textContent;
            const department = card.querySelector(".department").textContent;
            const qualification = card.querySelector(".qualification").textContent;
            const experience = card.querySelector(".experience").textContent;

            document.getElementById("modalPhoto").src = photo.src;
            document.getElementById("modalPhoto").alt = photo.alt;
            document.getElementById("modalName").textContent = name;

            const details = document.getElementById("modalDetails");
            details.innerHTML = "";

            [designation, department, qualification, experience].forEach(function (item) {
                const p = document.createElement("p");
                p.textContent = item;
                details.appendChild(p);
            });

            const modal = document.getElementById("facultyModal");
            modal.style.display = "flex";
            document.body.style.overflow = "hidden";
        });
    });

    // CLOSE POPUP
    document.getElementById("closeModal").addEventListener("click", function () {
        document.getElementById("facultyModal").style.display = "none";
        document.body.style.overflow = "";
    });

    // CLOSE WHEN CLICKING OUTSIDE
    document.getElementById("facultyModal").addEventListener("click", function (event) {
        if (event.target.id === "facultyModal") {
            event.currentTarget.style.display = "none";
            document.body.style.overflow = "";
        }
    });

    // CLOSE USING ESCAPE KEY
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            document.getElementById("facultyModal").style.display = "none";
            document.body.style.overflow = "";
        }
    });

    // CLOSE POPUP WITH ESCAPE KEY
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && facultyModal.style.display === "flex") {
            closeFacultyModal();
        }
    });

    function closeFacultyModal() {
        facultyModal.style.display = "none";
        document.body.style.overflow = "";
    }
});