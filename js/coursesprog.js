
// 1. Live Course Search / Filter Feature
const courseSearchInput = document.querySelector("#course-search-input");
const courseCards = document.querySelectorAll(".course-card");
const noResultsMessage = document.querySelector("#no-results-msg");

if (courseSearchInput && courseCards.length > 0) {
    courseSearchInput.addEventListener("input", function () {
        const query = courseSearchInput.value.toLowerCase().trim();
        let matchCount = 0;

        courseCards.forEach(function (card) {
            const courseTitle = card.querySelector("h3") ? card.querySelector("h3").textContent.toLowerCase() : "";
            const courseBadge = card.querySelector(".badge") ? card.querySelector(".badge").textContent.toLowerCase() : "";
            const courseDesc = card.querySelector("p") ? card.querySelector("p").textContent.toLowerCase() : "";

            if (courseTitle.includes(query) || courseBadge.includes(query) || courseDesc.includes(query)) {
                card.style.display = "flex";
                matchCount++;
            } else {
                card.style.display = "none";
            }
        });

        if (noResultsMessage) {
            noResultsMessage.style.display = matchCount === 0 ? "block" : "none";
        }
    });
}

// 2. Back to Top Button Feature
const backToTopBtn = document.querySelector("#back-to-top");

if (backToTopBtn) {
    window.addEventListener("scroll", function () {
        if (window.scrollY > 200) {
            backToTopBtn.style.display = "block";
        } else {
            backToTopBtn.style.display = "none";
        }
    });

    backToTopBtn.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}