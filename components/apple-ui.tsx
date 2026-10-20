import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Apple-style section building blocks.
 *
 * apple.com/iphone stacks alternating full-bleed bands: white, then #f5f5f7,
 * then an occasional dark band. Each band carries one centred headline and
 * generous vertical padding. These primitives encode that rhythm so every
 * page composes the same way.
 */

type Band = "light" | "band" | "dark";

const bandClass: Record<Band, string> = {
  light: "bg-white text-apple-ink",
  band: "bg-apple-band text-apple-ink",
  dark: "bg-apple-ink text-white",
};

export function Section({
  band = "light",
  children,
  wide = false,
  className = "",
  id,
}: {
  band?: Band;
  children: ReactNode;
  wide?: boolean;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`${bandClass[band]} apple-section ${className}`}>
      <div className={wide ? "store-wide" : "store-container"}>{children}</div>
    </section>
  );
}

/** Centred headline block that opens most Apple sections. */
export function SectionIntro({
  headline,
  subhead,
  dark = false,
  align = "center",
}: {
  headline: ReactNode;
  subhead?: ReactNode;
  dark?: boolean;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <h2 className={`type-headline ${dark ? "text-white" : ""}`}>{headline}</h2>
      {subhead && (
        <p
          className={`mt-4 text-[19px] leading-[1.42115] tracking-[-0.012em] ${
            dark ? "text-white/70" : "text-apple-muted"
          } ${align === "center" ? "mx-auto max-w-[640px]" : "max-w-[640px]"}`}
        >
          {subhead}
        </p>
      )}
    </div>
  );
}

/**
 * Apple's product tile: image floating on the band, name, a one-line
 * descriptor, price line, then two pill actions. Optional `dark` for the
 * dark bands Apple uses for hero products.
 */
export function ProductTile({
  name,
  tagline,
  price,
  image,
  href,
  primaryLabel = "Buy",
  secondary,
  dark = false,
  highlight,
}: {
  name: string;
  tagline?: string;
  price?: string;
  image: ReactNode;
  href: string;
  primaryLabel?: string;
  secondary?: { href: string; label: string };
  dark?: boolean;
  highlight?: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex h-[220px] w-full items-center justify-center px-6 md:h-[280px]">
        {image}
      </div>

      {highlight && (
        <p
          className={`type-caption mt-6 uppercase tracking-wider ${
            dark ? "text-white/60" : ""
          }`}
        >
          {highlight}
        </p>
      )}

      <h3
        className={`mt-2 text-[28px] font-semibold leading-[1.14286] tracking-[-0.008em] ${
          dark ? "text-white" : "text-apple-ink"
        }`}
      >
        {name}
      </h3>

      {tagline && (
        <p
          className={`mt-2 max-w-[300px] text-[17px] leading-[1.47059] tracking-[-0.022em] ${
            dark ? "text-white/70" : "text-apple-muted"
          }`}
        >
          {tagline}
        </p>
      )}

      {price && (
        <p
          className={`mt-4 text-[17px] tracking-[-0.022em] ${
            dark ? "text-white/70" : "text-apple-muted"
          }`}
        >
          {price}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <Link href={href} className="apple-button">
          {primaryLabel}
        </Link>
        {secondary && (
          <Link href={secondary.href} className="apple-link text-[17px]">
            {secondary.label} <span aria-hidden>›</span>
          </Link>
        )}
      </div>
    </div>
  );
}

/**
 * Apple's horizontal-scrolling tile row. Tiles snap and the row hides its
 * scrollbar, matching the "compare / explore" strip on Apple's site.
 */
export function TileRow({ children }: { children: ReactNode }) {
  return (
    <div className="scroll-row -mx-[1.375rem] flex snap-x snap-mandatory gap-5 overflow-x-auto px-[1.375rem] pb-2 md:mx-0 md:px-0">
      {children}
    </div>
  );
}

export function TileRowItem({
  children,
  width = "w-[280px]",
}: {
  children: ReactNode;
  width?: string;
}) {
  return <div className={`shrink-0 snap-start ${width}`}>{children}</div>;
}
