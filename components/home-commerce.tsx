"use client";

import { FullStoreShowroom } from "@/components/full-store-showroom";
import { ProductCard } from "@/components/product-card";
import { ProductMedia } from "@/components/product-media";
import { SearchPill } from "@/components/search-pill";
import { StoreShowroom3D } from "@/components/store-showroom-3d";
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
  Sparkles,
  Speaker,
  Store,
  Tablet,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const categories = [
  { href: "/shop?category=phones", label: "Phones", icon: Smartphone },
  { href: "/shop?category=audio", label: "Audio", icon: Headphones },
  { href: "/shop?category=creation", label: "Tablets", icon: Tablet },
  { href: "/shop?category=laptops", label: "Laptops", icon: Laptop },
  { href: "/shop?category=power", label: "Accessories", icon: Speaker },
  { href: "/shop", label: "All Products", icon: MoreHorizontal },
] as const;

export function HomeCommerce() {
  const { count } = useStore();
  const [tab, setTab] = useState<"top" | "new">("top");
  const [viewMode, setViewMode] = useState<"3d" | "classic">("3d");
  const [selectedShowroomIndex, setSelectedShowroomIndex] = useState(0);

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
    <div>
      {/* Desktop Full-Bleed 3D Showroom Hero */}
      <div className="hidden md:block">
        <FullStoreShowroom featured={topPicks} />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-24 pt-3 sm:px-6 md:pb-16 md:pt-10">
        {/* Mobile Header */}
        <header className="flex items-center justify-between gap-3 md:hidden">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#e8f0fe] text-xs font-bold text-[#1a73e8]">
              FZ
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#202124]">FZ Mobile</p>
              <p className="truncate text-xs text-[#5f6368]">Official Store Nigeria</p>
            </div>
          </div>
          <Link
            href="/track"
            className="relative flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#dadce0] bg-[#ffffff] text-[#5f6368] transition-colors hover:bg-[#f8f9fa]"
            aria-label="Order updates"
          >
            <Bell className="size-4.5" />
            {count > 0 && (
              <span className="absolute right-2 top-2 size-2 rounded-full bg-[#1a73e8]" />
            )}
          </Link>
        </header>

        {/* Mobile Search Input */}
        <div className="mt-3 md:hidden">
          <SearchPill />
        </div>

        {/* Mobile Storefront Hero (Clean, fast, non-cluttered) */}
        {hero && heroVariant && (
          <section className="relative mt-4 rounded-3xl border border-[#e3edf7] bg-[#f8fafd] p-6 overflow-hidden md:hidden">
            <div className="relative z-10">
              <span className="inline-block text-[#1a73e8] font-semibold text-xs tracking-wider uppercase mb-1">
                FZ Mobile Store
              </span>
              <h1 className="text-3xl font-semibold tracking-tight text-[#202124] leading-tight">
                Discover devices made to inspire.
              </h1>
              <p className="mt-2 text-sm text-[#5f6368]">
                Authentic manufacturer warranties with fast nationwide delivery.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Link
                  href="/shop?q=under%20500k"
                  className="rounded-full bg-white border border-[#dadce0] px-3 py-1 text-xs font-medium text-[#3c4043]"
                >
                  Under ₦500k
                </Link>
                <Link
                  href="/shop?q=under%20800k"
                  className="rounded-full bg-white border border-[#dadce0] px-3 py-1 text-xs font-medium text-[#3c4043]"
                >
                  Under ₦800k
                </Link>
                <Link
                  href="/shop?q=iphone"
                  className="rounded-full bg-white border border-[#dadce0] px-3 py-1 text-xs font-medium text-[#3c4043]"
                >
                  iPhones
                </Link>
              </div>
            </div>
            <div className="mt-4 flex h-48 items-center justify-center">
              <ProductMedia
                art={hero.art}
                color={heroVariant.colorHex}
                image={productImage(hero.image, heroVariant.image)}
                alt={hero.name}
                className="h-full w-full object-contain"
                priority
              />
            </div>
          </section>
        )}


      {/* Category Bar (Material 3 Segmented Pills) */}
      <section className="mt-8">
        <div className="scroll-row flex items-center gap-2.5 overflow-x-auto pb-2 md:flex-wrap md:justify-center md:overflow-visible">
          {categories.map(({ href, label, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#dadce0] hover:bg-[#f8f9fa] text-xs font-medium text-[#3c4043] transition-all whitespace-nowrap"
            >
              <Icon className="size-4 text-[#5f6368]" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Google Store Value Props / Assurance Bar */}
      <section className="mt-8 rounded-3xl border border-[#dadce0] bg-[#ffffff] p-5 sm:p-6 shadow-xs">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 md:divide-x md:divide-[#dadce0]">
          <div className="flex items-center gap-3.5 px-2">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#e8f0fe] text-[#1a73e8]">
              <Shield className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#202124]">Official 12-Month Warranty</p>
              <p className="text-xs text-[#5f6368]">Peace of mind on every order</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 px-2 md:pl-6">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#e6f4ea] text-[#137333]">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#202124]">Free Verified Inspection</p>
              <p className="text-xs text-[#5f6368]">Multi-point quality certification</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 px-2 md:pl-6">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#e8f0fe] text-[#1a73e8]">
              <Truck className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#202124]">Direct Lagos Delivery</p>
              <p className="text-xs text-[#5f6368]">Express door-to-door dispatch</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase Section */}
      <section className="mt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#dadce0] pb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTab("top")}
              className={`cursor-pointer px-5 py-2 rounded-full font-medium text-sm transition-all ${
                tab === "top"
                  ? "bg-[#c2e7ff] text-[#001d35]"
                  : "border border-[#dadce0] text-[#5f6368] hover:bg-[#f8f9fa]"
              }`}
            >
              Top Picks
            </button>
            <button
              type="button"
              onClick={() => setTab("new")}
              className={`cursor-pointer px-5 py-2 rounded-full font-medium text-sm transition-all ${
                tab === "new"
                  ? "bg-[#c2e7ff] text-[#001d35]"
                  : "border border-[#dadce0] text-[#5f6368] hover:bg-[#f8f9fa]"
              }`}
            >
              New Arrivals
            </button>
          </div>
          <Link
            href="/shop?deals=1"
            className="text-sm font-medium text-[#1a73e8] hover:underline"
          >
            Explore all deals &rarr;
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {grid.map(({ product, variant }) => (
            <ProductCard
              key={`${tab}-${variant.id}`}
              product={product}
              variant={variant}
            />
          ))}
        </div>
      </section>
      </div>
    </div>
  );
}
