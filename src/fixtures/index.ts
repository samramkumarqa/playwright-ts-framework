import { test as base, expect, request as playwrightRequest } from '@playwright/test';
import { env } from '../config/env';
import { UsersClient } from '../api/clients/UsersClient';
import { CartPage, CheckoutPage, InventoryPage, LoginPage } from '../pages';

/**
 * Custom fixtures: tests ask for what they need by name and get a ready object,
 * with no setup or teardown code inside the test itself.
 */
interface PageFixtures {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
}

interface ApiFixtures {
  /** Unauthenticated client for public reads. */
  publicUsersApi: UsersClient;
  /** Authenticated client for writes. Skips the test when GOREST_TOKEN is not set. */
  usersApi: UsersClient;
  /** Register a user id here and it is deleted after the test, even if the test fails. */
  cleanupUserIds: number[];
}

export const test = base.extend<PageFixtures & ApiFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  publicUsersApi: async ({}, use) => {
    const context = await playwrightRequest.newContext({
      baseURL: env.apiBaseUrl,
      extraHTTPHeaders: { Accept: 'application/json' },
    });
    await use(new UsersClient(context));
    await context.dispose();
  },

  usersApi: async ({}, use, testInfo) => {
    testInfo.skip(!env.goRestToken, 'GOREST_TOKEN is not set; skipping write test');
    const context = await playwrightRequest.newContext({
      baseURL: env.apiBaseUrl,
      extraHTTPHeaders: {
        Accept: 'application/json',
        Authorization: `Bearer ${env.goRestToken}`,
      },
    });
    await use(new UsersClient(context));
    await context.dispose();
  },

  cleanupUserIds: async ({ usersApi }, use) => {
    const ids: number[] = [];
    await use(ids);
    for (const id of ids) {
      await usersApi.delete(id); // 204 or 404 are both fine here
    }
  },
});

export { expect };
