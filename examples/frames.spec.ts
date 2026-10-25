import { test, expect } from '@playwright/test';

test('reads text inside nested frames', async ({ page }) => {
  await page.goto('/nested_frames');

  const top = page.frameLocator('frame[name="frame-top"]');
  await expect(top.frameLocator('frame[name="frame-left"]').locator('body')).toHaveText('LEFT');
  await expect(top.frameLocator('frame[name="frame-middle"]').locator('#content')).toHaveText('MIDDLE');
  await expect(page.frameLocator('frame[name="frame-bottom"]').locator('body')).toHaveText('BOTTOM');
});
