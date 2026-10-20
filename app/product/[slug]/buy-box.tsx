"use client";

import { ConditionChip } from "@/components/condition-chip";
import { ProductMedia } from "@/components/product-media";
import { Sheet } from "@/components/sheet";
import { conditionMeta } from "@/lib/catalog";
import { naira } from "@/lib/format";
import { productImage } from "@/lib/media";
import { useStore } from "@/lib/store";
import type { Condition, Product, Variant } from "@/lib/types";
import { ArrowLeft, Minus, Plus, Share2, ShoppingBag } from "lucide-react";
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
    <div className="mx-auto max-w-lg bg-white pb-28 md:max-w-6xl md:pb-12">
      <div className="sticky top-0 z-20 flex h-14 items-center justify-between border-b borderapple-line/80 bg-white/90 px-3 backdrop-blur-xl md:hidden">
        <button
          type="button"
          aria-label="Back"
          onClick={() => router.back()}
          className="flex size-10 cursor-pointer items-center justify-center rounded-full border borderapple-line bg-white textapple-ink shadow-xs"
        >
          <ArrowLeft className="size-4" />
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Share"
            onClick={share}
            className="flex size-10 cursor-pointer items-center justify-center rounded-full border borderapple-line bg-white textapple-ink shadow-xs"
          >
            <Share2 className="size-4" />
          </button>
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative flex size-10 cursor-pointer items-center justify-center rounded-full border borderapple-line bg-white textapple-ink shadow-xs"
          >
            <ShoppingBag className="size-4" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bgapple-button px-1 text-[9px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 md:gap-14 md:px-6 md:pt-8">
        {/* Left Column: Google Store Image Gallery */}
        <div className="px-4 md:px-0">
          <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-3xl border borderapple-line bgapple-band p-8 shadow-xs">
            <ProductMedia
              art={product.art}
              color={variant.colorHex}
              image={productImage(product.image, variant.image)}
              alt={`${product.name} in ${variant.colorName}`}
              className="h-full w-full object-contain"
              priority
            />
          </div>

          {thumbVariants.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {thumbVariants.map((item) => {
                const selected = item.colorName === variant.colorName;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => chooseColor(item.colorName)}
                    className={`relative size-20 shrink-0 cursor-pointer overflow-hidden rounded-2xl border p-2 transition-all ${
                      selected
                        ? "borderapple-button bg-white shadow-xs ring-2 ringapple-button/30"
                        : "borderapple-line bgapple-band hover:borderapple-muted hover:bg-white"
                    }`}
                    aria-label={item.colorName}
                  >
                    <ProductMedia
                      art={product.art}
                      color={item.colorHex}
                      image={productImage(product.image, item.image)}
                      alt={item.colorName}
                      className="h-full w-full object-contain"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Buy Box Options */}
        <div className="mt-6 px-4 md:mt-0 md:px-0">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider textapple-muted">{product.brand}</p>
            <h1 className="mt-1 font-display text-3xl font-medium tracking-tight textapple-ink md:text-4xl">
              {product.name}
            </h1>
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-good">
              <span className="size-2 rounded-full bg-good" />
              Certified stock · {variant.stock > 0 ? "In stock & ready to ship" : "Currently unavailable"}
            </p>
          </div>

          {/* Pricing & Stepper */}
          <div className="mt-6 flex items-center justify-between gap-4 border-b borderapple-line pb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-medium tracking-tight textapple-ink tabular-nums">
                {naira(variant.price)}
              </span>
              {discounted && (
                <span className="text-sm font-normal textapple-muted line-through tabular-nums">
                  {naira(variant.compareAt!)}
                </span>
              )}
            </div>

            {variant.stock > 0 && (
              <div className="flex h-11 items-center rounded-full border borderapple-line bgapple-band px-1">
                <button
                  type="button"
                  className="flex size-9 cursor-pointer items-center justify-center rounded-full textapple-muted transition-colors hover:bg-white hover:textapple-ink disabled:opacity-30"
                  aria-label="Decrease quantity"
                  disabled={qty <= 1}
                  onClick={() => setQty((value) => Math.max(1, value - 1))}
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-8 text-center text-sm font-medium tabular-nums textapple-ink">
                  {qty}
                </span>
                <button
                  type="button"
                  className="flex size-9 cursor-pointer items-center justify-center rounded-full textapple-muted transition-colors hover:bg-white hover:textapple-ink disabled:opacity-30"
                  aria-label="Increase quantity"
                  disabled={qty >= variant.stock}
                  onClick={() => setQty((value) => Math.min(variant.stock, value + 1))}
                >
                  <Plus className="size-4" />
                </button>
              </div>
            )}
          </div>

          {/* Color Picker: Google Store concentric swatches */}
          <div className="mt-6">
            <p className="text-sm font-medium textapple-ink">
              Colour: <span className="font-normal textapple-muted">{variant.colorName}</span>
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {colors.map((name) => {
                const swatch = product.variants.find((item) => item.colorName === name)!;
                const selected = name === variant.colorName;
                return (
                  <button
                    key={name}
                    type="button"
                    aria-label={name}
                    title={name}
                    aria-pressed={selected}
                    onClick={() => chooseColor(name)}
                    className={`flex size-11 cursor-pointer items-center justify-center rounded-full transition-all ${
                      selected
                        ? "ring-2 ringapple-button ring-offset-2 ring-offset-white"
                        : "border border-transparent hover:borderapple-line"
                    }`}
                  >
                    <span
                      className="size-8 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: swatch.colorHex }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Storage Selection: Clean Material 3 segmented pill options */}
          {showStorage && (
            <div className="mt-6">
              <p className="text-sm font-medium textapple-ink">{product.optionLabel}</p>
              <div className="mt-2.5 flex flex-wrap gap-2.5">
                {storages.map((item) => {
                  const selected = item === variant.storage;
                  return (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => chooseStorage(item)}
                      className={`min-w-24 cursor-pointer rounded-xl border p-3 text-sm font-medium transition-all ${
                        selected
                          ? "borderapple-button bgapple-band textapple-button shadow-xs"
                          : "borderapple-line bg-white textapple-ink hover:borderapple-muted hover:bgapple-band"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Condition Grades: Google M3 tonal chips */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium textapple-ink">Condition</p>
              <button
                type="button"
                onClick={() => setGradeOpen(true)}
                className="cursor-pointer text-xs font-medium textapple-button hover:underline"
              >
                Grade guide
              </button>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {grades.map((item) => {
                const selected = item.id === variant.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setCondition(item.condition);
                      setQty(1);
                    }}
                    className={`cursor-pointer rounded-full px-4 py-2 text-xs font-medium transition-all ${
                      selected
                        ? "border borderapple-line bgapple-line textapple-ink shadow-xs"
                        : "border borderapple-line bgapple-band textapple-button hover:bgapple-line/60"
                    }`}
                  >
                    {conditionMeta[item.condition]?.label ?? item.condition}
                  </button>
                );
              })}
            </div>
            <p className="mt-2.5 text-xs leading-relaxed textapple-muted">
              {conditionMeta[variant.condition]?.blurb}
            </p>
            {variant.note && <p className="mt-1 text-xs textapple-muted">{variant.note}</p>}
          </div>

          {/* Quick Specs: Clean Google Store specs table */}
          <div className="mt-8 rounded-3xl border borderapple-line bgapple-band p-6 shadow-xs">
            <p className="text-sm font-medium textapple-ink">Quick specs</p>
            <ul className="mt-3 divide-y divideapple-line text-sm">
              {product.specs.slice(0, 4).map((spec) => (
                <li key={spec.label} className="flex justify-between py-2.5 first:pt-0 last:pb-0">
                  <span className="textapple-muted">{spec.label}</span>
                  <span className="font-medium textapple-ink">{spec.value}</span>
                </li>
              ))}
              <li className="flex justify-between py-2.5 last:pb-0">
                <span className="textapple-muted">Warranty</span>
                <span className="font-medium textapple-ink">12 months</span>
              </li>
            </ul>
          </div>

          {/* Desktop CTAs */}
          <div className="mt-8 hidden gap-3 md:flex">
            <button
              type="button"
              disabled={variant.stock < 1}
              onClick={() => addToCart(false)}
              className="inline-flex h-13 flex-1 cursor-pointer items-center justify-center rounded-full bgapple-button px-8 text-sm font-medium text-white shadow-sm transition-all hover:bgapple-button-hover hover:shadow-md disabled:opacity-40"
            >
              Add to cart
            </button>
            <button
              type="button"
              disabled={variant.stock < 1}
              onClick={() => addToCart(true)}
              className="inline-flex h-13 flex-1 cursor-pointer items-center justify-center rounded-full border borderapple-line bg-white px-8 text-sm font-medium textapple-button transition-all hover:bgapple-band disabled:opacity-40"
            >
              Buy now
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA Bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t borderapple-line bg-white/90 p-3 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-lg gap-3">
          <button
            type="button"
            disabled={variant.stock < 1}
            onClick={() => addToCart(false)}
            className="flex h-13 flex-1 cursor-pointer items-center justify-center rounded-full bgapple-button px-6 text-sm font-medium text-white shadow-sm transition-colors hover:bgapple-button-hover disabled:opacity-40"
          >
            Add to cart
          </button>
          <button
            type="button"
            disabled={variant.stock < 1}
            onClick={() => addToCart(true)}
            className="flex h-13 flex-1 cursor-pointer items-center justify-center rounded-full border borderapple-line bg-white px-6 text-sm font-medium textapple-button transition-colors hover:bgapple-band disabled:opacity-40"
          >
            Buy now
          </button>
        </div>
      </div>

      <Sheet open={gradeOpen} title="Condition grades" onClose={() => setGradeOpen(false)}>
        <div className="space-y-5">
          {(Object.keys(conditionMeta) as Condition[]).map((grade) => (
            <div key={grade} className="rounded-2xl border borderapple-line bgapple-band p-4">
              <ConditionChip condition={grade} />
              <p className="mt-2 text-sm leading-relaxed textapple-muted">{conditionMeta[grade].definition}</p>
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
