import fs from 'fs';

const animPath = 'c:/Users/princ/OneDrive/Desktop/portfolio/abdullah-portfolio/js/animations.js';
let code = fs.readFileSync(animPath, 'utf8');

// Replace card.forEach blocks in tilt functions
const oldCardPattern = `    cards.forEach(card => {
      card.addEventListener('mousemove', function (e) {`;

const newCardReplacement = `    cards.forEach(card => {
      if (card.dataset.tiltBound === 'true') return;
      card.dataset.tiltBound = 'true';

      card.addEventListener('mouseenter', function () {
        card.style.transition = 'none';
      });

      card.addEventListener('mousemove', function (e) {`;

code = code.replaceAll(oldCardPattern, newCardReplacement);

const oldLeavePattern = `      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });`;

const newLeaveReplacement = `      card.addEventListener('mouseleave', function () {
        card.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.transform = '';
        setTimeout(() => {
          card.style.transition = '';
        }, 450);
      });`;

code = code.replaceAll(oldLeavePattern, newLeaveReplacement);

fs.writeFileSync(animPath, code, 'utf8');
console.log('✓ Updated 3D tilt functions with smooth transitions and duplicate listener protection');
