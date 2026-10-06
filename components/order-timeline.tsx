import { formatWhen, naira } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";
import Link from "next/link";

const STEPS = [
  "Order Received",
  "Payment Verified",
  "Dispatched to Park/Courier",
  "In Transit",
  "Delivered",
];

function reached(status: OrderStatus) {
  switch (status) {
    case "pending_verification":
      return 0;
    case "payment_verified":
      return 1;
    case "dispatched":
      return 2;
    case "in_transit":
      return 3;
    case "delivered":
      return 4;
    default:
      return -1;
  }
}

export function OrderTimeline({ order }: { order: Order }) {
  const current = reached(order.status);

  return (
    <div>
      <p className="text-sm text-muted">Order {order.id}</p>
      <p className="mt-1 font-display text-3xl font-medium tabular-nums">{naira(order.total)}</p>
      <p className="mt-1 text-sm text-muted">{formatWhen(order.createdAt)} WAT</p>

      {order.status === "awaiting_receipt" && (
        <div className="mt-6 rounded-2xl border border-black/10 p-4">
          <p className="font-bold">Awaiting payment receipt</p>
          <p className="mt-1 text-sm text-muted">Upload the transfer receipt to start verification.</p>
          <Link href={`/pay/${order.id}`} className="mt-3 inline-flex font-bold text-deep">
            Upload receipt
          </Link>
        </div>
      )}
      {order.status === "payment_rejected" && (
        <div className="mt-6 rounded-2xl border border-black/10 p-4">
          <p className="font-bold">Payment not confirmed</p>
          <p className="mt-1 text-sm">{order.rejectReason || "Upload a clearer receipt."}</p>
          <Link href={`/pay/${order.id}`} className="mt-3 inline-flex font-bold text-deep">
            Upload another receipt
          </Link>
        </div>
      )}
      {order.status === "cancelled" && (
        <div className="mt-6 rounded-2xl border border-black/10 p-4">
          <p className="font-bold">Cancelled</p>
          <p className="mt-1 text-sm text-muted">This order was cancelled and the unit was released.</p>
        </div>
      )}

      <ol className="mt-8">
        {STEPS.map((label, index) => {
          const done = current >= index;
          return (
            <li key={label} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={
                    done
                      ? "size-3.5 rounded-full bg-deep"
                      : "size-3.5 rounded-full border-2 border-black/20 bg-white"
                  }
                />
                {index < STEPS.length - 1 && (
                  <span className={done && current > index ? "w-px flex-1 bg-deep" : "w-px flex-1 bg-black/15"} />
                )}
              </div>
              <p className={`pb-6 text-sm ${done ? "font-bold" : "text-muted"}`}>{label}</p>
            </li>
          );
        })}
      </ol>

      {current >= 2 && order.logistics && (
        <div className="rounded-2xl border border-black/10 p-4">
          <p className="text-sm text-muted">Dispatch details</p>
          {order.tier === "same-state" && (
            <dl className="mt-2 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Rider</dt>
                <dd className="font-bold">{order.logistics.riderName}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Phone</dt>
                <dd>
                  <a className="font-bold text-deep" href={`tel:${order.logistics.riderPhone}`}>
                    {order.logistics.riderPhone}
                  </a>
                </dd>
              </div>
            </dl>
          )}
          {order.tier === "interstate" && (
            <dl className="mt-2 space-y-2 text-sm">
              <Row label="Park" value={order.logistics.parkName} />
              <Row label="Driver" value={order.logistics.driverPhone} />
              <Row label="Vehicle" value={order.logistics.vehicleNumber} />
            </dl>
          )}
          {order.tier === "international" && (
            <dl className="mt-2 space-y-2 text-sm">
              <Row label="Carrier" value={order.logistics.carrier} />
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Tracking</dt>
                <dd>
                  <a className="font-bold text-deep" href={order.logistics.trackingUrl}>
                    {order.logistics.trackingNumber}
                  </a>
                </dd>
              </div>
            </dl>
          )}
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="font-bold">{value}</dd>
    </div>
  );
}
