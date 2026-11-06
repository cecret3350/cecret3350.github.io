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
const tailsteerVisual = document.querySelector('.pub-visual-tailsteer');

if (tailsteerVisual) {
  const frame = tailsteerVisual.querySelector('.tailsteer-frame');
  const label = tailsteerVisual.querySelector('.tailsteer-turn-label');
  const sources = Array.from(
    { length: 20 },
    (_, index) => `assets/publications/tailsteer-anime-turn-${String(index + 1).padStart(2, '0')}.webp`,
  );
  const images = sources.map((source) => {
    const image = new Image();
    image.src = source;
    return image;
  });
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timer;
  let playbackId = 0;
  let isPinned = false;

  const waitForImage = (image) => {
    if (image.complete) return Promise.resolve();
    return new Promise((resolve) => {
      image.addEventListener('load', resolve, { once: true });
      image.addEventListener('error', resolve, { once: true });
    });
  };

  const stopSequence = () => {
    playbackId += 1;
    window.clearTimeout(timer);
    frame.src = sources[0];
    label.textContent = 'Turn 1';
  };

  const startSequence = () => {
    playbackId += 1;
    window.clearTimeout(timer);
    const currentPlayback = playbackId;

    const showFrame = async (index) => {
      await waitForImage(images[index]);
      if (currentPlayback !== playbackId) return;

      frame.src = sources[index];
      label.textContent = `Turn ${index + 1}`;

      if (reducedMotion.matches || index === sources.length - 1) return;
      timer = window.setTimeout(() => showFrame(index + 1), 180);
    };

    showFrame(reducedMotion.matches ? sources.length - 1 : 0);
  };

  tailsteerVisual.addEventListener('mouseenter', startSequence);
  tailsteerVisual.addEventListener('mouseleave', () => {
    if (!isPinned) stopSequence();
  });
  tailsteerVisual.addEventListener('focus', startSequence);
  tailsteerVisual.addEventListener('blur', () => {
    isPinned = false;
    tailsteerVisual.classList.remove('is-result');
    tailsteerVisual.setAttribute('aria-pressed', 'false');
    stopSequence();
  });
  tailsteerVisual.addEventListener('click', () => {
    isPinned = !isPinned;
    tailsteerVisual.classList.toggle('is-result', isPinned);
    tailsteerVisual.setAttribute('aria-pressed', String(isPinned));
    if (isPinned) startSequence();
    else stopSequence();
  });
}

publicationVisuals.forEach((visual) => {
  if (visual === tailsteerVisual) return;

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
