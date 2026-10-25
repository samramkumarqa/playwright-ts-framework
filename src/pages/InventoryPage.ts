import { expect, type Locator, type Page } from '@playwright/test';
import type { ProductName } from '../data/users';
import { BasePage } from './BasePage';
import { HeaderComponent } from './components/HeaderComponent';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage extends BasePage {
  protected readonly path = '/inventory.html';

  readonly header: HeaderComponent;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly sortSelect: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.sortSelect = page.getByTestId('product-sort-container');
  }

  override async expectLoaded(): Promise<void> {
    await super.expectLoaded();
    await expect(this.title).toHaveText('Products');
  }

  /** A product card, scoped so its buttons can be found without global selectors. */
  product(name: ProductName): Locator {
    return this.items.filter({ has: this.page.getByTestId('inventory-item-name').getByText(name, { exact: true }) });
  }

  async addToCart(...names: ProductName[]): Promise<void> {
    for (const name of names) {
      await this.product(name).getByRole('button', { name: 'Add to cart' }).click();
    }
  }

  async removeFromCart(name: ProductName): Promise<void> {
    await this.product(name).getByRole('button', { name: 'Remove' }).click();
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortSelect.selectOption(option);
  }

  async getNames(): Promise<string[]> {
    return this.itemNames.allInnerTexts();
  }

  async getPrices(): Promise<number[]> {
    const texts = await this.itemPrices.allInnerTexts();
    return texts.map((t) => Number(t.replace('$', '')));
  }
}
