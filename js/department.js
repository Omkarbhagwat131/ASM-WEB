document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.querySelector("#department-grid"), status = document.querySelector("#department-status");
  const search = document.querySelector("#department-search"), level = document.querySelector("#department-level");
  if (!grid) return;
  let departments = [];
  const render = () => {
    const q = (search.value || "").trim().toLowerCase(), selected = level.value;
    const results = departments.filter((item) => [item.code,item.name,item.program,item.description].join(" ").toLowerCase().includes(q) && (selected === "all" || item.level.toLowerCase() === selected));
    grid.replaceChildren();
    results.forEach((item) => {const card=document.createElement("article");card.className="department-card";const code=document.createElement("span");code.textContent=item.code+" · "+item.level;const title=document.createElement("h3");title.textContent=item.name;const program=document.createElement("strong");program.textContent=item.program;const desc=document.createElement("p");desc.textContent=item.description;const button=document.createElement("button");button.type="button";button.textContent="View program";button.addEventListener("click",()=>{location.href="coursesprog.html";});card.append(code,title,program,desc,button);grid.append(card);});
    status.textContent=results.length ? results.length+" departments/programs found." : "No departments match your search.";
  };
  try {const response=await fetch("../data/department.json");if(!response.ok)throw Error("Department data unavailable");departments=await response.json();render();search.addEventListener("input",render);level.addEventListener("change",render);} catch(error){console.error(error);status.textContent="Department information could not be loaded. Run the site using Live Server.";}
});
