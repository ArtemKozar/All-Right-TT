import type { CustomerInformation } from '../pages/CheckoutInformationPage.ts';

export const customer: CustomerInformation = {
  firstName: 'Test',
  lastName: 'User',
  postalCode: '12345',
};

export const emptyCustomer: CustomerInformation = {
  firstName: '',
  lastName: '',
  postalCode: '',
};

export const customerWithFirstNameOnly: CustomerInformation = {
  ...emptyCustomer,
  firstName: customer.firstName,
};

export const customerWithoutPostalCode: CustomerInformation = {
  ...customer,
  postalCode: '',
};

export const whitespaceCustomer: CustomerInformation = {
  firstName: '   ',
  lastName: '   ',
  postalCode: '   ',
};
