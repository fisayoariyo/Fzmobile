"use client";

import { fromPrice, searchProducts } from "@/lib/catalog";
import { naira } from "@/lib/format";
import { productImage } from "@/lib/media";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
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
      className={`relative ${hero ? "w-full max-w-xl" : ""}`}
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        go();
      }}
    >
      <div className={hero ? "flex items-stretch gap-2 sm:gap-3" : undefined}>
        <TextField
          id={hero ? "hero-search" : "site-search"}
          value={query}
          autoFocus={autoFocus}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={hero ? "What are you looking for?" : "Search phones, laptops, mics…"}
          autoComplete="off"
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#000" }} />
                </InputAdornment>
              ),
              "aria-controls": listId,
            },
            htmlInput: {
              "aria-label": hero ? "What are you looking for?" : "Search phones, laptops, mics",
            },
          }}
          sx={{
            flex: 1,
            "& .MuiOutlinedInput-root": {
              borderRadius: 999,
              bgcolor: hero ? "#fff" : "#f0f7ff",
              minHeight: hero ? 56 : 50,
              boxShadow: hero ? "0 12px 40px rgba(19, 94, 75, 0.12)" : "none",
              "& fieldset": { border: hero ? "1px solid rgba(0,0,0,0.08)" : "none" },
            },
          }}
        />
        {hero && (
          <button
            type="submit"
            className="inline-flex h-14 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-deep px-5 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#0284c7] sm:px-6"
          >
            Shop
            <ArrowForwardIcon sx={{ fontSize: 18 }} />
          </button>
        )}
      </div>
      {query.trim().length > 0 && (
        <ul
          id={listId}
          className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-xl shadow-black/[0.08]"
        >
          {results.length === 0 && (
            <li className="px-4 py-3 text-sm text-muted">No devices match that search.</li>
          )}
          {results.map((product) => {
            const img = productImage(product.image);
            return (
              <li key={product.slug}>
                <button
                  type="button"
                  className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-black/[0.03]"
                  onClick={() => router.push(`/product/${product.slug}`)}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-xl bg-surface">
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
                      <span className="block truncate text-sm font-bold">{product.name}</span>
                      <span className="block text-sm text-muted">{product.brand}</span>
                    </span>
                  </div>
                  <span className="shrink-0 text-sm font-bold tabular-nums">
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
