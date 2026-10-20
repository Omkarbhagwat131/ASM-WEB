// These are sample study areas for learning the filters, not official syllabus data.
const syllabusTopics = [
  { title: "Programming foundations", program: "computer", stage: "foundation", description: "Example concepts: problem solving, algorithms and introductory programming." },
  { title: "Web and application development", program: "computer", stage: "core", description: "Example concepts: web structure, application design and software development." },
  { title: "Database systems", program: "computer", stage: "core", description: "Example concepts: data models, querying and database management." },
  { title: "Data science and analytics", program: "computer", stage: "advanced", description: "Example concepts: statistics, data exploration and analytical thinking." },
  { title: "Business communication", program: "business", stage: "foundation", description: "Example concepts: written communication, presentations and teamwork." },
  { title: "Management principles", program: "business", stage: "core", description: "Example concepts: organizations, planning and decision-making." },
  { title: "Business strategy", program: "business", stage: "advanced", description: "Example concepts: strategic analysis and organizational direction." },
  { title: "Accounting principles", program: "commerce", stage: "foundation", description: "Example concepts: accounting records, statements and core terminology." },
  { title: "Economics and markets", program: "commerce", stage: "core", description: "Example concepts: markets, economic activity and financial literacy." },
  { title: "Finance and taxation", program: "commerce", stage: "advanced", description: "Example concepts: finance, tax concepts and business reporting." }
];
const savedKey = "asmNextGenStudyTopics";
const board = document.querySelector("#syllabus-board");
const savedStatus = document.querySelector("#plan-status");
let savedTopics = [];
let showOnlySaved = false;

try {
  const stored = JSON.parse(localStorage.getItem(savedKey) || "[]");
  savedTopics = Array.isArray(stored) ? stored : [];
} catch (error) {
  // Report malformed or unavailable plan data while keeping the topic explorer usable.
  console.error("Could not load the study plan:", error);
  showToast("The saved study plan could not be read.");
}
document.querySelector("#saved-count").textContent = savedTopics.length;

// Filter study topics and render cards using all selected criteria.
function displayTopics() {
  const query = document.querySelector("#syllabus-search").value.trim().toLowerCase();
  const program = document.querySelector("#syllabus-program").value;
  const stage = document.querySelector("#syllabus-stage").value;
  // Require each topic to match the query, program, stage, and saved-only mode.
  const topicsToShow = syllabusTopics.filter((topic) => {
    const textMatches = `${topic.title} ${topic.description}`.toLowerCase().includes(query);
    const programMatches = program === "all" || topic.program === program;
    const stageMatches = stage === "all" || topic.stage === stage;
    const savedMatches = !showOnlySaved || savedTopics.includes(topic.title);
    return textMatches && programMatches && stageMatches && savedMatches;
  });

  board.replaceChildren();
  // Build one saveable study card for each matching topic.
  topicsToShow.forEach((topic, index) => {
    const card = document.createElement("article");
    card.className = "syllabus-card";
    card.dataset.stage = topic.stage;
    card.style.animationDelay = `${index * 50}ms`;
    const category = document.createElement("span");
    category.textContent = `${topic.program} / ${topic.stage}`;
    const title = document.createElement("h3");
    title.textContent = topic.title;
    const description = document.createElement("p");
    description.textContent = topic.description;
    const saveButton = document.createElement("button");
    const isSaved = savedTopics.includes(topic.title);
    saveButton.classList.toggle("saved", isSaved);
    saveButton.textContent = isSaved ? "✓ Added to plan" : "+ Add to plan";
    saveButton.setAttribute("aria-pressed", String(isSaved));
    // Add or remove this subject from the visitor's study plan.
    saveButton.addEventListener("click", () => toggleTopic(topic.title));
    card.append(category, title, description, saveButton);
    board.append(card);
  });
  if (!topicsToShow.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = showOnlySaved ? "No saved topics match these filters." : "No topics match. Try changing your filters.";
    board.append(empty);
  }
  document.querySelector("#syllabus-status").textContent = `${topicsToShow.length}  topics shown${showOnlySaved ? " from your plan" : ""}.`;
}

// Toggle a topic in the locally saved study plan and refresh its status.
function toggleTopic(title) {
  // Remove an existing topic or append a newly selected topic.
  savedTopics = savedTopics.includes(title)
    ? savedTopics.filter((savedTitle) => savedTitle !== title)
    : [...savedTopics, title];
  try {
    localStorage.setItem(savedKey, JSON.stringify(savedTopics));
  } catch (error) {
    // Report the failed write so an unsaved topic is not shown as persisted.
    console.error("Could not save the study plan:", error);
    showToast("Could not save your study plan in this browser.");
  }
  document.querySelector("#saved-count").textContent = savedTopics.length;
  savedStatus.textContent = `${savedTopics.length} ${savedTopics.length === 1 ? "topic" : "topics"} in your local study plan.`;
  displayTopics();
}

// Connect each syllabus search and filter field to the topic renderer.
document.querySelectorAll("#syllabus-search, #syllabus-program, #syllabus-stage").forEach((control) => {
  // Refresh the topic list when any search or filter control changes.
  control.addEventListener(control.tagName === "INPUT" ? "input" : "change", displayTopics);
});

// Toggle between all topics and only the visitor's saved topics.
document.querySelector("#show-saved").addEventListener("click", (event) => {
  showOnlySaved = !showOnlySaved;
  event.currentTarget.firstChild.textContent = showOnlySaved ? "Show all topics " : "Show my saved topics ";
  displayTopics();
});

// Remove saved topics from browser storage and clear the visible plan.
document.querySelector("#clear-saved").addEventListener("click", () => {
  savedTopics = [];
  try {
    localStorage.removeItem(savedKey);
  } catch (error) {
    // Report storage errors while leaving the visible plan available to the visitor.
    console.error("Could not clear the saved study plan:", error);
    showToast("Could not clear browser storage.");
  }
  document.querySelector("#saved-count").textContent = "0";
  savedStatus.textContent = "Your study plan is clear.";
  displayTopics();
});
displayTopics();
