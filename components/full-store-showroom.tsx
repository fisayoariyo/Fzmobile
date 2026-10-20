"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { flashDeals } from "@/lib/catalog";
import { naira } from "@/lib/format";
import { productImage } from "@/lib/media";
import type { Product, Variant } from "@/lib/types";
import {
  ArrowRight,
  Eye,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Store,
  ChevronRight,
  Maximize2,
  Info,
} from "lucide-react";

export function FullStoreShowroom({
  featured,
}: {
  featured: { product: Product; variant: Variant }[];
}) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isInspecting, setIsInspecting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeItem = featured[selectedIdx] ?? featured[0];

  // Hotspot coordinates positioned on the wooden display table in your photo
  // Table row: 5 devices spread across the front display counter
  const hotspots = [
    { id: 0, x: 28.5, y: 70.0, label: "Phone 1" },
    { id: 1, x: 40.0, y: 67.5, label: "Phone 2" },
    { id: 2, x: 49.5, y: 65.5, label: "Phone 3" },
    { id: 3, x: 56.5, y: 64.0, label: "Phone 4" },
    { id: 4, x: 63.5, y: 63.0, label: "Phone 5" },
  ];

  // Subtle interactive parallax tilt on mouse/touch move
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotation({ x: y * -8, y: x * 10 });
  }

  function handleMouseLeave() {
    setRotation({ x: 0, y: 0 });
  }

  return (
    <div className="relative min-h-[92vh] w-full overflow-hidden bg-[#0c0d10] text-white">
      {/* Flagship Showroom Architectural Canvas */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative flex h-[92vh] w-full items-center justify-center transition-transform duration-300 ease-out"
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
      >
        {/* Crisp photographic showroom background from reference image */}
        <Image
          src="/fzmobile-storefront.jpg"
          alt="Fzmobile Flagship Store Showroom"
          fill
          priority
          className="object-cover object-center filter brightness-[0.92] contrast-[1.05]"
        />

        {/* Ambient Dark Vignette & Overhead LED Spotlight Bleed */}
        <div className="pointer-events-none absolute inset-0 bg-radial-[at_50%_40%] from-transparent via-black/25 to-black/80" />

        {/* Subtle Top Navigation HUD inside the 3D space */}
        <div className="absolute left-4 right-4 top-4 z-20 flex items-center justify-between sm:left-8 sm:right-8 sm:top-6">
          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-4 py-2 backdrop-blur-md">
            <span className="size-2.5 animate-pulse rounded-full bg-[#1a73e8]" />
            <span className="text-xs font-semibold tracking-wide text-white">
              FLAGSHIP SHOWROOM · LAGOS
            </span>
          </div>

          <Link
            href="/shop"
            className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black"
          >
            <Store className="size-3.5" />
            <span>Classic Shop View</span>
          </Link>
        </div>

        {/* Interactive Hotspot Pins on the Display Tables */}
        {hotspots.map((spot, i) => {
          const item = featured[i];
          if (!item) return null;
          const isSelected = selectedIdx === i;
          const isHovered = hoveredIdx === i;

          return (
            <div
              key={spot.id}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
            >
              {/* Pulsing Hotspot Target */}
              <button
                type="button"
                onClick={() => setSelectedIdx(i)}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                aria-label={`Inspect ${item.product.name}`}
                className="group relative flex size-10 cursor-pointer items-center justify-center"
              >
                {/* Expanding pulse ring */}
                <span
                  className={`absolute inline-flex size-full animate-ping rounded-full opacity-75 ${
                    isSelected ? "bg-[#1a73e8]" : "bg-white/40"
                  }`}
                />
                {/* Outer ring */}
                <span
                  className={`relative flex size-7 items-center justify-center rounded-full border-2 transition-all ${
                    isSelected
                      ? "border-[#1a73e8] bg-[#1a73e8] shadow-[0_0_15px_#1a73e8]"
                      : "border-white/80 bg-black/60 backdrop-blur-xs group-hover:scale-110 group-hover:border-[#1a73e8]"
                  }`}
                >
                  <span className="size-2 rounded-full bg-white" />
                </span>
              </button>

              {/* Floating Spatial Label Hover Tag */}
              {(isSelected || isHovered) && (
                <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-xl border border-white/20 bg-black/80 px-3 py-1.5 text-center shadow-xl backdrop-blur-md animate-scale-up">
                  <p className="text-xs font-semibold text-white">{item.product.name}</p>
                  <p className="text-[11px] font-medium text-[#4bb8fc]">
                    {naira(item.variant.price)}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {/* Ambient Prompt in Center-Bottom */}
        <div className="pointer-events-none absolute bottom-32 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/10 bg-black/40 px-4 py-1.5 backdrop-blur-md">
          <p className="flex items-center gap-2 text-xs text-white/70">
            <Eye className="size-3.5 text-[#1a73e8]" />
            <span>Tap any phone on the table to inspect specs & buy</span>
          </p>
        </div>
      </div>

      {/* Floating Glassmorphic Device Inspector Deck (Bottom Overlay) */}
      {activeItem && (
        <div className="absolute inset-x-4 bottom-4 z-30 mx-auto max-w-4xl sm:inset-x-8 sm:bottom-6">
          <div className="flex flex-col gap-4 rounded-3xl border border-white/15 bg-black/75 p-5 shadow-2xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-center gap-4">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2">
                <Image
                  src={productImage(activeItem.product.image, activeItem.variant.image) || "/brand/logo-white.svg"}
                  alt={activeItem.product.name}
                  fill
                  className="object-contain p-1 drop-shadow-md"
                  unoptimized
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#1a73e8]/20 px-2 py-0.5 text-[10px] font-bold text-[#4bb8fc]">
                    Official Warranty
                  </span>
                  <span className="text-xs text-white/50">{activeItem.product.brand}</span>
                </div>
                <h2 className="mt-1 font-display text-lg font-semibold text-white sm:text-xl">
                  {activeItem.product.name}
                </h2>
                <p className="text-xs text-white/70">
                  {activeItem.variant.colorName} · {activeItem.variant.storage} · Verified Stock
                </p>
              </div>
            </div>

            {/* Price & Primary Buy CTA */}
            <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-3 sm:border-0 sm:pt-0">
              <div>
                <p className="text-[11px] text-white/50">Direct Price</p>
                <p className="font-display text-xl font-bold text-white tabular-nums sm:text-2xl">
                  {naira(activeItem.variant.price)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/product/${activeItem.product.slug}?v=${activeItem.variant.id}`}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-[#1a73e8] px-6 text-xs font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-[#1557b0] active:scale-95"
                >
                  <span>Buy Now</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
