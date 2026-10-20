const contactForm = document.querySelector("#contact-form");
const contactStatus = document.querySelector("#contact-status");
// Save the contact message in this browser; this form does not send email.
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(contactForm);
  const message = {
    name: String(form.get("name")).trim(),
    email: String(form.get("email")).trim().toLowerCase(),
    topic: String(form.get("topic")),
    message: String(form.get("message")).trim(),
    savedAt: new Date().toISOString()
  };
  const previousMessages = getSavedList("asmNextGenContactMessages");
  try {
    localStorage.setItem("asmNextGenContactMessages", JSON.stringify([...previousMessages, message]));
    contactForm.reset();
    contactStatus.classList.remove("error");
    contactStatus.textContent = "Your message was saved in this browser. It was not sent to ASM.";
  } catch (error) {
    // Report storage failure without showing the message as successfully saved.
    // Report storage failure rather than marking the message as successfully saved.
    console.error("Could not save the contact message:", error);
    contactStatus.classList.add("error");
    contactStatus.textContent = "Browser storage is unavailable. The message was not saved.";
  }
});
