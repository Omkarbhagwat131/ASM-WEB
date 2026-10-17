document.addEventListener("DOMContentLoaded", async () => {
  const targets = {
    stats: document.querySelector("#placement-stats"),
    highlights: document.querySelector("#placement-highlights"),
    training: document.querySelector("#placement-training"),
    recruiters: document.querySelector("#placement-recruiters")
  };
  const makeIcon = (iconClass, className) => {
    const icon = document.createElement("i");
    icon.className = iconClass || "fa-solid fa-circle-info";
    if (className) icon.classList.add(className);
    icon.setAttribute("aria-hidden", "true");
    return icon;
  };
  const renderStats = (items) => {
    if (!targets.stats) return;
    targets.stats.replaceChildren();
    (items || []).forEach((item) => {
      const card = document.createElement("article");
      card.className = "stat-box";
      card.append(makeIcon(item.icon, "stat-icon"));
      const value = document.createElement("h2");
      value.textContent = item.value || "";
      const label = document.createElement("p");
      label.className = "stat-label";
      label.textContent = item.label || "";
      card.append(value, label);
      targets.stats.append(card);
    });
  };
  const renderHighlights = (items) => {
    if (!targets.highlights) return;
    targets.highlights.replaceChildren();
    (items || []).forEach((item) => {
      const card = document.createElement("article");
      card.className = "department-card";
      const icon = document.createElement("div");
      icon.className = "card-icon";
      icon.append(makeIcon(item.icon));
      const label = document.createElement("span");
      label.className = "department-code";
      label.textContent = item.label || "";
      const value = document.createElement("h3");
      value.textContent = item.value || "";
      const description = document.createElement("p");
      description.textContent = item.description || "";
      card.append(icon, label, value, description);
      targets.highlights.append(card);
    });
  };
  const renderSteps = (items) => {
    if (!targets.training) return;
    targets.training.replaceChildren();
    (items || []).forEach((item, index) => {
      const card = document.createElement("article");
      card.className = "step-card";
      const number = document.createElement("span");
      number.className = "step-number";
      number.textContent = String(index + 1).padStart(2, "0");
      const heading = document.createElement("h3");
      heading.textContent = item.title || "";
      const description = document.createElement("p");
      description.textContent = item.description || "";
      card.append(number, heading, description);
      targets.training.append(card);
    });
  };
  const renderRecruiters = (items) => {
    if (!targets.recruiters) return;
    targets.recruiters.replaceChildren();
    (items || []).forEach((item) => {
      const card = document.createElement("article");
      card.className = "document-item";
      const iconWrap = document.createElement("span");
      iconWrap.className = "document-icon";
      iconWrap.append(makeIcon(item.icon));
      const text = document.createElement("div");
      const heading = document.createElement("h3");
      heading.textContent = item.title || "";
      const description = document.createElement("p");
      description.textContent = item.description || "";
      text.append(heading, description);
      card.append(iconWrap, text);
      targets.recruiters.append(card);
    });
  };
  try {
    const response = await fetch("../data/placement.json");
    if (!response.ok) throw new Error("Placement data unavailable.");
    const data = await response.json();
    renderStats(data.stats);
    renderHighlights(data.highlights);
    renderSteps(data.training);
    renderRecruiters(data.recruiters);
  } catch (error) {
    console.error(error);
  }
});
