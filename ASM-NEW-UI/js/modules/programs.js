// Program details stay in a small array, so filtering and card creation stay clear.
// Course names follow the ASM course flyer supplied with this student project.
const programOptions = [
  { title: "Artificial Intelligence & Machine Learning", award: "B.E.", level: "undergraduate", description: "Engineering program listed in ASM's supplied course flyer. Confirm the current intake and eligibility with admissions." },
  { title: "Computer Science & Engineering", award: "B.E.", level: "undergraduate", description: "Engineering program listed in ASM's supplied course flyer. Confirm the current intake and eligibility with admissions." },
  { title: "Information Technology", award: "B.E.", level: "undergraduate", description: "Engineering program listed in ASM's supplied course flyer. Confirm the current intake and eligibility with admissions." },
  { title: "Electronics & Computer Engineering", award: "B.E.", level: "undergraduate", description: "Engineering program listed in ASM's supplied course flyer. Confirm the current intake and eligibility with admissions." },
  { title: "Direct Second Year Engineering", award: "DSE", level: "undergraduate", description: "Direct second-year engineering entry is listed in ASM's supplied course flyer. Confirm current eligibility with admissions." },
  { title: "Bachelor of Computer Applications", award: "BCA", level: "undergraduate", description: "Program listed in ASM's supplied course flyer. Confirm the current intake and eligibility with admissions." },
  { title: "Master of Computer Applications", award: "MCA", level: "postgraduate", description: "Program listed in ASM's supplied course flyer. Confirm the current intake and eligibility with admissions." }
];

const savedCoursesKey = "asmNextGenCourseShortlist";
const grid = document.querySelector("#program-grid");
const search = document.querySelector("#program-search");
const filter = document.querySelector("#program-filter");
const status = document.querySelector("#program-status");
const dialog = document.querySelector("#program-dialog");
let savedCourses = [];

try {
  const savedValue = JSON.parse(localStorage.getItem(savedCoursesKey) || "[]");
  savedCourses = Array.isArray(savedValue) ? savedValue : [];
} catch (error) {
  // Report corrupted or unavailable shortlist data before rendering the course list.
  console.error("Could not read the course shortlist:", error);
  showToast("Your saved course list could not be read.");
}

// Fill and open the quick-view dialog for the selected course.
function showProgramDetails(program) {
  document.querySelector("#dialog-label").textContent = `${program.award} · ${program.level}`;
  document.querySelector("#dialog-title").textContent = program.title;
  document.querySelector("#dialog-description").textContent = program.description;
  dialog.showModal();
}

// Filter courses and rebuild the cards for the current search and level.
function renderPrograms() {
  const query = search.value.trim().toLowerCase();
  const selectedType = filter.value;
  // Keep only courses that match the query and selected study level.
  const matchingPrograms = programOptions.filter((program) => {
    const matchesText = `${program.title} ${program.award} ${program.description}`.toLowerCase().includes(query);
    return matchesText && (selectedType === "all" || program.level === selectedType);
  });

  grid.replaceChildren();
  // Build one interactive card for each matching course.
  matchingPrograms.forEach((program, index) => {
    const card = document.createElement("article");
    card.className = "program-card";
    card.style.animationDelay = `${Math.min(index * 55, 250)}ms`;
    const category = document.createElement("span");
    category.textContent = `${program.award} / ${program.level}`;
    const title = document.createElement("h3");
    title.textContent = program.title;
    const summary = document.createElement("p");
    summary.textContent = program.description;
    const actions = document.createElement("div");
    actions.className = "program-card-actions";
    const saveButton = document.createElement("button");
    const isSaved = savedCourses.includes(program.title);
    saveButton.classList.toggle("saved", isSaved);
    saveButton.textContent = isSaved ? "✓ Saved" : "+ Shortlist";
    saveButton.setAttribute("aria-pressed", String(isSaved));
    // Add or remove this course from the local shortlist.
    saveButton.addEventListener("click", () => toggleShortlist(program.title));
    const detailButton = document.createElement("button");
    detailButton.textContent = "Quick view ↗";
    // Open the detail dialog for this course.
    detailButton.addEventListener("click", () => showProgramDetails(program));
    actions.append(saveButton, detailButton);
    card.append(category, title, summary, actions);
    grid.append(card);
  });

  if (matchingPrograms.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Nothing matched. Try a different search or program type.";
    grid.append(empty);
  }
  status.textContent = `${matchingPrograms.length} of ${programOptions.length} courses shown · ${savedCourses.length} shortlisted`;
}

// Toggle a course in the browser-stored shortlist and refresh the cards.
function toggleShortlist(title) {
  // Remove a course already saved; otherwise append it to the shortlist.
  savedCourses = savedCourses.includes(title)
    ? savedCourses.filter((savedTitle) => savedTitle !== title)
    : [...savedCourses, title];
  try {
    localStorage.setItem(savedCoursesKey, JSON.stringify(savedCourses));
  } catch (error) {
    // Report a failed shortlist write so the visitor knows it was not persisted.
    console.error("Could not save the course shortlist:", error);
    showToast("Could not save your shortlist in this browser.");
  }
  renderPrograms();
}

// Refresh the course list whenever the search text changes.
search.addEventListener("input", renderPrograms);

// Refresh the course list whenever the selected study level changes.
filter.addEventListener("change", renderPrograms);

// Reset both filters and restore the full course list.
document.querySelector("#clear-programs").addEventListener("click", () => {
  search.value = "";
  filter.value = "all";
  renderPrograms();
});
// Close the course dialog when its close control is selected.
document.querySelector("#dialog-close").addEventListener("click", () => dialog.close());

// Close the course dialog when a visitor clicks its backdrop.
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
renderPrograms();
