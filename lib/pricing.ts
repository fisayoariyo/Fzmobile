/**
 * Storefront price.
 *
 * Ops supply a list price that is roughly what the customer should pay. For
 * every product that appears on that list, `cost` holds the number verbatim
 * and the standing uplift is applied on top.
 *
 * Products that are NOT on the ops list (for example the Google Pixel range,
 * which still carries its earlier pricing) are passed through unchanged, so
 * the uplift never silently raises a price ops did not quote.
 */
export const UPLIFT = 0.1;

export function sellPrice(cost: number): number {
  return Math.round(cost * (1 + UPLIFT));
}

/** Price for a product that is not on the current ops list: no uplift. */
export function sellPriceUnlisted(cost: number): number {
  return cost;
}
