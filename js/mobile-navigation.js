document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector(".faculty-menu-toggle");
    const navigation = document.querySelector("#faculty-navigation");

    if (!toggle || !navigation) return;

    const setOpen = (open) => {
        navigation.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute(
            "aria-label",
            open ? "Close navigation menu" : "Open navigation menu"
        );
    };

    toggle.addEventListener("click", () => {
        setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    navigation.addEventListener("click", (event) => {
        if (event.target.closest("a")) setOpen(false);
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) setOpen(false);
    });
});
