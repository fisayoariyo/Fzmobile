import type { Metadata } from "next";
import { Suspense } from "react";
import { TrackScreen } from "./track-screen";

export const metadata: Metadata = {
  title: "Track your order",
  description: "Look up an Fzmobile order with the Order ID and phone number from checkout.",
};

export default function TrackPage() {
  return (
    <Suspense>
      <TrackScreen />
    </Suspense>
  );
}
