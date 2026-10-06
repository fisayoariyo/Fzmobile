"use client";

import { fromPrice, searchProducts } from "@/lib/catalog";
import { naira } from "@/lib/format";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";

export function SearchPill({ autoFocus = false }: { autoFocus?: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const listId = useId();
  const results = query.trim().length > 0 ? searchProducts(query).slice(0, 5) : [];

  return (
    <form
      className="relative"
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        const value = query.trim();
        if (!value) return;
        router.push(`/shop?q=${encodeURIComponent(value)}`);
      }}
    >
      <TextField
        id="site-search"
        value={query}
        autoFocus={autoFocus}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search phones, laptops, mics…"
        autoComplete="off"
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
            "aria-label": "Search phones, laptops, mics",
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 999,
            bgcolor: "#CCDCDB",
            "& fieldset": { border: "none" },
          },
        }}
      />
      {query.trim().length > 0 && (
        <ul
          id={listId}
          className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-black/10 bg-white"
        >
          {results.length === 0 && (
            <li className="px-4 py-3 text-sm text-muted">No devices match that search.</li>
          )}
          {results.map((product) => (
            <li key={product.slug}>
              <button
                type="button"
                className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left hover:bg-black/[0.03]"
                onClick={() => router.push(`/product/${product.slug}`)}
              >
                <span>
                  <span className="block text-sm font-bold">{product.name}</span>
                  <span className="block text-sm text-muted">{product.brand}</span>
                </span>
                <span className="shrink-0 text-sm font-bold tabular-nums">
                  {naira(fromPrice(product))}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
