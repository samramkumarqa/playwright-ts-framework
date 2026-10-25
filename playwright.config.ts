import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/env';

export { STORAGE_STATE } from './src/config/paths';

export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 7_000 },

  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }], ['junit', { outputFile: 'test-results/junit.xml' }]]
    : [['list'], ['html', { open: 'on-failure' }]],

  use: {
    baseURL: env.baseUrl,
    headless: env.headless,
    testIdAttribute: 'data-test',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
  },

  projects: [
    // Logs in once and saves the session, so UI specs start already authenticated.
    {
      name: 'setup',
      testMatch: 'tests/setup/*.setup.ts',
    },
    {
      name: 'chromium',
      testMatch: 'tests/ui/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      testMatch: 'tests/ui/**/*.spec.ts',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      testMatch: 'tests/ui/**/*.spec.ts',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
    },
    // API tests need no browser at all.
    {
      name: 'api',
      testMatch: 'tests/api/**/*.spec.ts',
      use: { baseURL: env.apiBaseUrl },
    },
    // Standalone feature demos (frames, dialogs, uploads...). Not part of the default run.
    {
      name: 'examples',
      testMatch: 'examples/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'], baseURL: env.examplesBaseUrl },
    },
  ],
});
