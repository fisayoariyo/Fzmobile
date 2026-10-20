"use client";

import { ProductMedia } from "@/components/product-media";
import { Section, SectionIntro, TileRow, TileRowItem } from "@/components/apple-ui";
import { CATEGORIES, flashDeals, fromPrice, getProduct, products } from "@/lib/catalog";
import { naira } from "@/lib/format";
import { productImage } from "@/lib/media";
import { whatsappHref } from "@/lib/site";
import type { Product, Variant } from "@/lib/types";
import Link from "next/link";
import { useMemo } from "react";

/**
 * Landing page rebuilt on Apple's information architecture.
 *
 * apple.com leads with one oversized hero product, then a strip of product
 * tiles, then alternating full-bleed bands, then a large dark band, then the
 * dense link footer. Prices here stay visible because the store sells finite
 * stock over bank transfer.
 */

type Row = { product: Product; variant: Variant };

function bestVariant(product: Product): Variant | undefined {
  const inStock = product.variants.filter((v) => v.stock > 0);
  const pool = inStock.length > 0 ? inStock : product.variants;
  return [...pool].sort((a, b) => a.price - b.price)[0];
}

function rowsFor(predicate: (p: Product) => boolean, limit: number): Row[] {
  return products
    .filter(predicate)
    .map((product) => {
      const variant = bestVariant(product);
      return variant ? { product, variant } : null;
    })
    .filter((row): row is Row => row !== null)
    .sort((a, b) => b.product.createdAt.localeCompare(a.product.createdAt))
    .slice(0, limit);
}

function TileMedia({ product, variant, priority }: { product: Product; variant: Variant; priority?: boolean }) {
  return (
    <div className="relative h-full w-full">
      <ProductMedia
        art={product.art}
        color={variant.colorHex}
        image={productImage(product.image, variant.image)}
        alt={product.name}
        priority={priority}
        className="h-full w-full"
      />
    </div>
  );
}

export function HomeCommerce() {
  const deals = useMemo(() => flashDeals(), []);

  const hero = getProduct("iphone-16") ?? getProduct("iphone-15") ?? deals[0]?.product;
  const heroVariant = hero ? bestVariant(hero) : undefined;

  const latest = useMemo(() => rowsFor((p) => p.category === "phones", 4), []);
  const computing = useMemo(() => rowsFor((p) => p.category === "laptops", 3), []);
  const audio = useMemo(() => rowsFor((p) => p.category === "audio", 3), []);
  const featured = deals.slice(0, 4);

  return (
    <div className="tab-safe">
      {/* ── Hero: one product, oversized, on the light band ───────────── */}
      {hero && heroVariant && (
        <section className="bg-apple-band pb-16 pt-14 text-center md:pb-20 md:pt-16">
          <div className="store-container">
            <p className="type-caption uppercase tracking-wider">New</p>
            <h1 className="type-hero mt-3">{hero.name}</h1>
            <p className="type-body mx-auto mt-4 max-w-[520px] text-apple-muted">
              {heroVariant.colorName} · {heroVariant.storage} — authentic stock with exact
              condition and battery health stated up front.
            </p>

            <p className="mt-6 text-[19px] tracking-[-0.012em] text-apple-muted">
              From <span className="font-semibold text-apple-ink">{naira(fromPrice(hero))}</span>
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <Link href={`/product/${hero.slug}?v=${heroVariant.id}`} className="apple-button">
                Buy
              </Link>
              <Link href={`/product/${hero.slug}?v=${heroVariant.id}`} className="apple-link text-[17px]">
                Learn more <span aria-hidden>›</span>
              </Link>
            </div>

            <div className="mx-auto mt-12 h-[280px] w-full max-w-[620px] md:h-[420px]">
              <TileMedia product={hero} variant={heroVariant} priority />
            </div>
          </div>
        </section>
      )}

      {/* ── Product strip: the latest devices in a snap-scrolling row ──── */}
      <Section band="light">
        <SectionIntro
          headline="The latest. Take a look at what's new."
          subhead="Every device is verified before it ships. Exact colour, storage and grade on every listing."
        />
        <div className="mt-12">
          <TileRow>
            {latest.map(({ product, variant }) => (
              <TileRowItem key={product.slug} width="w-[300px]">
                <Link href={`/product/${product.slug}?v=${variant.id}`} className="group block">
                  <div className="h-[240px] w-full">
                    <TileMedia product={product} variant={variant} />
                  </div>
                  <p className="type-caption mt-5 uppercase tracking-wider">New</p>
                  <h3 className="mt-1 text-[21px] font-semibold leading-[1.19048] tracking-[-0.011em] text-apple-ink">
                    {product.name}
                  </h3>
                  <p className="mt-1.5 text-[14px] tracking-[-0.016em] text-apple-muted">
                    From {naira(fromPrice(product))}
                  </p>
                  <span className="apple-link mt-3 inline-block text-[14px]">
                    Buy <span aria-hidden>›</span>
                  </span>
                </Link>
              </TileRowItem>
            ))}
          </TileRow>
        </div>
      </Section>

      {/* ── Category bands: one full-bleed band per area ───────────────── */}
      <Section band="band">
        <SectionIntro
          headline="Explore the store."
          subhead="Six areas, every listing showing the exact colour, storage and condition."
        />

        <div className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => {
            const rows = rowsFor((p) => p.category === category.id, 1);
            const top = rows[0];
            return (
              <Link
                key={category.id}
                href={`/shop?category=${category.id}`}
                className="group flex flex-col items-center rounded-[18px] bg-white px-6 py-8 text-center transition-transform duration-300 hover:-translate-y-1"
              >
                {top ? (
                  <div className="h-[180px] w-full">
                    <TileMedia product={top.product} variant={top.variant} />
                  </div>
                ) : (
                  <div className="h-[180px] w-full" />
                )}
                <h3 className="mt-6 text-[21px] font-semibold leading-[1.19048] tracking-[-0.011em] text-apple-ink">
                  {category.label}
                </h3>
                <p className="mt-1.5 text-[14px] tracking-[-0.016em] text-apple-muted">
                  {category.name}
                </p>
                <span className="apple-link mt-4 text-[14px]">
                  Shop {category.label.toLowerCase()} <span aria-hidden>›</span>
                </span>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* ── Two-up feature: computing and audio ────────────────────────── */}
      <Section band="light" wide>
        <div className="grid gap-6 lg:grid-cols-2">
          {[
            { title: "Mac and laptops", rows: computing, href: "/shop?category=laptops" },
            { title: "Sound that carries", rows: audio, href: "/shop?category=audio" },
          ].map((block) => (
            <div key={block.title} className="rounded-[18px] bg-apple-band px-6 py-12 text-center">
              <h2 className="type-title">{block.title}</h2>
              <div className="mt-8 grid grid-cols-3 gap-4">
                {block.rows.map(({ product, variant }) => (
                  <Link
                    key={product.slug}
                    href={`/product/${product.slug}?v=${variant.id}`}
                    className="group block"
                  >
                    <div className="h-[130px] w-full">
                      <TileMedia product={product} variant={variant} />
                    </div>
                    <p className="mt-3 truncate text-[12px] font-semibold tracking-[-0.01em] text-apple-ink">
                      {product.name}
                    </p>
                    <p className="mt-0.5 text-[12px] text-apple-muted">
                      {naira(fromPrice(product))}
                    </p>
                  </Link>
                ))}
              </div>
              <Link href={block.href} className="apple-button-secondary mt-8 text-[14px]">
                Shop all
              </Link>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Deals ──────────────────────────────────────────────────────── */}
      {featured.length > 0 && (
        <Section band="band">
          <SectionIntro
            headline="Going, going. Shop the deals."
            subhead="Limited stock at reduced prices. Once it's gone, it's gone."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map(({ product, variant }) => (
              <Link
                key={product.slug}
                href={`/product/${product.slug}?v=${variant.id}`}
                className="group flex flex-col items-center rounded-[18px] bg-white px-5 py-8 text-center transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="h-[170px] w-full">
                  <TileMedia product={product} variant={variant} />
                </div>
                <h3 className="mt-5 text-[17px] font-semibold tracking-[-0.022em] text-apple-ink">
                  {product.name}
                </h3>
                <p className="mt-1 text-[14px] text-apple-muted">{variant.colorName}</p>
                <p className="mt-3 text-[17px] font-semibold tracking-[-0.022em] text-apple-ink">
                  {naira(variant.price)}
                </p>
                <span className="apple-link mt-3 text-[14px]">
                  Buy <span aria-hidden>›</span>
                </span>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* ── Dark band: the support/why-us moment ───────────────────────── */}
      <Section band="dark">
        <div className="text-center">
          <h2 className="type-headline text-white">Not sure which grade to pick?</h2>
          <p className="mx-auto mt-4 max-w-[560px] text-[19px] leading-[1.42115] tracking-[-0.012em] text-white/70">
            Send us your budget and what you need the device for. We&apos;ll tell you what we
            actually have in stock — no upselling, no surprises.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noreferrer"
              className="apple-button"
            >
              Chat with a Specialist
            </a>
            <Link
              href="/policies/warranty"
              className="text-[17px] tracking-[-0.022em] text-apple-link hover:underline"
            >
              Compare grades <span aria-hidden>›</span>
            </Link>
          </div>
        </div>
      </Section>

      {/* ── Direct entry points: dense link block ──────────────────────── */}
      <Section band="light">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {[
            ...CATEGORIES.map((category) => ({
              title: category.label,
              links: [
                { href: `/shop?category=${category.id}`, label: `All ${category.label.toLowerCase()}` },
                {
                  href: `/shop?category=${category.id}&condition=new_sealed`,
                  label: "Brand new sealed",
                },
                {
                  href: `/shop?category=${category.id}&condition=grade_a`,
                  label: "Pre-owned Grade A",
                },
                {
                  href: `/shop?category=${category.id}&condition=grade_b`,
                  label: "Pre-owned Grade B",
                },
              ],
            })),
            {
              title: "Shop by budget",
              links: [
                { href: "/shop?q=under%20500k", label: "Under ₦500k" },
                { href: "/shop?q=under%20800k", label: "₦500k – ₦800k" },
                { href: "/shop?q=under%201m", label: "₦800k – ₦1m" },
                { href: "/shop?deals=1", label: "Flash deals" },
              ],
            },
            {
              title: "Support",
              links: [
                { href: "/track", label: "Track an order" },
                { href: "/policies/warranty", label: "Warranty" },
                { href: "/policies/returns", label: "Returns & refunds" },
                { href: "/policies/delivery", label: "Delivery fees" },
              ],
            },
          ].map((group) => (
            <div key={group.title}>
              <p className="type-caption mb-3 uppercase tracking-wider">{group.title}</p>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-[14px] tracking-[-0.016em] text-apple-muted transition-colors hover:text-apple-link"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
