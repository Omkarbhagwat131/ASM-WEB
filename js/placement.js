 document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".counter");

  counters.forEach((counter) => {
    const target = +counter.getAttribute("data-target");
    let current = 0;
    const increment = Math.ceil(target / 40);

    const updateCounter = () => {
      current += increment;
      if (current >= target) {
        counter.textContent = `${target}+`;
      } else {
        counter.textContent = `${current}`;
        setTimeout(updateCounter, 40);
      }
    };

    updateCounter();
  });
});