const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

const filterButtons = document.querySelectorAll('.filter-btn');
const publications = document.querySelectorAll('.publication');
const publicationVisuals = document.querySelectorAll('.pub-visual');

publicationVisuals.forEach((visual) => {
  visual.addEventListener('click', () => {
    const isShowingResult = visual.classList.toggle('is-result');
    visual.setAttribute('aria-pressed', String(isShowingResult));
  });

  visual.addEventListener('blur', () => {
    visual.classList.remove('is-result');
    visual.setAttribute('aria-pressed', 'false');
  });
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-pressed', String(isActive));
    });

    publications.forEach((publication, index) => {
      const shouldShow = filter === 'all' || publication.dataset.selected === 'true';
      publication.hidden = !shouldShow;

      if (shouldShow) {
        publication.classList.add('entering');
        window.setTimeout(() => publication.classList.remove('entering'), index * 45);
      }
    });
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08 },
);

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
document.querySelector('#current-year').textContent = new Date().getFullYear();
