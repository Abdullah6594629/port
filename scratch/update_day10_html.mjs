import fs from 'fs';

const filePath = 'c:/Users/princ/OneDrive/Desktop/portfolio/abdullah-portfolio/index.html';
let html = fs.readFileSync(filePath, 'utf8');

// 1. Add Scroll Progress Bar & Page Loader after <body> and skip-to-content
const loaderSnippet = `
  <!-- Module 7: Scroll Progress Indicator -->
  <div class="scroll-progress-bar" id="scroll-progress-bar" role="progressbar" aria-label="Page reading progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"></div>

  <!-- Module 1: Premium Page Loader -->
  <div class="page-loader" id="page-loader" role="status" aria-label="Loading Abdullah Mahmood Malik portfolio" aria-live="polite">
    <div class="page-loader__content">
      <div class="page-loader__logo">
        <span class="page-loader__monogram">A</span>
        <div class="page-loader__ring" aria-hidden="true"></div>
      </div>
      <div class="page-loader__brand" aria-label="Abdullah">
        <span class="loader-letter" style="--i:0">A</span>
        <span class="loader-letter" style="--i:1">B</span>
        <span class="loader-letter" style="--i:2">D</span>
        <span class="loader-letter" style="--i:3">U</span>
        <span class="loader-letter" style="--i:4">L</span>
        <span class="loader-letter" style="--i:5">L</span>
        <span class="loader-letter" style="--i:6">A</span>
        <span class="loader-letter" style="--i:7">H</span>
      </div>
      <p class="page-loader__tagline">Full Stack Developer &amp; Digital Marketer</p>
      <div class="page-loader__track" aria-hidden="true">
        <div class="page-loader__bar" id="loader-progress-bar"></div>
      </div>
    </div>
  </div>
`;

if (!html.includes('id="page-loader"')) {
  const target = '<a href="#main-content" class="skip-to-content">Skip to main content</a>';
  if (html.includes(target)) {
    html = html.replace(target, target + '\n' + loaderSnippet);
    console.log('✓ Injected Scroll Progress Bar & Page Loader');
  } else {
    console.error('✗ Failed to find skip-to-content anchor in index.html');
  }
}

// 2. Add Back to Top Button and Custom Cursor before scripts
const cursorSnippet = `
  <!-- Module 8: Back to Top Button -->
  <button type="button" class="back-to-top" id="back-to-top" aria-label="Back to top of page" title="Back to top">
    <i class="fa-solid fa-arrow-up" aria-hidden="true"></i>
    <span class="sr-only">Back to top</span>
  </button>

  <!-- Module 4: Custom Cursor (Desktop Only) -->
  <div class="custom-cursor" id="custom-cursor" aria-hidden="true">
    <div class="custom-cursor__dot" id="cursor-dot"></div>
    <div class="custom-cursor__ring" id="cursor-ring"></div>
  </div>
`;

if (!html.includes('id="back-to-top"')) {
  const targetScript = '<!-- Scripts -->\n  <script src="js/animations.js"></script>';
  if (html.includes(targetScript)) {
    html = html.replace(targetScript, cursorSnippet + '\n  ' + targetScript);
    console.log('✓ Injected Back to Top Button & Custom Cursor');
  } else {
    console.error('✗ Failed to find targetScript in index.html');
  }
}

// 3. Add explicit dimensions and decoding="async" to images for CLS / performance
html = html.replace(
  'class="hero-visual__img" \n                    id="profile-img"\n                    loading="eager"',
  'class="hero-visual__img" \n                    id="profile-img"\n                    width="480"\n                    height="540"\n                    loading="eager"'
);

html = html.replace(
  'class="about-visual__img" \n                    id="about-profile-img"\n                    loading="lazy"',
  'class="about-visual__img" \n                    id="about-profile-img"\n                    width="480"\n                    height="540"\n                    loading="lazy"\n                    decoding="async"'
);

// Add width/height/decoding to project preview images (project-01 to project-08)
for (let i = 1; i <= 8; i++) {
  const num = String(i).padStart(2, '0');
  const targetImg = `src="assets/images/projects/project-${num}.jpg" \n                  alt="`;
  if (html.includes(targetImg)) {
    // Only replace if width isn't already added
    const searchBlock = `src="assets/images/projects/project-${num}.jpg"`;
    const snippetOld = `src="assets/images/projects/project-${num}.jpg" \n                  alt=`;
    const snippetNew = `src="assets/images/projects/project-${num}.jpg" \n                  width="600"\n                  height="375"\n                  decoding="async"\n                  alt=`;
    if (!html.includes(`src="assets/images/projects/project-${num}.jpg" \n                  width="600"`)) {
      html = html.replace(snippetOld, snippetNew);
    }
  }
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('✓ index.html updated successfully');
