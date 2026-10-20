// Faculty profiles are searchable from the details already in the student project.
const facultyMembers = [
  { name: "Dr. Dhananjay Upasni", role: "Dean Academics", department: "engineering", departmentName: "Electrical Engineering", subject: "Electrical Machines · Power Systems", image: "../images/dhananjay-sir.png" },
  { name: "Dr. Ketan Desale", role: "Head of Department", department: "computer", departmentName: "Master of Computer Applications", subject: "Research Methodology", image: "../images/ketan-sir.png" },
  { name: "Prof. Jyoti Mokashi", role: "MCA Coordinator & Assistant Professor", department: "computer", departmentName: "Master of Computer Applications", subject: "Data Structures & Algorithms", image: "../images/jyoti-mam.jpeg" },
  { name: "Prof. Vandana Pendekar", role: "Assistant Professor & TPO", department: "engineering", departmentName: "Engineering (ECE)", subject: "Circuit Analysis · Digital Electronics", image: "../images/vandana-mam.jpeg" },
  { name: "Asst. Prof. Samiksha Pawar", role: "Assistant Professor & Placement Coordinator", department: "computer", departmentName: "Master of Computer Applications", subject: "Software Engineering", image: "../images/samiksha-mam.jpeg" },
  { name: "Asst. Prof. Sakshi Chikorde", role: "Assistant Professor", department: "computer", departmentName: "Master of Computer Applications", subject: "E-Commerce", image: "../images/sakshi-mam.jpeg" }
];
const facultyGrid = document.querySelector("#faculty-grid");

// Filter faculty profiles by the current search query and department.
function renderFaculty() {
  const query = document.querySelector("#faculty-search").value.trim().toLowerCase();
  const department = document.querySelector("#faculty-filter").value;
  // Retain profiles matching both the text query and department selection.
  const results = facultyMembers.filter((person) => {
    const matchesText = `${person.name} ${person.role} ${person.departmentName} ${person.subject}`.toLowerCase().includes(query);
    return matchesText && (department === "all" || person.department === department);
  });
  facultyGrid.replaceChildren();
  // Build one profile card for each matching faculty member.
  results.forEach((person, index) => {
    const card = document.createElement("article");
    card.className = "faculty-card";
    card.style.animationDelay = `${index * 60}ms`;
    const imageFrame = document.createElement("div");
    imageFrame.className = "faculty-photo";
    const image = document.createElement("img");
    image.src = person.image;
    image.alt = person.name;
    image.loading = "lazy";
    const chip = document.createElement("span");
    chip.textContent = person.department === "computer" ? "COMPUTER APPLICATIONS" : "ENGINEERING";
    imageFrame.append(image, chip);
    const info = document.createElement("div");
    info.className = "faculty-info";
    const role = document.createElement("p");
    role.className = "faculty-role";
    role.textContent = person.role;
    const name = document.createElement("h3");
    name.textContent = person.name;
    const departmentName = document.createElement("p");
    departmentName.textContent = person.departmentName;
    const subject = document.createElement("span");
    subject.className = "faculty-subject";
    subject.textContent = person.subject;
    info.append(role, name, departmentName, subject);
    card.append(imageFrame, info);
    facultyGrid.append(card);
  });
  document.querySelector("#faculty-status").textContent = `${results.length} faculty ${results.length === 1 ? "profile" : "profiles"} shown.`;
  if (!results.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No profiles match. Try a different name or department.";
    facultyGrid.append(empty);
  }
}
// Update profile cards whenever the visitor changes the search text.
document.querySelector("#faculty-search").addEventListener("input", renderFaculty);

// Update profile cards whenever the selected department changes.
document.querySelector("#faculty-filter").addEventListener("change", renderFaculty);
renderFaculty();
