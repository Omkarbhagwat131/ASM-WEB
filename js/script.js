"use strict";

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    formStatus.textContent = `Thanks, ${name}. This demo does not send messages yet. Please email info@asmcollege.edu to reach us.`;
  });
}

const eventFilters = document.getElementById("event-filters");
const eventSearch = document.getElementById("event-search");
const eventCategory = document.getElementById("event-category");
const eventList = document.getElementById("event-list");
const resultsStatus = document.getElementById("event-results-status");
const storageStatus = document.getElementById("event-storage-status");

if (
  eventFilters &&
  eventSearch &&
  eventCategory &&
  eventList &&
  resultsStatus &&
  storageStatus
) {
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
  const storageKey = "asm-contact-event-filters";
  const validCategories = ["all", "technology", "guest-lecture"];

  function showStorageError(message, error) {
    console.error(message, error);
    storageStatus.textContent =
      "Your event search preferences could not be saved or restored.";
  }

  function restoreFilters() {
    try {
      const savedPreferences = localStorage.getItem(storageKey);

      if (!savedPreferences) {
        return;
      }

      const preferences = JSON.parse(savedPreferences);

      if (
        typeof preferences !== "object" ||
        preferences === null ||
        Array.isArray(preferences)
      ) {
        throw new TypeError("Saved event filters have an invalid format.");
      }

      if (typeof preferences.searchQuery === "string") {
        eventSearch.value = preferences.searchQuery;
      }

      const isValidCategory = validCategories.some(
        (category) => category === preferences.selectedCategory
      );

      if (isValidCategory) {
        eventCategory.value = preferences.selectedCategory;
      }
    } catch (error) {
      showStorageError("Could not restore event search preferences:", error);
    }
  }

  function saveFilters() {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          searchQuery: eventSearch.value.trim(),
          selectedCategory: eventCategory.value
        })
      );
      storageStatus.textContent = "";
    } catch (error) {
      showStorageError("Could not save event search preferences:", error);
    }
  }

  function createEventCard(eventData) {
    const card = document.createElement("article");
    card.className = "contact-event-card";

    const date = document.createElement("span");
    date.className = "contact-event-date";
    date.textContent = eventData.date;

    const title = document.createElement("h3");
    title.textContent = eventData.title;

    const detail = document.createElement("p");
    detail.className = "contact-event-detail";
    detail.textContent = eventData.detail;

    const description = document.createElement("p");
    description.textContent = eventData.description;

    card.append(date, title, detail, description);
    return card;
  }

  function renderEvents() {
    const query = eventSearch.value.trim().toLowerCase();
    const category = eventCategory.value;

    const matchingEvents = events.filter(function (eventData) {
      const searchableText = [
        eventData.title,
        eventData.date,
        eventData.detail,
        eventData.description,
        eventData.category
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch = searchableText.includes(query);
      const matchesCategory =
        category === "all" || eventData.category === category;

      return matchesSearch && matchesCategory;
    });

    const eventCards = matchingEvents.map(createEventCard);
    eventList.replaceChildren(...eventCards);

    if (matchingEvents.length === 0) {
      resultsStatus.textContent = "No events found. Try another search or filter.";
    } else {
      resultsStatus.textContent =
        matchingEvents.length +
        (matchingEvents.length === 1 ? " event found." : " events found.");
    }
  }

  function updateFilters() {
    renderEvents();
    saveFilters();
  }

  restoreFilters();
  renderEvents();

  eventFilters.addEventListener("submit", (event) => {
    event.preventDefault();
  });

  eventFilters.addEventListener("input", (event) => {
    if (event.target === eventSearch) {
      updateFilters();
    }
  });

  eventFilters.addEventListener("change", (event) => {
    if (event.target === eventCategory) {
      updateFilters();
    }
  });

  eventFilters.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const clearButton = event.target.closest('[data-action="clear-filters"]');

    if (!clearButton || !eventFilters.contains(clearButton)) {
      return;
    }

    eventSearch.value = "";
    eventCategory.value = "all";
    updateFilters();
    eventSearch.focus();
  });

} else if (document.getElementById("event-filters")) {
  console.error(
    "Event search could not initialize because required page elements are missing."
  );
}
