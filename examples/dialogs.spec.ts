import { test, expect } from '@playwright/test';

test.describe('JavaScript dialogs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/javascript_alerts');
  });

  test('accepts an alert', async ({ page }) => {
    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBe('I am a JS Alert');
      await dialog.accept();
    });
    await page.getByRole('button', { name: 'Click for JS Alert' }).click();
    await expect(page.locator('#result')).toHaveText('You successfully clicked an alert');
  });

  test('dismisses a confirm', async ({ page }) => {
    page.once('dialog', (dialog) => dialog.dismiss());
    await page.getByRole('button', { name: 'Click for JS Confirm' }).click();
    await expect(page.locator('#result')).toHaveText('You clicked: Cancel');
  });

  test('types into a prompt', async ({ page }) => {
    page.once('dialog', (dialog) => dialog.accept('Playwright'));
    await page.getByRole('button', { name: 'Click for JS Prompt' }).click();
    await expect(page.locator('#result')).toHaveText('You entered: Playwright');
  });
});
