
"use strict";

/* ==========================================
   ASM ABOUT PAGE JAVASCRIPT
========================================== */

document.addEventListener("DOMContentLoaded", initializeAboutPage);

async function initializeAboutPage() {
    setupMobileNavigation();
    setupCurrentYear();

    await loadAboutData();
}

/* ==========================================
   MOBILE NAVIGATION
========================================== */

function setupMobileNavigation() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".main-navigation");

    if (!menuToggle || !navigation) {
        return;
    }

    menuToggle.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("is-open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
    });

    // Close mobile menu after selecting a page link.
    navigation.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 768) {
                navigation.classList.remove("is-open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Open navigation menu");
            }
        });
    });

    // Reset mobile menu state when switching to desktop.
    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            navigation.classList.remove("is-open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation menu");
        }
    });
}

/* ==========================================
   CURRENT YEAR
========================================== */

function setupCurrentYear() {
    const yearElement = document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/* ==========================================
   LOAD JSON DATA
========================================== */

async function loadAboutData() {
    try {
        const response = await fetch("../data/about.json");

        if (!response.ok) {
            throw new Error(
                `Unable to load about.json. HTTP status: ${response.status}`
            );
        }

        const data = await response.json();

        renderIntroduction(data.introduction);
        renderVisionMission(data.vision, data.mission);
        renderValues(data.values);
        renderObjectives(data.objectives);

    } catch (error) {
        console.error("About page data error:", error);
        showDataError();
    }
}

/* ==========================================
   CREATE ELEMENTS SAFELY
========================================== */

function createElement(tagName, className, textContent) {
    const element = document.createElement(tagName);

    if (className) {
        element.className = className;
    }

    if (textContent !== undefined && textContent !== null) {
        element.textContent = textContent;
    }

    return element;
}

/* ==========================================
   INTRODUCTION
========================================== */

function renderIntroduction(introduction) {
    const container = document.getElementById("about-content");

    if (!container || !introduction) {
        return;
    }

    container.replaceChildren();

    const heading = createElement(
        "h3",
        "",
        introduction.heading
    );

    container.appendChild(heading);

    if (!Array.isArray(introduction.paragraphs)) {
        return;
    }

    introduction.paragraphs.forEach((paragraphText) => {
        const paragraph = createElement(
            "p",
            "",
            paragraphText
        );

        container.appendChild(paragraph);
    });
}

/* ==========================================
   VISION AND MISSION
========================================== */

function renderVisionMission(vision, mission) {
    const container = document.getElementById(
        "vision-mission-container"
    );

    if (!container) {
        return;
    }

    container.replaceChildren();

    const items = [vision, mission];

    items.forEach((item) => {
        if (!item) {
            return;
        }

        const card = createElement("article", "info-card");

        const icon = createElement(
            "div",
            "card-icon",
            item.icon || "◇"
        );

        const heading = createElement(
            "h3",
            "",
            item.title
        );

        const description = createElement(
            "p",
            "",
            item.description
        );

        card.append(icon, heading, description);
        container.appendChild(card);
    });
}

/* ==========================================
   CORE VALUES
========================================== */

function renderValues(values) {
    const container = document.getElementById("values-container");

    if (!container) {
        return;
    }

    container.replaceChildren();

    if (!Array.isArray(values) || values.length === 0) {
        container.appendChild(
            createElement(
                "p",
                "loading-message",
                "No core values are available."
            )
        );

        return;
    }

    values.forEach((value) => {
        const card = createElement("article", "value-card");

        const icon = createElement(
            "div",
            "value-icon",
            value.icon || "◇"
        );

        const heading = createElement(
            "h3",
            "",
            value.title
        );

        const description = createElement(
            "p",
            "",
            value.description
        );

        card.append(icon, heading, description);
        container.appendChild(card);
    });
}

/* ==========================================
   OBJECTIVES
========================================== */

function renderObjectives(objectives) {
    const container = document.getElementById(
        "objectives-container"
    );

    if (!container) {
        return;
    }

    container.replaceChildren();

    if (!Array.isArray(objectives) || objectives.length === 0) {
        container.appendChild(
            createElement(
                "p",
                "loading-message",
                "No objectives are available."
            )
        );

        return;
    }

    objectives.forEach((objective, index) => {
        const card = createElement("article", "objective-card");

        const number = createElement(
            "div",
            "objective-number",
            String(index + 1).padStart(2, "0")
        );

        const content = createElement("div", "objective-content");

        const heading = createElement(
            "h3",
            "",
            objective.title
        );

        const description = createElement(
            "p",
            "",
            objective.description
        );

        content.append(heading, description);
        card.append(number, content);
        container.appendChild(card);
    });
}

/* ==========================================
   ERROR HANDLING
========================================== */

function showDataError() {
    const containers = [
        "about-content",
        "vision-mission-container",
        "values-container",
        "objectives-container"
    ];

    containers.forEach((containerId) => {
        const container = document.getElementById(containerId);

        if (!container) {
            return;
        }

        const message = createElement(
            "p",
            "error-message",
            "Information could not be loaded. Please run this page using VS Code Live Server and check that data/about.json exists."
        );

        container.replaceChildren(message);
    });
}
