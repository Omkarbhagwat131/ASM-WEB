document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#contact-form");
  const status = document.querySelector("#form-status");
  let validation = {
    invalid: "Please check the required fields.",
    successPrefix: "Thanks, ",
    successSuffix: ". Your enquiry is valid."
  };
  const textFields = {
    "contact-hero-eyebrow": "heroEyebrow",
    "contact-hero-title": "heroTitle",
    "contact-hero-description": "heroDescription",
    "contact-section-eyebrow": "sectionEyebrow",
    "contact-heading": "sectionTitle",
    "contact-section-description": "sectionDescription",
    "contact-form-title": "formTitle",
    "contact-form-description": "formDescription",
    "contact-name-label": "nameLabel",
    "contact-email-label": "emailLabel",
    "contact-message-label": "messageLabel",
    "contact-message-hint": "messageHint",
    "contact-submit-label": "submitLabel",
    "contact-details-eyebrow": "detailsEyebrow",
    "details-heading": "detailsTitle",
    "contact-details-description": "detailsDescription",
    "contact-directions-label": "directionsLabel",
    "contact-footer-text": "footer"
  };

  fetch("../data/contact.json")
    .then((response) => {
      if (!response.ok) throw new Error("Contact information unavailable.");
      return response.json();
    })
    .then((data) => {
      const content = data.content || {};
      Object.entries(textFields).forEach(([id, key]) => {
        const element = document.getElementById(id);
        if (element && content[key]) element.textContent = content[key];
      });
      const placeholders = [
        ["name", "namePlaceholder"],
        ["email", "emailPlaceholder"],
        ["message", "messagePlaceholder"]
      ];
      placeholders.forEach(([id, key]) => {
        const element = document.getElementById(id);
        if (element && content[key]) element.placeholder = content[key];
      });

      const email = document.querySelector("#contact-email");
      if (email && data.email) {
        email.textContent = data.email;
        email.href = "mailto:" + data.email;
      }
      const phone = document.querySelector("#contact-phone");
      if (phone && data.phone) {
        phone.textContent = data.phone;
        phone.href = "tel:" + data.phone.replace(/[^+\d]/g, "");
      }
      const address = document.querySelector("#contact-address");
      if (address && data.address) address.textContent = data.address;
      const directions = document.querySelector("#contact-directions");
      if (directions && data.directionsUrl) directions.href = data.directionsUrl;
      if (data.validation) validation = data.validation;
    })
    .catch((error) => console.error(error));

  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const name = form.elements.name.value.trim();
    const message = form.elements.message.value.trim();
    if (name.length < 2 || message.length < 10) {
      status.textContent = validation.invalid;
      status.className = "contact-form-status error";
      return;
    }
    status.textContent = validation.successPrefix + name + validation.successSuffix;
    status.className = "contact-form-status success";
  });
  form.addEventListener("input", () => {
    if (!status) return;
    status.textContent = "";
    status.className = "contact-form-status";
  });
});
