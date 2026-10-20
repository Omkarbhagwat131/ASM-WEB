const subjectAreas = [
  {
    title: "Civil Engineering",
    kind: "ENGINEERING",
    summary: "Plan and create the buildings, roads and infrastructure people rely on.",
    detail: "Explore construction technology, structural engineering, surveying, transportation, geotechnical and environmental engineering.",
    image: "civil-engineering.jpg",
    imageAlt: "Modern buildings illustrating civil engineering and construction",
    link: "programs.html"
  },
  {
    title: "Computer Science & Engineering",
    kind: "ENGINEERING",
    summary: "Build software, computing systems and the technologies behind digital services.",
    detail: "Explore programming, algorithms, software engineering, databases, operating systems and cybersecurity.",
    image: "computer-science.jpg",
    imageAlt: "Computer circuit board illustrating computer science and engineering",
    link: "programs.html"
  },
  {
    title: "Information Technology",
    kind: "ENGINEERING",
    summary: "Connect people and organizations through reliable digital infrastructure.",
    detail: "Explore computer networks, cloud platforms, information security, web systems and IT service management.",
    image: "information-technology.jpg",
    imageAlt: "Network server racks illustrating information technology",
    link: "programs.html"
  },
  {
    title: "Mechanical Engineering",
    kind: "ENGINEERING",
    summary: "Design, analyze and improve machines, products and manufacturing systems.",
    detail: "Explore product design, manufacturing, materials, thermodynamics, robotics and maintenance.",
    image: "mechanical-engineering.jpg",
    imageAlt: "Engineering design drawings and tools on a workbench",
    link: "programs.html"
  },
  {
    title: "Electrical Engineering",
    kind: "ENGINEERING",
    summary: "Study electrical power, energy systems and the machines that use them.",
    detail: "Explore power generation, electrical machines, control systems, renewable energy and power distribution.",
    image: "electrical-engineering.jpg",
    imageAlt: "Solar farm illustrating electrical power and renewable energy",
    link: "programs.html"
  },
  {
    title: "Electronics & Computer Engineering",
    kind: "ENGINEERING",
    summary: "Bring electronics and computing together in connected devices and systems.",
    detail: "Explore electronic circuits, embedded systems, communication, sensors, control and the Internet of Things.",
    image: "electronics-computer.jpg",
    imageAlt: "People collaborating with computers on an electronics and computing project",
    link: "programs.html"
  },
  {
    title: "Artificial Intelligence & Machine Learning",
    kind: "ENGINEERING",
    summary: "Use data and intelligent systems to solve problems in new ways.",
    detail: "Explore data science, machine learning, neural networks, computer vision and responsible AI.",
    image: "artificial-intelligence.jpg",
    imageAlt: "Artificial intelligence lettering on a digital background",
    link: "programs.html"
  },
  {
    title: "Chemical Engineering",
    kind: "ENGINEERING",
    summary: "Transform materials into useful products through safe, efficient processes.",
    detail: "Explore process engineering, industrial chemistry, materials, process safety and sustainable production.",
    image: "chemical-engineering.jpg",
    imageAlt: "Laboratory glassware illustrating chemical engineering processes",
    link: "programs.html"
  },
  {
    title: "Master of Computer Applications (MCA)",
    kind: "POSTGRADUATE",
    summary: "Advance your computing knowledge through postgraduate study.",
    detail: "Explore advanced software development, application architecture, databases, cloud computing and project work. Check ASM for current eligibility and course availability.",
    image: "mca-postgraduate.jpg",
    imageAlt: "Student using a laptop for postgraduate computing study",
    link: "programs.html"
  },
  {
    title: "Computing & Applications",
    kind: "TECHNOLOGY",
    summary: "Explore programming, software development, web technologies and databases.",
    detail: "Build foundations in application development, web technologies, programming logic and information systems.",
    image: "computer-science.jpg",
    imageAlt: "Computer circuit board illustrating computing and applications",
    link: "programs.html"
  },
  {
    title: "Business Administration",
    kind: "BUSINESS",
    summary: "Study management, entrepreneurship, strategy and leadership.",
    detail: "Explore organizational management, marketing, entrepreneurship, business strategy and leadership.",
    image: "mca-postgraduate.jpg",
    imageAlt: "Students collaborating around laptops on a business project",
    link: "programs.html"
  },
  {
    title: "Commerce & Finance",
    kind: "COMMERCE",
    summary: "Build understanding of accounting, taxation, economics and finance.",
    detail: "Explore financial accounting, business taxation, economics, financial markets and commerce.",
    image: "information-technology.jpg",
    imageAlt: "Digital information systems illustrating modern commerce and finance",
    link: "programs.html"
  }
];

const departmentGrid = document.querySelector("#department-grid");
const departmentSearch = document.querySelector("#department-search");

// Filter and render department cards for the current search.
function renderDepartments() {
  const query = departmentSearch.value.trim().toLowerCase();
  const matches = subjectAreas.filter((item) =>
    `${item.title} ${item.kind} ${item.summary} ${item.detail}`.toLowerCase().includes(query)
  );

  departmentGrid.replaceChildren();
  matches.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "department-card reveal visible";
    card.style.animationDelay = `${index * 70}ms`;

    const image = document.createElement("img");
    image.className = "department-image";
    image.src = `../images/departments/${item.image}`;
    image.alt = item.imageAlt;
    image.loading = "lazy";
    image.decoding = "async";

    const number = document.createElement("span");
    number.className = "department-number";
    number.textContent = String(index + 1).padStart(2, "0");

    const title = document.createElement("h3");
    title.textContent = item.title;

    const summary = document.createElement("p");
    summary.textContent = `${item.kind} · ${item.summary}`;

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "View details +";
    button.setAttribute("aria-expanded", "false");
    button.addEventListener("click", () => {
      const isExpanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isExpanded));
      button.textContent = isExpanded ? "View details +" : "Hide details −";
      let detail = card.querySelector(".department-detail");
      if (isExpanded) {
        detail.remove();
      } else {
        detail = document.createElement("p");
        detail.className = "department-detail";
        detail.textContent = item.detail;
        card.append(detail);
      }
    });

    const link = document.createElement("a");
    link.className = "department-link";
    link.href = item.link;
    link.textContent = "Explore related learning →";
    card.append(image, number, title, summary, button, link);
    departmentGrid.append(card);
  });

  document.querySelector("#department-status").textContent = `${matches.length} subject areas shown.`;
  if (!matches.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No subject areas match. Try another search.";
    departmentGrid.append(empty);
  }
}

departmentSearch.addEventListener("input", renderDepartments);
document.querySelector("#clear-departments").addEventListener("click", () => {
  departmentSearch.value = "";
  renderDepartments();
});
renderDepartments();
