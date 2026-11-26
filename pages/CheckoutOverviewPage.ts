import type { Locator, Page } from '@playwright/test';
import { parsePrice } from '../utils/price.ts';

export class CheckoutOverviewPage {
  readonly path = '/checkout-step-two.html';
  readonly page: Page;
  readonly title: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly itemQuantities: Locator;
  readonly paymentInformation: Locator;
  readonly shippingInformation: Locator;
  readonly itemTotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly cancelButton: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.itemQuantities = page.getByTestId('item-quantity');
    this.paymentInformation = page.getByTestId('payment-info-value');
    this.shippingInformation = page.getByTestId('shipping-info-value');
    this.itemTotal = page.getByTestId('subtotal-label');
    this.tax = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.finishButton = page.getByRole('button', { name: 'Finish' });
  }

  async readTax(): Promise<number> {
    return parsePrice(await this.tax.innerText());
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
