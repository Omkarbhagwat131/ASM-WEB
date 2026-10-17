document.addEventListener("DOMContentLoaded", async () => {
  const targets = {
    programmes: document.querySelector("#admission-programs"),
    eligibility: document.querySelector("#admission-eligibility"),
    process: document.querySelector("#admission-process-steps")
  };
  const makeIcon = (iconClass) => {
    const wrapper = document.createElement("div");
    wrapper.className = "admission-icon";
    const icon = document.createElement("i");
    icon.className = iconClass || "fa-solid fa-circle-info";
    icon.setAttribute("aria-hidden", "true");
    wrapper.append(icon);
    return wrapper;
  };
  const makeCard = (item, type, index) => {
    const card = document.createElement("article");
    card.className = "admission-card";
    if (type === "process") {
      const number = document.createElement("div");
      number.className = "process-number";
      number.textContent = String(index + 1);
      card.append(number);
    } else {
      card.append(makeIcon(item.icon));
    }
    if (item.level) {
      const label = document.createElement("span");
      label.className = "card-label";
      label.textContent = item.level;
      card.append(label);
    }
    const heading = document.createElement("h3");
    heading.textContent = item.title || "";
    const description = document.createElement("p");
    description.textContent = item.description || "";
    card.append(heading, description);
    if (Array.isArray(item.highlights)) {
      const list = document.createElement("ul");
      item.highlights.forEach((text) => {
        const entry = document.createElement("li");
        entry.textContent = text;
        list.append(entry);
      });
      card.append(list);
    }
    return card;
  };

  try {
    const response = await fetch("../data/addmission.json");
    if (!response.ok) throw new Error("Admission data unavailable.");
    const data = await response.json();
    targets.programmes?.replaceChildren(...(data.programmes || []).map((item) => makeCard(item, "programme")));
    targets.eligibility?.replaceChildren(...(data.eligibility || []).map((item) => makeCard(item, "eligibility")));
    targets.process?.replaceChildren(...(data.process || []).map((item, index) => makeCard(item, "process", index)));
    const intro = document.querySelector(".eligibility-grid")?.previousElementSibling;
    if (intro && data.eligibilityIntro) intro.textContent = data.eligibilityIntro;
    const note = document.querySelector(".admission-note");
    if (note && data.eligibilityNote) note.textContent = "Important: " + data.eligibilityNote;
  } catch (error) {
    console.error(error);
  }
});
