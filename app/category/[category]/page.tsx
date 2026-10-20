import { CompareTable } from "@/components/compare-table";
import { Section, SectionIntro } from "@/components/apple-ui";
import { ProductMedia } from "@/components/product-media";
import { CATEGORIES, categoryById, products } from "@/lib/catalog";
import { productImage } from "@/lib/media";
import type { Product, Variant } from "@/lib/types";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

/**
 * Apple-style category landing page.
 *
 * Mirrors apple.com's product landing: a marketing hero, a compare grid of
 * everything in the category, a "why buy here" band, then the dense link
 * block. One page per category, generated statically.
 */

type Row = { product: Product; variant: Variant };

/** Headline copy per category, in Apple's short marketing register. */
const categoryCopy: Record<string, { headline: string; subhead: string; hero: string }> = {
  phones: {
    hero: "iPhone and more",
    headline: "Which phone is right for you?",
    subhead: "Every handset verified, graded honestly, and priced in Naira.",
  },
  laptops: {
    hero: "Mac and laptops",
    headline: "Power to do your best work.",
    subhead: "MacBooks, HP and Dell — checked, graded, and covered by warranty.",
  },
  audio: {
    hero: "Audio",
    headline: "Sound worth carrying.",
    subhead: "AirPods, JBL and Beats, with the finish and condition stated exactly.",
  },
  power: {
    hero: "Power",
    headline: "Charge and connect.",
    subhead: "Genuine adapters and charging essentials.",
  },
  creation: {
    hero: "Creation",
    headline: "Make something worth keeping.",
    subhead: "iPad, Apple Pencil and Meta Ray-Ban, ready to create.",
  },
  gaming: {
    hero: "Gaming",
    headline: "Play without waiting.",
    subhead: "Consoles and handhelds, tested before they ship.",
  },
};

function bestVariant(product: Product): Variant | undefined {
  const inStock = product.variants.filter((v) => v.stock > 0);
  const pool = inStock.length > 0 ? inStock : product.variants;
  return [...pool].sort((a, b) => a.price - b.price)[0];
}

function rowsForCategory(id: string): Row[] {
  return products
    .filter((p) => p.category === id)
    .map((product) => {
      const variant = bestVariant(product);
      return variant ? { product, variant } : null;
    })
    .filter((row): row is Row => row !== null)
    .sort((a, b) => b.product.createdAt.localeCompare(a.product.createdAt));
}

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category: category.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const meta = categoryById(category);
  if (!meta) return { title: "Not found" };
  const copy = categoryCopy[category];
  return {
    title: copy?.hero ?? meta.label,
    description: copy?.subhead ?? `Shop ${meta.label.toLowerCase()} at Fzmobile.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const meta = categoryById(category);
  if (!meta) notFound();

  const copy = categoryCopy[category] ?? {
    hero: meta.label,
    headline: `Shop ${meta.label.toLowerCase()}.`,
    subhead: "Every listing shows the exact colour, storage and condition.",
  };

  const rows = rowsForCategory(meta.id);
  const hero = rows[0];

  return (
    <div className="tab-safe">
      {/* Hero */}
      <section className="bg-apple-band pb-16 pt-14 text-center md:pb-20 md:pt-16">
        <div className="store-container">
          <p className="type-caption uppercase tracking-wider">{meta.name}</p>
          <h1 className="type-hero mt-3">{copy.hero}</h1>
          <p className="type-body mx-auto mt-4 max-w-[520px] text-apple-muted">{copy.subhead}</p>

          {hero && (
            <div className="mx-auto mt-12 h-[280px] w-full max-w-[620px] md:h-[400px]">
              <ProductMedia
                art={hero.product.art}
                color={hero.variant.colorHex}
                image={productImage(hero.product.image, hero.variant.image)}
                alt={hero.product.name}
                priority
                className="h-full w-full"
              />
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="#compare" className="apple-button">
              Compare models
            </Link>
            <Link href="/shop" className="apple-link text-[17px]">
              Shop all tech <span aria-hidden>›</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Compare grid */}
      <Section band="light" wide id="compare">
        <SectionIntro headline={copy.headline} subhead={copy.subhead} />
        <div className="mt-12">
          <CompareTable rows={rows} />
        </div>
      </Section>

      {/* Why buy here — dark band */}
      <Section band="dark">
        <div className="grid gap-10 text-center md:grid-cols-3 md:gap-8 md:text-left">
          {[
            {
              title: "Exact condition",
              body: "Colour, storage, SIM setup and battery health on every listing.",
            },
            {
              title: "12-month warranty",
              body: "Grade-by-grade terms stated plainly before you pay.",
            },
            {
              title: "Bank transfer, no card",
              body: "Pay by transfer and confirm on WhatsApp. Delivery to all 36 states.",
            },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="text-[19px] font-semibold tracking-[-0.012em] text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-[14px] leading-[1.42859] tracking-[-0.016em] text-white/70">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Other categories */}
      <Section band="band">
        <SectionIntro headline="Keep exploring." />
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {CATEGORIES.filter((c) => c.id !== meta.id).map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.id}`}
              className="rounded-[980px] bg-white px-6 py-3 text-[17px] tracking-[-0.022em] text-apple-ink transition-colors hover:bg-white/70"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </Section>

      {/* Dense link block */}
      <Section band="light">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {[
            {
              title: "By grade",
              links: [
                { href: `/shop?category=${meta.id}&condition=new_sealed`, label: "Brand new sealed" },
                { href: `/shop?category=${meta.id}&condition=grade_a`, label: "Pre-owned Grade A" },
                { href: `/shop?category=${meta.id}&condition=grade_b`, label: "Pre-owned Grade B" },
              ],
            },
            {
              title: "By budget",
              links: [
                { href: `/shop?category=${meta.id}&q=under%20500k`, label: "Under ₦500k" },
                { href: `/shop?category=${meta.id}&q=under%20800k`, label: "₦500k – ₦800k" },
                { href: `/shop?category=${meta.id}&q=under%201m`, label: "₦800k – ₦1m" },
              ],
            },
            {
              title: "All listings",
              links: [
                { href: `/shop?category=${meta.id}`, label: `All ${meta.label.toLowerCase()}` },
                { href: `/shop?category=${meta.id}&sort=price-asc`, label: "Price: low to high" },
                { href: `/shop?category=${meta.id}&sort=price-desc`, label: "Price: high to low" },
              ],
            },
            {
              title: "Support",
              links: [
                { href: "/track", label: "Track an order" },
                { href: "/policies/warranty", label: "Warranty" },
                { href: "/policies/returns", label: "Returns" },
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
