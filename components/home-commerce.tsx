"use client";

import { ProductMedia } from "@/components/product-media";
import { SearchPill } from "@/components/search-pill";
import { flashDeals, getProduct, products } from "@/lib/catalog";
import { naira } from "@/lib/format";
import { productImage } from "@/lib/media";
import { useStore } from "@/lib/store";
import type { Product, Variant } from "@/lib/types";
import {
  Bell,
  CheckCircle2,
  Headphones,
  Laptop,
  MoreHorizontal,
  Shield,
  Smartphone,
  Speaker,
  Tablet,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const categories = [
  { href: "/shop?category=phones", label: "Mobile", icon: Smartphone },
  { href: "/shop?category=audio", label: "Audio", icon: Headphones },
  { href: "/shop?category=creation", label: "Tablets", icon: Tablet },
  { href: "/shop?category=laptops", label: "Laptops", icon: Laptop },
  { href: "/shop?category=power", label: "Power", icon: Speaker },
  { href: "/shop", label: "More", icon: MoreHorizontal },
] as const;

function DealCard({
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
      className="group block cursor-pointer rounded-2xl border border-line/50 bg-white p-3 shadow-sm card-hover"
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

export function HomeCommerce() {
  const { count } = useStore();
  const [tab, setTab] = useState<"top" | "new">("top");

  const deals = flashDeals();
  const topPicks = deals.slice(0, 8);
  const newArrivals = useMemo(() => {
    const rows: { product: Product; variant: Variant }[] = [];
    const sorted = [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    for (const product of sorted) {
      const variant =
        product.variants.find((item) => item.stock > 0) ?? product.variants[0];
      if (!variant) continue;
      rows.push({ product, variant });
      if (rows.length >= 8) break;
    }
    return rows;
  }, []);

  const grid = tab === "top" ? topPicks : newArrivals;
  const hero = getProduct("iphone-16") ?? getProduct("iphone-15") ?? deals[0]?.product;
  const heroVariant =
    hero?.variants.find((item) => item.stock > 0 && item.deal) ??
    hero?.variants.find((item) => item.stock > 0) ??
    hero?.variants[0];

  return (
    <div className="mx-auto max-w-lg px-4 pb-24 pt-2 md:max-w-6xl md:px-6 md:pb-12 md:pt-6">
      <header className="flex items-center justify-between gap-3 md:hidden">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-mist text-sm font-bold text-deep shadow-xs">
            Fz
          </span>
          <div className="min-w-0">
            <p className="truncate text-base font-bold leading-tight">Hello</p>
            <p className="truncate text-xs text-muted">Fzmobile Technologies</p>
          </div>
        </div>
        <Link
          href="/track"
          className="relative flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line/60 bg-surface shadow-xs transition-colors hover:bg-mist/30"
          aria-label="Order updates"
        >
          <Bell className="size-5 text-slate-700" />
          {count > 0 && (
            <span className="absolute right-2 top-2 size-2 rounded-full bg-deep" />
          )}
        </Link>
      </header>

      <div className="mt-4 flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <SearchPill />
        </div>
      </div>

      {hero && heroVariant && (
        <section className="relative mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-deep/90 p-6 text-white shadow-xl md:grid md:grid-cols-2 md:items-center md:gap-8 md:p-10 lg:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-deep/30 blur-3xl md:size-96"
          />
          <div className="relative z-10 max-w-md">
            <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-soft backdrop-blur-xs">
              Flagship Showcase
            </span>
            <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-white md:text-5xl">
              Best Picks. <span className="text-soft">Best Prices.</span>
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
              Discover top-rated devices at clear, marked-up prices with official warranty.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/shop"
                className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-white px-6 text-sm font-bold text-slate-900 shadow-md transition-all hover:scale-105 hover:bg-slate-100 active:scale-95"
              >
                Shop Now
              </Link>
              <Link
                href="/shop?deals=1"
                className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full border border-white/30 px-6 text-sm font-semibold text-white backdrop-blur-xs transition-all hover:border-white/50 hover:bg-white/10 active:scale-95"
              >
                View Deals
              </Link>
            </div>
          </div>
          <div className="relative z-10 mt-6 flex h-52 items-center justify-center sm:h-64 md:mt-0 md:h-72 lg:h-80">
            <div className="relative h-full w-full max-w-xs transition-transform duration-500 hover:scale-105 md:max-w-none">
              <ProductMedia
                art={hero.art}
                color={heroVariant.colorHex}
                image={productImage(hero.image, heroVariant.image)}
                alt={hero.name}
                className="h-full w-full object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </section>
      )}

      <section className="mt-8">
        <div className="grid grid-cols-3 gap-3 md:grid-cols-6 md:gap-4">
          {categories.map(({ href, label, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="group flex flex-col items-center gap-2 p-1.5 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <span className="flex size-16 items-center justify-center rounded-2xl border border-line/50 bg-surface text-deep shadow-sm transition-all duration-200 group-hover:scale-105 group-hover:border-deep/30 group-hover:bg-mist/40">
                <Icon className="size-6 transition-transform duration-200 group-hover:scale-110" />
              </span>
              <span className="text-center text-xs font-bold text-slate-800">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-line/60 bg-surface/70 px-3 py-4 shadow-xs sm:px-6">
        <div className="grid grid-cols-3 divide-x divide-line/60">
          <div className="flex flex-col items-center justify-center gap-1.5 px-2 text-center sm:flex-row sm:gap-2.5">
            <Shield className="size-5 shrink-0 text-deep" />
            <span className="text-xs font-medium text-muted sm:text-sm">12-Month Warranty</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1.5 px-2 text-center sm:flex-row sm:gap-2.5">
            <CheckCircle2 className="size-5 shrink-0 text-deep" />
            <span className="text-xs font-medium text-muted sm:text-sm">Verified Devices</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1.5 px-2 text-center sm:flex-row sm:gap-2.5">
            <Truck className="size-5 shrink-0 text-deep" />
            <span className="text-xs font-medium text-muted sm:text-sm">Fast Delivery</span>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between border-b border-line/60">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setTab("top")}
              className={`cursor-pointer pb-3 text-sm font-bold transition-colors ${
                tab === "top"
                  ? "border-b-2 border-deep text-deep"
                  : "border-b-2 border-transparent text-muted hover:text-black"
              }`}
            >
              Top Picks
            </button>
            <button
              type="button"
              onClick={() => setTab("new")}
              className={`cursor-pointer pb-3 text-sm font-bold transition-colors ${
                tab === "new"
                  ? "border-b-2 border-deep text-deep"
                  : "border-b-2 border-transparent text-muted hover:text-black"
              }`}
            >
              New Arrivals
            </button>
          </div>
          <Link
            href="/shop?deals=1"
            className="pb-3 text-sm font-bold text-deep hover:underline"
          >
            See All
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {grid.map(({ product, variant }) => (
            <DealCard key={`${tab}-${variant.id}`} product={product} variant={variant} />
          ))}
        </div>
      </section>
    </div>
  );
}
