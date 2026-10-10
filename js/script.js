const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

document.querySelectorAll(".contact-event-card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.classList.add("is-hovered");
  });

  card.addEventListener("mouseleave", () => {
    card.classList.remove("is-hovered");
  });
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  formStatus.textContent = `Thanks, ${name}. This demo does not send messages yet. Please email info@asmcollege.edu to reach us.`;
});
