(() => {
  const year = document.querySelector('#current-year');
  if (year) year.textContent = new Date().getFullYear();
  document.querySelectorAll('.menu-toggle').forEach((button) => {
    const nav = button.closest('header')?.querySelector('.main-navigation') || document.querySelector('.main-navigation');
    if (!nav || nav.querySelector('#navigation-list, #nav-list')) return;
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    });
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) {
        nav.classList.remove('is-open');
        button.setAttribute('aria-expanded', 'false');
      }
    });
  });
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll('main section, main article').forEach((element) => {
      element.classList.add('reveal'); observer.observe(element);
    });
  }
})();
