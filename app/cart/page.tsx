"use client";

import { ConditionChip } from "@/components/condition-chip";
import { ProductMedia } from "@/components/product-media";
import { getVariant } from "@/lib/catalog";
import { naira } from "@/lib/format";
import { productImage } from "@/lib/media";
import { useStore } from "@/lib/store";
import { Minus, Plus } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { lines, setQty, remove, ready } = useStore();
  const detailed = lines
    .map((line) => {
      const found = getVariant(line.variantId);
      return found ? { ...found, qty: line.qty } : null;
    })
    .filter((line) => line != null);

  const subtotal = detailed.reduce((sum, line) => sum + line.variant.price * line.qty, 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
      <h1 className="font-display text-4xl font-medium">Cart</h1>
      {!ready ? (
        <p className="mt-6 text-sm text-muted">Loading your cart…</p>
      ) : detailed.length === 0 ? (
        <div className="py-12">
          <p className="text-base">Your cart is empty.</p>
          <Link
            href="/shop"
            className="mt-6 inline-flex h-12 cursor-pointer items-center rounded-full bg-deep px-6 font-bold text-white"
          >
            Shop devices
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {detailed.map((line) => (
              <li key={line.variant.id} className="flex gap-4 py-5">
                <Link
                  href={`/product/${line.product.slug}?v=${line.variant.id}`}
                  className="relative size-24 shrink-0 overflow-hidden rounded-2xl border border-black/10"
                >
                  <ProductMedia
                    art={line.product.art}
                    color={line.variant.colorHex}
                    image={productImage(line.product.image, line.variant.image)}
                    alt={line.product.name}
                    className="h-full w-full"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={`/product/${line.product.slug}?v=${line.variant.id}`} className="font-bold">
                    {line.product.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted">
                    {line.variant.colorName} · {line.variant.storage}
                  </p>
                  <div className="mt-2">
                    <ConditionChip condition={line.variant.condition} />
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex h-12 items-center rounded-full border border-black/15">
                      <button
                        type="button"
                        className="flex size-12 cursor-pointer items-center justify-center"
                        aria-label="Decrease quantity"
                        onClick={() => setQty(line.variant.id, line.qty - 1)}
                      >
                        <Minus className="size-4" />
                      </button>
                      <span className="w-6 text-center font-bold tabular-nums">{line.qty}</span>
                      <button
                        type="button"
                        className="flex size-12 cursor-pointer items-center justify-center disabled:opacity-40"
                        aria-label="Increase quantity"
                        disabled={line.qty >= line.variant.stock}
                        onClick={() => setQty(line.variant.id, line.qty + 1)}
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>
                    <p className="font-bold tabular-nums">{naira(line.variant.price * line.qty)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(line.variant.id)}
                    className="mt-2 cursor-pointer text-sm font-bold text-deep"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-muted">Subtotal</p>
            <p className="text-xl font-bold tabular-nums">{naira(subtotal)}</p>
          </div>
          <p className="mt-1 text-sm text-muted">Delivery is added at checkout.</p>
          <Link
            href="/checkout"
            className="mt-6 inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-full bg-deep font-bold text-white"
          >
            Checkout
          </Link>
        </>
      )}
    </div>
  );
}
