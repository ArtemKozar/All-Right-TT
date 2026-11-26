export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function parsePrice(text: string): number {
  const match = /\$(\d+\.\d{2})/.exec(text);
  if (!match?.[1]) {
    throw new Error(`No price found in "${text}"`);
  }
  return Number(match[1]);
}

// Sums in cents, so 29.99 + 9.99 is 39.98 and not 39.980000000000004.
export function sumPrices(prices: number[]): number {
  const cents = prices.reduce((total, price) => total + Math.round(price * 100), 0);
  return cents / 100;
}
