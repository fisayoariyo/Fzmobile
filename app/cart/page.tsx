"use client";

import { ConditionChip } from "@/components/condition-chip";
import { ProductMedia } from "@/components/product-media";
import { getVariant } from "@/lib/catalog";
import { naira } from "@/lib/format";
import { productImage } from "@/lib/media";
import { useStore } from "@/lib/store";
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const { lines, setQty, remove, clear, ready } = useStore();
  const detailed = lines
    .map((line) => {
      const found = getVariant(line.variantId);
      return found ? { ...found, qty: line.qty } : null;
    })
    .filter((line) => line != null);

  const subtotal = detailed.reduce((sum, line) => sum + line.variant.price * line.qty, 0);

  return (
    <div className="mx-auto max-w-lg px-4 pb-28 pt-2 md:max-w-3xl md:px-6 md:pb-12 md:pt-8">
      <div className="mb-6 flex h-12 items-center justify-between md:mb-8">
        <button
          type="button"
          aria-label="Back"
          onClick={() => router.back()}
          className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-surface text-muted transition-colors hover:bg-mist hover:text-black md:hidden"
        >
          <ArrowLeft className="size-5" />
        </button>
        <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">Cart</h1>
        <button
          type="button"
          aria-label="Clear cart"
          disabled={detailed.length === 0}
          onClick={() => clear()}
          className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-surface text-deep transition-colors hover:bg-mist disabled:opacity-40"
        >
          <Trash2 className="size-5" />
        </button>
      </div>

      {!ready ? (
        <div className="py-12 text-center">
          <p className="text-sm text-muted">Loading your cart…</p>
        </div>
      ) : detailed.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <svg
            className="size-20 stroke-current text-muted/60"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-2z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <h2 className="mt-4 font-display text-lg font-medium">Your cart is empty</h2>
          <p className="mt-2 text-sm text-muted">Browse our collection and find something you love</p>
          <Link
            href="/shop"
            className="mt-6 inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-deep px-8 font-semibold text-white shadow-md shadow-deep/20 transition-all hover:bg-deep/90 active:scale-[0.98]"
          >
            Shop devices
          </Link>
        </div>
      ) : (
        <>
          <ul className="space-y-3.5">
            {detailed.map((line) => (
              <li
                key={line.variant.id}
                className="flex gap-3.5 rounded-2xl border border-black/[0.04] bg-white p-3.5 shadow-sm transition-shadow hover:shadow-md md:p-4"
              >
                <Link
                  href={`/product/${line.product.slug}?v=${line.variant.id}`}
                  className="relative shrink-0 overflow-hidden rounded-2xl bg-surface"
                  style={{ width: 100, height: 100 }}
                >
                  <ProductMedia
                    art={line.product.art}
                    color={line.variant.colorHex}
                    image={productImage(line.product.image, line.variant.image)}
                    alt={line.product.name}
                    className="h-full w-full object-cover"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/product/${line.product.slug}?v=${line.variant.id}`}
                        className="text-base font-semibold leading-snug transition-colors hover:text-deep"
                      >
                        {line.product.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted">
                        {line.product.brand} · {line.variant.colorName}
                      </p>
                      <p className="mt-0.5 text-xs text-muted">{line.variant.storage}</p>
                    </div>
                    <button
                      type="button"
                      aria-label="Remove item"
                      onClick={() => remove(line.variant.id)}
                      className="cursor-pointer text-muted transition-colors hover:text-red-500"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <div className="mt-2">
                    <ConditionChip condition={line.variant.condition} />
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <p className="text-base font-bold tabular-nums text-deep">
                      {naira(line.variant.price * line.qty)}
                    </p>
                    <div className="flex h-9 items-center rounded-full border border-black/[0.04] bg-surface">
                      <button
                        type="button"
                        className="flex size-9 cursor-pointer items-center justify-center text-muted transition-colors hover:text-black"
                        aria-label="Decrease quantity"
                        onClick={() => setQty(line.variant.id, line.qty - 1)}
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold tabular-nums">
                        {line.qty}
                      </span>
                      <button
                        type="button"
                        className="flex size-9 cursor-pointer items-center justify-center text-muted transition-colors hover:text-black disabled:opacity-40"
                        aria-label="Increase quantity"
                        disabled={line.qty >= line.variant.stock}
                        onClick={() => setQty(line.variant.id, line.qty + 1)}
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                  </div>
                  <Link
                    href={`/product/${line.product.slug}?v=${line.variant.id}`}
                    className="mt-2.5 inline-block text-xs font-medium text-[#1a73e8] hover:underline"
                  >
                    View details
                  </Link>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-3xl border border-[#dadce0] bg-[#f8f9fa] p-6 shadow-xs">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#5f6368]">Subtotal</span>
              <span className="font-medium text-[#202124] tabular-nums">{naira(subtotal)}</span>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-sm">
              <span className="text-[#5f6368]">Shipping</span>
              <span className="font-medium text-[#202124]">Calculated at checkout</span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-[#dadce0] pt-4">
              <span className="text-base font-medium text-[#202124]">Total</span>
              <span className="text-2xl font-medium tabular-nums text-[#202124]">{naira(subtotal)}</span>
            </div>
          </div>

          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#dadce0] bg-white/95 p-4 backdrop-blur-md md:static md:mt-6 md:border-0 md:bg-transparent md:p-0">
            <Link
              href="/checkout"
              className="inline-flex h-13 w-full cursor-pointer items-center justify-center rounded-full bg-[#1a73e8] text-sm font-medium text-white shadow-sm transition-all hover:bg-[#1557b0] active:scale-[0.99]"
            >
              Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
