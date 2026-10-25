import { test, expect } from '@playwright/test';

test('handles a new browser tab', async ({ page, context }) => {
  await page.goto('/windows');

  const [popup] = await Promise.all([
    context.waitForEvent('page'),
    page.getByRole('link', { name: 'Click Here' }).click(),
  ]);

  await expect(popup).toHaveURL(/\/windows\/new$/);
  await expect(popup.getByRole('heading')).toHaveText('New Window');
  await popup.close();
  await expect(page.getByRole('heading')).toHaveText('Opening a new window');
});
