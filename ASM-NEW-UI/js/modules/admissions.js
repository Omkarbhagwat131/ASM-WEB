// Save an admissions reminder for the student to revisit on this browser.
const admissionForm = document.querySelector("#admission-form");
const admissionStatus = document.querySelector("#admission-status");
const feePdfDialog = document.querySelector("#fee-pdf-dialog");

document.querySelector("#fee-pdf-open").addEventListener("click", () => feePdfDialog.showModal());
document.querySelector("#fee-pdf-close").addEventListener("click", () => feePdfDialog.close());
feePdfDialog.addEventListener("click", (event) => {
  if (event.target === feePdfDialog) feePdfDialog.close();
});

// Save the completed admissions planning note in this browser only.
admissionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(admissionForm);
  const note = {
    name: String(formData.get("name")).trim(),
    email: String(formData.get("email")).trim().toLowerCase(),
    program: String(formData.get("program")),
    savedAt: new Date().toISOString()
  };
  const savedNotes = getSavedList("asmNextGenAdmissionNotes");
  try {
    localStorage.setItem("asmNextGenAdmissionNotes", JSON.stringify([...savedNotes, note]));
    admissionForm.reset();
    admissionStatus.classList.remove("error");
    admissionStatus.textContent = "Planning note saved in this browser. It was not sent to ASM.";
  } catch (error) {
    // Report storage failure instead of suggesting the planning note was saved.
    console.error("Could not save the admissions note:", error);
    admissionStatus.classList.add("error");
    admissionStatus.textContent = "Browser storage is unavailable. Your note was not saved.";
  }
});
