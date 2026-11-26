import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.ts';
import { ProductsPage } from '../../pages/ProductsPage.ts';
import { CartPage } from '../../pages/CartPage.ts';
import { standardUser } from '../../test-data/users.ts';
import { cartTexts, pageTitles } from '../../test-data/texts.ts';
import { backpack, bikeLight } from '../../test-data/products.ts';
import { formatPrice } from '../../utils/price.ts';

test.describe('Cart', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.logIn(standardUser.username, standardUser.password);
  });

  test('UI-05 user adds 2 products and the cart shows them', { tag: ['@ui', '@smoke'] }, async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await productsPage.addToCart(backpack.name, bikeLight.name);

    await expect(productsPage.removeButton(backpack.name)).toBeVisible();
    await expect(productsPage.removeButton(bikeLight.name)).toBeVisible();
    await expect(productsPage.header.cartBadge).toHaveText(cartTexts.badgeWithTwoItems);

    await productsPage.header.openCart();

    await expect(page).toHaveURL(cartPage.path);
    await expect(cartPage.title).toHaveText(pageTitles.cart);
    await expect(cartPage.quantityLabel).toHaveText(cartTexts.quantityLabel);
    await expect(cartPage.descriptionLabel).toHaveText(cartTexts.descriptionLabel);
    await expect(cartPage.itemNames).toHaveText([backpack.name, bikeLight.name]);
    await expect(cartPage.itemPrices).toHaveText([formatPrice(backpack.price), formatPrice(bikeLight.price)]);
    await expect(cartPage.itemQuantities).toHaveText([cartTexts.quantityOfOne, cartTexts.quantityOfOne]);
    await expect(cartPage.removeButton(backpack.name)).toBeVisible();
    await expect(cartPage.removeButton(bikeLight.name)).toBeVisible();
    await expect(cartPage.continueShoppingButton).toBeVisible();
    await expect(cartPage.checkoutButton).toBeVisible();
  });

  test('UI-06 user removes products from the cart', { tag: ['@ui'] }, async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await productsPage.addToCart(backpack.name, bikeLight.name);
    await productsPage.header.openCart();
    await cartPage.remove(bikeLight.name);

    await expect(cartPage.itemNames).toHaveText([backpack.name]);
    await expect(cartPage.header.cartBadge).toHaveText(cartTexts.badgeWithOneItem);

    await cartPage.remove(backpack.name);

    await expect(cartPage.items).toHaveCount(0);
    await expect(cartPage.header.cartBadge).toBeHidden();
  });

  test('UI-12 cart button is announced as "Cart, 1 item" with one product', { tag: ['@ui'] }, async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await productsPage.addToCart(backpack.name);

    await expect(productsPage.header.cartBadge).toHaveText(cartTexts.badgeWithOneItem);
    await expect(productsPage.header.cartButton).toHaveAccessibleName(cartTexts.accessibleNameWithOneItem);
  });
});
