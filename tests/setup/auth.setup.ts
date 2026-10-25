import { test as setup } from '../../src/fixtures';
import { users } from '../../src/data/users';
import { STORAGE_STATE } from '../../src/config/paths';

/**
 * Logs in once per run and stores the session.
 * UI specs reuse it via `test.use({ storageState })`, so they skip the login form.
 */
setup('authenticate as standard user', async ({ page, loginPage, inventoryPage }) => {
  await loginPage.goto();
  await loginPage.login(users.standard);
  await inventoryPage.expectLoaded();
  await page.context().storageState({ path: STORAGE_STATE });
});
