import path from 'node:path';
import { test, expect } from '@playwright/test';

test('uploads a file', async ({ page }) => {
  await page.goto('/upload');
  await page.locator('#file-upload').setInputFiles(path.join(__dirname, 'fixtures', 'sample-upload.txt'));
  await page.getByRole('button', { name: 'Upload' }).click();

  await expect(page.getByRole('heading', { name: 'File Uploaded!' })).toBeVisible();
  await expect(page.locator('#uploaded-files')).toHaveText('sample-upload.txt');
});

test('downloads a file and saves it', async ({ page }, testInfo) => {
  await page.goto('/download');
  const link = page.locator('#content a').first();
  const expectedName = (await link.innerText()).trim();

  const [download] = await Promise.all([page.waitForEvent('download'), link.click()]);
  expect(download.suggestedFilename()).toBe(expectedName);

  const savedTo = testInfo.outputPath(download.suggestedFilename());
  await download.saveAs(savedTo);
});
