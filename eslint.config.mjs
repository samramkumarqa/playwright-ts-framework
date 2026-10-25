import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default tseslint.config(
  { ignores: ['node_modules', 'playwright-report', 'test-results', 'blob-report', '.auth'] },
  ...tseslint.configs.recommended,
  {
    files: ['tests/**/*.ts', 'examples/**/*.ts'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // Assertions live inside page-object methods such as expectLoaded().
      'playwright/expect-expect': ['warn', { assertFunctionPatterns: ['^expect', '\\.expect[A-Z]'] }],
      'playwright/no-wait-for-timeout': 'error',
      'playwright/no-force-option': 'error',
      'playwright/no-skipped-test': ['error', { allowConditional: true }],
    },
  },
  {
    rules: {
      '@typescript-eslint/no-floating-promises': 'off',
      'no-empty-pattern': 'off', // Playwright fixtures use `async ({}, use) => ...`
    },
  },
);
