import { ConditionChip } from "@/components/condition-chip";
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
  const image = productImage(product.image, variant.image);
  return (
    <Link
      href={`/product/${product.slug}?v=${variant.id}`}
      className="group block cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-black/10 bg-white transition-colors duration-200 group-hover:border-black/30">
        {discounted && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-black px-2.5 py-1 text-[11px] font-bold text-white">
            Deal
          </span>
        )}
        <ProductMedia
          art={product.art}
          color={variant.colorHex}
          image={image}
          alt={`${product.name} ${variant.colorName}`}
          className="h-full w-full"
        />
      </div>
      <div className="mt-3">
        <ConditionChip condition={variant.condition} />
        <h3 className="mt-2 line-clamp-2 text-[15px] font-bold leading-snug">{product.name}</h3>
        <p className="mt-1 truncate text-sm text-muted">
          {variant.colorName} · {variant.storage}
        </p>
        <p className="mt-2 text-base font-bold tabular-nums">{naira(variant.price)}</p>
        {discounted && (
          <p className="text-sm text-muted line-through tabular-nums">{naira(variant.compareAt!)}</p>
        )}
      </div>
    </Link>
  );
}
