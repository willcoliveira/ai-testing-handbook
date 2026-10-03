import { defineConfig, devices } from '@playwright/test';
import { loadEnvFile } from 'node:process';

// Adapted from willcoliveira/playwright-ts-template. Browser tests for the built book
// (`npm run docs:build` first); the static gates live in tests/site/unit and post-build.mjs.

// Load a local .env when present (Node >= 22 built-in, no dotenv dependency).
// CI injects its variables directly, so a missing file is not an error.
try {
  loadEnvFile();
} catch {
  /* no .env — fall through to process.env / defaults */
}

const isCI = !!process.env.CI;
const LOCAL_URL = 'http://localhost:4173/ai-testing-handbook/';
// '||' on purpose: CI passes an unset repository variable as an empty string.
const baseURL = process.env.BASE_URL || LOCAL_URL;

export default defineConfig({
  testDir: './tests/site/e2e',
  outputDir: './test-results',

  // Each test file runs in parallel; tests inside a file too.
  fullyParallel: true,
  // A stray test.only never gets merged.
  forbidOnly: isCI,
  // Retry on CI only; a retry writes a trace (see use.trace).
  retries: isCI ? 2 : 0,
  // CI runners are small.
  workers: isCI ? 2 : undefined,

  timeout: 30_000,
  expect: {
    timeout: 5_000,
    // Visual spec (tests/site/e2e/visual.spec.ts): element shots, so a small absolute pixel budget
    // (a ratio over a big element could hide a missing rule or a 1px shift), CSS pixels on every
    // device, no animations or caret.
    toHaveScreenshot: { maxDiffPixels: 50, animations: 'disabled', caret: 'hide', scale: 'css' },
  },

  // CI: line output, GitHub annotations and an HTML report uploaded as an artifact on failure.
  // Local: line output + an HTML report that only opens when something failed.
  reporter: isCI ? [['list'], ['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'on-failure' }]],

  use: {
    baseURL,
    // CI: only on the first retry; locally every failure leaves a trace to open.
    trace: isCI ? 'on-first-retry' : 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    testIdAttribute: 'data-testid',
  },

  // PR set: chromium + mobile-chrome (`npm run test:e2e`).
  // Full set: all four, plus the every-page sweep tagged @full (`npm run test:e2e:full`, main and weekly).
  // Visual set: the @visual spec on chromium, tablet and mobile-chrome against a SITE_TEST=1 build
  // (`npm run test:visual`, Linux baselines from tests/site/Dockerfile); the other runs grep it out.
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
    { name: 'tablet', use: { ...devices['Desktop Chrome'], viewport: { width: 820, height: 1180 } } },
    // no WebKit baselines: the visual spec never runs here
    { name: 'mobile-safari', use: { ...devices['iPhone 15'] }, testIgnore: /visual\.spec\.ts$/ },
  ],

  // The built site, served as GitHub Pages will serve it. Skipped when BASE_URL points elsewhere
  // (a manually started preview on another port, or the deployed site).
  webServer:
    baseURL === LOCAL_URL
      ? {
          command: 'npm run docs:preview -- --port 4173',
          url: LOCAL_URL,
          reuseExistingServer: !isCI,
          timeout: 120_000,
        }
      : undefined,
});
