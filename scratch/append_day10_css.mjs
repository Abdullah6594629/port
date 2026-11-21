import fs from 'fs';

const stylePath = 'c:/Users/princ/OneDrive/Desktop/portfolio/abdullah-portfolio/css/style.css';
let styleCss = fs.readFileSync(stylePath, 'utf8');

const section17 = `
/* ==========================================================================
   SECTION 17: DAY 10 ADVANCED POLISH & MICRO-INTERACTIONS
   - Scroll Progress Indicator
   - Premium Page Preloader
   - Back to Top Button
   - Custom Desktop Cursor
   - Visual Polish Enhancements
   ========================================================================== */

/* 17.1 Scroll Progress Bar */
.scroll-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 0%;
  height: 3px;
  background: linear-gradient(90deg, var(--color-accent) 0%, #3B82F6 100%);
  z-index: 100005;
  pointer-events: none;
  transition: width 0.08s ease-out;
  box-shadow: 0 0 10px rgba(37, 99, 235, 0.4);
}

/* 17.2 Premium Page Preloader */
.page-loader {
  position: fixed;
  inset: 0;
  background-color: var(--color-bg);
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  visibility: visible;
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1),
              visibility 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.page-loader.is-hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.page-loader__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 380px;
  padding: 2rem;
}

.page-loader__logo {
  position: relative;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
}

.page-loader__monogram {
  font-family: var(--font-primary);
  font-size: 1.75rem;
  font-weight: var(--fw-extrabold);
  color: var(--color-primary-text);
  letter-spacing: -0.04em;
  z-index: 2;
}

.page-loader__ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px dashed var(--color-accent);
  opacity: 0.6;
  animation: loaderRingSpin 6s linear infinite;
}

.page-loader__brand {
  display: flex;
  gap: 0.2rem;
  margin-bottom: 0.5rem;
  letter-spacing: 0.25em;
  font-family: var(--font-primary);
  font-weight: var(--fw-extrabold);
  font-size: 1.2rem;
  color: var(--color-primary-text);
}

.loader-letter {
  display: inline-block;
  opacity: 0;
  transform: translateY(8px);
  animation: loaderLetterIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: calc(var(--i) * 0.05s + 0.1s);
}

.page-loader__tagline {
  font-size: 0.8rem;
  color: var(--color-secondary-text);
  letter-spacing: 0.06em;
  margin-bottom: 1.5rem;
  font-weight: var(--fw-medium);
}

.page-loader__track {
  width: 140px;
  height: 2px;
  background-color: var(--color-border);
  border-radius: 999px;
  overflow: hidden;
  position: relative;
}

.page-loader__bar {
  width: 0%;
  height: 100%;
  background-color: var(--color-accent);
  border-radius: 999px;
  transition: width 0.3s ease-out;
}

/* 17.3 Back to Top Button */
.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background-color: var(--color-bg);
  color: var(--color-primary-text);
  border: 1px solid var(--color-border);
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  cursor: pointer;
  z-index: 950;
  opacity: 0;
  visibility: hidden;
  transform: translateY(16px);
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              visibility 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              background-color 0.2s ease,
              color 0.2s ease,
              border-color 0.2s ease,
              box-shadow 0.2s ease;
}

.back-to-top.is-visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.back-to-top:hover {
  background-color: var(--color-accent);
  color: #FFFFFF;
  border-color: var(--color-accent);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.25);
  transform: translateY(-3px);
}

.back-to-top:active {
  transform: translateY(0);
}

.back-to-top:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}

/* 17.4 Custom Cursor (Desktop Only) */
.custom-cursor {
  display: none;
}

@media (hover: hover) and (pointer: fine) and (min-width: 992px) {
  body.custom-cursor-active .custom-cursor {
    display: block;
    pointer-events: none;
  }

  body.custom-cursor-active {
    cursor: none;
  }

  body.custom-cursor-active a,
  body.custom-cursor-active button,
  body.custom-cursor-active input,
  body.custom-cursor-active select,
  body.custom-cursor-active textarea,
  body.custom-cursor-active [role="button"],
  body.custom-cursor-active .interactive {
    cursor: none;
  }
}

.custom-cursor__dot {
  position: fixed;
  top: 0;
  left: 0;
  width: 6px;
  height: 6px;
  background-color: var(--color-accent);
  border-radius: 50%;
  pointer-events: none;
  z-index: 1000000;
  transform: translate(-50%, -50%);
  transition: opacity 0.2s ease, transform 0.15s ease;
  opacity: 0;
}

.custom-cursor__ring {
  position: fixed;
  top: 0;
  left: 0;
  width: 32px;
  height: 32px;
  border: 1.5px solid rgba(37, 99, 235, 0.45);
  background: rgba(37, 99, 235, 0.03);
  border-radius: 50%;
  pointer-events: none;
  z-index: 999999;
  transform: translate(-50%, -50%);
  transition: width 0.25s cubic-bezier(0.16, 1, 0.3, 1),
              height 0.25s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.25s ease,
              background-color 0.25s ease,
              opacity 0.2s ease;
  opacity: 0;
}

.custom-cursor.is-visible .custom-cursor__dot,
.custom-cursor.is-visible .custom-cursor__ring {
  opacity: 1;
}

.custom-cursor.is-hovering .custom-cursor__ring {
  width: 52px;
  height: 52px;
  border-color: var(--color-accent);
  background: rgba(37, 99, 235, 0.08);
}

.custom-cursor.is-hovering .custom-cursor__dot {
  transform: translate(-50%, -50%) scale(1.4);
}

/* 17.5 Subtle Card & Typography Polish */
.skill-card,
.service-card,
.project-card,
.achievement-card,
.testimonial-card,
.contact-card,
.education-card,
.cert-card {
  will-change: transform;
  transform-style: preserve-3d;
}

.btn-magnetic {
  will-change: transform;
}
`;

if (!styleCss.includes('SECTION 17: DAY 10 ADVANCED POLISH')) {
  styleCss += '\n' + section17;
  fs.writeFileSync(stylePath, styleCss, 'utf8');
  console.log('✓ Section 17 added to style.css');
} else {
  console.log('Section 17 already present in style.css');
}
