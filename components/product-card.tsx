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
      className="group block cursor-pointer rounded-3xl border border-[#dadce0] bg-white p-3.5 shadow-xs transition-all duration-200 hover:border-[#1a73e8]/40 hover:shadow-md md:p-4"
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#f8f9fa] flex items-center justify-center p-3">
        {deal && (
          <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-[#137333] px-2.5 py-0.5 text-[11px] font-medium text-white shadow-xs">
            Save {percentOff > 0 ? `${percentOff}%` : "Special"}
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
      <div className="mt-3.5">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-[#202124] transition-colors group-hover:text-[#1a73e8]">
          {product.name}
        </h3>
        <p className="mt-1 truncate text-xs text-[#5f6368]">
          {variant.colorName} · {variant.storage}
        </p>
        <div className="mt-2 flex flex-wrap items-baseline gap-1.5">
          <span className="text-base font-medium tabular-nums text-[#202124]">{naira(variant.price)}</span>
          {discounted && (
            <span className="text-xs text-[#5f6368] line-through tabular-nums">
              {naira(variant.compareAt!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
