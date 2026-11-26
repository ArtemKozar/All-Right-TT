import type { Locator, Page } from '@playwright/test';

export type CustomerInformation = {
  firstName: string;
  lastName: string;
  postalCode: string;
};

export class CheckoutInformationPage {
  readonly path = '/checkout-step-one.html';
  readonly page: Page;
  readonly title: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly cancelButton: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.postalCodeInput = page.getByRole('textbox', { name: 'Zip/Postal Code' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.errorMessage = page.getByRole('alert');
  }

  async submitInformation(information: CustomerInformation): Promise<void> {
    await this.firstNameInput.fill(information.firstName);
    await this.lastNameInput.fill(information.lastName);
    await this.postalCodeInput.fill(information.postalCode);
    await this.continueButton.click();
  }
}
