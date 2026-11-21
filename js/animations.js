/**
 * ============================================================================
 * ABDULLAH MAHMOOD — PREMIUM PORTFOLIO
 * Animation Controller & Micro-interactions (Vanilla JavaScript)
 * Day 3: 3D Parallax, Typing, Statistics Counter & Scroll Reveals
 * ============================================================================
 */

(function () {
  'use strict';

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
        progressBar.style.width = `${percent.toFixed(1)}%`;
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

      ring.style.transform = `translate3d(${ringX.toFixed(1)}px, ${ringY.toFixed(1)}px, 0) translate(-50%, -50%)`;

      const dist = Math.abs(mouseX - ringX) + Math.abs(mouseY - ringY);
      if (dist > 0.05 || isTracking) {
        requestAnimationFrame(renderRing);
      }
    }

    window.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

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
        el.style.transform = `translate3d(0, ${(scrollY * speed).toFixed(1)}px, 0)`;
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


  /**
   * 1. Smooth Role Typing & Deleting Animation (Hero)
   */
  function initRoleTypingAnimation() {
    const typedTextEl = document.getElementById('typed-role-text');
    if (!typedTextEl) return;

    const roles = [
      'Full Stack Developer',
      'Frontend Developer',
      'WordPress Developer',
      'Digital Marketer'
    ];

    if (prefersReducedMotion) {
      typedTextEl.textContent = 'Full Stack Developer & Digital Marketer';
      return;
    }

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingTimer = null;

    const TYPE_SPEED = 85;
    const DELETE_SPEED = 45;
    const HOLD_DELAY = 1800;
    const NEXT_DELAY = 350;

    function typeLoop() {
      const currentRole = roles[roleIndex];

      if (!isDeleting) {
        charIndex++;
        typedTextEl.textContent = currentRole.substring(0, charIndex);

        if (charIndex === currentRole.length) {
          isDeleting = true;
          typingTimer = setTimeout(typeLoop, HOLD_DELAY);
          return;
        }
        typingTimer = setTimeout(typeLoop, TYPE_SPEED);
      } else {
        charIndex--;
        typedTextEl.textContent = currentRole.substring(0, charIndex);

        if (charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          typingTimer = setTimeout(typeLoop, NEXT_DELAY);
          return;
        }
        typingTimer = setTimeout(typeLoop, DELETE_SPEED);
      }
    }

    // Start with short initial delay
    typingTimer = setTimeout(typeLoop, 500);

    // Cleanup timer if page is hidden
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        clearTimeout(typingTimer);
      } else {
        typeLoop();
      }
    });
  }

  /**
   * 2. Advanced 3D Mouse-Follow Parallax on Desktop (Hero)
   */
  function initHero3DParallax() {
    const heroSection = document.getElementById('home');
    const sceneWrapper = document.getElementById('hero-3d-wrapper');
    const cardTop = document.getElementById('glass-card-top');
    const cardBottom = document.getElementById('glass-card-bottom');
    const orb = document.querySelector('.hero-3d__orb');

    if (!heroSection || !sceneWrapper) return;

    const hasHoverPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (prefersReducedMotion || !hasHoverPointer || window.innerWidth < 992) {
      return;
    }

    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let isHovering = false;
    let animationFrameId = null;

    function lerp(start, end, factor) {
      return start + (end - start) * factor;
    }

    function renderParallax() {
      currentRotX = lerp(currentRotX, targetRotX, 0.08);
      currentRotY = lerp(currentRotY, targetRotY, 0.08);

      sceneWrapper.style.transform = `rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg)`;

      if (cardTop) {
        cardTop.style.transform = `translateZ(65px) translate3d(${(currentRotY * 1.5).toFixed(1)}px, ${(-currentRotX * 1.5).toFixed(1)}px, 0)`;
      }
      if (cardBottom) {
        cardBottom.style.transform = `translateZ(75px) translate3d(${(-currentRotY * 1.2).toFixed(1)}px, ${(currentRotX * 1.2).toFixed(1)}px, 0)`;
      }
      if (orb) {
        orb.style.transform = `translateZ(-50px) translate3d(${(-currentRotY * 2).toFixed(1)}px, ${(currentRotX * 2).toFixed(1)}px, 0)`;
      }

      const distance = Math.abs(targetRotX - currentRotX) + Math.abs(targetRotY - currentRotY);
      if (isHovering || distance > 0.01) {
        animationFrameId = requestAnimationFrame(renderParallax);
      } else {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    }

    heroSection.addEventListener('mousemove', function (e) {
      isHovering = true;
      const rect = heroSection.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;

      targetRotY = normX * 12;
      targetRotX = -normY * 12;

      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(renderParallax);
      }
    });

    heroSection.addEventListener('mouseleave', function () {
      isHovering = false;
      targetRotX = 0;
      targetRotY = 0;
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(renderParallax);
      }
    });
  }

  /**
   * 3. Subtle Magnetic Hover Effect on CTA Buttons
   */
    function initMagneticButtons() {
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

        btn.style.transform = `translate(${moveX.toFixed(1)}px, ${moveY.toFixed(1)}px)`;
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
  }

  /**
   * 4. Professional Statistics Count-Up Animation (Day 3)
   * Starts when #about-stats enters the viewport via IntersectionObserver.
   * Runs only ONCE; does not restart repeatedly on scroll.
   */
  function initStatisticsCounter() {
    const statsContainer = document.getElementById('about-stats');
    if (!statsContainer) return;

    const counterElements = statsContainer.querySelectorAll('.about-stat-card__number');
    if (!counterElements.length) return;

    // Fast-path for reduced motion
    if (prefersReducedMotion) {
      counterElements.forEach(el => {
        const rawTarget = el.getAttribute('data-counter');
        const suffix = el.getAttribute('data-suffix') || '';
        el.textContent = rawTarget + suffix;
      });
      return;
    }

    let hasAnimated = false;

    function runCountUp() {
      if (hasAnimated) return;
      hasAnimated = true;

      const DURATION = 1600; // ms

      counterElements.forEach(el => {
        const rawTarget = el.getAttribute('data-counter');
        const isText = el.getAttribute('data-type') === 'text' || isNaN(Number(rawTarget));
        const suffix = el.getAttribute('data-suffix') || '';

        if (isText) {
          el.textContent = rawTarget;
          el.style.opacity = '1';
          return;
        }

        const targetValue = parseInt(rawTarget, 10);
        const startTime = performance.now();

        function updateNumber(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / DURATION, 1);
          // Ease-out cubic curve: 1 - pow(1 - p, 3)
          const easeOutProgress = 1 - Math.pow(1 - progress, 3);
          const currentValue = Math.floor(easeOutProgress * targetValue);

          el.textContent = currentValue + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateNumber);
          } else {
            el.textContent = targetValue + suffix;
          }
        }

        requestAnimationFrame(updateNumber);
      });
    }

    if (!('IntersectionObserver' in window)) {
      runCountUp();
      return;
    }

    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCountUp();
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.25
    });

    statsObserver.observe(statsContainer);
  }

  /**
   * 5. Scroll Reveal Observer for Sections & Components
   */
    function initScrollObserver() {
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
  }

  /**
   * 6. Download CV Direct Download & File Verification Controller
   */
  function initCvDownloadHandler() {
    const cvBtn = document.getElementById('download-cv-btn');
    const toast = document.getElementById('cv-toast');
    if (!cvBtn || !toast) return;

    let toastTimer = null;

    function triggerDownload(url) {
      const tempLink = document.createElement('a');
      tempLink.href = url;
      tempLink.download = cvBtn.getAttribute('download') || 'Abdullah-Mahmood-CV.pdf';
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
    }

    cvBtn.addEventListener('click', function (e) {
      const fileUrl = cvBtn.getAttribute('href');

      // In local file:// environments, browser security blocks fetch() on local files.
      // Allow native <a> download without obstruction.
      if (typeof window !== 'undefined' && window.location && window.location.protocol === 'file:') {
        return;
      }

      e.preventDefault();

      if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
        window.fetch(fileUrl, { method: 'HEAD' })
          .then(response => {
            if (response.ok) {
              // File exists: trigger clean download
              triggerDownload(fileUrl);
            } else {
              showToast();
            }
          })
          .catch(() => {
            // Fallback: trigger download directly
            triggerDownload(fileUrl);
          });
      } else {
        triggerDownload(fileUrl);
      }
    });

    function showToast() {
      toast.classList.add('is-active');

      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.classList.remove('is-active');
      }, 5000);
    }
  }

  /**
   * 7. Profile Image Fallback Handling
   */
  function initImageFallback() {
    const imageIds = ['profile-img', 'about-profile-img'];
    imageIds.forEach(id => {
      const img = document.getElementById(id);
      if (img) {
        img.addEventListener('error', function () {
          const parentFrame = img.closest('.hero-visual__frame, .about-visual__frame');
          if (parentFrame) {
            parentFrame.classList.add('has-fallback');
          }
        });
      }
    });
  }

  /**
   * 8. Interactive Skills Category Filtering (Day 4)
   */
  function initSkillsFilter() {
    const filterButtons = document.querySelectorAll('.skills-filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');
    if (!filterButtons.length || !skillCards.length) return;

    filterButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        const filter = this.getAttribute('data-filter');

        // Update active class & ARIA
        filterButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        // Filter cards with staggered animation
        let visibleIndex = 0;
        skillCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          const isMatch = filter === 'all' || cardCategory === filter;

          if (isMatch) {
            card.classList.remove('is-hidden');
            card.classList.remove('animate-in');
            void card.offsetWidth; // Trigger reflow for keyframe reset
            card.style.animationDelay = `${visibleIndex * 35}ms`;
            card.classList.add('animate-in');
            visibleIndex++;
          } else {
            card.classList.add('is-hidden');
            card.classList.remove('animate-in');
            card.style.animationDelay = '';
          }
        });
      });
    });
  }

  /**
   * 9. Subtle 3D Tilt on Desktop Hover for Skill Cards (Day 4)
   */
  function initSkillCard3DTilt() {
    const hasHoverPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (prefersReducedMotion || !hasHoverPointer || window.innerWidth < 992) {
      return;
    }

    const cards = document.querySelectorAll('.skill-card');

    cards.forEach(card => {
      if (card.dataset.tiltBound === 'true') return;
      card.dataset.tiltBound = 'true';

      card.addEventListener('mouseenter', function () {
        card.style.transition = 'none';
      });

      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;

        const tiltX = -normY * 8;
        const tiltY = normX * 8;

        card.style.transform = `perspective(600px) rotateX(${tiltX.toFixed(1)}deg) rotateY(${tiltY.toFixed(1)}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', function () {
        card.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.transform = '';
        setTimeout(() => {
          card.style.transition = '';
        }, 450);
      });
    });
  }

  /**
   * 10. Accessible Service Details Modal Controller (Day 5)
   */
  function initServicesModal() {
    const modal = document.getElementById('service-modal');
    if (!modal) return;

    const modalDialog = modal.querySelector('.service-modal__dialog');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalDismissBtn = document.getElementById('modal-dismiss-btn');
    const modalCtaBtn = document.getElementById('modal-cta-btn');

    const modalNumber = document.getElementById('modal-service-number');
    const modalTag = document.getElementById('modal-service-tag');
    const modalTitle = document.getElementById('modal-service-title');
    const modalIcon = document.getElementById('modal-service-icon');
    const modalDesc = document.getElementById('modal-service-desc');
    const modalFeatures = document.getElementById('modal-service-features');

    const triggerBtns = document.querySelectorAll('[data-service-trigger]');
    const serviceCards = document.querySelectorAll('.service-card');

    let lastFocusedTrigger = null;

    const servicesData = {
      1: {
        number: '01',
        tag: 'Full Stack Engineering',
        title: 'Full Stack Web Development',
        iconClass: 'fa-solid fa-layer-group',
        desc: 'Building modern, responsive and scalable web applications using frontend and backend technologies.',
        features: [
          'Custom Web Applications tailored to business requirements',
          'Frontend & Backend Development with clean, modular architecture',
          'Database Integration (MySQL, MongoDB) & RESTful API Engineering',
          'Cloud deployment, security hardening and high performance optimization'
        ]
      },
      2: {
        number: '02',
        tag: 'User Interface & UX',
        title: 'Frontend Development',
        iconClass: 'fa-solid fa-code',
        desc: 'Creating beautiful, responsive and interactive user interfaces with modern frontend technologies.',
        features: [
          'Semantic HTML5, responsive CSS3 and modern Vanilla JavaScript',
          'React.js Component Architecture & Reactive State Management',
          'Responsive UI Design tested across mobile, tablet, and desktop',
          'Smooth 60FPS CSS animations and engaging micro-interactions'
        ]
      },
      3: {
        number: '03',
        tag: 'CMS & Custom Themes',
        title: 'WordPress Development',
        iconClass: 'fa-brands fa-wordpress-simple',
        desc: 'Developing professional WordPress websites with modern designs and easy content management.',
        features: [
          'Business Websites built with custom branding and conversion focus',
          'Custom WordPress Development & Clean Child Theme Architecture',
          'Elementor Integration for intuitive, client-friendly content editing',
          'Speed optimization, caching, security hardening and automated backups'
        ]
      },
      4: {
        number: '04',
        tag: 'E-Commerce Solutions',
        title: 'E-Commerce Development',
        iconClass: 'fa-solid fa-cart-shopping',
        desc: 'Building professional online stores that provide smooth shopping experiences.',
        features: [
          'Shopify Store Development, app setup and custom liquid styling',
          'WooCommerce platform architecture with scalable product catalogs',
          'Product Page Customization engineered for high conversion rates',
          'Frictionless checkout flow and secure payment gateway integrations'
        ]
      },
      5: {
        number: '05',
        tag: 'Paid Acquisition & Growth',
        title: 'Digital Marketing',
        iconClass: 'fa-solid fa-bullhorn',
        desc: 'Helping businesses reach their target audience through strategic digital marketing campaigns.',
        features: [
          'Targeted Meta Advertising (Facebook & Instagram conversion campaigns)',
          'High-intent Google Advertising (Search, Display & Retargeting)',
          'Social Media Marketing strategies to engage and nurture audiences',
          'Conversion tracking, Pixel / CAPI setup and ROI performance optimization'
        ]
      },
      6: {
        number: '06',
        tag: 'Search Visibility & Funnels',
        title: 'SEO & Lead Generation',
        iconClass: 'fa-solid fa-magnifying-glass-chart',
        desc: 'Improving online visibility and generating quality business leads through effective marketing strategies.',
        features: [
          'Technical on-page & off-page Search Engine Optimization (SEO)',
          'Automated Lead Generation funnels and landing page optimization',
          'Data-driven Marketing Strategy aligned with business revenue goals',
          'Competitor analysis, keyword rankings and monthly performance reports'
        ]
      }
    };

    function openModal(serviceId, triggerEl) {
      const data = servicesData[serviceId];
      if (!data) return;

      lastFocusedTrigger = triggerEl || null;

      if (modalNumber) modalNumber.textContent = data.number;
      if (modalTag) modalTag.textContent = data.tag;
      if (modalTitle) modalTitle.textContent = data.title;
      if (modalIcon) modalIcon.innerHTML = `<i class="${data.iconClass}" aria-hidden="true"></i>`;
      if (modalDesc) modalDesc.textContent = data.desc;

      if (modalFeatures) {
        modalFeatures.innerHTML = data.features.map(feat => `
          <li>
            <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
            <span>${feat}</span>
          </li>
        `).join('');
      }

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');

      if (modalCloseBtn) {
        setTimeout(() => modalCloseBtn.focus(), 50);
      }
    }

    function closeModal() {
      if (!modal.classList.contains('is-open')) return;

      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');

      if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
        lastFocusedTrigger.focus();
      }
    }

    // Attach trigger buttons
    triggerBtns.forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const serviceId = this.getAttribute('data-service-trigger');
        openModal(serviceId, this);
      });
    });

    // Also support clicking or pressing Enter on the service card
    serviceCards.forEach(card => {
      card.addEventListener('click', function (e) {
        if (e.target.closest('button') || e.target.closest('a')) return;
        const serviceId = this.getAttribute('data-service-id');
        const trigger = this.querySelector('[data-service-trigger]') || this;
        openModal(serviceId, trigger);
      });

      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          if (e.target !== card) return;
          e.preventDefault();
          const serviceId = this.getAttribute('data-service-id');
          const trigger = this.querySelector('[data-service-trigger]') || this;
          openModal(serviceId, trigger);
        }
      });
    });

    // Close button & Cancel button
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    // Clicking outside modal dialog
    modal.addEventListener('click', function (e) {
      if (modalDialog && !modalDialog.contains(e.target)) {
        closeModal();
      }
    });

    // Close on CTA navigation
    if (modalCtaBtn) {
      modalCtaBtn.addEventListener('click', function () {
        closeModal();
      });
    }

    // Accessible keydown handler (Escape & Focus Trap)
    document.addEventListener('keydown', function (e) {
      if (!modal.classList.contains('is-open')) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
        return;
      }

      if (e.key === 'Tab') {
        const focusableElements = modal.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });
  }

  /**
   * 11. Subtle 3D Tilt on Desktop Hover for Service Cards (Day 5)
   */
  function initServiceCard3DTilt() {
    const hasHoverPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (prefersReducedMotion || !hasHoverPointer || window.innerWidth < 992) {
      return;
    }

    const cards = document.querySelectorAll('.service-card');

    cards.forEach(card => {
      if (card.dataset.tiltBound === 'true') return;
      card.dataset.tiltBound = 'true';

      card.addEventListener('mouseenter', function () {
        card.style.transition = 'none';
      });

      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;

        const tiltX = -normY * 7;
        const tiltY = normX * 7;

        card.style.transform = `perspective(800px) rotateX(${tiltX.toFixed(1)}deg) rotateY(${tiltY.toFixed(1)}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', function () {
        card.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.transform = '';
        setTimeout(() => {
          card.style.transition = '';
        }, 450);
      });
    });
  }

  /**
   * 12. Interactive Category Filter Controller for Projects Showcase (Day 6)
   */
  function initProjectsFilter() {
    const filterBtns = document.querySelectorAll('.projects-filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    if (!filterBtns.length || !projectCards.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const filter = this.getAttribute('data-filter');

        // Update active filter button styling and accessibility state
        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        // Filter project cards with staggered fade-in animations
        let visibleIndex = 0;
        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          const isMatch = filter === 'all' || category === filter;

          if (isMatch) {
            card.classList.remove('is-hidden');
            card.classList.remove('animate-in');
            void card.offsetWidth; // Force reflow
            card.style.animationDelay = `${visibleIndex * 40}ms`;
            card.classList.add('animate-in');
            visibleIndex++;
          } else {
            card.classList.add('is-hidden');
            card.classList.remove('animate-in');
            card.style.animationDelay = '';
          }
        });
      });
    });
  }

  /**
   * 13. Accessible Project Detail Modal Dialog Controller (Day 6)
   */
  function initProjectsModal() {
    const modal = document.getElementById('project-modal');
    if (!modal) return;

    const modalDialog = modal.querySelector('.project-modal__dialog');
    const modalBackdrop = document.getElementById('project-modal-backdrop');
    const modalCloseBtn = document.getElementById('project-modal-close-btn');
    const modalDismissBtn = document.getElementById('project-modal-dismiss-btn');
    const modalCategory = document.getElementById('project-modal-category');
    const modalIdBadge = document.getElementById('project-modal-id');
    const modalImg = document.getElementById('project-modal-img');
    const modalIcon = document.getElementById('project-modal-icon');
    const modalLabel = document.getElementById('project-modal-label');
    const modalTitle = document.getElementById('project-modal-title');
    const modalDesc = document.getElementById('project-modal-desc');
    const modalTechTags = document.getElementById('project-modal-tech-tags');
    const modalDemoBtn = document.getElementById('project-modal-demo-btn');
    const modalCodeBtn = document.getElementById('project-modal-code-btn');

    const triggerBtns = document.querySelectorAll('[data-project-trigger]');
    const projectCards = document.querySelectorAll('.project-card');

    let lastFocusedTrigger = null;

    const projectsData = {
      1: {
        id: 'PROJECT 01',
        title: 'Modern Business Website',
        category: 'Web Development',
        categorySlug: 'web-dev',
        imgSrc: 'assets/images/projects/project-01.jpg',
        iconClass: 'fa-solid fa-building',
        desc: 'A modern corporate web presence built to deliver rapid loading times and seamless cross-device compatibility. Features accessible semantic layout, custom micro-interactions, responsive navigation, and performance-tuned asset delivery.',
        tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design', 'SEO Ready'],
        demoUrl: '#',
        codeUrl: '#'
      },
      2: {
        id: 'PROJECT 02',
        title: 'E-commerce Online Store',
        category: 'E-commerce',
        categorySlug: 'ecommerce',
        imgSrc: 'assets/images/projects/project-02.jpg',
        iconClass: 'fa-solid fa-bag-shopping',
        desc: 'Engineered for modern online retail with intuitive product filtering, dynamic cart interaction, optimized conversion flow, and secure multi-currency transaction support.',
        tags: ['WooCommerce', 'PHP', 'JavaScript', 'CSS Grid', 'Stripe API'],
        demoUrl: '#',
        codeUrl: '#'
      },
      3: {
        id: 'PROJECT 03',
        title: 'Corporate WordPress Website',
        category: 'WordPress',
        categorySlug: 'wordpress',
        imgSrc: 'assets/images/projects/project-03.jpg',
        iconClass: 'fa-brands fa-wordpress',
        desc: 'Designed for seamless corporate publishing with customized modular content blocks, advanced custom fields (ACF), optimized server caching, and robust security hardening.',
        tags: ['WordPress', 'PHP', 'Elementor Pro', 'ACF', 'MySQL'],
        demoUrl: '#',
        codeUrl: '#'
      },
      4: {
        id: 'PROJECT 04',
        title: 'React Dashboard Application',
        category: 'React Applications',
        categorySlug: 'react-app',
        imgSrc: 'assets/images/projects/project-04.jpg',
        iconClass: 'fa-brands fa-react',
        desc: 'An analytical dashboard interface providing real-time data inspection, customizable charting components, state-managed data filtering, and high-performance reactive rendering.',
        tags: ['React.js', 'REST APIs', 'CSS Modules', 'Chart.js', 'State Hooks'],
        demoUrl: '#',
        codeUrl: '#'
      },
      5: {
        id: 'PROJECT 05',
        title: 'Creative Landing Page',
        category: 'Web Development',
        categorySlug: 'web-dev',
        imgSrc: 'assets/images/projects/project-05.jpg',
        iconClass: 'fa-solid fa-wand-magic-sparkles',
        desc: 'Built to maximize audience retention and campaign engagement through compelling visual storytelling, optimized call-to-action placement, and lightweight scroll-triggered motion graphics.',
        tags: ['HTML5', 'CSS3 Animations', 'JavaScript', 'UI/UX Design'],
        demoUrl: '#',
        codeUrl: '#'
      },
      6: {
        id: 'PROJECT 06',
        title: 'Shopify Store Design',
        category: 'E-commerce',
        categorySlug: 'ecommerce',
        imgSrc: 'assets/images/projects/project-06.jpg',
        iconClass: 'fa-brands fa-shopify',
        desc: 'Tailored e-commerce theme architecture prioritizing mobile shoppers, rapid page loading, branded micro-animations, and integrated customer trust signals.',
        tags: ['Shopify', 'Liquid', 'JavaScript', 'Responsive CSS'],
        demoUrl: '#',
        codeUrl: '#'
      },
      7: {
        id: 'PROJECT 07',
        title: 'Digital Marketing Campaign',
        category: 'Digital Marketing',
        categorySlug: 'marketing',
        imgSrc: 'assets/images/projects/project-07.jpg',
        iconClass: 'fa-solid fa-bullhorn',
        desc: 'A comprehensive campaign framework designed for measurable audience acquisition and lead conversion, incorporating audience segmentation, pixel tracking, and targeted creative assets.',
        tags: ['Meta Ads', 'Google Ads', 'SEO Strategy', 'Analytics', 'Conversion Funnels'],
        demoUrl: '#',
        codeUrl: '#'
      },
      8: {
        id: 'PROJECT 08',
        title: 'Portfolio Website',
        category: 'Web Development',
        categorySlug: 'web-dev',
        imgSrc: 'assets/images/projects/project-08.jpg',
        iconClass: 'fa-solid fa-code',
        desc: 'An ultra-clean personal website built with zero external framework overhead, featuring bespoke CSS 3D transforms, accessible modal architectures, and fluid responsive design across all viewports.',
        tags: ['HTML5', 'CSS3', 'Vanilla JavaScript', '3D Transforms', 'Responsive UI'],
        demoUrl: '#',
        codeUrl: '#'
      }
    };

    function openModal(projectId, triggerEl) {
      const data = projectsData[projectId];
      if (!data) return;

      lastFocusedTrigger = triggerEl || null;

      if (modalCategory) modalCategory.textContent = data.category;
      if (modalIdBadge) modalIdBadge.textContent = data.id;
      if (modalTitle) modalTitle.textContent = data.title;
      if (modalDesc) modalDesc.textContent = data.desc;
      if (modalLabel) modalLabel.textContent = data.id;
      if (modalIcon) modalIcon.innerHTML = `<i class="${data.iconClass}" aria-hidden="true"></i>`;

      if (modalImg) {
        modalImg.src = data.imgSrc;
        modalImg.alt = `${data.title} detailed visual`;
        modalImg.style.opacity = '1';
        modalImg.onerror = function () {
          this.style.opacity = '0';
        };
      }

      if (modalTechTags) {
        modalTechTags.innerHTML = data.tags.map(tag => `
          <span class="project-tag">${tag}</span>
        `).join('');
      }

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');

      if (modalCloseBtn) {
        setTimeout(() => modalCloseBtn.focus(), 50);
      }
    }

    function closeModal() {
      if (!modal.classList.contains('is-open')) return;

      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');

      if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
        lastFocusedTrigger.focus();
      }
    }

    // Attach trigger buttons
    triggerBtns.forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const projectId = this.getAttribute('data-project-trigger');
        openModal(projectId, this);
      });
    });

    // Also support card click and Enter/Space keyboard access
    projectCards.forEach(card => {
      card.addEventListener('click', function (e) {
        if (e.target.closest('button') || e.target.closest('a')) return;
        const projectId = this.getAttribute('data-project-id');
        const trigger = this.querySelector('[data-project-trigger]') || this;
        openModal(projectId, trigger);
      });

      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          if (e.target !== card) return;
          e.preventDefault();
          const projectId = this.getAttribute('data-project-id');
          const trigger = this.querySelector('[data-project-trigger]') || this;
          openModal(projectId, trigger);
        }
      });
    });

    // Close actions
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    // Outside click
    modal.addEventListener('click', function (e) {
      if (modalDialog && !modalDialog.contains(e.target)) {
        closeModal();
      }
    });

    // Keyboard navigation (Escape & Focus Trap)
    document.addEventListener('keydown', function (e) {
      if (!modal.classList.contains('is-open')) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
        return;
      }

      if (e.key === 'Tab') {
        const focusableElements = modal.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });
  }

  /**
   * 14. Subtle 3D Tilt on Desktop Hover for Project Cards (Day 6)
   */
  function initProjectCard3DTilt() {
    const hasHoverPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (prefersReducedMotion || !hasHoverPointer || window.innerWidth < 992) {
      return;
    }

    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
      if (card.dataset.tiltBound === 'true') return;
      card.dataset.tiltBound = 'true';

      card.addEventListener('mouseenter', function () {
        card.style.transition = 'none';
      });

      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;

        const tiltX = -normY * 7;
        const tiltY = normX * 7;

        card.style.transform = `perspective(800px) rotateX(${tiltX.toFixed(1)}deg) rotateY(${tiltY.toFixed(1)}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', function () {
        card.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.transform = '';
        setTimeout(() => {
          card.style.transition = '';
        }, 450);
      });
    });
  }

  /**
   * 15. Experience Cards "Read More" Interactive Collapsible (Day 7 - Module 8)
   */
  function initExperienceCollapsibles() {
    const expandBtns = document.querySelectorAll('.experience-card__expand-btn');
    if (!expandBtns.length) return;

    expandBtns.forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const triggerId = this.getAttribute('data-expand-trigger');
        const targetCollapsibleId = this.getAttribute('aria-controls') || (triggerId ? `exp-collapsible-${triggerId}` : null);
        const card = this.closest('.experience-card');
        const collapsible = targetCollapsibleId ? document.getElementById(targetCollapsibleId) : null;
        const btnText = this.querySelector('.btn-text') || this.querySelector('span');

        if (!card || !collapsible) return;

        const isCurrentlyExpanded = this.getAttribute('aria-expanded') === 'true';

        if (isCurrentlyExpanded) {
          // Collapse
          this.setAttribute('aria-expanded', 'false');
          collapsible.setAttribute('aria-hidden', 'true');
          card.classList.remove('is-expanded');
          collapsible.classList.remove('is-expanded');
          if (btnText) btnText.textContent = 'Read More';
        } else {
          // Expand
          this.setAttribute('aria-expanded', 'true');
          collapsible.setAttribute('aria-hidden', 'false');
          card.classList.add('is-expanded');
          collapsible.classList.add('is-expanded');
          if (btnText) btnText.textContent = 'Read Less';
        }
      });
    });
  }

  /**
   * 16. Vertical Timeline Dynamic Progress Line & Sequential Markers (Day 7 - Module 7)
   */
  function initTimelineProgress() {
    const timelineContainer = document.getElementById('experience-timeline');
    const progressBar = document.getElementById('timeline-progress-fill') || document.getElementById('timeline-progress-bar');
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (!timelineContainer || !progressBar || !timelineItems.length) return;

    if (prefersReducedMotion) {
      progressBar.style.height = '100%';
      timelineItems.forEach(item => item.classList.add('is-active'));
      return;
    }

    let ticking = false;

    function updateTimeline() {
      const rect = timelineContainer.getBoundingClientRect();
      const windowHeight = window.innerHeight || 800;

      // Start filling when container enters viewport
      const startPoint = windowHeight * 0.7;
      const totalHeight = rect.height || 600;
      const currentScroll = startPoint - rect.top;

      let progress = 0;
      if (currentScroll > 0) {
        progress = Math.min(Math.max(currentScroll / totalHeight, 0), 1);
      }

      const percent = (progress * 100).toFixed(1);
      progressBar.style.height = `${percent}%`;

      // Update sequential marker active states
      timelineItems.forEach(item => {
        const itemRect = item.getBoundingClientRect();
        if (itemRect.top < startPoint + 40) {
          item.classList.add('is-active');
        } else {
          item.classList.remove('is-active');
        }
      });

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateTimeline);
        ticking = true;
      }
    }, { passive: true });

    // Initial check
    updateTimeline();
  }

  /**
   * 17. Achievement Counter Animation (Day 7 - Module 3)
   */
  function initAchievementCounter() {
    const counters = document.querySelectorAll('.achievement-card__number[data-target]');
    if (!counters.length) return;

    if (prefersReducedMotion) {
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        counter.textContent = isNaN(target) ? counter.textContent : target.toLocaleString();
      });
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          if (isNaN(target)) return;

          const duration = 1600; // ms
          const startTime = performance.now();

          function updateCount(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutQuad
            const ease = 1 - (1 - progress) * (1 - progress);
            const currentVal = Math.floor(ease * target);

            el.textContent = currentVal.toLocaleString();

            if (progress < 1) {
              window.requestAnimationFrame(updateCount);
            } else {
              el.textContent = target.toLocaleString();
            }
          }

          window.requestAnimationFrame(updateCount);
          obs.unobserve(el);
        }
      });
    }, {
      threshold: 0.25,
      rootMargin: '0px 0px -40px 0px'
    });

    counters.forEach(counter => observer.observe(counter));
  }

  /**
   * 18. Subtle 3D Tilt on Desktop Hover for Journey Cards (Day 7)
   */
  function initJourneyCards3DTilt() {
    const hasHoverPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (prefersReducedMotion || !hasHoverPointer || window.innerWidth < 992) {
      return;
    }

    const cards = document.querySelectorAll('.education-card, .cert-card, .achievement-card, .research-card, .highlight-card, .testimonial-card, .contact-card');

    cards.forEach(card => {
      if (card.dataset.tiltBound === 'true') return;
      card.dataset.tiltBound = 'true';

      card.addEventListener('mouseenter', function () {
        card.style.transition = 'none';
      });

      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;

        const tiltX = -normY * 6;
        const tiltY = normX * 6;

        card.style.transform = `perspective(800px) rotateX(${tiltX.toFixed(1)}deg) rotateY(${tiltY.toFixed(1)}deg) translateY(-5px)`;
      });

      card.addEventListener('mouseleave', function () {
        card.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.transform = '';
        setTimeout(() => {
          card.style.transition = '';
        }, 450);
      });
    });
  }

  /**
   * ==========================================================================
   * TESTIMONIALS DATA STRUCTURE (Day 8 - Module 3)
   * Editable repository for genuine student feedback, client reviews, and
   * professional collaborations. Real testimonials will replace placeholders
   * upon verification.
   * ==========================================================================
   */
  const testimonialsData = [
    {
      id: 1,
      name: "Verified Student",
      designation: "Web Development Student",
      organization: "Arfa Karim Technology Incubator",
      text: "Real testimonial coming soon",
      notice: "Student feedback will be published here upon verification of coursework and mentoring testimonials.",
      image: null,
      avatarInitials: "ST",
      category: "students",
      rating: null,
      date: null,
      isPlaceholder: true
    },
    {
      id: 2,
      name: "Business Client",
      designation: "E-commerce / Store Owner",
      organization: "Digital Brand Partner",
      text: "Real testimonial coming soon",
      notice: "Client review and project case study feedback will be added here following client verification and release.",
      image: null,
      avatarInitials: "CR",
      category: "clients",
      rating: null,
      date: null,
      isPlaceholder: true
    },
    {
      id: 3,
      name: "Colleague / Peer",
      designation: "Senior Developer / Educator",
      organization: "Technology Industry Partner",
      text: "Real testimonial coming soon",
      notice: "Professional peer and collaborator endorsement will be displayed here upon formal verification.",
      image: null,
      avatarInitials: "PC",
      category: "collaborations",
      rating: null,
      date: null,
      isPlaceholder: true
    }
  ];

  /**
   * 19. Interactive Testimonials Carousel & Category Filter (Day 8 - Modules 5, 6, 7)
   */
  function initTestimonialsSlider() {
    const carousel = document.getElementById('testimonials-carousel');
    const viewport = document.getElementById('testimonials-viewport');
    const track = document.getElementById('testimonials-track');
    const prevBtn = document.getElementById('testimonial-prev-btn');
    const nextBtn = document.getElementById('testimonial-next-btn');
    const paginationContainer = document.getElementById('testimonial-pagination');
    const autoplayBtn = document.getElementById('testimonial-autoplay-btn');
    const autoplayIcon = document.getElementById('autoplay-icon');
    const autoplayLabel = document.getElementById('autoplay-label');
    const tabs = document.querySelectorAll('.testimonials__tab');
    const slides = document.querySelectorAll('.testimonials-carousel__slide');

    if (!carousel || !viewport || !track || !slides.length) return;

    let currentCategory = 'all';
    let currentIndex = 0;
    let autoplayTimer = null;
    let isAutoplayPausedManually = false;
    let isHovered = false;
    let isFocused = false;
    let isPageHidden = false;
    const AUTOPLAY_INTERVAL = 5000;

    // Filter helper
    function getVisibleSlides() {
      return Array.from(slides).filter(slide => !slide.classList.contains('is-hidden'));
    }

    // Responsive cards per view
    function getCardsPerView() {
      if (window.innerWidth >= 1200) return 3;
      if (window.innerWidth >= 768) return 2;
      return 1;
    }

    // Maximum scroll index
    function getMaxIndex() {
      const visible = getVisibleSlides();
      const cpv = getCardsPerView();
      return Math.max(0, visible.length - cpv);
    }

    // Update Slider Position & State
    function updateSlider(animate = true) {
      const visible = getVisibleSlides();
      const maxIndex = getMaxIndex();

      if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
      }
      if (currentIndex < 0) {
        currentIndex = 0;
      }

      if (!animate || prefersReducedMotion) {
        track.style.transition = 'none';
      } else {
        track.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
      }

      if (visible.length === 0) {
        track.style.transform = 'translateX(0px)';
        return;
      }

      const firstSlide = visible[0];
      const slideWidth = firstSlide.offsetWidth;
      // Get gap from computed style
      const computedTrack = window.getComputedStyle(track);
      const gap = parseFloat(computedTrack.gap) || 28;

      const offset = currentIndex * (slideWidth + gap);
      track.style.transform = `translateX(-${offset}px)`;

      // Update Prev / Next button states
      if (prevBtn) {
        prevBtn.disabled = (currentIndex === 0 && maxIndex === 0);
      }
      if (nextBtn) {
        nextBtn.disabled = (currentIndex === maxIndex && maxIndex === 0);
      }

      updatePaginationDots();
    }

    // Render Pagination Dots
    function renderPagination() {
      if (!paginationContainer) return;
      paginationContainer.innerHTML = '';

      const maxIndex = getMaxIndex();
      const numDots = maxIndex + 1;

      if (numDots <= 1) {
        paginationContainer.style.display = 'none';
        return;
      } else {
        paginationContainer.style.display = 'flex';
      }

      for (let i = 0; i < numDots; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = `pagination-dot${i === currentIndex ? ' is-active' : ''}`;
        dot.setAttribute('aria-label', `Go to testimonial slide ${i + 1}`);
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-selected', i === currentIndex ? 'true' : 'false');
        dot.addEventListener('click', function () {
          currentIndex = i;
          updateSlider(true);
          restartAutoplay();
        });
        paginationContainer.appendChild(dot);
      }
    }

    // Sync active dot
    function updatePaginationDots() {
      if (!paginationContainer) return;
      const dots = paginationContainer.querySelectorAll('.pagination-dot');
      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.classList.add('is-active');
          dot.setAttribute('aria-selected', 'true');
        } else {
          dot.classList.remove('is-active');
          dot.setAttribute('aria-selected', 'false');
        }
      });
    }

    // Navigation triggers
    function nextSlide() {
      const maxIndex = getMaxIndex();
      if (maxIndex === 0) return;

      if (currentIndex >= maxIndex) {
        currentIndex = 0;
      } else {
        currentIndex++;
      }
      updateSlider(true);
    }

    function prevSlide() {
      const maxIndex = getMaxIndex();
      if (maxIndex === 0) return;

      if (currentIndex <= 0) {
        currentIndex = maxIndex;
      } else {
        currentIndex--;
      }
      updateSlider(true);
    }

    // Autoplay Engine
    function startAutoplay() {
      if (prefersReducedMotion || isAutoplayPausedManually || autoplayTimer) return;
      autoplayTimer = setInterval(() => {
        nextSlide();
      }, AUTOPLAY_INTERVAL);
    }

    function pauseAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function restartAutoplay() {
      pauseAutoplay();
      if (!isAutoplayPausedManually && !isHovered && !isFocused && !isPageHidden && !prefersReducedMotion) {
        startAutoplay();
      }
    }

    function toggleAutoplayManually() {
      isAutoplayPausedManually = !isAutoplayPausedManually;

      if (autoplayBtn) {
        autoplayBtn.setAttribute('aria-pressed', isAutoplayPausedManually ? 'true' : 'false');
        autoplayBtn.setAttribute('title', isAutoplayPausedManually ? 'Resume autoplay' : 'Pause autoplay');
        autoplayBtn.setAttribute('aria-label', isAutoplayPausedManually ? 'Resume automatic slide rotation' : 'Pause automatic slide rotation');
      }

      if (autoplayIcon) {
        autoplayIcon.className = isAutoplayPausedManually ? 'fa-solid fa-play' : 'fa-solid fa-pause';
      }

      if (autoplayLabel) {
        autoplayLabel.textContent = isAutoplayPausedManually ? 'Play' : 'Pause';
      }

      if (isAutoplayPausedManually) {
        pauseAutoplay();
      } else {
        startAutoplay();
      }
    }

    // Event Listeners for Controls
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        nextSlide();
        restartAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        prevSlide();
        restartAutoplay();
      });
    }

    if (autoplayBtn) {
      autoplayBtn.addEventListener('click', function () {
        toggleAutoplayManually();
      });
    }

    // Pause on Hover
    carousel.addEventListener('mouseenter', function () {
      isHovered = true;
      pauseAutoplay();
    });

    carousel.addEventListener('mouseleave', function () {
      isHovered = false;
      restartAutoplay();
    });

    // Pause on Focus
    carousel.addEventListener('focusin', function () {
      isFocused = true;
      pauseAutoplay();
    });

    carousel.addEventListener('focusout', function () {
      isFocused = false;
      restartAutoplay();
    });

    // Pause on Page Visibility
    document.addEventListener('visibilitychange', function () {
      isPageHidden = document.hidden;
      if (document.hidden) {
        pauseAutoplay();
      } else {
        restartAutoplay();
      }
    });

    // Keyboard Navigation (ArrowLeft / ArrowRight)
    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
        restartAutoplay();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
        restartAutoplay();
      }
    });

    // Touch Swipe Support
    let touchStartX = 0;
    let touchStartY = 0;

    track.addEventListener('touchstart', function (e) {
      if (e.touches && e.touches.length) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
      if (e.changedTouches && e.changedTouches.length) {
        const diffX = e.changedTouches[0].clientX - touchStartX;
        const diffY = e.changedTouches[0].clientY - touchStartY;

        // Ensure horizontal intent
        if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX < 0) {
            nextSlide();
          } else {
            prevSlide();
          }
          restartAutoplay();
        }
      }
    }, { passive: true });

    // Category Tabs Filter
    tabs.forEach(tab => {
      tab.addEventListener('click', function () {
        const category = this.getAttribute('data-category');
        if (category === currentCategory) return;

        currentCategory = category;

        // Update tabs active state
        tabs.forEach(t => {
          const isActive = t === tab;
          t.classList.toggle('active', isActive);
          t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        // Filter slides
        slides.forEach(slide => {
          const slideCategory = slide.getAttribute('data-category');
          if (currentCategory === 'all' || slideCategory === currentCategory) {
            slide.classList.remove('is-hidden');
          } else {
            slide.classList.add('is-hidden');
          }
        });

        currentIndex = 0;
        renderPagination();
        updateSlider(true);
        restartAutoplay();
      });
    });

    // Window resize handler (recalculate offsets & pagination)
    window.addEventListener('resize', function () {
      renderPagination();
      updateSlider(false);
    }, { passive: true });

    // Initial setup
    renderPagination();
    updateSlider(false);
    startAutoplay();
  }

  /**
   * ==========================================================================
   * CONTACT FORM EMAIL CONFIGURATION (Day 9 - Module 5)
   * Configurable submission bridge for future endpoint integration (FormSubmit,
   * EmailJS, or serverless webhook). Default provider is 'mailto' for safe,
   * transparent, frontend-only email client dispatch.
   * ==========================================================================
   */
  const CONTACT_EMAIL_CONFIG = {
    // Active provider: 'mailto' | 'formsubmit' | 'emailjs'
    provider: 'mailto',

    // Verified recipient public contact email
    recipientEmail: 'princeabood492@gmail.com',

    // Future direct API endpoint URL (leave empty for mailto fallback)
    endpointUrl: '',

    // Future EmailJS credentials (placeholders)
    emailJs: {
      serviceId: '',
      templateId: '',
      publicKey: ''
    }
  };

  /**
   * 20. Premium Contact Form Controller & Robust Validation (Day 9 - Modules 4, 5, 6)
   */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Form Inputs
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const serviceSelect = document.getElementById('contact-service');
    const budgetSelect = document.getElementById('contact-budget');
    const messageInput = document.getElementById('contact-message');
    const submitBtn = document.getElementById('contact-submit-btn');
    const charCounter = document.getElementById('message-char-count');

    // Error Spans
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const subjectError = document.getElementById('subject-error');
    const serviceError = document.getElementById('service-error');
    const messageError = document.getElementById('message-error');

    // Status Banners
    const mailtoBanner = document.getElementById('form-mailto-banner');
    const successBanner = document.getElementById('form-success-banner');
    const errorBanner = document.getElementById('form-error-banner');
    const errorMessageEl = document.getElementById('form-error-message');

    let isSubmitting = false;

    // Helper: set field error
    function setError(input, errorEl, message) {
      const group = input.closest('.form-group');
      if (group) group.classList.add('has-error');
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.hidden = false;
      }
    }

    // Helper: clear field error
    function clearError(input, errorEl) {
      const group = input.closest('.form-group');
      if (group) group.classList.remove('has-error');
      if (errorEl) {
        errorEl.textContent = '';
      }
    }

    // Validation: Full Name
    function validateName() {
      if (!nameInput) return true;
      const val = nameInput.value.trim();
      if (!val) {
        setError(nameInput, nameError, 'Full Name is required.');
        return false;
      }
      if (val.length < 2) {
        setError(nameInput, nameError, 'Please enter at least 2 characters for your name.');
        return false;
      }
      clearError(nameInput, nameError);
      return true;
    }

    // Validation: Email Address
    function validateEmail() {
      if (!emailInput) return true;
      const val = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!val) {
        setError(emailInput, emailError, 'Email Address is required.');
        return false;
      }
      if (!emailRegex.test(val)) {
        setError(emailInput, emailError, 'Please enter a valid email address (e.g. name@company.com).');
        return false;
      }
      clearError(emailInput, emailError);
      return true;
    }

    // Validation: Subject
    function validateSubject() {
      if (!subjectInput) return true;
      const val = subjectInput.value.trim();
      if (!val) {
        setError(subjectInput, subjectError, 'Subject is required.');
        return false;
      }
      if (val.length < 3) {
        setError(subjectInput, subjectError, 'Please enter at least 3 characters for the subject.');
        return false;
      }
      clearError(subjectInput, subjectError);
      return true;
    }

    // Validation: Service Interested In
    function validateService() {
      if (!serviceSelect) return true;
      const val = serviceSelect.value;
      if (!val) {
        setError(serviceSelect, serviceError, 'Please select a service.');
        return false;
      }
      clearError(serviceSelect, serviceError);
      return true;
    }

    // Validation: Message (Min length 10)
    function validateMessage() {
      if (!messageInput) return true;
      const val = messageInput.value.trim();
      if (!val) {
        setError(messageInput, messageError, 'Message is required.');
        return false;
      }
      if (val.length < 10) {
        setError(messageInput, messageError, `Please enter at least 10 characters (currently ${val.length}).`);
        return false;
      }
      clearError(messageInput, messageError);
      return true;
    }

    // Dynamic Character Counter for Message
    if (messageInput && charCounter) {
      messageInput.addEventListener('input', function () {
        const len = this.value.trim().length;
        if (len < 10) {
          charCounter.textContent = `${len}/10 characters min`;
          charCounter.style.color = len === 0 ? 'var(--color-secondary-text)' : '#DC2626';
        } else {
          charCounter.textContent = `${len} characters`;
          charCounter.style.color = '#10B981';
        }
      });
    }

    // Real-time error clearing on input/change
    if (nameInput) {
      nameInput.addEventListener('input', () => { if (nameInput.value.trim().length >= 2) clearError(nameInput, nameError); });
      nameInput.addEventListener('blur', validateName);
    }

    if (emailInput) {
      emailInput.addEventListener('input', () => {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) clearError(emailInput, emailError);
      });
      emailInput.addEventListener('blur', validateEmail);
    }

    if (subjectInput) {
      subjectInput.addEventListener('input', () => { if (subjectInput.value.trim().length >= 3) clearError(subjectInput, subjectError); });
      subjectInput.addEventListener('blur', validateSubject);
    }

    if (serviceSelect) {
      serviceSelect.addEventListener('change', () => { if (serviceSelect.value) clearError(serviceSelect, serviceError); });
      serviceSelect.addEventListener('blur', validateService);
    }

    if (messageInput) {
      messageInput.addEventListener('input', () => { if (messageInput.value.trim().length >= 10) clearError(messageInput, messageError); });
      messageInput.addEventListener('blur', validateMessage);
    }

    // Hide status banners
    function hideBanners() {
      if (mailtoBanner) mailtoBanner.hidden = true;
      if (successBanner) successBanner.hidden = true;
      if (errorBanner) errorBanner.hidden = true;
    }

    // Form Submission Handler
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      hideBanners();

      // Validate all required fields
      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isSubjectValid = validateSubject();
      const isServiceValid = validateService();
      const isMessageValid = validateMessage();

      const isFormValid = isNameValid && isEmailValid && isSubjectValid && isServiceValid && isMessageValid;

      if (!isFormValid) {
        if (errorBanner && errorMessageEl) {
          errorMessageEl.textContent = 'Please fill out all required fields marked with * before submitting.';
          errorBanner.hidden = false;
        }

        // Focus first invalid field
        if (!isNameValid && nameInput) nameInput.focus();
        else if (!isEmailValid && emailInput) emailInput.focus();
        else if (!isSubjectValid && subjectInput) subjectInput.focus();
        else if (!isServiceValid && serviceSelect) serviceSelect.focus();
        else if (!isMessageValid && messageInput) messageInput.focus();

        return;
      }

      // Prevent accidental repeated submission
      if (isSubmitting) return;
      isSubmitting = true;

      if (submitBtn) {
        submitBtn.classList.add('is-submitting');
        submitBtn.disabled = true;
      }

      const formData = {
        name: nameInput ? nameInput.value.trim() : '',
        email: emailInput ? emailInput.value.trim() : '',
        subject: subjectInput ? subjectInput.value.trim() : '',
        service: serviceSelect ? serviceSelect.value : '',
        budget: budgetSelect ? budgetSelect.value : 'Not specified',
        message: messageInput ? messageInput.value.trim() : ''
      };

      // 5. Configurable Email Integration Dispatcher
      const hasEndpoint = Boolean(CONTACT_EMAIL_CONFIG.endpointUrl && CONTACT_EMAIL_CONFIG.endpointUrl.trim());

      if (!hasEndpoint || CONTACT_EMAIL_CONFIG.provider === 'mailto') {
        // Safe, transparent mailto fallback (Module 5)
        setTimeout(() => {
          const mailtoSubject = encodeURIComponent(`[Website Inquiry] ${formData.subject}`);
          const mailtoBody = encodeURIComponent(
            `Hello Abdullah,

I am contacting you regarding ${formData.service}.

` +
            `---
` +
            `From: ${formData.name}
` +
            `Email: ${formData.email}
` +
            `Service: ${formData.service}
` +
            `Project Budget: ${formData.budget}

` +
            `Message:
${formData.message}

` +
            `---
Sent from abdullahmahmood.portfolio`
          );

          const mailtoUrl = `mailto:${CONTACT_EMAIL_CONFIG.recipientEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

          // Trigger email client
          window.location.href = mailtoUrl;

          // Display honest, transparent notice to visitor
          if (mailtoBanner) {
            mailtoBanner.hidden = false;
          }

          // Reset submit button state
          isSubmitting = false;
          if (submitBtn) {
            submitBtn.classList.remove('is-submitting');
            submitBtn.disabled = false;
          }
        }, 500);

      } else {
        // Direct Endpoint Fetch (FormSubmit / Webhook / EmailJS)
        fetch(CONTACT_EMAIL_CONFIG.endpointUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(formData)
        })
          .then(res => {
            if (res.ok) {
              if (successBanner) successBanner.hidden = false;
              form.reset();
              if (charCounter) charCounter.textContent = 'Min 10 characters';
            } else {
              throw new Error('Endpoint returned unsuccessful response');
            }
          })
          .catch(() => {
            if (errorBanner && errorMessageEl) {
              errorMessageEl.textContent = 'Unable to send directly at this moment. Please email princeabood492@gmail.com directly or try again.';
              errorBanner.hidden = false;
            }
          })
          .finally(() => {
            isSubmitting = false;
            if (submitBtn) {
              submitBtn.classList.remove('is-submitting');
              submitBtn.disabled = false;
            }
          });
      }
    });
  }

  /**
   * Initialize All Controllers when DOM is Ready
   */
  document.addEventListener('DOMContentLoaded', function () {
    initPageLoader();
    initScrollProgressAndBackToTop();
    initCustomCursor();
    initDecorativeParallax();
    initRoleTypingAnimation();
    initHero3DParallax();
    initMagneticButtons();
    initStatisticsCounter();
    initScrollObserver();
    initCvDownloadHandler();
    initImageFallback();
    initSkillsFilter();
    initSkillCard3DTilt();
    initServicesModal();
    initServiceCard3DTilt();
    initProjectsFilter();
    initProjectsModal();
    initProjectCard3DTilt();
    initExperienceCollapsibles();
    initTimelineProgress();
    initAchievementCounter();
    initJourneyCards3DTilt();
    initTestimonialsSlider();
    initContactForm();
  });

  // Re-evaluate parallax & card tilt on window resize
  window.addEventListener('resize', function () {
    initCustomCursor();
    initHero3DParallax();
    initMagneticButtons();
    initSkillCard3DTilt();
    initServiceCard3DTilt();
    initProjectCard3DTilt();
    initJourneyCards3DTilt();
  }, { passive: true });

})();
