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
      className="group block cursor-pointer rounded-2xl border border-line bg-white p-3 shadow-xs transition-all duration-300 hover:border-ink hover:shadow-md md:p-4"
    >
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-surface p-2">
        {deal && (
          <span className="absolute left-2 top-2 z-10 rounded-full bg-ink px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white shadow-xs">
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
      <div className="mt-3">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink transition-colors group-hover:text-black">
          {product.name}
        </h3>
        <p className="mt-0.5 truncate text-xs text-muted">
          {variant.colorName} · {variant.storage}
        </p>
        <div className="mt-2 flex flex-wrap items-baseline gap-1.5">
          <span className="text-sm font-bold tabular-nums text-ink sm:text-base">
            {naira(variant.price)}
          </span>
          {discounted && (
            <span className="text-xs text-faint line-through tabular-nums">
              {naira(variant.compareAt!)}
            </span>
          )}
        </div>
        <p className="mt-1.5 text-[11px] text-faint">
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
