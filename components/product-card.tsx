import { ProductMedia } from "@/components/product-media";
import { naira } from "@/lib/format";
import { productImage } from "@/lib/media";
import type { Product, Variant } from "@/lib/types";
import Link from "next/link";

export function ProductCard({
  product,
  variant,
}: {
  product: Product;
  variant: Variant;
}) {
  const discounted = variant.compareAt != null && variant.compareAt > variant.price;
  const percentOff =
    discounted && variant.compareAt
      ? Math.round(((variant.compareAt - variant.price) / variant.compareAt) * 100)
      : 0;
  const image = productImage(product.image, variant.image);
  const deal = Boolean(variant.deal) || discounted;

  return (
    <Link
      href={`/product/${product.slug}?v=${variant.id}`}
      className="group block cursor-pointer rounded-2xl border border-black/[0.04] bg-white p-3 shadow-sm card-hover"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-surface">
        {deal && (
          <span className="absolute right-2.5 top-2.5 z-10 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
            Deal
          </span>
        )}
        <div className="h-full w-full transition-transform duration-300 group-hover:scale-105">
          <ProductMedia
            art={product.art}
            color={variant.colorHex}
            image={image}
            alt={`${product.name} ${variant.colorName}`}
            className="h-full w-full"
          />
        </div>
      </div>
      <h3 className="mt-3 line-clamp-2 text-sm font-semibold leading-snug text-black">
        {product.name}
      </h3>
      <p className="mt-1 truncate text-xs text-muted">
        {variant.colorName} · {variant.storage}
      </p>
      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
        <span className="text-base font-bold tabular-nums text-deep">{naira(variant.price)}</span>
        {discounted && (
          <>
            <span className="text-xs text-muted line-through tabular-nums">
              {naira(variant.compareAt!)}
            </span>
            {percentOff > 0 && (
              <span className="rounded-full bg-accent/10 px-1.5 py-0.5 text-[10px] font-bold text-accent">
                -{percentOff}%
              </span>
            )}
          </>
        )}
      </div>
    </Link>
  );
}
