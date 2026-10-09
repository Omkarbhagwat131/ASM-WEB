/* ADMISSION MODULE - Event 1: Card hover */

document.addEventListener("DOMContentLoaded", function () {
    const programCards = document.querySelectorAll(
        "#admission-process .department-card"
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
        "#admission-process .department-card"
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