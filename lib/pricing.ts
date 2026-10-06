/**
 * Sell price = cost + band markup from the ops rule.
 * Bands use the midpoint of each range when a range was given.
 */
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
  return cost + add;
}
