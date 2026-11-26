import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.ts';
import { ProductsPage } from '../../pages/ProductsPage.ts';
import { CartPage } from '../../pages/CartPage.ts';
import { CheckoutInformationPage } from '../../pages/CheckoutInformationPage.ts';
import { CheckoutOverviewPage } from '../../pages/CheckoutOverviewPage.ts';
import { CheckoutCompletePage } from '../../pages/CheckoutCompletePage.ts';
import { standardUser } from '../../test-data/users.ts';
import { checkoutErrors, checkoutTexts, pageTitles } from '../../test-data/texts.ts';
import { backpack, bikeLight } from '../../test-data/products.ts';
import {
  customer,
  customerWithFirstNameOnly,
  customerWithoutPostalCode,
  emptyCustomer,
  whitespaceCustomer,
} from '../../test-data/customers.ts';
import { formatPrice, sumPrices } from '../../utils/price.ts';

test.describe('Checkout', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.logIn(standardUser.username, standardUser.password);
  });

  test('UI-07 user completes a full checkout', { tag: ['@ui', '@smoke'] }, async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const informationPage = new CheckoutInformationPage(page);
    const overviewPage = new CheckoutOverviewPage(page);
    const completePage = new CheckoutCompletePage(page);
    const itemTotal = sumPrices([backpack.price, bikeLight.price]);

    await productsPage.addToCart(backpack.name, bikeLight.name);
    await productsPage.header.openCart();
    await cartPage.checkout();

    await expect(page).toHaveURL(informationPage.path);
    await expect(informationPage.title).toHaveText(pageTitles.checkoutInformation);

    await informationPage.submitInformation(customer);

    await expect(page).toHaveURL(overviewPage.path);
    await expect(overviewPage.title).toHaveText(pageTitles.checkoutOverview);
    await expect(overviewPage.itemNames).toHaveText([backpack.name, bikeLight.name]);
    await expect(overviewPage.itemPrices).toHaveText([formatPrice(backpack.price), formatPrice(bikeLight.price)]);
    await expect(overviewPage.paymentInformation).toHaveText(checkoutTexts.paymentInformation);
    await expect(overviewPage.shippingInformation).toHaveText(checkoutTexts.shippingInformation);
    await expect(overviewPage.itemTotal).toHaveText(`${checkoutTexts.itemTotalPrefix}${formatPrice(itemTotal)}`);

    // The tax rate is not checked: no requirement defines it.
    const tax = await overviewPage.readTax();
    await expect(overviewPage.total).toHaveText(`${checkoutTexts.totalPrefix}${formatPrice(sumPrices([itemTotal, tax]))}`);

    await overviewPage.finish();

    await expect(page).toHaveURL(completePage.path);
    await expect(completePage.title).toHaveText(pageTitles.checkoutComplete);
    await expect(completePage.confirmationHeading).toHaveText(checkoutTexts.thankYou);
    await expect(completePage.confirmationText).toHaveText(checkoutTexts.dispatched);
    await expect(completePage.ponyExpressImage).toBeVisible();
    await expect(completePage.header.cartBadge).toBeHidden();

    await completePage.backHome();

    await expect(page).toHaveURL(productsPage.path);
    await expect(productsPage.header.cartBadge).toBeHidden();
  });

  test('UI-09 user cannot continue checkout while a required field is empty', { tag: ['@ui', '@negative'] }, async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const informationPage = new CheckoutInformationPage(page);

    await productsPage.addToCart(backpack.name);
    await productsPage.header.openCart();
    await cartPage.checkout();

    await informationPage.submitInformation(emptyCustomer);
    await expect(informationPage.errorMessage).toHaveText(checkoutErrors.firstNameRequired);

    await informationPage.submitInformation(customerWithFirstNameOnly);
    await expect(informationPage.errorMessage).toHaveText(checkoutErrors.lastNameRequired);

    await informationPage.submitInformation(customerWithoutPostalCode);
    await expect(informationPage.errorMessage).toHaveText(checkoutErrors.postalCodeRequired);
    await expect(page).toHaveURL(informationPage.path);
  });

  test('UI-11 user cannot continue checkout with fields of spaces only', { tag: ['@ui', '@negative'] }, async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const informationPage = new CheckoutInformationPage(page);

    await productsPage.addToCart(backpack.name);
    await productsPage.header.openCart();
    await cartPage.checkout();
    await informationPage.submitInformation(whitespaceCustomer);

    await expect(page).toHaveURL(informationPage.path);
    await expect(informationPage.errorMessage).toHaveText(checkoutErrors.firstNameRequired);
  });
});
