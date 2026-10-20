// Save checked skill areas so the checklist stays here when the page is reopened.
const checklistKey = "asmNextGenPlacementSkills";
const skillBoxes = [...document.querySelectorAll(".skill-card input")];
const progressLabel = document.querySelector("#skill-progress-label");
const progressNumber = document.querySelector("#skill-progress");
const progressBar = document.querySelector("#progress-bar");
const placementLogoTrack = document.querySelector(".placement-logo-track");
const placementLogoSet = placementLogoTrack?.querySelector(".placement-company-list");

if (placementLogoTrack && placementLogoSet) {
  const repeatedLogoSet = placementLogoSet.cloneNode(true);
  repeatedLogoSet.setAttribute("aria-hidden", "true");
  placementLogoTrack.append(repeatedLogoSet);
}

try {
  const savedSkills = JSON.parse(localStorage.getItem(checklistKey) || "[]");
  if (Array.isArray(savedSkills)) {
    // Restore each saved skill selection into its matching checkbox.
    skillBoxes.forEach((box) => { box.checked = savedSkills.includes(box.value); });
  }
} catch (error) {
  // Report malformed or unavailable checklist data and leave the page usable.
  console.error("Could not load the placement checklist:", error);
  showToast("Saved checklist data could not be read.");
}

// Recalculate checklist progress and persist the selected skills locally.
function updateProgress() {
  // Collect the checked skill names to calculate and persist checklist progress.
  const checkedSkills = skillBoxes.filter((box) => box.checked).map((box) => box.value);
  const percentage = Math.round((checkedSkills.length / skillBoxes.length) * 100);
  progressNumber.textContent = `${percentage}%`;
  progressBar.style.width = `${percentage}%`;
  progressLabel.textContent = `${checkedSkills.length} of ${skillBoxes.length} areas checked`;
  try {
    localStorage.setItem(checklistKey, JSON.stringify(checkedSkills));
  } catch (error) {
    // Report the failed write while retaining the visible progress calculation.
    console.error("Could not save the placement checklist:", error);
    showToast("Could not save checklist changes in this browser.");
  }
}
// Recalculate the checklist whenever a skill checkbox changes.
skillBoxes.forEach((box) => box.addEventListener("change", updateProgress));

// Clear all skills, then refresh the percentage and saved checklist.
document.querySelector("#reset-skills").addEventListener("click", () => {
  // Uncheck every skill before updating the displayed progress.
  skillBoxes.forEach((box) => { box.checked = false; });
  updateProgress();
});
updateProgress();
