document.addEventListener("DOMContentLoaded", () => {
    let admissionData = null;

    const form = document.querySelector("#admission-form");
    const programSelect = document.querySelector("#selectedProgram");
    const infoFee = document.querySelector("#info-fee");
    const infoSeats = document.querySelector("#info-seats");
    const infoEligibility = document.querySelector("#info-eligibility");
    const datesList = document.querySelector("#important-dates-list");
    const alertBox = document.querySelector("#form-alert");

    // Fetch JSON Data
    const fetchAdmissionData = async () => {
        try {
            const response = await fetch("data/admission-data.json");
            if (!response.ok) throw new Error("Failed to load admission data");
            admissionData = await response.json();
            
            renderImportantDates(admissionData.importantDates);
            autoSelectCourseFromURL();
            updateProgramCalculatedInfo();
        } catch (error) {
            console.error("Error loading JSON:", error);
        }
    };

    // Auto select program if coming from courses page with parameter e.g. admission.html?course=bca-ug
    const autoSelectCourseFromURL = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const courseParam = urlParams.get("course");
        if (courseParam && programSelect) {
            programSelect.value = courseParam;
        }
    };

    // Update Program details dynamically
    const updateProgramCalculatedInfo = () => {
        if (!admissionData || !programSelect) return;
        const selectedKey = programSelect.value;
        const programInfo = admissionData.feeStructure[selectedKey];
        
        if (programInfo) {
            infoFee.textContent = programInfo.tuition;
            infoSeats.textContent = programInfo.seats;
            const categoryKey = selectedKey.includes("ug") ? "ug" : "pg";
            infoEligibility.textContent = admissionData.eligibilityCriteria[categoryKey];
        }
    };

    if (programSelect) {
        programSelect.addEventListener("change", updateProgramCalculatedInfo);
    }

    // Render Important Dates
    const renderImportantDates = (dates) => {
        if (!datesList) return;
        datesList.innerHTML = "";
        dates.forEach(d => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${d.event}:</strong> ${d.date}`;
            datesList.appendChild(li);
        });
    };

    // Multi-Step Form Navigation Logic
    const nextBtns = document.querySelectorAll(".next-btn");
    const prevBtns = document.querySelectorAll(".prev-btn");

    nextBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const currentStep = btn.closest(".form-step-content");
            const nextStepId = btn.getAttribute("data-next");
            
            // Basic validation before next
            const inputs = currentStep.querySelectorAll("input, select");
            let isValid = true;
            inputs.forEach(input => {
                if (!input.checkValidity()) {
                    input.reportValidity();
                    isValid = false;
                }
            });

            if (isValid) {
                currentStep.classList.remove("active-step");
                document.querySelector(`#${nextStepId}`).classList.add("active-step");
                updateStepIndicators(nextStepId);
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const currentStep = btn.closest(".form-step-content");
            const prevStepId = btn.getAttribute("data-prev");
            currentStep.classList.remove("active-step");
            document.querySelector(`#${prevStepId}`).classList.add("active-step");
            updateStepIndicators(prevStepId);
        });
    });

    const updateStepIndicators = (activeStepId) => {
        document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
        if (activeStepId === "step-1") document.querySelector("#step-1-indicator").classList.add("active");
        if (activeStepId === "step-2") document.querySelector("#step-2-indicator").classList.add("active");
        if (activeStepId === "step-3") document.querySelector("#step-3-indicator").classList.add("active");
    };

    // Document Checklist Interactive Counter
    const docCheckboxes = document.querySelectorAll(".doc-check");
    const progressText = document.querySelector("#checklist-progress");

    docCheckboxes.forEach(cb => {
        cb.addEventListener("change", () => {
            const checkedCount = document.querySelectorAll(".doc-check:checked").length;
            if (progressText) {
                progressText.textContent = `${checkedCount} of ${docCheckboxes.length} Documents Ready`;
            }
        });
    });

    // Form Submit Handler
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const fullName = document.querySelector("#fullName").value;
            
            alertBox.style.display = "block";
            alertBox.style.backgroundColor = "#dcfce7";
            alertBox.style.color = "#15803d";
            alertBox.textContent = `🎉 Congratulations ${fullName}! Your admission application has been submitted successfully (Demo Submission).`;

            form.reset();
            setTimeout(() => {
                window.location.href = "coursesprog.html";
            }, 3000);
        });
    }

    fetchAdmissionData();
});