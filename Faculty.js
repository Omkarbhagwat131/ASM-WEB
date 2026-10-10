
 // Faculty Search
const searchInput = document.getElementById("searchInput");
const facultyCards = document.querySelectorAll(".faculty-card");
const noResults = document.getElementById("noResults");
const searchMessage = document.getElementById("searchMessage");

if (searchInput && noResults && searchMessage) {
    searchInput.addEventListener("input", function () {
        const searchText = this.value.trim().toLowerCase();
        let visibleCount = 0;

        facultyCards.forEach(function (card) {
            const facultyName =
                card.querySelector("h3")?.textContent.toLowerCase() || "";

            const designation =
                card.querySelector(".designation")?.textContent.toLowerCase() || "";

            const department =
                card.querySelector(".department")?.textContent.toLowerCase() || "";

            const matches =
                facultyName.includes(searchText) ||
                designation.includes(searchText) ||
                department.includes(searchText);

            card.style.display = matches ? "flex" : "none";

            if (matches) {
                visibleCount++;
            }
        });

        noResults.style.display =
            visibleCount === 0 ? "block" : "none";

        searchMessage.textContent = searchText
            ? visibleCount + " faculty member(s) found."
            : "Search faculty by entering their name.";
    });
}

// View Details Popup
const modal = document.getElementById("facultyModal");
const modalName = document.getElementById("modalName");
const modalDetails = document.getElementById("modalDetails");
const modalPhoto = document.getElementById("modalPhoto");
const closeModal = document.getElementById("closeModal");

if (modal && modalName && modalDetails && modalPhoto && closeModal) {
    facultyCards.forEach(function (card) {
        const button = card.querySelector(".view-details");

        if (!button) return;

        button.addEventListener("click", function () {
            const name =
                card.querySelector("h3")?.textContent.trim() || "";

            const photo =
                card.querySelector(".faculty-photo img");

            const designation =
                card.querySelector(".designation")?.textContent.trim() || "";

            const department =
                card.querySelector(".department")?.textContent.trim() || "";

            const qualification =
                card.querySelector(".qualification")?.textContent.trim() || "";

            const experience =
                card.querySelector(".experience")?.textContent.trim() || "";

            // Display faculty photo
            if (photo) {
                modalPhoto.src = photo.src;
                modalPhoto.alt = name;
            }

            // Display faculty name
            modalName.textContent = name;

            // Clear previous details
            modalDetails.replaceChildren();

            // Display faculty information
            [
                ["Designation", designation],
                ["Department", department],
                ["Qualification", qualification],
                ["Experience", experience]
            ].forEach(function (item) {
                const paragraph = document.createElement("p");
                const label = document.createElement("strong");

                label.textContent = item[0] + ": ";

                paragraph.append(
                    label,
                    document.createTextNode(item[1])
                );

                modalDetails.appendChild(paragraph);
            });

            // Open popup
            modal.style.display = "flex";
            closeModal.focus();
        });
    });

    // Close popup using close button
    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Close popup by clicking outside
    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Close popup using Escape key
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            modal.style.display = "none";
        }
    });
}
