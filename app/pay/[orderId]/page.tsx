import type { Metadata } from "next";
import { PayClient } from "./pay-client";

export const metadata: Metadata = { title: "Pay by transfer" };

export default async function PayPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return <PayClient orderId={orderId} />;
}
