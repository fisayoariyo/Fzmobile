"use client";

import { OrderTimeline } from "@/components/order-timeline";
import { naira } from "@/lib/format";
import { BANK, whatsappHref } from "@/lib/site";
import { useStore } from "@/lib/store";
import { Check, Copy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function PayClient({ orderId }: { orderId: string }) {
  const { orderById, attachReceipt, ready } = useStore();
  const order = orderById(orderId);
  const [copied, setCopied] = useState("");
  const [fileError, setFileError] = useState("");
  const [fileName, setFileName] = useState("");

  async function copy(value: string, key: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
    } catch {
      setCopied("");
    }
  }

  if (!ready) {
    return <p className="mx-auto max-w-xl px-4 py-10 text-sm text-muted">Loading order…</p>;
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10">
        <h1 className="font-display text-4xl font-medium">Order not on this device</h1>
        <Link href="/track" className="mt-4 inline-flex font-bold text-deep">
          Track with Order ID and phone
        </Link>
      </div>
    );
  }

  const waiting = order.status === "awaiting_receipt" || order.status === "payment_rejected";

  return (
    <div className="mx-auto max-w-xl px-4 py-8 md:px-6">
      <p className="text-sm font-bold text-muted">Transfer this amount</p>
      <p className="mt-2 font-display text-5xl font-medium tracking-tight tabular-nums">{naira(order.total)}</p>
      <p className="mt-3 text-sm text-muted">
        Use the Order ID as the transfer narration. These bank details are a preview until the live account is connected.
      </p>

      <div className="mt-8">
        <CopyRow label="Bank" value={BANK.bank} copied={copied === "bank"} onCopy={() => copy(BANK.bank, "bank")} />
        <CopyRow
          label="Account name"
          value={BANK.accountName}
          copied={copied === "name"}
          onCopy={() => copy(BANK.accountName, "name")}
        />
        <CopyRow
          label="Account number"
          value={BANK.accountNumber}
          copied={copied === "number"}
          onCopy={() => copy(BANK.accountNumber, "number")}
        />
        <CopyRow
          label="Narration"
          value={order.id}
          copied={copied === "id"}
          onCopy={() => copy(order.id, "id")}
        />
      </div>

      {waiting ? (
        <form
          className="mt-8"
          onSubmit={(event) => {
            event.preventDefault();
            if (!fileName) {
              setFileError("Add the transfer receipt to continue.");
              return;
            }
            attachReceipt(order.id);
          }}
        >
          <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-black/25 px-4 py-6 text-center">
            <span className="font-bold">{fileName || "Upload receipt"}</span>
            <span className="mt-1 text-sm text-muted">JPG, PNG, or PDF. Up to 10 MB.</span>
            <input
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                if (file.size > 10 * 1024 * 1024) {
                  setFileError("That file is larger than 10 MB.");
                  setFileName("");
                  return;
                }
                setFileError("");
                setFileName(file.name);
              }}
            />
          </label>
          {fileError && (
            <p className="mt-2 text-sm font-bold" role="alert">
              {fileError}
            </p>
          )}
          {order.status === "payment_rejected" && (
            <p className="mt-3 text-sm">{order.rejectReason || "The last receipt was not confirmed."}</p>
          )}
          <button
            type="submit"
            className="mt-4 h-12 w-full cursor-pointer rounded-full bg-deep font-bold text-white"
          >
            Submit receipt
          </button>
        </form>
      ) : (
        <div className="mt-10 border-t border-line pt-8">
          <OrderTimeline order={order} />
        </div>
      )}

      <a href={whatsappHref(order.id)} className="mt-8 inline-flex font-bold text-deep" target="_blank" rel="noreferrer">
        WhatsApp support about this order
      </a>
    </div>
  );
}

function CopyRow({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-4">
      <div>
        <p className="text-sm text-muted">{label}</p>
        <p className="text-base font-bold">{value}</p>
      </div>
      <button
        type="button"
        onClick={onCopy}
        className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-full border border-black/15 px-4 text-sm font-bold"
      >
        {copied ? <Check className="size-4 text-deep" /> : <Copy className="size-4" />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
