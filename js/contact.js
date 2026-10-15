// =====================
// CONTACT FORM
// =====================

const form = document.getElementById("contact-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const formStatus = document.getElementById("form-status");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const userData = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    message: messageInput.value.trim()
  };

  // Get existing data or create empty array
  let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

  // Add new submission
  contacts.push(userData);

  // Save updated array
  localStorage.setItem("contacts", JSON.stringify(contacts));

  formStatus.textContent = `Thank you, ${userData.name}! Your message has been received.`;

  console.log("Name:", userData.name);
  console.log("Email:", userData.email);
  console.log("Message:", userData.message);

  form.reset();
});


// =====================
// EVENTS
// =====================
const eventList = document.getElementById("event-list");

const events = [
  {
    title: "Annual Tech Fest 2026",
    date: "15 October 2026",
    detail: "Main Auditorium",
    description:
      "Join us for coding competitions, hackathons, and guest lectures.",
    category: "technology"
  },
  {
    title: "Guest Lecture: Cloud Computing",
    date: "20 October 2026",
    detail: "Speaker: Dr. A. Sharma",
    description: "Learn about APIs and modern cloud trends.",
    category: "guest-lecture"
  }
];




// =====================
// DISPLAY EVENTS
// =====================

function renderEvents(eventArray) {

  eventList.innerHTML = "";

  eventArray.forEach(function(event) {

    const card = document.createElement("article");
    card.classList.add("contact-event-card");

    const title = document.createElement("h3");
    title.textContent = event.title;

    const date = document.createElement("span");
    date.classList.add("contact-event-date");
    date.textContent = event.date;

    const detail = document.createElement("p");
    detail.classList.add("contact-event-detail");
    detail.textContent = event.detail;

    const description = document.createElement("p");
    description.textContent = event.description;

    const category = document.createElement("p");
    category.textContent = event.category;

    card.append(
      date,
      title,
      detail,
      description,
      category
    );

    eventList.appendChild(card);

  });

}


// =====================
// INITIAL LOAD
// =====================

renderEvents(events);


// =====================
// SEARCH + FILTER
// =====================
const searchInput = document.getElementById("event-search");
const categorySelect = document.getElementById("event-category");
const clearButton = document.querySelector(
  "[data-action='clear-filters']"
);
function filterEvents() {

  const searchText = searchInput.value.toLowerCase();
  const selectedCategory = categorySelect.value;

  const filteredEvents = events.filter(function(event) {

    const matchesSearch =
      event.title.toLowerCase().includes(searchText) ||
      event.date.toLowerCase().includes(searchText) ||
      event.detail.toLowerCase().includes(searchText) ||
      event.description.toLowerCase().includes(searchText);

    const matchesCategory =
      selectedCategory === "all" ||
      event.category === selectedCategory;

    return matchesSearch && matchesCategory;

  });

  renderEvents(filteredEvents);

}


// =====================
// EVENT LISTENERS
// =====================

searchInput.addEventListener("input", filterEvents);

categorySelect.addEventListener("change", filterEvents);

clearButton.addEventListener("click", function () {
  searchInput.value = "";
  categorySelect.value = "all";

  filterEvents();
});

searchInput.addEventListener("input", function () {
  localStorage.setItem("searchText", searchInput.value);
});

searchInput.value =
  localStorage.getItem("searchText") || "";

categorySelect.addEventListener("change", function () {
  localStorage.setItem("selectedCategory",categorySelect.value);

  filterEvents();
});

categorySelect.value =
  localStorage.getItem("selectedCategory") || "all";
  
  filterEvents();