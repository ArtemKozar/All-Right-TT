import type { Locator, Page } from '@playwright/test';

export class PrimaryHeader {
  readonly cartButton: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    // The accessible name carries the item count: "Cart, empty", "Cart, 2 items".
    this.cartButton = page.getByRole('button', { name: /^Cart\b/ });
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

  async openCart(): Promise<void> {
    await this.cartButton.click();
  }
}
