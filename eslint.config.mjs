// Adapted from willcoliveira/playwright-ts-template. Lints the browser tests only: the site code,
// repository scripts, unit tests and .claude are plain .mjs checked by their own gates.
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

const TS = ['tests/site/**/*.ts', 'playwright.config.ts'];

export default tseslint.config(
  {
    ignores: ['**/*', '!tests/', '!tests/site/', '!tests/site/**/', ...TS.map((p) => `!${p}`)],
  },
  { files: TS, ...eslint.configs.recommended },
  ...tseslint.configs.recommended.map((c) => ({ ...c, files: TS })),
  {
    // Page objects carry actions and assertions too — same rules apply.
    files: ['tests/site/**/*.ts'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // Assertion helpers on page objects are named expect…; keep the rule live.
      'playwright/expect-expect': ['error', { assertFunctionPatterns: ['^expect'] }],
      // test.skip(condition, reason) is allowed by the skill's conventions; a bare skip is not.
      'playwright/no-skipped-test': ['warn', { allowConditional: true }],
    },
  },
);
