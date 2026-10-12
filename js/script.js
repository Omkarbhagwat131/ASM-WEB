document.addEventListener("DOMContentLoaded", function () {

    // Contact Form
    const contactForm = document.getElementById("contact-form");

    if (contactForm) {
        contactForm.addEventListener("submit", function(e) {
            e.preventDefault();
            alert("Thank you! Your message has been sent.");
        });
    }

    // MCA View Details
    const button = document.querySelector(".view-details-btn");
    const details = document.getElementById("mca-details");

    if (button && details) {
        button.addEventListener("click", function () {

            details.hidden = !details.hidden;

            button.textContent = details.hidden
                ? "View Details"
                : "Hide Details";

            button.setAttribute(
                "aria-expanded",
                String(!details.hidden)
            );

        });
    }

});