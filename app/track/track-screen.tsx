"use client";

import { OrderTimeline } from "@/components/order-timeline";
import { TrackForm } from "@/components/track-form";
import { normalizeNgPhone } from "@/lib/format";
import { useStore } from "@/lib/store";
import { useSearchParams } from "next/navigation";

export function TrackScreen() {
  const params = useSearchParams();
  const { findOrder, ready } = useStore();
  const orderId = params.get("order") ?? "";
  const phone = params.get("phone") ?? "";
  const normalized = phone ? normalizeNgPhone(phone) : null;
  const lookedUp = Boolean(orderId && phone);
  const order = ready && lookedUp && normalized ? findOrder(orderId, normalized) : null;

  return (
    <div className="mx-auto max-w-xl px-4 py-8 md:px-6">
      <h1 className="font-display text-4xl font-medium">Track your order</h1>
      <p className="mt-2 mb-6 text-sm text-muted">
        Both the Order ID and the phone number have to match.
      </p>
      <TrackForm />
      {!lookedUp && (
        <p className="mt-4 text-sm text-muted">
          Preview an order with <span className="font-bold text-black">FZ-4N8C2P</span> and{" "}
          <span className="font-bold text-black">08031234567</span>.
        </p>
      )}
      {lookedUp && ready && !order && (
        <p className="mt-8 text-sm font-bold" role="alert">
          We could not find an order with those details.
        </p>
      )}
      {order && (
        <div className="mt-10">
          <OrderTimeline order={order} />
        </div>
      )}
    </div>
  );
}
