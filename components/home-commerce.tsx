"use client";

import { CategoryRail } from "@/components/category-rail";
import { ConditionGuide } from "@/components/condition-guide";
import { ProductCard } from "@/components/product-card";
import { ProductMedia } from "@/components/product-media";
import { StoreSearch } from "@/components/store-search";
import { conditionMeta, flashDeals, getProduct, products } from "@/lib/catalog";
import { naira } from "@/lib/format";
import { productImage } from "@/lib/media";
import { whatsappHref } from "@/lib/site";
import type { Product, Variant } from "@/lib/types";
import {
  ArrowRight,
  BadgeCheck,
  ShieldCheck,
  Truck,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const budgets = [
  { href: "/shop?q=under%20500k", label: "Under ₦500k", note: "Everyday devices" },
  { href: "/shop?q=under%20800k", label: "₦500k – ₦800k", note: "Mid-range flagships" },
  { href: "/shop?q=under%201m", label: "₦800k – ₦1m", note: "Upper mid-range" },
  { href: "/shop?category=phones&sort=price-desc", label: "₦1m and above", note: "Latest flagships" },
] as const;

const trust = [
  {
    icon: ShieldCheck,
    title: "12-month warranty",
    body: "Grade-by-grade terms, stated up front.",
    tone: "brand" as const,
  },
  {
    icon: BadgeCheck,
    title: "Verified inspection",
    body: "Multi-point check on every unit.",
    tone: "good" as const,
  },
  {
    icon: Truck,
    title: "Nationwide delivery",
    body: "Lagos same-day, interstate 1–3 days.",
    tone: "brand" as const,
  },
  {
    icon: Wallet,
    title: "Bank transfer",
    body: "Receipt verified before dispatch.",
    tone: "good" as const,
  },
];

function SectionHeading({
  eyebrow,
  title,
  href,
  action,
}: {
  eyebrow?: string;
  title: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-line pb-3">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-faint">
            {eyebrow}
          </p>
        )}
        <h2 className="text-lg font-semibold text-ink md:text-xl">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className="shrink-0 text-sm font-medium text-brand hover:underline"
        >
          {action ?? "See all"} →
        </Link>
      )}
    </div>
  );
}

export function HomeCommerce() {
  const [tab, setTab] = useState<"top" | "new">("top");

  const deals = useMemo(() => flashDeals(), []);
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

  const dealStrip = deals.slice(0, 6);

  return (
    <div className="tab-safe">
      {/* Hero — one layout for every breakpoint */}
      <section className="border-b border-line bg-surface">
        <div className="store-container grid gap-8 py-10 md:grid-cols-2 md:items-center md:gap-12 md:py-16">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
              <BadgeCheck className="size-3.5" />
              Fzmobile · Official Store Nigeria
            </span>

            <h1 className="mt-4 text-3xl font-semibold leading-[1.15] tracking-tight text-ink sm:text-4xl md:text-5xl">
              Every device, exactly as described.
            </h1>

            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted md:text-base">
              Exact colour, storage, condition and battery health on every listing.
              Authentic stock, honest grades, prices in Naira.
            </p>

            <div className="mt-6 max-w-xl">
              <StoreSearch autoComplete />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              {budgets.map((budget) => (
                <Link
                  key={budget.href}
                  href={budget.href}
                  className="rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-medium text-ink transition-colors hover:border-brand hover:bg-brand-soft hover:text-brand"
                >
                  {budget.label}
                </Link>
              ))}
            </div>
          </div>

          {hero && heroVariant && (
            <div className="animate-rise-delayed">
              <div className="relative overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-xs md:p-8">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-faint">
                      Featured this week
                    </p>
                    <p className="mt-0.5 truncate text-base font-semibold text-ink">
                      {hero.name}
                    </p>
                    <p className="truncate text-xs text-muted">
                      {heroVariant.colorName} · {heroVariant.storage}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-muted">
                    {conditionMeta[heroVariant.condition].label}
                  </span>
                </div>

                <div className="relative mx-auto mt-4 flex h-52 items-center justify-center md:h-64">
                  <ProductMedia
                    art={hero.art}
                    color={heroVariant.colorHex}
                    image={productImage(hero.image, heroVariant.image)}
                    alt={hero.name}
                    className="h-full w-full object-contain"
                    priority
                  />
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4">
                  <div>
                    <p className="text-[11px] text-faint">From</p>
                    <p className="text-xl font-bold text-ink tabular-nums">
                      {naira(heroVariant.price)}
                    </p>
                  </div>
                  <Link
                    href={`/product/${hero.slug}?v=${heroVariant.id}`}
                    className="inline-flex h-11 items-center gap-1.5 rounded-full bg-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
                  >
                    View device
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="store-container pb-16 pt-10 md:pb-20">
        {/* Categories */}
        <section>
          <SectionHeading
            eyebrow="Browse"
            title="Shop by category"
            href="/shop"
            action="All tech"
          />
          <div className="mt-5">
            <CategoryRail />
          </div>
        </section>

        {/* Trust */}
        <section className="mt-10 rounded-3xl border border-line bg-white p-5 md:p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
            {trust.map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                    item.tone === "good"
                      ? "bg-good-soft text-good"
                      : "bg-brand-soft text-brand"
                  }`}
                >
                  <item.icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink">{item.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Deals strip */}
        {dealStrip.length > 0 && (
          <section className="mt-12">
            <SectionHeading
              eyebrow="Limited stock"
              title="Flash deals"
              href="/shop?deals=1"
              action="All deals"
            />
            <div className="scroll-row -mx-4 mt-5 flex gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
              {dealStrip.map(({ product, variant }) => (
                <div key={variant.id} className="w-40 shrink-0 md:w-48">
                  <ProductCard product={product} variant={variant} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Top picks / new arrivals */}
        <section className="mt-12">
          <div className="flex flex-col gap-4 border-b border-line pb-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-2">
              {(["top", "new"] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  className={`cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-all ${
                    tab === key
                      ? "bg-pill text-brand-ink"
                      : "border border-line text-muted hover:bg-surface"
                  }`}
                >
                  {key === "top" ? "Top Picks" : "New Arrivals"}
                </button>
              ))}
            </div>
            <Link
              href={tab === "top" ? "/shop?deals=1" : "/shop?sort=newest"}
              className="text-sm font-medium text-brand hover:underline"
            >
              {tab === "top" ? "All deals" : "All new"} →
            </Link>
          </div>

          {grid.length === 0 ? (
            <p className="mt-6 text-sm text-muted">No devices in this list right now.</p>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {grid.map(({ product, variant }) => (
                <ProductCard
                  key={`${tab}-${variant.id}`}
                  product={product}
                  variant={variant}
                />
              ))}
            </div>
          )}
        </section>

        {/* Shop by budget */}
        <section className="mt-12">
          <SectionHeading eyebrow="Find your range" title="Shop by budget" href="/shop" />
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            {budgets.map((budget) => (
              <Link
                key={budget.href}
                href={budget.href}
                className="card-hover rounded-2xl border border-line bg-white p-4 transition-colors hover:border-brand"
              >
                <p className="text-sm font-semibold text-ink md:text-base">
                  {budget.label}
                </p>
                <p className="mt-1 text-xs text-muted">{budget.note}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Condition guide */}
        <section className="mt-12">
          <SectionHeading
            eyebrow="Know what you're buying"
            title="Grades explained"
            href="/policies/warranty"
            action="Warranty terms"
          />
          <div className="mt-5">
            <ConditionGuide />
          </div>
        </section>

        {/* Support band */}
        <section className="mt-12 overflow-hidden rounded-3xl border border-line bg-ink p-6 text-white md:p-10">
          <div className="grid gap-6 md:grid-cols-[1.5fr_1fr] md:items-center">
            <div>
              <h2 className="text-xl font-semibold md:text-2xl">
                Not sure which grade or storage to pick?
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/70">
                Send us your budget and what you need the device for. We&apos;ll tell you
                what we actually have in stock — no upselling, no surprises.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-ink transition-colors hover:bg-white/90"
              >
                Chat on WhatsApp
              </a>
              <Link
                href="/track"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Track an order
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
