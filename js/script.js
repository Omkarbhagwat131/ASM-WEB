document.addEventListener("DOMContentLoaded", function () {

    // Contact Form Code
    const contactForm = document.getElementById("contact-form");

    if (contactForm) {
        contactForm.addEventListener("submit", function(e) {
            e.preventDefault();
            alert("Thank you! Your message has been sent.");
        });
    }

    // MCA View Details Code
    const viewButton = document.querySelector(".view-details-btn");
    const mcaDetails = document.getElementById("mca-details");

    if (viewButton && mcaDetails) {
        viewButton.addEventListener("click", function() {

            if (mcaDetails.hidden) {
                mcaDetails.hidden = false;
                viewButton.textContent = "Hide Details";
                viewButton.setAttribute("aria-expanded", "true");
            } else {
                mcaDetails.hidden = true;
                viewButton.textContent = "View Details";
                viewButton.setAttribute("aria-expanded", "false");
            }

        });
    }

});