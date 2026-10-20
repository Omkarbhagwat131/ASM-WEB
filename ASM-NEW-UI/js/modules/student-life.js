// The club cards can be searched, filtered and saved as a local shortlist.
const clubs = [
  { name: "CodeCrafters — Coding Club", type: "technology", summary: "Hackathons, coding challenges and open-source project workshops.", activity: "BUILD · DEBUG · SHARE" },
  { name: "RoboTech & AI Society", type: "technology", summary: "Explore robotics, IoT, automation and hands-on AI projects.", activity: "MAKE · TEST · REPEAT" },
  { name: "E-Cell & Management Club", type: "business", summary: "Entrepreneurship, startup ideas, pitch practice and leadership.", activity: "IDEAS · PITCH · CONNECT" },
  { name: "Aura — Cultural & Arts Club", type: "culture", summary: "Find space for music, drama, dance, photography and creative events.", activity: "CREATE · EXPRESS · CELEBRATE" },
  { name: "Chronicles — Debate & Literary Society", type: "culture", summary: "Explore debate, creative writing, public speaking and quizzes.", activity: "READ · THINK · SPEAK" }
];
const joinedKey = "asmNextGenClubShortlist";
let joinedClubs = [];
let selectedClubType = "all";
try {
  const storedClubs = JSON.parse(localStorage.getItem(joinedKey) || "[]");
  joinedClubs = Array.isArray(storedClubs) ? storedClubs : [];
} catch (error) {
  // Report corrupted or unavailable saved clubs before drawing the shortlist.
  console.error("Could not load saved club interests:", error);
  showToast("The club shortlist could not be read.");
}

// Filter and render student communities using the search and selected category.
function renderClubs() {
  const query = document.querySelector("#life-search").value.trim().toLowerCase();
  // Retain clubs matching the current text query and category.
  const matchingClubs = clubs.filter((club) => {
    const matchesText = `${club.name} ${club.summary} ${club.activity}`.toLowerCase().includes(query);
    return matchesText && (selectedClubType === "all" || club.type === selectedClubType);
  });
  const grid = document.querySelector("#life-grid");
  grid.replaceChildren();
  // Build one shortlist card for every matching club.
  matchingClubs.forEach((club, index) => {
    const card = document.createElement("article");
    card.className = "club-card";
    card.style.animationDelay = `${index * 65}ms`;
    const tag = document.createElement("span");
    tag.textContent = club.activity;
    const title = document.createElement("h3");
    title.textContent = club.name;
    const description = document.createElement("p");
    description.textContent = club.summary;
    const button = document.createElement("button");
    const isJoined = joinedClubs.includes(club.name);
    button.classList.toggle("joined", isJoined);
    button.textContent = isJoined ? "✓ On my shortlist" : "+ Add to shortlist";
    button.setAttribute("aria-pressed", String(isJoined));
    // Update the local shortlist when this club is selected.
    button.addEventListener("click", () => toggleClub(club.name));
    card.append(tag, title, description, button);
    grid.append(card);
  });
  document.querySelector("#life-status").textContent = `${matchingClubs.length} communities shown · ${joinedClubs.length} shortlisted`;
  if (!matchingClubs.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No clubs matched. Try a different search or category.";
    grid.append(empty);
  }
}

// Add or remove a club from the browser-stored shortlist.
function toggleClub(name) {
  // Remove an existing club or append a newly selected club.
  joinedClubs = joinedClubs.includes(name) ? joinedClubs.filter((clubName) => clubName !== name) : [...joinedClubs, name];
  try {
    localStorage.setItem(joinedKey, JSON.stringify(joinedClubs));
  } catch (error) {
    // Report the failed write so the updated shortlist is not implied to persist.
    console.error("Could not save the club shortlist:", error);
    showToast("Could not save your club shortlist in this browser.");
  }
  renderClubs();
}
// Refresh the club list as the visitor types a search.
document.querySelector("#life-search").addEventListener("input", renderClubs);

// Connect each category tab to its filter and selected state.
document.querySelectorAll("[data-life-category]").forEach((button) => {
  // Set this category and update all tab states when it is selected.
  button.addEventListener("click", () => {
    selectedClubType = button.dataset.lifeCategory;
    // Keep the active style and accessible pressed state synchronized.
    document.querySelectorAll("[data-life-category]").forEach((tab) => {
      const isActive = tab === button;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-pressed", String(isActive));
    });
    renderClubs();
  });
});
renderClubs();
