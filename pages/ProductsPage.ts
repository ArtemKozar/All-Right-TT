import type { Locator, Page } from '@playwright/test';
import { PrimaryHeader } from './components/PrimaryHeader.ts';

export class ProductsPage {
  readonly path = '/inventory.html';
  readonly page: Page;
  readonly header: PrimaryHeader;
  readonly title: Locator;
  readonly sortSelect: Locator;
  readonly activeSortOption: Locator;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly addToCartButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new PrimaryHeader(page);
    // The page title has no heading role.
    this.title = page.getByTestId('title');
    this.sortSelect = page.getByRole('combobox', { name: 'Sort products' });
    this.activeSortOption = page.getByTestId('active-option');
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.addToCartButtons = page.getByRole('button', { name: 'Add to cart' });
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  item(productName: string): Locator {
    return this.items.filter({ has: this.page.getByText(productName, { exact: true }) });
  }

  addToCartButton(productName: string): Locator {
    return this.item(productName).getByRole('button', { name: 'Add to cart' });
  }

  removeButton(productName: string): Locator {
    return this.item(productName).getByRole('button', { name: 'Remove' });
  }

  async sortBy(optionLabel: string): Promise<void> {
    await this.sortSelect.selectOption({ label: optionLabel });
  }

  async addToCart(...productNames: string[]): Promise<void> {
    for (const productName of productNames) {
      await this.addToCartButton(productName).click();
    }
  }
}
