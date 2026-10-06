import type { ShippingTier } from "./types";

export type DeliveryQuote = {
  tier: ShippingTier;
  fee: number;
  label: string;
  estimate: string;
};

export function deliveryFor(state: string, country: string): DeliveryQuote | null {
  if (!country) return null;
  if (country !== "Nigeria") {
    return {
      tier: "international",
      fee: 65000,
      label: "International courier",
      estimate: "5–10 days with DHL or FedEx",
    };
  }
  if (!state) return null;
  if (state === "Lagos") {
    return {
      tier: "same-state",
      fee: 3500,
      label: "Same-State rider",
      estimate: "Same day, if payment is verified before 2:00pm WAT",
    };
  }
  return {
    tier: "interstate",
    fee: 8500,
    label: "Interstate motor park",
    estimate: "2–4 days",
  };
}
