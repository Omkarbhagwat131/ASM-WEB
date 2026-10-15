document.addEventListener("DOMContentLoaded", () => {
    const courseSearchInput = document.querySelector("#course-search-input");
    const categorySelect = document.querySelector("#category-filter-select");
    const clearSearchBtn = document.querySelector("#clear-search-btn");
    const noResultsMessage = document.querySelector("#no-results-msg");

    const ugSection = document.querySelector("#ug-section");
    const pgSection = document.querySelector("#pg-section");
    const clubsSection = document.querySelector("#clubs-section");

    const ugHeading = document.querySelector("#ug-heading");
    const pgHeading = document.querySelector("#pg-heading");
    const clubsHeading = document.querySelector("#clubs-heading");

    // Modal Elements
    const modalOverlay = document.querySelector("#course-modal");
    const modalCloseBtn = document.querySelector("#modal-close-btn");
    const modalBadge = document.querySelector("#modal-badge");
    const modalTitle = document.querySelector("#modal-title");
    const modalDesc = document.querySelector("#modal-desc");
    const modalDuration = document.querySelector("#modal-duration");
    const modalSeats = document.querySelector("#modal-seats");
    const modalEligibility = document.querySelector("#modal-eligibility");
    const modalFees = document.querySelector("#modal-fees");
    const modalHighlightsList = document.querySelector("#modal-highlights-list");
    const modalActionBtn = document.querySelector("#modal-action-btn");

    const PREF_KEY = "asm-preferred-filter";
    let allCoursesData = [];

    // Fetch JSON data
    const fetchCoursesData = async () => {
        try {
            const response = await fetch("data/courses.json");
            if (!response.ok) throw new Error("Failed to load courses.json");
            const data = await response.json();
            allCoursesData = data.courses;
            renderCourses(allCoursesData);
            restoreSearchPreference();
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    // Render course cards with Rating and Download Syllabus button
    const renderCourses = (courses) => {
        ugSection.innerHTML = "";
        pgSection.innerHTML = "";
        clubsSection.innerHTML = "";

        courses.forEach(course => {
            const card = document.createElement("div");
            card.className = "course-card";
            card.setAttribute("data-category", course.category);
            card.setAttribute("data-title", course.title.toLowerCase());
            card.setAttribute("data-desc", course.description.toLowerCase());
            card.setAttribute("data-badge", course.badge.toLowerCase());

            // Clubs sathi syllabus button dakhavu naye mhanun condition
            const syllabusBtnHTML = course.category !== 'clubs' 
                ? `<button class="btn btn-outline download-pdf-btn" data-title="${course.title}" style="flex: 1; padding: 0.5rem; font-size: 0.85rem;">📥 Syllabus</button>` 
                : '';

            const quickViewWidth = course.category === 'clubs' ? 'width: 100%;' : 'flex: 1;';

            card.innerHTML = `
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <span class="badge" style="margin-bottom: 0;">${course.badge}</span>
                        <span style="font-size: 0.85rem; font-weight: 600; color: #d97706;">⭐ ${course.rating} (${course.reviewsCount})</span>
                    </div>
                    <h3>${course.title}</h3>
                    <p>${course.description}</p>
                </div>
                <div>
                    <ul class="course-details">
                        <li><strong>Duration:</strong> <span>${course.duration}</span></li>
                        <li><strong>Seats:</strong> <span>${course.seats}</span></li>
                    </ul>
                    <div class="card-actions" style="display: flex; gap: 6px; margin-bottom: 6px;">
                        <button class="btn btn-outline quick-view-btn" data-id="${course.id}" style="${quickViewWidth} padding: 0.5rem;">Quick View</button>
                        ${syllabusBtnHTML}
                    </div>
                    <a href="${course.actionUrl}" class="btn" style="display: block; width: 100%;">${course.category === 'clubs' ? 'Join Club' : 'Apply Now'}</a>
                </div>
            `;

            if (course.category === "ug") ugSection.appendChild(card);
            else if (course.category === "pg") pgSection.appendChild(card);
            else if (course.category === "clubs") clubsSection.appendChild(card);
        });

        attachCardEvents();
    };

    // Attach events for quick view and download syllabus simulation
    const attachCardEvents = () => {
        const courseCards = document.querySelectorAll(".course-card");

        courseCards.forEach(card => {
            card.addEventListener("mouseenter", () => {
                card.style.backgroundColor = "#e8f1f8";
                card.style.borderColor = "#103f68";
            });

            card.addEventListener("mouseleave", () => {
                card.style.backgroundColor = "#ffffff";
                card.style.borderColor = "var(--border-color)";
            });
        });

        // Quick View Modal triggers
        document.querySelectorAll(".quick-view-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const courseId = e.target.getAttribute("data-id");
                const course = allCoursesData.find(c => c.id === courseId);
                if (course) {
                    modalBadge.textContent = course.badge;
                    modalTitle.textContent = course.title;
                    modalDesc.textContent = course.description;
                    modalDuration.textContent = course.duration;
                    modalSeats.textContent = course.seats;
                    modalEligibility.textContent = course.eligibility;
                    modalFees.textContent = course.fees;
                    
                    modalHighlightsList.innerHTML = "";
                    course.highlights.forEach(h => {
                        const li = document.createElement("li");
                        li.textContent = h;
                        modalHighlightsList.appendChild(li);
                    });

                    modalActionBtn.textContent = course.category === 'clubs' ? 'Join Club' : 'Apply Now';
                    modalActionBtn.href = course.actionUrl;

                    modalOverlay.style.display = "flex";
                }
            });
        });

        // Download Syllabus Simulation Feature
        document.querySelectorAll(".download-pdf-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const title = e.target.getAttribute("data-title");
                alert(`📥 Demo Notice: Curriculum brochure for "${title}" downloaded successfully!`);
            });
        });
    };

    // Close Modal Events
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener("click", () => modalOverlay.style.display = "none");
    }
    window.addEventListener("click", (e) => {
        if (e.target === modalOverlay) modalOverlay.style.display = "none";
    });

    // Save Search Preferences to LocalStorage
    const saveSearchPreference = (query, category) => {
        try {
            const preferences = { searchQuery: query, selectedCategory: category, timestamp: new Date() };
            localStorage.setItem(PREF_KEY, JSON.stringify(preferences));
        } catch (error) {
            console.error("Could not save preference:", error);
        }
    };

    // Core Filtering Logic
    const filterCourses = (query = "", selectedCategory = "all") => {
        let matchCount = 0;

        if (ugHeading && ugSection) {
            const showUg = selectedCategory === "all" || selectedCategory === "ug";
            ugHeading.style.display = showUg ? "block" : "none";
            ugSection.style.display = showUg ? "grid" : "none";
        }
        if (pgHeading && pgSection) {
            const showPg = selectedCategory === "all" || selectedCategory === "pg";
            pgHeading.style.display = showPg ? "block" : "none";
            pgSection.style.display = showPg ? "grid" : "none";
        }
        if (clubsHeading && clubsSection) {
            const showClubs = selectedCategory === "all" || selectedCategory === "clubs";
            clubsHeading.style.display = showClubs ? "block" : "none";
            clubsSection.style.display = showClubs ? "grid" : "none";
        }

        const courseCards = document.querySelectorAll(".course-card");
        courseCards.forEach((card) => {
            const title = card.getAttribute("data-title") || "";
            const desc = card.getAttribute("data-desc") || "";
            const badge = card.getAttribute("data-badge") || "";
            const category = card.getAttribute("data-category") || "ug";

            const matchesQuery = title.includes(query) || desc.includes(query) || badge.includes(query);
            const matchesCategory = selectedCategory === "all" || category === selectedCategory;

            if (matchesQuery && matchesCategory) {
                card.style.display = "flex";
                matchCount++;
            } else {
                card.style.display = "none";
            }
        });

        if (noResultsMessage) {
            noResultsMessage.style.display = matchCount === 0 ? "block" : "none";
        }
    };

    // Restore Search Preference
    const restoreSearchPreference = () => {
        try {
            const saved = localStorage.getItem(PREF_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.searchQuery && courseSearchInput) courseSearchInput.value = parsed.searchQuery;
                if (parsed.selectedCategory && categorySelect) categorySelect.value = parsed.selectedCategory;
                filterCourses(parsed.searchQuery || "", parsed.selectedCategory || "all");
            }
        } catch (error) {
            localStorage.removeItem(PREF_KEY);
        }
    };

    // Event Listeners for Search & Filter inputs
    if (courseSearchInput) {
        courseSearchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();
            const currentCategory = categorySelect ? categorySelect.value : "all";
            filterCourses(query, currentCategory);
            saveSearchPreference(query, currentCategory);
        });
    }

    if (categorySelect) {
        categorySelect.addEventListener("change", (e) => {
            const selectedCategory = e.target.value;
            const currentQuery = courseSearchInput ? courseSearchInput.value.toLowerCase().trim() : "";
            filterCourses(currentQuery, selectedCategory);
            saveSearchPreference(currentQuery, selectedCategory);
        });
    }

    // Clear Button Handler
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener("click", () => {
            if (courseSearchInput) courseSearchInput.value = "";
            if (categorySelect) categorySelect.value = "all";
            filterCourses("", "all");
            localStorage.removeItem(PREF_KEY);
        });
    }

    fetchCoursesData();
});