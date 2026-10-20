import { ProductMedia } from "@/components/product-media";
import { conditionMeta } from "@/lib/catalog";
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
      className="group block cursor-pointer transition-opacity duration-300 hover:opacity-90"
    >
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[18px] bg-apple-band p-4">
        {deal && (
          <span className="absolute left-3 top-3 z-10 rounded-[980px] bg-apple-ink px-2.5 py-1 text-[11px] tracking-[-0.01em] text-white">
            {percentOff > 0 ? `-${percentOff}%` : "Special"}
          </span>
        )}
        <div className="h-full w-full transition-transform duration-300 group-hover:scale-105">
          <ProductMedia
            art={product.art}
            color={variant.colorHex}
            image={image}
            alt={`${product.name} ${variant.colorName}`}
            className="h-full w-full object-contain"
          />
        </div>
      </div>
      <div className="mt-4">
        <h3 className="line-clamp-2 text-[14px] font-semibold leading-[1.28571] tracking-[-0.016em] text-apple-ink">
          {product.name}
        </h3>
        <p className="mt-1 truncate text-[12px] tracking-[-0.01em] text-apple-muted">
          {variant.colorName} · {variant.storage}
        </p>
        <div className="mt-2 flex flex-wrap items-baseline gap-1.5">
          <span className="text-[14px] font-semibold tabular-nums tracking-[-0.016em] text-apple-ink">
            {naira(variant.price)}
          </span>
          {discounted && (
            <span className="text-[12px] tabular-nums tracking-[-0.01em] text-apple-muted line-through">
              {naira(variant.compareAt!)}
            </span>
          )}
        </div>
        <p className="mt-1.5 text-[12px] tracking-[-0.01em] text-apple-muted">
          {variant.stock <= 2
            ? variant.stock === 1
              ? "Last one in stock"
              : "Only 2 left"
            : conditionMeta[variant.condition].label}
        </p>
      </div>
    </Link>
  );
}
