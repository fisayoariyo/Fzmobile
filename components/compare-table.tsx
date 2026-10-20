import { ProductMedia } from "@/components/product-media";
import { fromPrice } from "@/lib/catalog";
import { naira } from "@/lib/format";
import { productImage } from "@/lib/media";
import type { Product, Variant } from "@/lib/types";
import Link from "next/link";

/**
 * Apple-style compare table.
 *
 * Apple's iPhone page is dominated by one long comparison grid: product
 * image and name pinned at the top of each column, then a spec row per
 * attribute. On desktop it scrolls horizontally when products outnumber the
 * columns; on mobile each column becomes a stacked card.
 *
 * Spec rows are derived from the variants so the table always reflects real
 * catalogue data rather than hard-coded copy.
 */

type Row = { product: Product; variant: Variant };

const SPEC_LABELS: { key: string; label: string }[] = [
  { key: "Display", label: "Display" },
  { key: "Storage", label: "Storage" },
  { key: "SIM", label: "SIM" },
  { key: "Status", label: "Status" },
  { key: "Warranty", label: "Warranty" },
  { key: "Battery", label: "Battery" },
];

function specValue(product: Product, key: string): string {
  return product.specs.find((s) => s.label.toLowerCase() === key.toLowerCase())?.value ?? "—";
}

export function CompareTable({ rows }: { rows: Row[] }) {
  if (rows.length === 0) return null;

  return (
    <div className="scroll-row -mx-[1.375rem] overflow-x-auto px-[1.375rem] md:mx-0 md:px-0">
      <div
        className="grid min-w-max gap-x-5 border-t border-apple-line pt-8"
        style={{ gridTemplateColumns: `repeat(${rows.length}, minmax(180px, 1fr))` }}
      >
        {/* Header row: image, name, price, action */}
        {rows.map(({ product, variant }) => (
          <div key={product.slug} className="flex flex-col items-center text-center">
            <div className="flex h-[140px] items-center justify-center">
              <ProductMedia
                art={product.art}
                color={variant.colorHex}
                image={productImage(product.image, variant.image)}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <p className="mt-4 text-[14px] font-semibold leading-[1.28571] tracking-[-0.016em] text-apple-ink">
              {product.name}
            </p>
            <p className="mt-2 text-[14px] tracking-[-0.016em] text-apple-muted">
              From {naira(fromPrice(product))}
            </p>
            <div className="mt-4 flex flex-col items-center gap-2">
              <Link
                href={`/product/${product.slug}?v=${variant.id}`}
                className="apple-button text-[14px]"
              >
                Buy
              </Link>
              <Link
                href={`/product/${product.slug}?v=${variant.id}`}
                className="apple-link text-[14px]"
              >
                Learn more <span aria-hidden>›</span>
              </Link>
            </div>
          </div>
        ))}

        {/* One block per spec row: label spans all columns, then a value each. */}
        {SPEC_LABELS.map(({ key, label }) => {
          const values = rows.map(({ product }) => specValue(product, key));
          const allEmpty = values.every((v) => v === "—");
          if (allEmpty) return null;
          return (
            <div key={key} className="col-span-full mt-8 border-t border-apple-line pt-5">
              <p className="mb-4 text-[14px] font-semibold tracking-[-0.016em] text-apple-ink">
                {label}
              </p>
              <div
                className="grid gap-x-5"
                style={{ gridTemplateColumns: `repeat(${rows.length}, minmax(180px, 1fr))` }}
              >
                {values.map((value, i) => (
                  <p
                    key={`${rows[i].product.slug}-${key}`}
                    className="text-[14px] leading-[1.42859] tracking-[-0.016em] text-apple-muted"
                  >
                    {value}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
