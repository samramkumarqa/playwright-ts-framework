import 'dotenv/config';

/**
 * Single place where runtime configuration is read.
 * Values come from environment variables (or a local .env file, never committed).
 * Secrets have no defaults; public demo values do.
 */
function bool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === '') return fallback;
  return ['1', 'true', 'yes'].includes(value.toLowerCase());
}

export const env = {
  /** UI application under test. */
  baseUrl: process.env.BASE_URL ?? 'https://www.saucedemo.com',

  /** REST API under test. */
  apiBaseUrl: process.env.API_BASE_URL ?? 'https://gorest.co.in',

  /** Site used by the standalone feature examples. */
  examplesBaseUrl: process.env.EXAMPLES_BASE_URL ?? 'https://the-internet.herokuapp.com',

  /** Headless by default so the suite runs the same locally and in CI. Set HEADLESS=false to watch. */
  headless: bool(process.env.HEADLESS, true),

  /**
   * SauceDemo's credentials are printed on its own login page, so they are safe defaults.
   * Override them for any real application.
   */
  uiPassword: process.env.UI_PASSWORD ?? 'secret_sauce',

  /** GoRest write token. Required for POST/PUT/DELETE tests; they are skipped when it is missing. */
  goRestToken: process.env.GOREST_TOKEN ?? '',
} as const;
