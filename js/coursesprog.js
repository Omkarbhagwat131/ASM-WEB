document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.querySelector("#courses-container");
  const search = document.querySelector("#course-search");
  const category = document.querySelector("#course-category");
  const count = document.querySelector("#course-count");
  const status = document.querySelector("#course-status");
  if (!grid) return;
  let courses = [];
  const render = () => {
    const term = (search?.value || "").trim().toLowerCase();
    const selected = (category?.value || "all").toLowerCase();
    const filtered = courses.filter((course) => {
      const text = [course.name, course.description, course.category, course.level].join(" ").toLowerCase();
      return text.includes(term) && (selected === "all" || [course.category, course.level].some((value) => String(value || "").toLowerCase() === selected));
    });
    grid.replaceChildren();
    filtered.forEach((course) => {
      const card = document.createElement("article"); card.className = "course-card";
      const badge = document.createElement("span"); badge.className = "course-category"; badge.textContent = course.level || course.category || "Program";
      const title = document.createElement("h3"); title.textContent = course.name || "Academic program";
      const desc = document.createElement("p"); desc.textContent = course.description || "";
      const duration = document.createElement("p"); duration.className = "course-duration"; duration.textContent = "Duration: " + (course.duration || "Please enquire");
      const explore = document.createElement("a");
      explore.className = "course-button";
      explore.href = course.link || "addmission.html";
      explore.textContent = "Explore Course";
      card.append(badge, title, desc, duration, explore); grid.append(card);
    });
    if (count) count.textContent = filtered.length + (filtered.length === 1 ? " course" : " courses") + " found";
    if (status) status.textContent = filtered.length ? "" : "No programs match your search.";
  };
  try {
    const response = await fetch("../data/courseprog.json");
    if (!response.ok) throw new Error("Course data unavailable.");
    const data = await response.json();
    courses = Array.isArray(data) ? data : (data.courses || []);
    render();
    search?.addEventListener("input", render);
    category?.addEventListener("change", render);
  } catch (error) {
    console.error(error); grid.replaceChildren();
    if (count) count.textContent = "";
    if (status) status.textContent = "Course information could not be loaded. Run this page using Live Server.";
  }
});
