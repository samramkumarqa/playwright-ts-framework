# Playwright TypeScript Framework

[![Playwright Tests](https://github.com/samramkumarqa/playwright-ts-framework/actions/workflows/playwright.yml/badge.svg)](https://github.com/samramkumarqa/playwright-ts-framework/actions/workflows/playwright.yml)

UI and API test automation in one suite, built with **Playwright Test** and **TypeScript**.

- **UI:** Page Object Model against [SauceDemo](https://www.saucedemo.com): login, product sorting, cart, and full checkout.
- **API:** REST tests against [GoRest](https://gorest.co.in): GET, POST, PUT, PATCH and DELETE, plus negative and auth cases.
- **Examples:** Standalone demos of frames, dialogs, uploads, downloads, new tabs, shadow DOM, basic auth and locator strategies.

## Highlights

| Area               | What it shows                                                                                   |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| Page Object Model  | Typed page classes built on `Locator`s, plus a reusable header component                        |
| Custom fixtures    | Tests receive `loginPage`, `inventoryPage`, `usersApi`… by name, with no setup code in the test |
| Login once         | A setup project saves the session; UI specs reuse it through `storageState`                     |
| Stable locators    | `getByRole`, `getByLabel` and `getByTestId`; no XPath, no `sleep`                               |
| API layer          | `UsersClient` wrapper, typed models, Faker data factory, contract checks                        |
| Self-cleaning data | Users created in API tests are deleted afterwards, even when a test fails                       |
| Secrets            | Read from environment variables; nothing sensitive is committed                                 |
| Cross-browser      | Chromium, Firefox and WebKit projects                                                           |
| CI                 | GitHub Actions: lint, typecheck, tests, and HTML report artifacts; nightly cross-browser run    |
| Debugging          | Trace, screenshot and video kept on failure                                                     |

## Project structure

```
├── playwright.config.ts        # projects: setup, chromium, firefox, webkit, api, examples
├── src/
│   ├── config/                 # env handling, storage-state path
│   ├── data/                   # UI users and product catalogue
│   ├── pages/                  # page objects + components/
│   ├── api/
│   │   ├── clients/            # UsersClient (GET/POST/PUT/PATCH/DELETE)
│   │   ├── models/             # User types + runtime contract check
│   │   └── factories/          # buildUser() test data
│   └── fixtures/               # custom test fixtures (pages + API clients)
├── tests/
│   ├── setup/                  # one-time login
│   ├── ui/                     # login, inventory, checkout
│   └── api/                    # read + CRUD/negative tests
├── examples/                   # Playwright feature demos
└── .github/workflows/          # CI pipeline
```

## Getting started

Requires Node.js 20 or newer.

```bash
npm ci
npx playwright install
cp .env.example .env          # optional: add GOREST_TOKEN for API write tests
npm test                      # Chromium UI + API
```

API write tests need a free GoRest token from https://gorest.co.in/consumer/login. Without one, those tests are **skipped** and everything else still runs.

## Commands

| Command                              | Runs                                     |
| ------------------------------------ | ---------------------------------------- |
| `npm test`                           | UI tests in Chromium plus API tests      |
| `npm run test:ui`                    | UI tests only                            |
| `npm run test:api`                   | API tests only                           |
| `npm run test:smoke`                 | Tests tagged `@smoke`                    |
| `npm run test:all-browsers`          | UI tests in Chromium, Firefox and WebKit |
| `npm run test:examples`              | Feature demos                            |
| `npm run test:headed`                | UI tests with a visible browser          |
| `npm run report`                     | Open the last HTML report                |
| `npm run lint` / `npm run typecheck` | Static checks                            |

Debug a single test in UI mode with `npx playwright test --ui`.

## Configuration

| Variable       | Default                     | Purpose                             |
| -------------- | --------------------------- | ----------------------------------- |
| `GOREST_TOKEN` | _(none)_                    | Bearer token for API write tests    |
| `BASE_URL`     | `https://www.saucedemo.com` | UI under test                       |
| `API_BASE_URL` | `https://gorest.co.in`      | API under test                      |
| `HEADLESS`     | `true`                      | Set `false` to watch the browser    |
| `UI_PASSWORD`  | `secret_sauce`              | SauceDemo's published demo password |

In CI, add `GOREST_TOKEN` under **Settings → Secrets and variables → Actions**.

## Writing a test

```ts
import { test, expect } from '../../src/fixtures';
import { products } from '../../src/data/users';
import { STORAGE_STATE } from '../../src/config/paths';

test.use({ storageState: STORAGE_STATE }); // start logged in

test('adds a product to the cart', async ({ inventoryPage }) => {
  await inventoryPage.goto();
  await inventoryPage.addToCart(products.backpack);
  await inventoryPage.header.expectCartCount(1);
});
```
