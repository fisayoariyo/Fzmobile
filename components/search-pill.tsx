"use client";

import { fromPrice, searchProducts } from "@/lib/catalog";
import { naira } from "@/lib/format";
import { productImage } from "@/lib/media";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Search, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";

export function SearchPill({
  autoFocus = false,
  variant = "default",
}: {
  autoFocus?: boolean;
  variant?: "default" | "hero";
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const listId = useId();
  const results = query.trim().length > 0 ? searchProducts(query).slice(0, 5) : [];
  const hero = variant === "hero";

  function go(value?: string) {
    const next = (value ?? query).trim();
    if (!next) {
      router.push("/shop");
      return;
    }
    router.push(`/shop?q=${encodeURIComponent(next)}`);
  }

  return (
    <form
      className={`relative ${hero ? "w-full max-w-xl" : "w-full"}`}
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        go();
      }}
    >
      <div className={hero ? "flex items-stretch gap-2 sm:gap-3" : undefined}>
        <div
          className="google-elevation-1 hover:google-elevation-2 focus-within:google-elevation-2 flex h-12 w-full flex-1 items-center rounded-full border border-[#dadce0]/60 bg-white px-4 transition-all duration-200 focus-within:border-[#1a73e8] md:h-[50px]"
        >
          <Search className="size-5 shrink-0 text-[#5f6368]" />
          <input
            id={hero ? "hero-search" : "site-search"}
            type="search"
            value={query}
            autoFocus={autoFocus}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search phones, laptops, audio..."
            autoComplete="off"
            aria-label="Search phones, laptops, audio"
            aria-controls={listId}
            className="ml-3 h-full w-full bg-transparent text-sm font-normal text-[#202124] placeholder-[#70757a] outline-none md:text-base"
          />
          {query.trim().length > 0 && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="ml-1 flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#5f6368] transition-colors hover:bg-[#f1f3f4]"
              aria-label="Clear search query"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        {hero && (
          <button
            type="submit"
            className="inline-flex h-12 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-[#1a73e8] px-5 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-[#1557b0] md:h-[50px] sm:px-6"
          >
            Shop
            <ArrowForwardIcon sx={{ fontSize: 18 }} />
          </button>
        )}
      </div>

      {query.trim().length > 0 && (
        <ul
          id={listId}
          className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-2xl border border-[#dadce0] bg-white shadow-lg"
        >
          {results.length === 0 && (
            <li className="px-5 py-4 text-sm text-[#5f6368]">No devices match that search.</li>
          )}
          {results.map((product) => {
            const img = productImage(product.image);
            return (
              <li key={product.slug} className="border-b border-[#dadce0]/40 last:border-b-0">
                <button
                  type="button"
                  className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-[#f8f9fa]"
                  onClick={() => router.push(`/product/${product.slug}`)}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-xl border border-[#dadce0]/60 bg-[#f8f9fa]">
                      {img && (
                        <Image
                          src={img}
                          alt={product.name}
                          fill
                          className="object-contain p-1"
                          unoptimized
                        />
                      )}
                    </div>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-[#202124]">
                        {product.name}
                      </span>
                      <span className="block text-xs text-[#5f6368]">{product.brand}</span>
                    </span>
                  </div>
                  <span className="shrink-0 text-sm font-medium text-[#1a73e8] tabular-nums">
                    {naira(fromPrice(product))}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </form>
  );
}
