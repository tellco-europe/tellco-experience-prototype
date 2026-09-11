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

const pageSectionNavs = Array.from(document.querySelectorAll('[data-page-nav]'));

if (pageSectionNavs.length) {
  const pageSectionLinks = Array.from(document.querySelectorAll('[data-page-nav] a[href^="#"]'));
  const pageSections = Array.from(document.querySelectorAll('[data-page-section]'));
  const compactPageNav = document.querySelector('[data-page-nav-compact]');
  const compactPageNavToggle = document.querySelector('[data-page-nav-toggle]');
  const compactPageNavPanel = document.querySelector('[data-page-nav-panel]');
  const compactPageNavToggleState = document.querySelector('[data-page-nav-toggle-state]');

  const setPageSectionActive = (sectionId) => {
    pageSectionLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${sectionId}`;
      if (isActive) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const closeCompactPageNav = () => {
    if (!compactPageNavToggle || !compactPageNavPanel) return;
    compactPageNavToggle.setAttribute('aria-expanded', 'false');
    compactPageNavPanel.hidden = true;
    if (compactPageNavToggleState) compactPageNavToggleState.textContent = 'Show sections';
  };

  if (compactPageNavToggle && compactPageNavPanel) {
    compactPageNavToggle.addEventListener('click', () => {
      const willOpen = compactPageNavToggle.getAttribute('aria-expanded') !== 'true';
      compactPageNavToggle.setAttribute('aria-expanded', String(willOpen));
      compactPageNavPanel.hidden = !willOpen;
      if (compactPageNavToggleState) {
        compactPageNavToggleState.textContent = willOpen ? 'Hide sections' : 'Show sections';
      }
    });
  }

  pageSectionLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const sectionId = link.hash.slice(1);
      const targetSection = document.getElementById(sectionId);
      if (compactPageNav && compactPageNav.contains(link)) closeCompactPageNav();
      if (targetSection) {
        event.preventDefault();
        const targetTop = targetSection.getBoundingClientRect().top
          + window.scrollY
          - (header ? header.offsetHeight : 0)
          - 24;
        window.scrollTo({
          top: Math.max(0, targetTop),
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        });
        window.history.pushState(null, '', `#${sectionId}`);
      }
      setPageSectionActive(sectionId);
    });
  });

  if ('IntersectionObserver' in window && pageSections.length) {
    const visiblePageSections = new Set();
    const observerTop = (header ? header.offsetHeight : 0) + 24;

    const updateObservedPageSection = () => {
      const visible = pageSections.filter((section) => visiblePageSections.has(section));
      if (!visible.length) return;

      const passedTop = visible
        .filter((section) => section.getBoundingClientRect().top <= observerTop + 2)
        .sort((a, b) => b.getBoundingClientRect().top - a.getBoundingClientRect().top);
      const activeSection = passedTop[0] || visible.sort(
        (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top
      )[0];

      if (activeSection && activeSection.id) setPageSectionActive(activeSection.id);
    };

    const pageSectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visiblePageSections.add(entry.target);
        } else {
          visiblePageSections.delete(entry.target);
        }
      });
      updateObservedPageSection();
    }, {
      rootMargin: `-${observerTop}px 0px -65% 0px`,
      threshold: 0
    });

    pageSections.forEach((section) => pageSectionObserver.observe(section));
  }
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
