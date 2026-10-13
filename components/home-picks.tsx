"use client";

import { ProductMedia } from "@/components/product-media";
import { naira } from "@/lib/format";
import { productImage } from "@/lib/media";
import type { Product, Variant } from "@/lib/types";
import Link from "next/link";
import { useMemo, useState } from "react";

type Pick = { product: Product; variant: Variant };

const FILTERS = [
  { id: "all", label: "All tech" },
  { id: "phones", label: "Phones" },
  { id: "laptops", label: "Laptops" },
  { id: "audio", label: "Audio" },
  { id: "deals", label: "Deals" },
] as const;

export function HomePicks({ items }: { items: Pick[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");

  const visible = useMemo(() => {
    return items.filter(({ product, variant }) => {
      if (filter === "all") return true;
      if (filter === "deals") return Boolean(variant.deal);
      return product.category === filter;
    });
  }, [filter, items]);

  return (
    <div>
      <div className="scroll-row flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((item) => {
          const active = filter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`h-11 shrink-0 cursor-pointer rounded-full px-5 text-sm font-bold transition-colors duration-200 ${
                active
                  ? "bg-deep text-white"
                  : "bg-mist/70 text-black hover:bg-mist"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
        {visible.slice(0, 8).map(({ product, variant }) => {
          const image = productImage(product.image, variant.image);
          return (
            <article
              key={`${product.slug}-${variant.id}`}
              className="flex flex-col rounded-[1.5rem] bg-[#f2f8fc] p-3 md:p-4"
            >
              <Link
                href={`/product/${product.slug}?v=${variant.id}`}
                className="relative aspect-square overflow-hidden rounded-[1.25rem] bg-white"
              >
                <ProductMedia
                  art={product.art}
                  color={variant.colorHex}
                  image={image}
                  alt={product.name}
                  className="h-full w-full"
                />
                {variant.deal && (
                  <span className="absolute right-2 top-2 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-deep shadow-sm">
                    Deal
                  </span>
                )}
              </Link>
              <h3 className="mt-3 line-clamp-2 text-sm font-bold leading-snug md:text-[15px]">
                {product.name}
              </h3>
              <p className="mt-1 text-sm font-bold tabular-nums">{naira(variant.price)}</p>
              <Link
                href={`/product/${product.slug}?v=${variant.id}`}
                className="mt-3 inline-flex h-11 cursor-pointer items-center justify-center rounded-full border border-black/15 bg-white text-sm font-bold transition-colors duration-200 hover:border-deep hover:text-deep"
              >
                View device
              </Link>
            </article>
          );
        })}
      </div>

      {visible.length === 0 && (
        <p className="mt-8 text-sm text-muted">Nothing in this filter right now.</p>
      )}
    </div>
  );
}
