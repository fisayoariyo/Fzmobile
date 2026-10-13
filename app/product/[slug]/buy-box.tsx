"use client";

import { ConditionChip } from "@/components/condition-chip";
import { ProductMedia } from "@/components/product-media";
import { Sheet } from "@/components/sheet";
import { conditionMeta } from "@/lib/catalog";
import { cn, naira } from "@/lib/format";
import { productImage } from "@/lib/media";
import { useStore } from "@/lib/store";
import type { Condition, Product, Variant } from "@/lib/types";
import { ArrowLeft, Minus, Plus, Share2, ShoppingBag, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export function BuyBox({
  product,
  initialVariantId,
}: {
  product: Product;
  initialVariantId: string;
}) {
  const router = useRouter();
  const { add, count } = useStore();
  const initial =
    product.variants.find((variant) => variant.id === initialVariantId) ??
    product.variants.find((variant) => variant.stock > 0) ??
    product.variants[0];

  const [colorName, setColorName] = useState(initial.colorName);
  const [storage, setStorage] = useState(initial.storage);
  const [condition, setCondition] = useState<Condition>(initial.condition);
  const [qty, setQty] = useState(1);
  const [gradeOpen, setGradeOpen] = useState(false);

  const variant = useMemo(() => {
    return (
      product.variants.find(
        (item) =>
          item.colorName === colorName && item.storage === storage && item.condition === condition,
      ) ??
      product.variants.find((item) => item.colorName === colorName && item.storage === storage) ??
      product.variants.find((item) => item.colorName === colorName) ??
      product.variants[0]
    );
  }, [product.variants, colorName, storage, condition]);

  useEffect(() => {
    const next = `?v=${variant.id}`;
    if (window.location.search !== next) {
      window.history.replaceState(null, "", `/product/${product.slug}${next}`);
    }
  }, [variant.id, product.slug]);

  const colors = unique(product.variants, (item) => item.colorName);
  const storages = unique(
    product.variants.filter((item) => item.colorName === variant.colorName),
    (item) => item.storage,
  );
  const grades = product.variants.filter(
    (item) => item.colorName === variant.colorName && item.storage === variant.storage,
  );
  const showStorage = storages.some((item) => item !== "Standard");
  const discounted = variant.compareAt != null && variant.compareAt > variant.price;
  const thumbVariants = colors
    .map((name) => product.variants.find((item) => item.colorName === name)!)
    .slice(0, 4);

  function chooseColor(name: string) {
    const options = product.variants.filter((item) => item.colorName === name);
    const keep = options.find((item) => item.storage === storage && item.condition === condition);
    const next = keep ?? options.find((item) => item.stock > 0) ?? options[0];
    setColorName(name);
    setStorage(next.storage);
    setCondition(next.condition);
    setQty(1);
  }

  function chooseStorage(nextStorage: string) {
    const options = product.variants.filter(
      (item) => item.colorName === variant.colorName && item.storage === nextStorage,
    );
    const keep = options.find((item) => item.condition === condition);
    const next = keep ?? options.find((item) => item.stock > 0) ?? options[0];
    setStorage(nextStorage);
    setCondition(next.condition);
    setQty(1);
  }

  function addToCart(goCheckout: boolean) {
    if (variant.stock < 1) return;
    add(variant.id, qty);
    window.setTimeout(() => router.push(goCheckout ? "/checkout" : "/cart"), 0);
  }

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, text: product.name, url });
      } catch {
        /* dismissed */
      }
      return;
    }
    await navigator.clipboard?.writeText(url);
  }

  return (
    <div className="mx-auto max-w-lg pb-28 md:max-w-6xl md:pb-10">
      <div className="sticky top-0 z-20 flex h-14 items-center justify-between bg-white/80 px-3 backdrop-blur-xl md:hidden">
        <button
          type="button"
          aria-label="Back"
          onClick={() => router.back()}
          className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-surface"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Share"
            onClick={share}
            className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-surface"
          >
            <Share2 className="size-5" />
          </button>
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative flex size-11 cursor-pointer items-center justify-center rounded-full bg-surface"
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-deep px-1 text-[9px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 md:gap-12 md:px-6 md:pt-8">
        <div className="px-4 md:px-0">
          <div className="overflow-hidden rounded-[1.75rem] bg-surface shadow-sm">
            <ProductMedia
              art={product.art}
              color={variant.colorHex}
              image={productImage(product.image, variant.image)}
              alt={`${product.name} in ${variant.colorName}`}
              className="aspect-square w-full"
              priority
            />
          </div>
          {thumbVariants.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {thumbVariants.map((item) => {
                const selected = item.colorName === variant.colorName;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => chooseColor(item.colorName)}
                    className={cn(
                      "relative size-20 shrink-0 cursor-pointer overflow-hidden rounded-xl bg-surface",
                      selected && "ring-2 ring-deep ring-offset-2",
                    )}
                    aria-label={item.colorName}
                  >
                    <ProductMedia
                      art={product.art}
                      color={item.colorHex}
                      image={productImage(product.image, item.image)}
                      alt={item.colorName}
                      className="h-full w-full"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-5 px-4 md:mt-0 md:px-0">
          <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
            {product.name}
          </h1>
          <p className="mt-1 text-sm text-muted">By {product.brand}</p>
          <p className="mt-2 inline-flex items-center gap-1 text-sm font-bold">
            <Star className="size-4 fill-fresh text-fresh" />
            Certified stock · {variant.stock > 0 ? "In stock" : "Unavailable"}
          </p>

          <div className="mt-5 flex items-center justify-between gap-4">
            <p className="text-3xl font-bold tabular-nums">
              {naira(variant.price)}
              {discounted && (
                <span className="ml-2 text-base font-normal text-muted line-through">
                  {naira(variant.compareAt!)}
                </span>
              )}
            </p>
            {variant.stock > 0 && (
              <div className="flex h-11 items-center rounded-full bg-surface shadow-sm">
                <button
                  type="button"
                  className="flex size-11 cursor-pointer items-center justify-center disabled:opacity-40"
                  aria-label="Decrease quantity"
                  disabled={qty <= 1}
                  onClick={() => setQty((value) => Math.max(1, value - 1))}
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-6 text-center font-bold tabular-nums">{qty}</span>
                <button
                  type="button"
                  className="flex size-11 cursor-pointer items-center justify-center disabled:opacity-40"
                  aria-label="Increase quantity"
                  disabled={qty >= variant.stock}
                  onClick={() => setQty((value) => Math.min(variant.stock, value + 1))}
                >
                  <Plus className="size-4" />
                </button>
              </div>
            )}
          </div>

          <div className="mt-7">
            <p className="text-sm font-bold">Colour</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {colors.map((name) => {
                const swatch = product.variants.find((item) => item.colorName === name)!;
                const selected = name === variant.colorName;
                return (
                  <button
                    key={name}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => chooseColor(name)}
                    className={cn(
                      "inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border px-3.5 text-sm font-bold transition-all",
                      selected
                        ? "border-deep bg-deep/5 text-deep ring-2 ring-deep ring-offset-2"
                        : "border-black/10 hover:border-black/20",
                    )}
                  >
                    <span
                      className="size-4 rounded-full border border-black/10"
                      style={{ backgroundColor: swatch.colorHex }}
                    />
                    {name}
                  </button>
                );
              })}
            </div>
          </div>

          {showStorage && (
            <div className="mt-6">
              <p className="text-sm font-bold">{product.optionLabel}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {storages.map((item) => {
                  const selected = item === variant.storage;
                  return (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => chooseStorage(item)}
                      className={cn(
                        "inline-flex h-11 cursor-pointer items-center rounded-full px-4 text-sm font-bold transition-all",
                        selected
                          ? "bg-deep text-white shadow-sm"
                          : "border-0 bg-surface text-black hover:bg-black/[0.04]",
                      )}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-6">
            <p className="text-sm font-bold">Condition</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {grades.map((item) => (
                <ConditionChip
                  key={item.id}
                  condition={item.condition}
                  selected={item.id === variant.id}
                  onClick={() => {
                    setCondition(item.condition);
                    setQty(1);
                    setGradeOpen(true);
                  }}
                />
              ))}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {conditionMeta[variant.condition].blurb}
            </p>
            {variant.note && <p className="mt-1 text-sm text-muted">{variant.note}</p>}
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-black/[0.04] bg-surface p-5 shadow-sm">
            <p className="text-sm font-bold">Quick Specs</p>
            <ul className="mt-3 space-y-2.5 text-sm text-muted">
              {product.specs.slice(0, 4).map((spec) => (
                <li key={spec.label} className="flex justify-between gap-4">
                  <span>{spec.label}</span>
                  <span className="font-bold text-black">{spec.value}</span>
                </li>
              ))}
              <li className="flex justify-between gap-4">
                <span>Warranty</span>
                <span className="font-bold text-black">12 months</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 hidden gap-3 md:flex">
            <button
              type="button"
              disabled={variant.stock < 1}
              onClick={() => addToCart(true)}
              className="inline-flex h-14 flex-1 cursor-pointer items-center justify-center rounded-full border-2 border-deep text-base font-bold text-deep transition-all hover:bg-deep/5 disabled:opacity-40"
            >
              Buy Now
            </button>
            <button
              type="button"
              disabled={variant.stock < 1}
              onClick={() => addToCart(false)}
              className="inline-flex h-14 flex-1 cursor-pointer items-center justify-center rounded-full bg-deep text-base font-bold text-white shadow-sm transition-all hover:bg-[#0284c7] hover:shadow-md disabled:opacity-40"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-black/[0.06] bg-white/80 p-3 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-lg gap-3">
          <button
            type="button"
            disabled={variant.stock < 1}
            onClick={() => addToCart(true)}
            className="flex h-13 flex-1 cursor-pointer items-center justify-center rounded-full border-2 border-deep font-bold text-deep transition-colors disabled:opacity-40"
          >
            Buy Now
          </button>
          <button
            type="button"
            disabled={variant.stock < 1}
            onClick={() => addToCart(false)}
            className="flex h-13 flex-1 cursor-pointer items-center justify-center rounded-full bg-deep font-bold text-white shadow-sm transition-colors hover:bg-[#0284c7] disabled:opacity-40"
          >
            Add to Cart
          </button>
        </div>
      </div>

      <Sheet open={gradeOpen} title="Condition grades" onClose={() => setGradeOpen(false)}>
        <div className="space-y-5">
          {(Object.keys(conditionMeta) as Condition[]).map((grade) => (
            <div key={grade}>
              <ConditionChip condition={grade} />
              <p className="mt-2 text-sm leading-relaxed">{conditionMeta[grade].definition}</p>
            </div>
          ))}
        </div>
      </Sheet>
    </div>
  );
}

function unique(variants: Variant[], pick: (variant: Variant) => string) {
  return [...new Set(variants.map(pick))];
}
