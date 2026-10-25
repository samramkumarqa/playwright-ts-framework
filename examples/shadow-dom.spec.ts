import { test, expect } from '@playwright/test';

// Playwright CSS and text locators pierce open shadow roots automatically, no special syntax needed.
test('reads text inside shadow DOM', async ({ page }) => {
  await page.goto('/shadowdom');
  await expect(page.locator('my-paragraph').first().locator('span')).toHaveText("Let's have some different text!");
});
