import { test, expect } from '../../src/fixtures';
import { products } from '../../src/data/users';
import { STORAGE_STATE } from '../../src/config/paths';

test.use({ storageState: STORAGE_STATE });

test.describe('Inventory', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('shows all six products @smoke', async ({ inventoryPage }) => {
    await expect(inventoryPage.items).toHaveCount(6);
    await expect(inventoryPage.itemNames).toContainText(Object.values(products));
  });

  test('sorts by name A to Z and Z to A', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('za');
    const descending = await inventoryPage.getNames();
    expect(descending).toEqual([...descending].sort().reverse());

    await inventoryPage.sortBy('az');
    const ascending = await inventoryPage.getNames();
    expect(ascending).toEqual([...ascending].sort());
  });

  test('sorts by price low to high and high to low', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');
    const low = await inventoryPage.getPrices();
    expect(low).toEqual([...low].sort((a, b) => a - b));

    await inventoryPage.sortBy('hilo');
    const high = await inventoryPage.getPrices();
    expect(high).toEqual([...high].sort((a, b) => b - a));
  });

  test('cart badge tracks added and removed items', async ({ inventoryPage }) => {
    await inventoryPage.header.expectCartCount(0);

    await inventoryPage.addToCart(products.backpack, products.bikeLight);
    await inventoryPage.header.expectCartCount(2);

    await inventoryPage.removeFromCart(products.backpack);
    await inventoryPage.header.expectCartCount(1);
  });

  test('cart contents persist across a page reload', async ({ page, inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.onesie);
    await page.reload();
    await inventoryPage.header.expectCartCount(1);

    await inventoryPage.header.openCart();
    await cartPage.expectLoaded();
    await cartPage.expectItems([products.onesie]);
  });
});
