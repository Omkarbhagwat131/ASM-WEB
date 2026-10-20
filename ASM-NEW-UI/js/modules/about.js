// The browser remembers whether someone has visited the About page before.
const visitKey = "asmAboutVisits";
const visitStatus = document.querySelector("#about-visits");
if (visitStatus) {
  try {
    // Increment and display the local visit count for this browser.
    const visits = Number(localStorage.getItem(visitKey) || 0) + 1;
    localStorage.setItem(visitKey, String(visits));
    visitStatus.textContent = `You have explored this page ${visits} ${visits === 1 ? "time" : "times"} on this device.`;
  } catch (error) {
    // Explain that browser storage failed while keeping the About page usable.
    // Log the storage error and keep the About page visit text informative.
    console.error("Could not save About page visits:", error);
    visitStatus.textContent = "This browser could not save your page visits.";
  }
}
