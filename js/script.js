document.addEventListener("DOMContentLoaded", function () {

    // 1. Contact Form Validation
    const contactForm = document.getElementById("contact-form");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
    const formStatus = document.getElementById("form-status");

    if (
        contactForm &&
        nameInput &&
        emailInput &&
        messageInput &&
        formStatus
    ) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();

            // Check empty fields
            if (!name || !email || !message) {
                formStatus.textContent = "Please fill in all fields.";
                return;
            }

            // Check email format
            if (!emailInput.validity.valid) {
                formStatus.textContent =
                    "Please enter a valid email address.";
                emailInput.focus();
                return;
            }

            // Check minimum message length
            if (message.length < 10) {
                formStatus.textContent =
                    "Message must contain at least 10 characters.";
                messageInput.focus();
                return;
            }

            formStatus.textContent =
                `Thank you, ${name}! Your form is valid. Message submission is not connected yet.`;

            console.log("Contact form validation successful.");
        });
    }

    // 2. MCA View Details
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
