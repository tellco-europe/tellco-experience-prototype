const header = document.querySelector('[data-header]');
const toggle = document.querySelector('[data-nav-toggle]');
const nav = document.querySelector('[data-nav]');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    toggle.classList.toggle('is-open', !isOpen);
    nav.classList.toggle('is-open', !isOpen);
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.classList.remove('is-open');
      nav.classList.remove('is-open');
    });
  });
}

if (header) {
  const updateHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

if (nav) {
  const navLinks = Array.from(nav.querySelectorAll('a'));
  const homeLink = navLinks.find((link) => link.getAttribute('href') === 'index.html');
  const sectionLinks = navLinks
    .map((link) => {
      const href = link.getAttribute('href');
      return href && href.startsWith('#')
        ? { link, section: document.querySelector(href) }
        : null;
    })
    .filter((item) => item && item.section);

  const setActiveLink = (activeLink) => {
    navLinks.forEach((link) => link.removeAttribute('aria-current'));
    if (activeLink) activeLink.setAttribute('aria-current', 'location');
  };

  const updateActiveLink = () => {
    const offset = (header ? header.offsetHeight : 0) + 120;
    let activeLink = homeLink;

    sectionLinks.forEach(({ link, section }) => {
      if (section.getBoundingClientRect().top <= offset) activeLink = link;
    });

    setActiveLink(activeLink);
  };

  navLinks.forEach((link) => {
    link.addEventListener('click', () => setActiveLink(link));
  });

  updateActiveLink();
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  window.addEventListener('resize', updateActiveLink);
}

const partnerRevealItems = document.querySelectorAll('[data-partner-reveal]');

if (partnerRevealItems.length && 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  partnerRevealItems.forEach((item) => item.classList.add('hp-partner-reveal'));

  const partnerRevealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -48px' });

  partnerRevealItems.forEach((item) => partnerRevealObserver.observe(item));
}

const hpFinalVideo = document.querySelector('[data-hp-final-video]');
const hpFinalVideoControl = document.querySelector('[data-hp-final-video-control]');

if (hpFinalVideo && hpFinalVideoControl) {
  const hpFinalVideoControlIcon = hpFinalVideoControl.querySelector('[data-hp-final-video-control-icon]');
  const hpFinalVideoControlLabel = hpFinalVideoControl.querySelector('[data-hp-final-video-control-label]');
  const hpReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const syncHpFinalVideoControl = () => {
    const isPaused = hpFinalVideo.paused;
    hpFinalVideoControl.setAttribute('aria-label', `${isPaused ? 'Play' : 'Pause'} ecosystem video`);
    if (hpFinalVideoControlIcon) hpFinalVideoControlIcon.textContent = isPaused ? '▶' : 'Ⅱ';
    if (hpFinalVideoControlLabel) hpFinalVideoControlLabel.textContent = isPaused ? 'Play' : 'Pause';
  };

  if (hpReducedMotion.matches) {
    hpFinalVideo.autoplay = false;
    hpFinalVideo.pause();
  }

  hpFinalVideoControl.addEventListener('click', () => {
    if (hpFinalVideo.paused) {
      hpFinalVideo.play().catch(syncHpFinalVideoControl);
    } else {
      hpFinalVideo.pause();
    }
  });

  hpFinalVideo.addEventListener('play', syncHpFinalVideoControl);
  hpFinalVideo.addEventListener('pause', syncHpFinalVideoControl);
  hpFinalVideo.addEventListener('ended', syncHpFinalVideoControl);

  const handleHpReducedMotionChange = (event) => {
    if (event.matches) hpFinalVideo.pause();
  };

  if (typeof hpReducedMotion.addEventListener === 'function') {
    hpReducedMotion.addEventListener('change', handleHpReducedMotionChange);
  } else {
    hpReducedMotion.addListener(handleHpReducedMotionChange);
  }

  syncHpFinalVideoControl();
}

document.querySelectorAll('[data-demo-form]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = form.querySelector('[data-form-status]');
    if (status) {
      status.textContent = 'Thank you. This prototype form is front-end only. In production, it can connect to the partner CRM or registration workflow.';
    }
  });
});
