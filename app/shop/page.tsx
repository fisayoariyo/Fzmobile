import { ShopClient } from "./shop-client";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Shop",
  description: "Phones, laptops, audio, power, creation gear, and gaming. Filter by condition, brand, and price.",
};

export default function ShopPage() {
  return (
    <Suspense>
      <ShopClient />
    </Suspense>
  );
}
