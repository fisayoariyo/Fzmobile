"use client";

import { ConditionChip } from "@/components/condition-chip";
import { ProductMedia } from "@/components/product-media";
import { Sheet } from "@/components/sheet";
import { conditionMeta } from "@/lib/catalog";
import { cn, naira } from "@/lib/format";
import { productImage } from "@/lib/media";
import { useStore } from "@/lib/store";
import type { Condition, Product, Variant } from "@/lib/types";
import { Minus, Plus } from "lucide-react";
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
  const { add } = useStore();
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

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const apply = () => {
      document.body.style.paddingBottom = media.matches ? "88px" : "";
    };
    apply();
    media.addEventListener("change", apply);
    return () => {
      document.body.style.paddingBottom = "";
      media.removeEventListener("change", apply);
    };
  }, []);

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

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-6 md:grid-cols-2 md:gap-12 md:px-6 md:py-10">
      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
        <ProductMedia
          art={product.art}
          color={variant.colorHex}
          image={productImage(product.image, variant.image)}
          alt={`${product.name} in ${variant.colorName}`}
          className="aspect-square w-full"
          priority
        />
      </div>

      <div>
        <p className="text-sm font-bold text-muted">{product.brand}</p>
        <h1 className="mt-1 font-display text-4xl font-medium tracking-tight">{product.name}</h1>
        <p className="mt-4 text-2xl font-bold tabular-nums">
          {naira(variant.price)}
          {discounted && (
            <span className="ml-3 text-base font-normal text-muted line-through">
              {naira(variant.compareAt!)}
            </span>
          )}
        </p>
        {discounted && (
          <span className="mt-3 inline-flex rounded-full bg-black px-2.5 py-1 text-[11px] font-bold text-white">
            Deal
          </span>
        )}

        <div className="mt-8">
          <p className="text-sm font-bold">Colour · {variant.colorName}</p>
          {colors.length > 1 && (
            <div className="mt-2 flex flex-wrap">
              {colors.map((name) => {
                const swatch = product.variants.find((item) => item.colorName === name)!;
                const selected = name === variant.colorName;
                return (
                  <button
                    key={name}
                    type="button"
                    aria-label={name}
                    aria-pressed={selected}
                    onClick={() => chooseColor(name)}
                    className="flex size-12 cursor-pointer items-center justify-center"
                  >
                    <span
                      className={cn(
                        "size-7 rounded-full border border-black/15",
                        selected && "ring-2 ring-black ring-offset-2",
                      )}
                      style={{ backgroundColor: swatch.colorHex }}
                    />
                  </button>
                );
              })}
            </div>
          )}
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
                      "inline-flex h-12 cursor-pointer items-center rounded-full px-4 text-sm font-bold",
                      selected ? "bg-deep text-white" : "border border-black/15",
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
            {grades.map((item) => {
              const selected = item.id === variant.id;
              return (
                <ConditionChip
                  key={item.id}
                  condition={item.condition}
                  selected={selected}
                  onClick={() => {
                    setCondition(item.condition);
                    setQty(1);
                    setGradeOpen(true);
                  }}
                />
              );
            })}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">{conditionMeta[variant.condition].blurb}</p>
          {variant.note && <p className="mt-1 text-sm text-muted">{variant.note}</p>}
          {variant.batteryHealth != null && (
            <p className="mt-2 text-sm font-bold">Battery health {variant.batteryHealth}%</p>
          )}
          {variant.accessories && (
            <p className="mt-1 text-sm text-muted">Includes {variant.accessories}.</p>
          )}
        </div>

        <p className="mt-6 text-sm font-bold">
          {variant.stock === 0 ? "Unavailable" : variant.stock === 1 ? "Only 1 left" : "In stock"}
        </p>
        <p className="mt-2 text-sm leading-relaxed">{product.warranty}</p>
        <p className="mt-2 text-sm text-muted">
          Lagos rider, interstate motor park, or DHL / FedEx. The fee is confirmed at checkout.
        </p>

        {variant.stock > 0 && (
          <div className="mt-6 flex h-12 w-fit items-center rounded-full border border-black/15">
            <button
              type="button"
              className="flex size-12 cursor-pointer items-center justify-center disabled:opacity-40"
              aria-label="Decrease quantity"
              disabled={qty <= 1}
              onClick={() => setQty((value) => Math.max(1, value - 1))}
            >
              <Minus className="size-4" />
            </button>
            <span className="w-8 text-center font-bold tabular-nums">{qty}</span>
            <button
              type="button"
              className="flex size-12 cursor-pointer items-center justify-center disabled:opacity-40"
              aria-label="Increase quantity"
              disabled={qty >= variant.stock}
              onClick={() => setQty((value) => Math.min(variant.stock, value + 1))}
            >
              <Plus className="size-4" />
            </button>
          </div>
        )}

        <button
          type="button"
          disabled={variant.stock < 1}
          onClick={() => {
            add(variant.id, qty);
            window.setTimeout(() => router.push("/cart"), 0);
          }}
          className="mt-4 hidden h-12 w-full cursor-pointer rounded-full bg-deep font-bold text-white transition-colors duration-200 hover:bg-[#0f4a3b] disabled:cursor-not-allowed disabled:opacity-40 md:inline-flex md:items-center md:justify-center"
        >
          {variant.stock < 1 ? "Unavailable" : "Add to cart"}
        </button>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-black/10 bg-white p-3 md:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <p className="min-w-24 font-bold tabular-nums">{naira(variant.price)}</p>
          <button
            type="button"
            disabled={variant.stock < 1}
            onClick={() => {
            add(variant.id, qty);
            window.setTimeout(() => router.push("/cart"), 0);
          }}
          className="h-12 flex-1 cursor-pointer rounded-full bg-deep font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {variant.stock < 1 ? "Unavailable" : "Add to cart"}
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
