"use client";

import { ProductMedia } from "@/components/product-media";
import { Sheet } from "@/components/sheet";
import { friends as allFriends, getProduct } from "@/lib/catalog";
import { productImage } from "@/lib/media";
import type { Friend } from "@/lib/types";
import { Play } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function FriendsRow({
  items = allFriends,
  layout = "row",
}: {
  items?: Friend[];
  layout?: "row" | "grid";
}) {
  const [open, setOpen] = useState<Friend | null>(null);
  const product = open ? getProduct(open.productSlug) : null;
  const variant = product?.variants[0];

  const cards = items.map((friend) => {
    const linked = getProduct(friend.productSlug);
    const swatch = linked?.variants[0];
    return (
      <button
        key={friend.id}
        type="button"
        onClick={() => setOpen(friend)}
        className={
          layout === "grid"
            ? "w-full cursor-pointer text-left"
            : "w-[148px] shrink-0 cursor-pointer text-left"
        }
      >
        <span className="relative block aspect-[9/16] overflow-hidden rounded-2xl border border-black/10 bg-white">
          {linked && swatch && (
            <ProductMedia
              art={linked.art}
              color={swatch.colorHex}
              image={productImage(linked.image, swatch.image)}
              alt={linked.name}
              className="h-full w-full"
            />
          )}
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-white/90">
              <Play className="ml-0.5 size-5 fill-black text-black" />
            </span>
          </span>
        </span>
        <span className="mt-2 block text-sm font-bold">{friend.name}</span>
        <span className="mt-1 inline-flex items-center rounded-full border border-deep bg-white px-2 py-1 text-[11px] font-bold text-deep">
          Verified Buyer
        </span>
      </button>
    );
  });

  return (
    <>
      {layout === "row" ? (
        <div className="scroll-row -mx-4 flex gap-3 overflow-x-auto px-4 md:-mx-6 md:px-6">{cards}</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">{cards}</div>
      )}
      <Sheet open={open != null} title={open?.name ?? "Friend"} onClose={() => setOpen(null)}>
        {open && product && variant && (
          <div>
            <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white">
              <ProductMedia
                art={product.art}
                color={variant.colorHex}
                image={productImage(product.image, variant.image)}
                alt={product.name}
                className="aspect-[4/5] w-full"
              />
            </div>
            <p className="mt-4 text-base leading-relaxed">{open.caption}</p>
            <p className="mt-3 inline-flex items-center rounded-full border border-deep px-2.5 py-1 text-xs font-bold text-deep">
              Verified Buyer
            </p>
            <Link
              href={`/product/${product.slug}`}
              className="mt-6 inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-full bg-deep font-bold text-white"
              onClick={() => setOpen(null)}
            >
              View {open.productLabel}
            </Link>
          </div>
        )}
      </Sheet>
    </>
  );
}
