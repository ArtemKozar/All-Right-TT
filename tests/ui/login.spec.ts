import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.ts';
import { ProductsPage } from '../../pages/ProductsPage.ts';
import { standardUser, wrongPassword } from '../../test-data/users.ts';
import { browserTitle, loginErrors, pageTitles } from '../../test-data/texts.ts';

test.describe('Login', () => {
  test('UI-01 user logs in and sees the Products page', { tag: ['@ui', '@smoke'] }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    await loginPage.goto();
    await expect(page).toHaveTitle(browserTitle);

    await loginPage.logIn(standardUser.username, standardUser.password);

    await expect(page).toHaveURL(productsPage.path);
    await expect(productsPage.title).toHaveText(pageTitles.products);
    await expect(productsPage.header.cartBadge).toBeHidden();
  });

  test('UI-08 user cannot log in with a wrong password', { tag: ['@ui', '@negative'] }, async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.logIn(standardUser.username, wrongPassword);

    await expect(page).toHaveURL(loginPage.path);
    await expect(loginPage.errorMessage).toHaveText(loginErrors.wrongCredentials);
    await expect(loginPage.dismissErrorButton).toBeVisible();
  });

  test('UI-10 user cannot open the catalog without logging in', { tag: ['@ui', '@negative'] }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    await productsPage.goto();

    await expect(page).toHaveURL(loginPage.path);
    await expect(loginPage.errorMessage).toHaveText(loginErrors.inventoryWithoutLogin);
    await expect(loginPage.loginButton).toBeVisible();
    await expect(productsPage.items).toHaveCount(0);
  });
});
