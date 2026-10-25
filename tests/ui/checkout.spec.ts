import { faker } from '@faker-js/faker';
import { test, expect } from '../../src/fixtures';
import { products } from '../../src/data/users';
import { STORAGE_STATE } from '../../src/config/paths';

test.use({ storageState: STORAGE_STATE });

const shipping = () => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  postalCode: faker.location.zipCode(),
});

test.describe('Checkout', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('user can buy two products end to end @smoke', async ({ inventoryPage, cartPage, checkoutPage }) => {
    const basket = [products.backpack, products.fleeceJacket];

    await test.step('add products to the cart', async () => {
      await inventoryPage.addToCart(...basket);
      await inventoryPage.header.openCart();
      await cartPage.expectItems(basket);
    });

    await test.step('enter shipping details', async () => {
      await cartPage.checkout();
      await checkoutPage.fillShippingInfo(shipping());
      await checkoutPage.expectOnOverview();
      await expect(checkoutPage.itemNames).toHaveText(basket);
    });

    await test.step('totals add up', async () => {
      const itemSum = (await checkoutPage.getItemPrices()).reduce((a, b) => a + b, 0);
      const subtotal = await checkoutPage.getAmount(checkoutPage.subtotalLabel);
      const tax = await checkoutPage.getAmount(checkoutPage.taxLabel);
      const total = await checkoutPage.getAmount(checkoutPage.totalLabel);

      expect(subtotal).toBeCloseTo(itemSum, 2);
      expect(total).toBeCloseTo(subtotal + tax, 2);
    });

    await test.step('place the order', async () => {
      await checkoutPage.finish();
      await checkoutPage.expectOrderComplete();
      await inventoryPage.header.expectCartCount(0);
    });
  });

  const requiredFields = [
    { field: 'first name', info: { lastName: 'Doe', postalCode: '600001' }, error: 'First Name is required' },
    { field: 'last name', info: { firstName: 'Ram', postalCode: '600001' }, error: 'Last Name is required' },
    { field: 'postal code', info: { firstName: 'Ram', lastName: 'Doe' }, error: 'Postal Code is required' },
  ];

  for (const { field, info, error } of requiredFields) {
    test(`checkout requires ${field}`, async ({ inventoryPage, cartPage, checkoutPage }) => {
      await inventoryPage.addToCart(products.bikeLight);
      await inventoryPage.header.openCart();
      await cartPage.checkout();

      await checkoutPage.fillShippingInfo(info);
      await expect(checkoutPage.errorMessage).toContainText(error);
    });
  }
});
