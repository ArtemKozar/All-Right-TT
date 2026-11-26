export type Product = {
  name: string;
  price: number;
};

export const backpack: Product = { name: 'Sauce Labs Backpack', price: 29.99 };
export const bikeLight: Product = { name: 'Sauce Labs Bike Light', price: 9.99 };
export const boltTShirt: Product = { name: 'Sauce Labs Bolt T-Shirt', price: 15.99 };
export const fleeceJacket: Product = { name: 'Sauce Labs Fleece Jacket', price: 49.99 };
export const onesie: Product = { name: 'Sauce Labs Onesie', price: 7.99 };
export const redTShirt: Product = { name: 'Test.allTheThings() T-Shirt (Red)', price: 15.99 };

// The default order of the catalog: Name (A to Z).
export const catalogByNameAToZ: Product[] = [
  backpack,
  bikeLight,
  boltTShirt,
  fleeceJacket,
  onesie,
  redTShirt,
];

export const catalogByNameZToA: Product[] = [
  redTShirt,
  onesie,
  fleeceJacket,
  boltTShirt,
  bikeLight,
  backpack,
];

const escapeRegExp = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// No requirement defines the order of equally priced items, so either $15.99 item may
// come first.
const anyItemAt1599 = new RegExp(
  `^(${escapeRegExp(boltTShirt.name)}|${escapeRegExp(redTShirt.name)})$`,
);

export const namesByPriceLowToHigh: (string | RegExp)[] = [
  onesie.name,
  bikeLight.name,
  anyItemAt1599,
  anyItemAt1599,
  backpack.name,
  fleeceJacket.name,
];

export const pricesLowToHigh: number[] = [7.99, 9.99, 15.99, 15.99, 29.99, 49.99];
