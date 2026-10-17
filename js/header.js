const headerHTML = `
<div class="top-bar">
  <div class="top-left">
    <span>📞 +91 90280 76028</span>
    <span>✉️ admission.asmnextgen@asmedu.org</span>
  </div>
  <div class="top-right">
    <a href="media.html">Campus Media</a>
    <span>|</span>
    <a href="fee.html">FRA - Fee Structure</a>
  </div>
</div>

<header class="main-header">
  <div class="logo-left">
    <img src="image/asm-logo.png" alt="ASM Logo">
  </div>
  <div class="header-center">
    <p class="org-name">AUDYOGIK SHIKSHAN MANDAL</p>
    <h1>ASM's NEXTGEN TECHNICAL CAMPUS</h1>
    <p class="location">Talegaon Dabhade, Maval, Pune</p>
    <p class="approvals">
      Approved by AICTE &nbsp;|&nbsp;
      <a href="https://www.unipune.ac.in" target="_blank" class="univ-link">Affiliated to Savitribai Phule Pune University ↗</a>
      &nbsp;|&nbsp; DTE CODE - 16355
    </p>
  </div>
  <div class="logo-right">
    <img src="image/42-years.png" alt="42 Years">
  </div>
</header>

<nav class="main-nav">
  <a href="home.html">HOME</a>
  <a href="placement.html">PLACEMENTS</a>
  <a href="coursesprog.html">COURSES & PROGRAMS</a>
  <a href="campus.html">CAMPUS</a>
  <a href="contact.html">CONTACT US</a>
  <a href="faculty.html">FACULTY</a>
  <a href="department.html">DEPARTMENT</a>
  <a href="about.html">ABOUT</a>
  <a href="admission.html" class="admission-btn">ADMISSION</a>
</nav>
`;

const mount = document.getElementById("header");
if (mount) {
  mount.innerHTML = headerHTML;
}

// Active page auto-highlight
const currentPage = (window.location.pathname.split("/").pop() || "home.html").toLowerCase();
document.querySelectorAll(".main-nav a").forEach(link => {
  const href = (link.getAttribute("href") || "").toLowerCase();
  if (href === currentPage) {
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  }
});