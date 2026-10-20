const campusPhotos = [
  {
    src: "../images/ledtcamo.webp",
    alt: "ASM NextGen Technical Campus main entrance",
    caption: "Campus photo · main entrance"
  },
  {
    src: "../images/campus.webp",
    alt: "ASM NextGen Technical Campus building entrance",
    caption: "Campus photo · building entrance"
  },
  {
    src: "../images/asm-campus-building.png",
    alt: "Wide view of the ASM NextGen Technical Campus building",
    caption: "Campus photo · full building"
  }
];
let currentView = 0;
const gallery = document.querySelector(".campus-gallery");
const galleryImage = document.querySelector("#campus-image");
const galleryCaption = document.querySelector("#campus-caption");
const galleryPosition = document.querySelector("#gallery-position");
let transitionTimeout;

// Update the photo, caption and position, wrapping at either end of the list.
function showCampusView(nextIndex) {
  currentView = (nextIndex + campusPhotos.length) % campusPhotos.length;
  const photo = campusPhotos[currentView];
  gallery.classList.add("is-changing");
  window.clearTimeout(transitionTimeout);
  transitionTimeout = window.setTimeout(() => {
    galleryImage.src = photo.src;
    galleryImage.alt = photo.alt;
    galleryCaption.textContent = photo.caption;
    galleryPosition.textContent = `${String(currentView + 1).padStart(2, "0")} / ${String(campusPhotos.length).padStart(2, "0")}`;
    gallery.classList.remove("is-changing");
  }, 140);
}

// Move one image backward when the previous control is clicked.
document.querySelector("#gallery-back").addEventListener("click", () => showCampusView(currentView - 1));

// Move one image forward when the next control is clicked.
document.querySelector("#gallery-next").addEventListener("click", () => showCampusView(currentView + 1));

// Support left/right arrow-key navigation through the gallery.
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") showCampusView(currentView - 1);
  if (event.key === "ArrowRight") showCampusView(currentView + 1);
});
