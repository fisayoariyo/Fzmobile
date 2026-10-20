"use client";

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
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-3 sm:px-6 md:pb-16 md:pt-6">
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

      {/* Search pill on mobile */}
      <div className="mt-3 md:hidden">
        <SearchPill />
      </div>

      {/* Mode Switcher: 3D Showroom vs Classic Store */}
      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 rounded-full border border-[#dadce0] bg-[#f8f9fa] p-1 shadow-xs">
          <button
            type="button"
            onClick={() => setViewMode("3d")}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              viewMode === "3d"
                ? "bg-[#1a73e8] text-white shadow-xs"
                : "text-[#5f6368] hover:text-[#202124]"
            }`}
          >
            <Sparkles className="size-3.5" />
            <span>3D Showroom</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("classic")}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              viewMode === "classic"
                ? "bg-[#1a73e8] text-white shadow-xs"
                : "text-[#5f6368] hover:text-[#202124]"
            }`}
          >
            <Store className="size-3.5" />
            <span>Standard Store</span>
          </button>
        </div>

        <span className="hidden text-xs text-[#5f6368] sm:inline">
          Interactive WebGL Flagship Store
        </span>
      </div>

      {/* 3D Interactive Showroom View */}
      {viewMode === "3d" && (
        <section className="mt-4 animate-scale-up">
          <StoreShowroom3D
            featured={topPicks}
            selectedIndex={selectedShowroomIndex}
            onSelectProduct={(idx) => setSelectedShowroomIndex(idx)}
          />

          {/* Quick Inspector Strip for the Selected 3D Phone */}
          {topPicks[selectedShowroomIndex] && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#dadce0] bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-[#f8f9fa] p-1">
                  <ProductMedia
                    art={topPicks[selectedShowroomIndex].product.art}
                    color={topPicks[selectedShowroomIndex].variant.colorHex}
                    image={productImage(
                      topPicks[selectedShowroomIndex].product.image,
                      topPicks[selectedShowroomIndex].variant.image
                    )}
                    alt={topPicks[selectedShowroomIndex].product.name}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#202124]">
                    {topPicks[selectedShowroomIndex].product.name}
                  </h3>
                  <p className="text-xs text-[#5f6368]">
                    {topPicks[selectedShowroomIndex].variant.colorName} ·{" "}
                    {topPicks[selectedShowroomIndex].variant.storage}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-base font-semibold tabular-nums text-[#202124]">
                  {naira(topPicks[selectedShowroomIndex].variant.price)}
                </span>
                <Link
                  href={`/product/${topPicks[selectedShowroomIndex].product.slug}?v=${topPicks[selectedShowroomIndex].variant.id}`}
                  className="rounded-full bg-[#1a73e8] px-5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#1557b0]"
                >
                  Inspect & Buy →
                </Link>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Classic Editorial Hero Section */}
      {viewMode === "classic" && hero && heroVariant && (
        <section className="relative mt-4 md:mt-0 rounded-3xl bg-[#f8fafd] border border-[#e3edf7] p-8 md:p-12 lg:p-16 overflow-hidden animate-scale-up">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 lg:gap-12">
            <div className="relative z-10 max-w-xl">
              <span className="inline-block text-[#1a73e8] font-semibold text-xs tracking-wider uppercase mb-2">
                FZ Mobile Store
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-[#202124] leading-[1.1]">
                Discover devices made to inspire.
              </h1>
              <p className="text-base md:text-lg text-[#5f6368] max-w-lg mt-4 font-normal leading-relaxed">
                Experience premium phones, tablets, and audio with authentic manufacturer warranties and nationwide delivery.
              </p>
              <div className="mt-6 max-w-lg">
                <SearchPill variant="hero" />
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-[#5f6368]">Quick find:</span>
                  <Link
                    href="/shop?q=under%20500k"
                    className="rounded-full bg-white border border-[#dadce0] hover:border-[#1a73e8] hover:text-[#1a73e8] px-3 py-1 text-xs font-medium text-[#3c4043] transition-colors shadow-xs"
                  >
                    Under ₦500k
                  </Link>
                  <Link
                    href="/shop?q=under%20800k"
                    className="rounded-full bg-white border border-[#dadce0] hover:border-[#1a73e8] hover:text-[#1a73e8] px-3 py-1 text-xs font-medium text-[#3c4043] transition-colors shadow-xs"
                  >
                    Under ₦800k
                  </Link>
                  <Link
                    href="/shop?q=iphone"
                    className="rounded-full bg-white border border-[#dadce0] hover:border-[#1a73e8] hover:text-[#1a73e8] px-3 py-1 text-xs font-medium text-[#3c4043] transition-colors shadow-xs"
                  >
                    iPhones
                  </Link>
                  <Link
                    href="/shop?q=pixel"
                    className="rounded-full bg-white border border-[#dadce0] hover:border-[#1a73e8] hover:text-[#1a73e8] px-3 py-1 text-xs font-medium text-[#3c4043] transition-colors shadow-xs"
                  >
                    Pixels
                  </Link>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/shop?category=phones"
                  className="rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white px-6 py-2.5 text-xs font-medium transition-all shadow-sm"
                >
                  Browse all phones
                </Link>
                <Link
                  href="/shop?deals=1"
                  className="rounded-full border border-[#dadce0] hover:bg-black/[0.03] text-[#1a73e8] px-6 py-2.5 text-xs font-medium transition-all"
                >
                  Explore deals
                </Link>
              </div>
            </div>

            <div className="relative z-10 flex h-64 items-center justify-center sm:h-80 md:h-96">
              <div className="relative h-full w-full max-w-sm transition-transform duration-500 hover:scale-105">
                <ProductMedia
                  art={hero.art}
                  color={heroVariant.colorHex}
                  image={productImage(hero.image, heroVariant.image)}
                  alt={hero.name}
                  className="h-full w-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.12)]"
                  priority
                />
              </div>
            </div>
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
  );
}
