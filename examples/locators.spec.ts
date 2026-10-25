import { test, expect } from '@playwright/test';

/**
 * Locator strategies, from most to least preferred.
 * User-facing locators (role, label, text) survive markup changes far better than CSS or XPath.
 */
test.describe('Locator strategies', () => {
  test('role, label and text locators', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Username').fill('tomsmith');
    await page.getByLabel('Password').fill('SuperSecretPassword!'); // published on the demo page
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('You logged into a secure area!')).toBeVisible();
  });

  test('filtering, nth and counting a list', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('#content ul li a');
    await expect(links).not.toHaveCount(0);
    await expect(links.filter({ hasText: 'Checkboxes' })).toHaveCount(1);
    await expect(links.first()).toHaveText('A/B Testing');
  });

  test('scoped locators instead of long XPath', async ({ page }) => {
    await page.goto('/tables');
    const row = page.locator('#table1 tbody tr').filter({ hasText: 'jsmith@gmail.com' });
    await expect(row.locator('td').nth(0)).toHaveText('Smith');
  });

  test('checkboxes and dropdowns', async ({ page }) => {
    await page.goto('/checkboxes');
    const boxes = page.getByRole('checkbox');
    await boxes.first().check();
    await expect(boxes.first()).toBeChecked();

    await page.goto('/dropdown');
    await page.locator('#dropdown').selectOption('2');
    await expect(page.locator('#dropdown')).toHaveValue('2');
  });
});
