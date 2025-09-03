/**
 * Accessibility validation checklist and testing utilities
 * For integration with testing frameworks like Jest/Vitest
 */

export const ACCESSIBILITY_VALIDATION_CHECKLIST = [
  'Skip link present in DOM (.skip-link)',
  'Proper heading hierarchy (exactly one H1)',
  'Main landmark with id="main-content"',
  'Language attribute on html element (lang="en")',
  'Page title present and meaningful',
  'Focus indicators for all interactive elements',
  'ARIA labels on all form controls',
  'Alt text on all images',
  'Color contrast ratios meet WCAG AA (4.5:1)',
  'Keyboard navigation works for all interactive elements',
]

// Manual testing checklist
export const MANUAL_TESTING_CHECKLIST = [
  'Test keyboard navigation (Tab, Shift+Tab)',
  'Test screen reader compatibility (NVDA/JAWS)',
  'Verify color contrast ratios (4.5:1 for normal text)',
  'Test with browser zoom at 200%',
  'Verify all interactive elements have focus indicators',
  'Test dark mode accessibility',
  'Validate error page accessibility',
  'Check mobile accessibility (touch targets 44x44px)',
]

// Cross-browser testing checklist
export const BROWSER_TESTING_CHECKLIST = [
  'Chrome (latest)',
  'Firefox (latest)',
  'Safari 15+',
  'Edge (latest)',
  'iOS Safari (iPhone 12+)',
  'Android Chrome (Pixel 5+)',
  'iPad Safari',
]

// Responsive breakpoints to test
export const RESPONSIVE_BREAKPOINTS = [
  { name: 'Mobile Portrait', width: 320, height: 568 },
  { name: 'Mobile Landscape', width: 568, height: 320 },
  { name: 'Tablet Portrait', width: 768, height: 1024 },
  { name: 'Tablet Landscape', width: 1024, height: 768 },
  { name: 'Desktop Small', width: 1200, height: 800 },
  { name: 'Desktop Large', width: 1920, height: 1080 },
]