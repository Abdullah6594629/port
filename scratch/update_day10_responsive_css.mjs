import fs from 'fs';

const respPath = 'c:/Users/princ/OneDrive/Desktop/portfolio/abdullah-portfolio/css/responsive.css';
let respCss = fs.readFileSync(respPath, 'utf8');

const day10Responsive = `
/* ==========================================================================
   DAY 10 RESPONSIVE ENHANCEMENTS
   ========================================================================== */
@media (max-width: 991px) {
  /* Disable custom cursor explicitly on touch and tablet viewports */
  .custom-cursor {
    display: none !important;
  }
}

@media (max-width: 768px) {
  /* Compact Back to Top Button on Mobile */
  .back-to-top {
    bottom: 1.25rem;
    right: 1.25rem;
    width: 42px;
    height: 42px;
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .page-loader__content {
    padding: 1.5rem 1rem;
    max-width: 320px;
  }

  .page-loader__logo {
    width: 52px;
    height: 52px;
    margin-bottom: 1rem;
  }

  .page-loader__monogram {
    font-size: 1.5rem;
  }

  .page-loader__brand {
    font-size: 1.05rem;
    letter-spacing: 0.2em;
  }

  .page-loader__tagline {
    font-size: 0.75rem;
  }
}
`;

if (!respCss.includes('DAY 10 RESPONSIVE ENHANCEMENTS')) {
  respCss += '\n' + day10Responsive;
  fs.writeFileSync(respPath, respCss, 'utf8');
  console.log('✓ Added Day 10 responsive rules to responsive.css');
} else {
  console.log('Day 10 responsive rules already present in responsive.css');
}
