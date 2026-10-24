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

// Scroll Animation
document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll(
        ".departments-section, .admission-intro"
    );

    sections.forEach(function (section) {
        section.classList.add("animate-on-scroll");
    });

    const observer = new IntersectionObserver(
        function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15
        }
    );

    sections.forEach(function (section) {
        observer.observe(section);
    });
});

// Copy Email Button
document.addEventListener("DOMContentLoaded", function () {
    const copyEmailBtn = document.querySelector("#copy-email-btn");
    const copyStatus = document.querySelector("#copy-status");

    if (copyEmailBtn && copyStatus) {
        copyEmailBtn.addEventListener("click", async function () {
            try {
                await navigator.clipboard.writeText("info@asmcollege.edu");
                copyStatus.textContent = "Email copied successfully!";
            } catch (error) {
                console.error("Copy failed:", error);
                copyStatus.textContent =
                    "Copy failed. Please copy the email manually.";
            }
        });
    }
});
