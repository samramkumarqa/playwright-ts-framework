import { test, expect } from '../../src/fixtures';
import { users } from '../../src/data/users';

// These tests exercise the login form itself, so they start logged out.
test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('standard user can log in and out @smoke', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(users.standard);
    await inventoryPage.expectLoaded();

    await inventoryPage.header.logout();
    await loginPage.expectLoaded();
  });

  test('locked out user sees an error', async ({ loginPage, page }) => {
    await loginPage.login(users.lockedOut);
    await loginPage.expectError('Sorry, this user has been locked out.');
    await expect(page).toHaveURL(/\/$/);
  });

  test('invalid credentials are rejected', async ({ loginPage }) => {
    await loginPage.login(users.invalid);
    await loginPage.expectError('Username and password do not match any user in this service');
  });

  const missingFields = [
    { case: 'username', user: { username: '', password: 'secret_sauce' }, error: 'Username is required' },
    { case: 'password', user: { username: 'standard_user', password: '' }, error: 'Password is required' },
  ];

  for (const { case: field, user, error } of missingFields) {
    test(`missing ${field} shows a validation message`, async ({ loginPage }) => {
      await loginPage.login(user);
      await loginPage.expectError(error);
    });
  }

  test('protected pages redirect to login when signed out', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');
    await loginPage.expectError("You can only access '/inventory.html' when you are logged in.");
  });
});
