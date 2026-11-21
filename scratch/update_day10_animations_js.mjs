import fs from 'fs';

const animPath = 'c:/Users/princ/OneDrive/Desktop/portfolio/abdullah-portfolio/js/animations.js';
let code = fs.readFileSync(animPath, 'utf8');

// 1. Add Day 10 new controllers right before initRoleTypingAnimation
const day10Controllers = `
  /**
   * ==========================================================================
   * DAY 10 ADVANCED INTERACTION CONTROLLERS
   * ==========================================================================
   */

  /**
   * Module 1: Premium Page Loader Controller (Day 10)
   */
  function initPageLoader() {
    const loader = document.getElementById('page-loader');
    const progressBar = document.getElementById('loader-progress-bar');
    if (!loader) return;

    if (prefersReducedMotion) {
      loader.classList.add('is-hidden');
      loader.setAttribute('aria-hidden', 'true');
      loader.style.display = 'none';
      return;
    }

    let isLoaderDismissed = false;

    function dismissLoader() {
      if (isLoaderDismissed) return;
      isLoaderDismissed = true;

      if (progressBar) {
        progressBar.style.width = '100%';
      }

      setTimeout(() => {
        loader.classList.add('is-hidden');
        loader.setAttribute('aria-hidden', 'true');
        setTimeout(() => {
          loader.style.display = 'none';
        }, 500);
      }, 300);
    }

    // Animate progress bar incrementally while loading
    if (progressBar) {
      progressBar.style.width = '35%';
      setTimeout(() => {
        if (!isLoaderDismissed) progressBar.style.width = '75%';
      }, 200);
    }

    // Dismiss on window load
    if (document.readyState === 'complete') {
      dismissLoader();
    } else {
      window.addEventListener('load', dismissLoader, { once: true });
    }

    // Safety fallback timeout: never block user indefinitely
    setTimeout(dismissLoader, 1600);
  }

  /**
   * Module 7 & 8: Scroll Progress Indicator & Back to Top Controller (Day 10)
   */
  function initScrollProgressAndBackToTop() {
    const progressBar = document.getElementById('scroll-progress-bar');
    const backToTopBtn = document.getElementById('back-to-top');

    if (!progressBar && !backToTopBtn) return;

    let ticking = false;

    function onScrollUpdate() {
      const scrollY = window.scrollY || window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Update scroll progress
      if (progressBar && docHeight > 0) {
        const percent = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
        progressBar.style.width = \`\${percent.toFixed(1)}%\`;
        progressBar.setAttribute('aria-valuenow', Math.round(percent).toString());
      }

      // Update back-to-top button visibility
      if (backToTopBtn) {
        if (scrollY > 380) {
          backToTopBtn.classList.add('is-visible');
        } else {
          backToTopBtn.classList.remove('is-visible');
        }
      }

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(onScrollUpdate);
        ticking = true;
      }
    }, { passive: true });

    // Initial tick
    onScrollUpdate();

    // Back to Top Click
    if (backToTopBtn && !backToTopBtn.dataset.bound) {
      backToTopBtn.dataset.bound = 'true';
      backToTopBtn.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
        const skipLink = document.querySelector('.skip-to-content');
        if (skipLink) skipLink.focus();
      });
    }
  }

  /**
   * Module 4: Custom Desktop Cursor Controller (Day 10)
   */
  function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!cursor || !dot || !ring) return;

    const hasHoverPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

    // Strict desktop mouse check: disable completely on touch devices, mobile, or reduced motion
    if (prefersReducedMotion || !hasHoverPointer || isTouch || window.innerWidth < 992) {
      cursor.style.display = 'none';
      document.body.classList.remove('custom-cursor-active');
      return;
    }

    cursor.style.display = 'block';
    document.body.classList.add('custom-cursor-active');

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isTracking = false;
    let isVisible = false;

    function renderRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      ring.style.transform = \`translate3d(\${ringX.toFixed(1)}px, \${ringY.toFixed(1)}px, 0) translate(-50%, -50%)\`;

      const dist = Math.abs(mouseX - ringX) + Math.abs(mouseY - ringY);
      if (dist > 0.05 || isTracking) {
        requestAnimationFrame(renderRing);
      }
    }

    window.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      dot.style.transform = \`translate3d(\${mouseX}px, \${mouseY}px, 0) translate(-50%, -50%)\`;

      if (!isVisible) {
        isVisible = true;
        cursor.classList.add('is-visible');
      }

      if (!isTracking) {
        isTracking = true;
        requestAnimationFrame(renderRing);
      }
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      cursor.classList.remove('is-visible');
      isVisible = false;
    });

    document.addEventListener('mouseenter', function () {
      cursor.classList.add('is-visible');
      isVisible = true;
    });

    // Interactive element hover state delegation
    const interactiveSelector = 'a, button, input, select, textarea, [role="button"], .skill-card, .service-card, .project-card, .testimonial-card, .achievement-card, .contact-card, .education-card, .cert-card, .interactive';

    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(interactiveSelector)) {
        cursor.classList.add('is-hovering');
      }
    }, { passive: true });

    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(interactiveSelector)) {
        cursor.classList.remove('is-hovering');
      }
    }, { passive: true });
  }

  /**
   * Module 6: Decorative Elements Subtle Parallax (Day 10)
   */
  function initDecorativeParallax() {
    if (prefersReducedMotion || window.innerWidth < 992) return;

    const decorElements = document.querySelectorAll('.hero-grid-pattern, .about-geo--ring, .about-geo--cube');
    if (!decorElements.length) return;

    let ticking = false;

    function updateParallax() {
      const scrollY = window.scrollY;
      decorElements.forEach((el, index) => {
        const speed = (index + 1) * 0.03;
        el.style.transform = \`translate3d(0, \${(scrollY * speed).toFixed(1)}px, 0)\`;
      });
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }
`;

if (!code.includes('initPageLoader()')) {
  const target = "  // Check if user prefers reduced motion\n  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;";
  code = code.replace(target, target + '\n' + day10Controllers);
  console.log('✓ Added Day 10 new controllers to animations.js');
}

// 2. Enhance initMagneticButtons
const enhancedMagnetic = `  function initMagneticButtons() {
    const hasHoverPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (prefersReducedMotion || window.innerWidth < 992 || !hasHoverPointer) {
      return;
    }

    const magneticElements = document.querySelectorAll(
      '.btn--cta, .btn--outline, .btn-magnetic, .service-card__cta, .project-card__btn, #hero-cta-contact, #hero-cta-cv, #contact-submit-btn, .back-to-top'
    );

    magneticElements.forEach(btn => {
      if (btn.dataset.magneticBound === 'true') return;
      btn.dataset.magneticBound = 'true';

      btn.addEventListener('mouseenter', function () {
        btn.style.transition = 'none';
      });

      btn.addEventListener('mousemove', function (e) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const moveX = x * 0.15;
        const moveY = y * 0.15;

        btn.style.transform = \`translate(\${moveX.toFixed(1)}px, \${moveY.toFixed(1)}px)\`;
      });

      btn.addEventListener('mouseleave', function () {
        btn.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
        btn.style.transform = 'translate(0px, 0px)';
        setTimeout(() => {
          btn.style.transform = '';
          btn.style.transition = '';
        }, 350);
      });
    });
  }`;

code = code.replace(
  /function initMagneticButtons\(\) \{[\s\S]*?btn\.addEventListener\('mouseleave', function \(\) \{[\s\S]*?btn\.style\.transform = '';[\s\S]*?\}\);[\s\S]*?\}\);[\s\S]*?\}/,
  enhancedMagnetic
);
console.log('✓ Enhanced initMagneticButtons');

// 3. Enhance initScrollObserver for all 10 sections with variants
const enhancedScrollObserver = `  function initScrollObserver() {
    const revealConfigs = [
      // Section Headers & Titles (Fade Down)
      { selector: '.hero__meta-row, .about__header, .skills__header, .services__header, .projects__header, .journey__header, .testimonials__header, .contact__header', variant: 'reveal--fade-down' },
      // Left columns / Bios (Fade Right)
      { selector: '.about__bio, .contact__info-col', variant: 'reveal--fade-right' },
      // Right columns / Visuals (Fade Left)
      { selector: '.about-visual__wrapper, .contact__form-col, .hero-3d-scene', variant: 'reveal--fade-left' },
      // Subtitles & Descriptions (Text reveal)
      { selector: '.hero__subtitle, .about__desc, .services__desc, .projects__desc, .contact__desc', variant: 'reveal--text' },
      // Card Grids (Scale / Stagger)
      { selector: '.skill-card, .service-card, .project-card, .timeline-item, .education-card, .achievement-card, .research-card, .cert-card, .highlight-card, .testimonial-card, .contact-card', variant: 'reveal--scale' },
      // Generic blocks & banners
      { selector: '.skills-filter-nav, .projects-filter-nav, .services-cta-banner, .projects-cta-banner, .testimonials-cta, .testimonials-controls, .about-card-badge--exp, .about-highlight-card, .about__info-card, .scroll-tester__marker', variant: 'reveal--fade-up' }
    ];

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal-item, .skill-card, .service-card, .project-card, .education-card, .achievement-card, .testimonial-card, .contact-card').forEach(el => {
        el.classList.add('reveal-item', 'is-revealed');
      });
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealConfigs.forEach(config => {
      const elements = document.querySelectorAll(config.selector);
      elements.forEach((el, index) => {
        el.classList.add('reveal-item', config.variant);
        revealObserver.observe(el);
      });
    });
  }`;

code = code.replace(
  /function initScrollObserver\(\) \{[\s\S]*?observeTargets\.forEach\(el => \{[\s\S]*?el\.classList\.add\('reveal-item'\);[\s\S]*?revealObserver\.observe\(el\);[\s\S]*?\}\);[\s\S]*?\}/,
  enhancedScrollObserver
);
console.log('✓ Enhanced initScrollObserver');

// 4. Update DOMContentLoaded call list
const oldDOMContentLoaded = `  document.addEventListener('DOMContentLoaded', function () {
    initRoleTypingAnimation();`;

const newDOMContentLoaded = `  document.addEventListener('DOMContentLoaded', function () {
    initPageLoader();
    initScrollProgressAndBackToTop();
    initCustomCursor();
    initDecorativeParallax();
    initRoleTypingAnimation();`;

if (code.includes(oldDOMContentLoaded)) {
  code = code.replace(oldDOMContentLoaded, newDOMContentLoaded);
  console.log('✓ Updated DOMContentLoaded in animations.js');
}

// 5. Update window resize listener
const oldResize = `  window.addEventListener('resize', function () {
    initHero3DParallax();`;

const newResize = `  window.addEventListener('resize', function () {
    initCustomCursor();
    initHero3DParallax();`;

if (code.includes(oldResize)) {
  code = code.replace(oldResize, newResize);
  console.log('✓ Updated resize listener in animations.js');
}

fs.writeFileSync(animPath, code, 'utf8');
console.log('✓ animations.js updated successfully');
