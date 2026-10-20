// These campus stories are based on the ASM communication images supplied for this project.
const highlightItems = [
  { title: "AI Fest 2026: Hackathon & Ideathon Grand Finale", category: "learning", summary: "Lead with AI: a showcase bringing future innovators together across ASM campuses.", image: "../images/events/ai-fest-2026.png", alt: "AI Fest 2026 Hackathon and Ideathon Grand Finale poster" },
  { title: "World Record Recognition", category: "learning", summary: "ASM's campaign poster highlights multi-campus AI skill workshops conducted across multiple venues.", image: "../images/events/world-record-recognition.png", alt: "ASM World Record Recognition poster for multi-campus AI skill workshops" },
  { title: "Kalam Stream Challenge 2026", category: "community", summary: "A student creativity and innovation challenge featured in ASM's campus communications.", image: "../images/events/kalam-stream-challenge-2026.png", alt: "Kalam Stream Challenge 2026 campus poster" },
  { title: "Aarambh Induction Program", category: "community", summary: "A welcome program for new B.E. and MCA students, pictured at the Talegaon Dabhade campus.", image: "../images/events/aarambh-induction.png", alt: "Guests on stage at ASM NextGen Technical Campus's Aarambh induction program" }
];
const bookmarksKey = "asmNextGenEventBookmarks";
let savedHighlights = [];
try {
  const stored = JSON.parse(localStorage.getItem(bookmarksKey) || "[]");
  if (!Array.isArray(stored)) throw new TypeError("Saved campus stories should be a list");
  savedHighlights = stored;
} catch (error) {
  // Report malformed or unavailable saved stories and continue rendering the page.
  console.error("Could not load saved campus highlights:", error);
  showToast("Saved highlights could not be read.");
}

// Render the filtered campus stories and restore their saved state.
function displayHighlights() {
  const query = document.querySelector("#event-search").value.trim().toLowerCase();
  const category = document.querySelector("#event-category").value;
  // Keep stories that match both the text query and selected topic.
  const filtered = highlightItems.filter((item) => {
    const matchesText = `${item.title} ${item.summary}`.toLowerCase().includes(query);
    return matchesText && (category === "all" || item.category === category);
  });
  const grid = document.querySelector("#events-grid");
  grid.replaceChildren();
  // Render a story card for each matching campus highlight.
  filtered.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "event-card";
    card.style.animationDelay = `${index * 55}ms`;
    const image = document.createElement("img");
    image.className = "event-card-image";
    image.src = item.image;
    image.alt = item.alt;
    image.loading = "lazy";
    const copy = document.createElement("div");
    copy.className = "event-card-copy";
    const label = document.createElement("span");
    label.textContent = `${item.category} · campus story`;
    const title = document.createElement("h3");
    title.textContent = item.title;
    const description = document.createElement("p");
    description.textContent = item.summary;
    const actions = document.createElement("div");
    actions.className = "event-card-actions";
    const button = document.createElement("button");
    const isSaved = savedHighlights.includes(item.title);
    button.classList.toggle("saved", isSaved);
    button.textContent = isSaved ? "✓ Saved" : "+ Save story";
    button.setAttribute("aria-pressed", String(isSaved));
    // Save or remove this campus story from the browser's saved list.
    button.addEventListener("click", () => {
      // Toggle this story in the visitor's browser-saved list.
      // Remove the selected story when it is already saved.
      const nextSavedHighlights = isSaved
        ? savedHighlights.filter((titleText) => titleText !== item.title)
        : [...savedHighlights, item.title];
      try {
        localStorage.setItem(bookmarksKey, JSON.stringify(nextSavedHighlights));
      } catch (error) {
        // Report the storage failure and do not show a false saved state.
        console.error("Could not save a campus highlight:", error);
        showToast("Could not save this highlight.");
        return;
      }
      savedHighlights = nextSavedHighlights;
      displayHighlights();
    });
    const sourceLink = document.createElement("a");
    sourceLink.href = "https://www.instagram.com/asm_next/";
    sourceLink.target = "_blank";
    sourceLink.rel = "noopener noreferrer";
    sourceLink.textContent = "ASM updates ↗";
    actions.append(button, sourceLink);
    copy.append(label, title, description, actions);
    card.append(image, copy);
    grid.append(card);
  });
  document.querySelector("#events-status").textContent = `${filtered.length} campus ${filtered.length === 1 ? "story" : "stories"} shown · ${savedHighlights.length} saved on this device`;
  if (!filtered.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No highlights match your filters.";
    grid.append(empty);
  }
}

// Refresh the list whenever a visitor types a search query.
document.querySelector("#event-search").addEventListener("input", displayHighlights);

// Refresh the list whenever a visitor changes the topic filter.
document.querySelector("#event-category").addEventListener("change", displayHighlights);

// Clear the search and restore all campus stories.
document.querySelector("#clear-events").addEventListener("click", () => {
  document.querySelector("#event-search").value = "";
  document.querySelector("#event-category").value = "all";
  displayHighlights();
});

// Show all featured campus stories when the page first loads.
displayHighlights();
