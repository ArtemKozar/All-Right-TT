export const browserTitle = 'Swag Labs';

export const pageTitles = {
  products: 'Products',
  cart: 'Your Cart',
  checkoutInformation: 'Checkout: Your Information',
  checkoutOverview: 'Checkout: Overview',
  checkoutComplete: 'Checkout: Complete!',
} as const;

export const sortOptions = {
  nameAToZ: 'Name (A to Z)',
  nameZToA: 'Name (Z to A)',
  priceLowToHigh: 'Price (low to high)',
} as const;

export const loginErrors = {
  wrongCredentials: 'Epic sadface: Username and password do not match any user in this service',
  inventoryWithoutLogin: "Epic sadface: You can only access '/inventory.html' when you are logged in.",
} as const;

export const checkoutErrors = {
  firstNameRequired: 'Error: First Name is required',
  lastNameRequired: 'Error: Last Name is required',
  postalCodeRequired: 'Error: Postal Code is required',
} as const;

export const cartTexts = {
  quantityLabel: 'QTY',
  descriptionLabel: 'Description',
  quantityOfOne: '1',
  badgeWithOneItem: '1',
  badgeWithTwoItems: '2',
  accessibleNameWithOneItem: 'Cart, 1 item',
} as const;

export const checkoutTexts = {
  paymentInformation: 'SauceCard #31337',
  shippingInformation: 'Free Pony Express Delivery!',
  itemTotalPrefix: 'Item total: ',
  totalPrefix: 'Total: ',
  thankYou: 'Thank you for your order!',
  dispatched: 'Your order has been dispatched, and will arrive just as fast as the pony can get there!',
} as const;
