import type { Locator, Page } from '@playwright/test';
import { PrimaryHeader } from './components/PrimaryHeader.ts';

export class CartPage {
  readonly path = '/cart.html';
  readonly page: Page;
  readonly header: PrimaryHeader;
  readonly title: Locator;
  readonly quantityLabel: Locator;
  readonly descriptionLabel: Locator;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly itemQuantities: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new PrimaryHeader(page);
    this.title = page.getByTestId('title');
    this.quantityLabel = page.getByTestId('cart-quantity-label');
    this.descriptionLabel = page.getByTestId('cart-desc-label');
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.itemQuantities = page.getByTestId('item-quantity');
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  removeButton(productName: string): Locator {
    return this.items
      .filter({ has: this.page.getByText(productName, { exact: true }) })
      .getByRole('button', { name: 'Remove' });
  }

  async remove(productName: string): Promise<void> {
    await this.removeButton(productName).click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
