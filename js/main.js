/**
 * ============================================================================
 * ABDULLAH MAHMOOD — PREMIUM PORTFOLIO
 * Main Navigation & Interaction Controller (Vanilla JavaScript)
 * ============================================================================
 */

(function () {
  'use strict';

  // DOM Elements Cache
  const header = document.getElementById('header');
  const navbar = document.getElementById('navbar');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileNavPanel = document.getElementById('mobile-nav-panel');
  const mobileNavBackdrop = document.getElementById('mobile-nav-backdrop');
  const mobileNavClose = document.getElementById('mobile-nav-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav__link');
  const desktopNavLinks = document.querySelectorAll('.navbar__link');
  const allNavAnchors = document.querySelectorAll('a[href^="#"]');

  /**
   * Sticky & Compact Navbar Behavior on Scroll
   */
  const SCROLL_THRESHOLD = 20;

  function handleNavbarScroll() {
    if (!header) return;
    
    if (window.scrollY > SCROLL_THRESHOLD) {
      if (!header.classList.contains('is-scrolled')) {
        header.classList.add('is-scrolled');
      }
    } else {
      if (header.classList.contains('is-scrolled')) {
        header.classList.remove('is-scrolled');
      }
    }
  }

  // Throttle helper for scroll performance
  let isScrolling = false;
  window.addEventListener('scroll', function () {
    if (!isScrolling) {
      isScrolling = true;
      window.requestAnimationFrame(function () {
        handleNavbarScroll();
        updateActiveNavOnScroll();
        isScrolling = false;
      });
    }
  }, { passive: true });

  /**
   * Mobile Drawer Toggle and Management
   */
  let isMenuOpen = false;

  function openMobileMenu() {
    if (isMenuOpen || !mobileNavPanel || !hamburgerBtn) return;
    isMenuOpen = true;

    hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobileNavPanel.setAttribute('aria-hidden', 'false');
    mobileNavPanel.classList.add('is-open');
    document.body.classList.add('nav-open');

    // Focus the first navigation link for accessibility
    const firstLink = mobileNavPanel.querySelector('.mobile-nav__link');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 250);
    }
  }

  function closeMobileMenu() {
    if (!isMenuOpen || !mobileNavPanel || !hamburgerBtn) return;
    isMenuOpen = false;

    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileNavPanel.setAttribute('aria-hidden', 'true');
    mobileNavPanel.classList.remove('is-open');
    document.body.classList.remove('nav-open');

    // Return focus to hamburger toggle
    hamburgerBtn.focus();
  }

  function toggleMobileMenu() {
    if (isMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  // Event Listeners for Mobile Navigation
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', function () {
      closeMobileMenu();
    });
  }

  // Close when clicking the semi-transparent backdrop
  if (mobileNavBackdrop) {
    mobileNavBackdrop.addEventListener('click', function () {
      closeMobileMenu();
    });
  }

  // Close when clicking outside of the drawer
  document.addEventListener('click', function (e) {
    if (isMenuOpen && mobileNavPanel && !mobileNavPanel.contains(e.target) && e.target !== hamburgerBtn) {
      closeMobileMenu();
    }
  });

  // Close when pressing the Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isMenuOpen) {
      closeMobileMenu();
    }
  });

  // Close when clicking any mobile navigation link
  mobileNavLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeMobileMenu();
      setActiveLink(this.getAttribute('data-nav'));
    });
  });

  // Desktop navigation click listener
  desktopNavLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      setActiveLink(this.getAttribute('data-nav'));
    });
  });

  /**
   * Set Active State for Nav Links
   */
  function setActiveLink(navId) {
    if (!navId) return;

    desktopNavLinks.forEach(function (el) {
      if (el.getAttribute('data-nav') === navId) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    mobileNavLinks.forEach(function (el) {
      if (el.getAttribute('data-nav') === navId) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
  }

  /**
   * Scrollspy: Dynamically update active nav item as user scrolls
   */
  const sections = document.querySelectorAll('section[id], div[id].scroll-tester__marker');

  function updateActiveNavOnScroll() {
    const scrollPosition = window.scrollY + 120;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight || 100;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        setActiveLink(sectionId);
      }
    });
  }

  /**
   * Smooth Scrolling for Anchor Links with Header Offset
   */
  allNavAnchors.forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#home') {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        setActiveLink('home');
        return;
      }

      if (href.startsWith('#')) {
        const targetElement = document.querySelector(href);
        if (targetElement) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  /**
   * Initial Setup on DOM Ready
   */
  document.addEventListener('DOMContentLoaded', function () {
    handleNavbarScroll();
  });

})();
