import type { Locator, Page } from '@playwright/test';
import { PrimaryHeader } from './components/PrimaryHeader.ts';

export class CheckoutCompletePage {
  readonly path = '/checkout-complete.html';
  readonly page: Page;
  readonly header: PrimaryHeader;
  readonly title: Locator;
  readonly confirmationHeading: Locator;
  readonly confirmationText: Locator;
  readonly ponyExpressImage: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new PrimaryHeader(page);
    this.title = page.getByTestId('title');
    this.confirmationHeading = page.getByRole('heading', { level: 2 });
    this.confirmationText = page.getByTestId('complete-text');
    this.ponyExpressImage = page.getByRole('img', { name: 'Pony Express' });
    this.backHomeButton = page.getByRole('button', { name: 'Back Home' });
  }

  async backHome(): Promise<void> {
    await this.backHomeButton.click();
  }
}
