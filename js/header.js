const modules = {
  "home.html": {
    heading: "ASM'S NEXTGEN TECHNICAL CAMPUS",
    subtitle: "Empowering students with innovation, advanced technical skills, and industry-ready knowledge at Talegaon Dabhade, Pune.",
    legacyHero: ".home-module-hero"
  },
  "placement.html": {
    heading: "OUR PLACEMENTS & SUCCESS STORIES",
    subtitle: "Building career-ready graduates through industry-focused training and placement opportunities.",
    legacyHero: ".placement-hero",
    card: `
      <p class="module-card-kicker">CAREER OUTCOMES</p>
      <h2>Highest Package</h2>
      <p class="module-highlight">21 LPA</p>
      <p class="module-card-copy">Our students are prepared for opportunities with leading companies.</p>
      <div class="recruiter-logos" aria-label="Top recruiters">
        <span>TCS</span><span>Infosys</span><span>Wipro</span><span>Capgemini</span>
      </div>`
  },
  "coursesprog.html": {
    heading: "COURSES & PROGRAMS",
    subtitle: "Explore industry-oriented programs designed to build practical skills and future-ready careers.",
    legacyHero: ".hero",
    card: `
      <p class="module-card-kicker">FIND YOUR PROGRAM</p>
      <h2>Choose a course</h2>
      <label class="module-field">
        <span>Program</span>
        <select id="hero-course-select">
          <option value="cse-ug">B.Tech</option>
          <option value="mba-pg">MBA</option>
          <option value="mca-pg">MCA</option>
        </select>
      </label>
      <a class="module-card-button" id="hero-course-apply" href="admission.html?program=cse-ug">Apply Now</a>`
  },
  "campus.html": {
    heading: "LIFE AT CAMPUS",
    subtitle: "Discover a vibrant campus experience filled with learning, friendships, events, and new opportunities.",
    legacyHero: ".banner",
    card: `
      <p class="module-card-kicker">CAMPUS LIFE</p>
      <h2>Explore our campus</h2>
      <div class="campus-gallery-preview" aria-label="Campus gallery preview">
        <img src="image/aarambh-01.webp" alt="Students at a campus induction event">
        <img src="image/aarambh-05.webp" alt="Campus student activities">
        <img src="image/aarambh-06.webp" alt="Students participating in campus life">
      </div>
      <a class="module-card-button" href="#campus-gallery">Virtual Tour</a>`
  },
  "faculty.html": {
    heading: "MEET OUR FACULTY",
    subtitle: "Learn from experienced educators dedicated to supporting every student's academic and professional growth.",
    legacyHero: ".page-title",
    card: `
      <p class="module-card-kicker">OUR ACADEMIC COMMUNITY</p>
      <h2>Find a faculty member</h2>
      <label class="module-field">
        <span>Faculty name</span>
        <input id="hero-faculty-search" type="search" placeholder="Search faculty" aria-label="Search faculty">
      </label>
      <p class="faculty-count"><strong>250+</strong> faculty members</p>`
  },
  "department.html": {
    heading: "OUR DEPARTMENTS",
    subtitle: "Explore academic departments that connect strong foundations with practical, career-focused learning.",
    legacyHero: ".hero",
    card: `
      <p class="module-card-kicker">ACADEMIC DEPARTMENTS</p>
      <h2>Explore departments</h2>
      <ul class="department-list">
        <li><span>CSE</span> Computer Science &amp; Engineering</li>
        <li><span>MECH</span> Mechanical Engineering</li>
        <li><span>E&amp;TC</span> Electronics &amp; Telecommunication</li>
      </ul>`
  },
  "about.html": {
    heading: "ABOUT ASM GROUP",
    subtitle: "A legacy of education, opportunity, and student growth shaped by Audyogik Shikshan Mandal.",
    card: `
      <p class="module-card-kicker">OUR LEGACY</p>
      <h2>Education through generations</h2>
      <div class="about-stats">
        <div><strong>60+</strong><span>Years of ASM</span></div>
        <div><strong>42+</strong><span>Years of legacy</span></div>
        <div><strong>250+</strong><span>Faculty members</span></div>
      </div>`
  },
  "admission.html": {
    heading: "ADMISSION 2026-27 OPEN",
    subtitle: "Take the next step towards your future with a program built around your ambition.",
    legacyHero: ".admission-hero",
    card: `
      <p class="module-card-kicker">VISIT OUR CAMPUS</p>
      <h2>ASM NextGen Technical Campus</h2>
      <p class="module-location">
        Talegaon Dabhade, Maval,<br>
        Pune, Maharashtra 410506
      </p>
      <a class="module-card-button" href="https://www.google.com/maps/dir/?api=1&amp;destination=18.716145,73.664016" target="_blank" rel="noopener">Visit Campus</a>`
  },
  "contact.html": {
    heading: "CONTACT US",
    subtitle: "Our team is ready to answer your questions and help you connect with ASM NextGen.",
    legacyHero: ".contact-hero",
    card: `
      <p class="module-card-kicker">GET IN TOUCH</p>
      <h2>Send us a message</h2>
      <form id="hero-contact-form">
        <label class="module-field"><span>Name</span><input name="name" autocomplete="name" required></label>
        <label class="module-field"><span>Email</span><input name="email" type="email" autocomplete="email" required></label>
        <label class="module-field"><span>Message</span><textarea name="message" rows="2" required></textarea></label>
        <button class="module-card-button" type="submit">Contact Us</button>
      </form>
      <a class="module-map-preview" href="https://www.google.com/maps/search/?api=1&amp;query=ASM+NextGen+Technical+Campus+Talegaon+Dabhade" target="_blank" rel="noopener" aria-label="View ASM NextGen Technical Campus on a map">
        <span>ASM NextGen Technical Campus</span><strong aria-hidden="true">⌖</strong>
      </a>
      <a class="module-map-link" href="https://www.google.com/maps/search/?api=1&amp;query=ASM+NextGen+Technical+Campus+Talegaon+Dabhade" target="_blank" rel="noopener">View campus map</a>`
  }
};

document.head.insertAdjacentHTML("beforeend", `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">`);

const socialLinks = `
  <nav class="social-links" aria-label="ASM social media">
    <a href="https://www.facebook.com/NextGenTechnicalCampus/" target="_blank" rel="noopener" aria-label="Facebook"><span aria-hidden="true">f</span></a>
    <a href="https://www.instagram.com/asm_next/" target="_blank" rel="noopener" aria-label="Instagram"><span aria-hidden="true">◎</span></a>
    <a href="https://www.linkedin.com/company/asm-nextgen-technical-campus/" target="_blank" rel="noopener" aria-label="LinkedIn"><span aria-hidden="true">in</span></a>
    <a href="https://www.youtube.com/@ASMNextgenTechnicalCampus" target="_blank" rel="noopener" aria-label="YouTube"><span aria-hidden="true">▶</span></a>
  </nav>`;

const mount = document.getElementById("header");
if (mount) {
  const currentPage = (window.location.pathname.split("/").pop() || "home.html").toLowerCase();
  const page = modules[currentPage] || modules["home.html"];
  mount.innerHTML = `
    <header class="site-header">
      <div class="site-identity">
        <div class="top-bar">
          <div class="top-left">
            <a href="tel:+919028076028">+91 90280 76028</a>
            <a href="mailto:admission.asmnextgen@asmedu.org">admission.asmnextgen@asmedu.org</a>
          </div>
          <div class="top-right">
            <a href="media.html">Campus Media</a>
            <span aria-hidden="true">|</span>
            <a href="fee.html">FRA - Fee Structure</a>
          </div>
        </div>
        <div class="brand-row">
          <a class="site-brand" href="home.html" aria-label="ASM NextGen home">
            <img src="image/asm-logo.png" alt="ASM logo">
          </a>
          <div class="brand-copy">
            <p class="org-name">AUDYOGIK SHIKSHAN MANDAL</p>
            <h1>ASM's NEXTGEN TECHNICAL CAMPUS</h1>
            <p class="brand-location">Talegaon Dabhade, Maval, Pune</p>
            <p class="brand-approvals">
              Approved by AICTE
              <span aria-hidden="true">|</span>
              <a href="https://www.unipune.ac.in" target="_blank" rel="noopener">Affiliated to Savitribai Phule Pune University ↗</a>
              <span aria-hidden="true">|</span>
              DTE CODE - 16355
            </p>
          </div>
          <img class="anniversary-logo" src="image/42-years.png" alt="42 years of ASM">
        </div>
      </div>
      <nav class="site-nav" aria-label="Main navigation">
        <a href="home.html">HOME</a>
        <a href="placement.html">PLACEMENTS</a>
        <a href="coursesprog.html">COURSES &amp; PROGRAMS</a>
        <a href="campus.html">CAMPUS</a>
        <a href="contact.html">CONTACT US</a>
        <a href="faculty.html">FACULTY</a>
        <a href="department.html">DEPARTMENT</a>
        <a href="about.html">ABOUT</a>
        <a class="admission-btn" href="admission.html">ADMISSION</a>
      </nav>
    </header>`;

  mount.querySelectorAll(".site-nav a").forEach(link => {
    if ((link.getAttribute("href") || "").toLowerCase() === currentPage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    const frame = document.createElement("div");
    frame.className = "site-frame";
    while (document.body.firstChild) {
      frame.appendChild(document.body.firstChild);
    }
    document.body.appendChild(frame);

    if (currentPage === "home.html") {
      const homeHero = document.querySelector(page.legacyHero);
      homeHero?.classList.add("module-hero", "home-module-hero");
      homeHero?.querySelector(".hero-buttons")?.remove();
    } else {
      document.querySelector(page.legacyHero)?.remove();
      const moduleHero = document.createElement("section");
      moduleHero.className = "module-hero";
      moduleHero.innerHTML = `
        <span class="hero-orb hero-orb-one" aria-hidden="true"></span>
        <span class="hero-orb hero-orb-two" aria-hidden="true"></span>
        <div class="module-hero-content">
          <div class="module-hero-copy">
            <p class="module-eyebrow"><span></span> WELCOME TO NEXTGEN</p>
            <h1>${page.heading}</h1>
            <p class="module-subtitle">${page.subtitle}</p>
          </div>
          <aside class="module-hero-card">${page.card}</aside>
        </div>
        ${socialLinks}`;
      mount.after(moduleHero);
    }

    const existingSocial = document.querySelector(".social-links");
    if (existingSocial) frame.appendChild(existingSocial);
    else frame.insertAdjacentHTML("beforeend", socialLinks);

    const campusGallery = document.querySelector(".campus-grid, .grid-3");
    if (campusGallery && currentPage === "campus.html") {
      campusGallery.id = "campus-gallery";
    }

    const heroFacultySearch = document.getElementById("hero-faculty-search");
    const facultySearch = document.getElementById("searchInput");
    if (heroFacultySearch && facultySearch) {
      heroFacultySearch.addEventListener("input", () => {
        facultySearch.value = heroFacultySearch.value;
        facultySearch.dispatchEvent(new Event("input", { bubbles: true }));
      });
    }

    const courseSelect = document.getElementById("hero-course-select");
    const courseApply = document.getElementById("hero-course-apply");
    if (courseSelect && courseApply) {
      courseSelect.addEventListener("change", () => {
        courseApply.href = `admission.html?program=${encodeURIComponent(courseSelect.value)}`;
      });
    }

    const contactForm = document.getElementById("hero-contact-form");
    if (contactForm) {
      contactForm.addEventListener("submit", event => {
        event.preventDefault();
        const target = document.getElementById("contact-form");
        const values = new FormData(contactForm);
        ["name", "email", "message"].forEach(name => {
          const input = target?.elements.namedItem(name);
          if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
            input.value = String(values.get(name) || "");
          }
        });
        target?.requestSubmit();
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    const revealTargets = document.querySelectorAll(".site-frame > section, .site-frame > main > section, .site-frame > main > div, .site-frame > footer");
    revealTargets.forEach(target => {
      if (!target.classList.contains("module-hero") && !target.classList.contains("home-module-hero")) {
        target.classList.add("module-reveal");
      }
    });
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      document.querySelectorAll(".module-reveal").forEach(target => observer.observe(target));
    } else {
      document.querySelectorAll(".module-reveal").forEach(target => target.classList.add("is-visible"));
    }
  });
}
