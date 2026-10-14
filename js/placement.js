 document.addEventListener("DOMContentLoaded", () => {
  
  // 1. COUNTER ANIMATION LOGIC
  const counters = document.querySelectorAll(".counter");
  
  counters.forEach((counter) => {
    counter.innerText = "0";
    const target = +counter.getAttribute("data-target");

    const updateCounter = () => {
      const count = +counter.innerText.replace("+", "");
      const increment = Math.ceil(target / 50);

      if (count < target) {
        counter.innerText = `${Math.ceil(count + increment)}`;
        setTimeout(updateCounter, 30);
      } else {
        counter.innerText = `${target}+`;
      }
    };

    updateCounter();
  });


  // 2. STUDENT FILTER LOGIC (All / MCA / BCA)
  const filterButtons = document.querySelectorAll(".filter-btn");
  const studentCards = document.querySelectorAll(".student-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Active class change karne
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const category = button.getAttribute("data-filter");

      studentCards.forEach((card) => {
        const studentCategory = card.getAttribute("data-category");
        if (category === "all" || studentCategory === category) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });


  // 3. DOWNLOAD BROCHURE VIA PRINT TO PDF
  const brochureBtn = document.getElementById("download-brochure");
  if (brochureBtn) {
    brochureBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.print();
    });
  }

});