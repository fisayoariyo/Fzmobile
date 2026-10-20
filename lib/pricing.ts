/**
 * Sell price = cost + band markup from the ops rule, plus the current
 * uplift applied to every list price.
 *
 * `cost` holds the list price exactly as supplied by ops. The band markup
 * and the uplift are both applied on top, so the same number rounds to the
 * storefront price shown to customers.
 */
const UPLIFT = 0.1;

export function sellPrice(cost: number): number {
  let add = 0;
  if (cost < 251_000) add = 20_000;
  else if (cost <= 351_000) add = 27_500;
  else if (cost <= 451_000) add = 32_500;
  else if (cost < 500_000) add = 35_000;
  else if (cost <= 651_000) add = 37_500;
  else if (cost <= 950_000) add = 45_000;
  else if (cost < 2_000_000) add = 100_000;
  else add = 175_000;
  return cost + add + Math.round((cost + add) * UPLIFT);
}
