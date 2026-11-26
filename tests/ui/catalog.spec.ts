import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.ts';
import { ProductsPage } from '../../pages/ProductsPage.ts';
import { standardUser } from '../../test-data/users.ts';
import { sortOptions } from '../../test-data/texts.ts';
import {
  catalogByNameAToZ,
  catalogByNameZToA,
  namesByPriceLowToHigh,
  pricesLowToHigh,
} from '../../test-data/products.ts';
import { formatPrice } from '../../utils/price.ts';

test.describe('Catalog', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.logIn(standardUser.username, standardUser.password);
  });

  test('UI-02 catalog shows 6 products with name, price and Add to cart', { tag: ['@ui'] }, async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await expect(productsPage.activeSortOption).toHaveText(sortOptions.nameAToZ);
    await expect(productsPage.items).toHaveCount(catalogByNameAToZ.length);
    await expect(productsPage.itemNames).toHaveText(catalogByNameAToZ.map((product) => product.name));
    await expect(productsPage.itemPrices).toHaveText(catalogByNameAToZ.map((product) => formatPrice(product.price)));
    await expect(productsPage.addToCartButtons).toHaveCount(catalogByNameAToZ.length);
  });

  test('UI-03 user sorts products by price from low to high', { tag: ['@ui'] }, async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await productsPage.sortBy(sortOptions.priceLowToHigh);

    await expect(productsPage.activeSortOption).toHaveText(sortOptions.priceLowToHigh);
    await expect(productsPage.itemPrices).toHaveText(pricesLowToHigh.map(formatPrice));
    await expect(productsPage.itemNames).toHaveText(namesByPriceLowToHigh);
  });

  test('UI-04 user sorts products by name from Z to A', { tag: ['@ui'] }, async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await productsPage.sortBy(sortOptions.nameZToA);

    await expect(productsPage.activeSortOption).toHaveText(sortOptions.nameZToA);
    await expect(productsPage.itemNames).toHaveText(catalogByNameZToA.map((product) => product.name));
  });
});
