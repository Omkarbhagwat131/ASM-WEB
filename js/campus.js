document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.querySelector("#campus-container");
  const status = document.querySelector("#campus-status");
  if (!grid) return;
  try {
    const response = await fetch("../data/campus.json");
    if (!response.ok) throw new Error("Campus data unavailable.");
    const data = await response.json();
    const facilities = Array.isArray(data.facilities) ? data.facilities : [];
    grid.replaceChildren();
    facilities.forEach((facility) => {
      const card = document.createElement("article");
      card.className = "campus-card";
      const image = document.createElement("img");
      image.loading = "lazy";
      image.decoding = "async";
      image.src = facility.image || "../image/asm-campus-building.png";
      image.alt = facility.name || "Campus facility";
      image.addEventListener("error", () => { image.src = "../image/asm-campus-building.png"; }, { once: true });
      const content = document.createElement("div");
      content.className = "campus-card-content";
      const title = document.createElement("h3");
      title.textContent = facility.name || "Campus facility";
      const desc = document.createElement("p");
      desc.textContent = facility.description || "";
      content.append(title, desc);
      card.append(image, content);
      grid.append(card);
    });
    if (status) status.textContent = facilities.length ? "" : "Campus information will be updated soon.";
  } catch (error) {
    console.error(error);
    if (status) status.textContent = "Campus facilities could not be loaded. Please run the site using Live Server.";
  }
});
