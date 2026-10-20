"use client";

import { fromPrice, searchProducts } from "@/lib/catalog";
import { naira } from "@/lib/format";
import { productImage } from "@/lib/media";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

/**
 * Header search. Two shapes:
 * - default: compact pill that sits in the desktop nav bar
 * - complete: full-width field used inside the mobile menu / search sheet
 */
export function StoreSearch({
  autoFocus = false,
  autoComplete = false,
}: {
  autoFocus?: boolean;
  autoComplete?: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const listId = useId();
  const rootRef = useRef<HTMLFormElement>(null);

  const trimmed = query.trim();
  const results = trimmed ? searchProducts(trimmed).slice(0, 5) : [];
  const showList = autoComplete && open && trimmed.length > 0;

  // `autoComplete` mode renders results inline, so outside-click should collapse them.
  useEffect(() => {
    if (!showList) return;
    function onPointer(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [showList]);

  function go(value?: string) {
    const next = (value ?? query).trim();
    setOpen(false);
    router.push(next ? `/shop?q=${encodeURIComponent(next)}` : "/shop");
  }

  return (
    <form
      ref={rootRef}
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        go();
      }}
      className={autoComplete ? "relative w-full" : "relative w-full max-w-md"}
    >
      <div className="google-elevation-1 focus-within:google-elevation-2 flex h-10 w-full items-center rounded-full border border-line/70 bg-white px-3.5 transition-all duration-200 focus-within:border-brand md:h-11">
        <Search className="size-4.5 shrink-0 text-muted" />
        <input
          id={autoComplete ? "search-sheet" : "site-search"}
          type="search"
          value={query}
          autoFocus={autoFocus}
          autoComplete="off"
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search iPhone, Pixel, MacBook, or 'under 800k'"
          aria-label="Search devices or budget"
          aria-controls={listId}
          className="ml-2.5 h-full w-full min-w-0 bg-transparent text-sm text-ink placeholder-faint outline-none"
        />
        {trimmed.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            className="ml-1 flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-hover"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {showList && (
        <ul
          id={listId}
          className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_12px_40px_rgba(60,64,67,0.18)]"
        >
          {results.length === 0 && (
            <li className="px-5 py-4 text-sm text-muted">
              No devices match “{trimmed}”.
            </li>
          )}

          {results.map((product) => {
            const img = productImage(product.image);
            return (
              <li key={product.slug} className="border-b border-line/40 last:border-b-0">
                <Link
                  href={`/product/${product.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-surface"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="relative size-10 shrink-0 overflow-hidden rounded-xl border border-line/60 bg-surface">
                      {img && (
                        <Image
                          src={img}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-contain p-1"
                          unoptimized
                        />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-ink">
                        {product.name}
                      </span>
                      <span className="block truncate text-xs text-muted">
                        {product.brand}
                      </span>
                    </span>
                  </span>
                  <span className="shrink-0 text-sm font-semibold text-brand tabular-nums">
                    {naira(fromPrice(product))}
                  </span>
                </Link>
              </li>
            );
          })}

          <li>
            <button
              type="button"
              onClick={() => go()}
              className="flex w-full cursor-pointer items-center justify-center gap-1.5 bg-surface px-4 py-3 text-sm font-medium text-brand transition-colors hover:bg-brand-soft"
            >
              See all results for “{trimmed}”
              <ArrowForwardIcon sx={{ fontSize: 16 }} />
            </button>
          </li>
        </ul>
      )}
    </form>
  );
}
