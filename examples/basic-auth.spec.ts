import { test, expect } from '@playwright/test';

// The site documents admin/admin as its demo credentials.
test.use({ httpCredentials: { username: 'admin', password: 'admin' } });

test('passes HTTP basic auth', async ({ page }) => {
  await page.goto('/basic_auth');
  await expect(page.locator('#content p')).toContainText('Congratulations! You must have the proper credentials.');
});
