import fs from 'fs';

const animPath = 'c:/Users/princ/OneDrive/Desktop/portfolio/abdullah-portfolio/css/animations.css';
let animCss = fs.readFileSync(animPath, 'utf8');

const day10Keyframes = `
/* Day 10 Loader Keyframes */
@keyframes loaderRingSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes loaderLetterIn {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Day 10 Advanced Scroll Reveal Variants */
.reveal--fade-down {
  transform: translateY(-24px);
}
.reveal--fade-down.is-revealed {
  transform: translateY(0);
}

.reveal--fade-left {
  transform: translateX(-30px);
}
.reveal--fade-left.is-revealed {
  transform: translateX(0);
}

.reveal--fade-right {
  transform: translateX(30px);
}
.reveal--fade-right.is-revealed {
  transform: translateX(0);
}

.reveal--scale {
  transform: scale(0.92) translateY(12px);
}
.reveal--scale.is-revealed {
  transform: scale(1) translateY(0);
}

.reveal--text {
  transform: translateY(14px);
  filter: blur(3px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.8s cubic-bezier(0.16, 1, 0.3, 1),
              filter 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal--text.is-revealed {
  transform: translateY(0);
  filter: blur(0);
}
`;

// Insert day10Keyframes right above the reduced-motion block if not already there
if (!animCss.includes('Day 10 Loader Keyframes')) {
  const reducedMotionTarget = '/* --------------------------------------------------------------------------\n   3. Accessibility: Reduced Motion Support';
  if (animCss.includes(reducedMotionTarget)) {
    animCss = animCss.replace(reducedMotionTarget, day10Keyframes + '\n' + reducedMotionTarget);
    console.log('✓ Added Day 10 keyframes and reveal classes to animations.css');
  } else {
    animCss += '\n' + day10Keyframes;
    console.log('✓ Appended Day 10 keyframes to animations.css');
  }
}

// Ensure reduced motion block contains Day 10 elements
if (!animCss.includes('.page-loader__ring,')) {
  animCss = animCss.replace(
    '.status-dot {',
    '.status-dot,\n  .page-loader,\n  .page-loader__ring,\n  .page-loader__bar,\n  .loader-letter,\n  .custom-cursor,\n  .custom-cursor__dot,\n  .custom-cursor__ring,\n  .back-to-top {'
  );

  animCss = animCss.replace(
    '.reveal-item {',
    '.reveal-item,\n  .reveal--fade-down,\n  .reveal--fade-left,\n  .reveal--fade-right,\n  .reveal--scale,\n  .reveal--text {'
  );

  console.log('✓ Updated prefers-reduced-motion block for Day 10 elements');
}

fs.writeFileSync(animPath, animCss, 'utf8');
console.log('✓ animations.css updated successfully');
