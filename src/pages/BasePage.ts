import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Shared behaviour for every page object.
 * Subclasses declare their `path` and the locator that proves the page has loaded.
 */
export abstract class BasePage {
  protected abstract readonly path: string;
  readonly title: Locator;

  constructor(readonly page: Page) {
    this.title = page.getByTestId('title');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`${escapeRegExp(this.path)}$`));
  }
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
