"use client";

import { CategoryChips } from "@/components/category-chips";
import { ConditionChip } from "@/components/condition-chip";
import { ProductCard } from "@/components/product-card";
import { Sheet } from "@/components/sheet";
import {
  brands,
  categoryById,
  conditionMeta,
  shopResults,
  storageOptions,
} from "@/lib/catalog";
import type { Condition } from "@/lib/types";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type ReactNode } from "react";

const prices = [
  { id: "under-500", label: "Under ₦500,000" },
  { id: "mid", label: "₦500,000 – ₦1,000,000" },
  { id: "over-1000", label: "Over ₦1,000,000" },
];

const conditions: Condition[] = ["new_sealed", "grade_a", "grade_b"];

export function ShopClient() {
  const params = useSearchParams();
  const router = useRouter();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const query = {
    category: params.get("category") || undefined,
    q: params.get("q") || undefined,
    condition: params.get("condition") || undefined,
    brand: params.get("brand") || undefined,
    price: params.get("price") || undefined,
    storage: params.get("storage") || undefined,
    sort: params.get("sort") || "newest",
    deals: params.get("deals") === "1",
  };

  const rows = shopResults(query);
  const title = query.category ? categoryById(query.category)?.name ?? "Devices" : query.deals ? "Flash Deals" : "All tech";
  const storages = storageOptions(query.category);

  function update(next: Record<string, string | null>) {
    const sp = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(next)) {
      if (!value) sp.delete(key);
      else sp.set(key, value);
    }
    const search = sp.toString();
    router.replace(search ? `/shop?${search}` : "/shop", { scroll: false });
  }

  const active = [
    query.q ? { key: "q", label: query.q } : null,
    query.condition
      ? { key: "condition", label: conditionMeta[query.condition as Condition]?.label ?? query.condition }
      : null,
    query.brand ? { key: "brand", label: query.brand } : null,
    query.price ? { key: "price", label: prices.find((item) => item.id === query.price)?.label ?? query.price } : null,
    query.storage ? { key: "storage", label: query.storage } : null,
    query.deals ? { key: "deals", label: "Deals" } : null,
  ].filter(Boolean) as { key: string; label: string }[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
      <CategoryChips active={query.category ?? "all"} />
      <div className="mt-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium">{title}</h1>
          <p className="mt-1 text-sm text-muted">
            {rows.length} {rows.length === 1 ? "device" : "devices"}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-full border border-black/15 px-4 text-sm font-bold"
        >
          <SlidersHorizontal className="size-4" />
          Filter
        </button>
        <label className="sr-only" htmlFor="sort">
          Sort
        </label>
        <select
          id="sort"
          value={query.sort}
          onChange={(event) => update({ sort: event.target.value })}
          className="h-12 cursor-pointer rounded-full border border-black/15 bg-white px-4 text-sm font-bold"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price, low to high</option>
          <option value="price-desc">Price, high to low</option>
          <option value="deals">Best deals</option>
        </select>
      </div>

      {active.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {active.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => update({ [chip.key]: null })}
              className="inline-flex h-10 cursor-pointer items-center rounded-full bg-deep px-3 text-sm font-bold text-white"
            >
              {chip.label}
              <span className="sr-only">Remove</span>
              <span aria-hidden="true" className="ml-2">
                ×
              </span>
            </button>
          ))}
        </div>
      )}

      {rows.length === 0 ? (
        <div className="py-16">
          <p className="font-display text-2xl font-medium">Nothing matches these filters.</p>
          <button
            type="button"
            onClick={() => router.replace("/shop")}
            className="mt-4 h-12 cursor-pointer font-bold text-deep"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-x-5">
          {rows.map(({ product, variant }) => (
            <ProductCard key={product.slug} product={product} variant={variant} />
          ))}
        </div>
      )}

      <FilterSheet
        key={`${filtersOpen}-${query.condition ?? ""}-${query.brand ?? ""}-${query.price ?? ""}-${query.storage ?? ""}`}
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        category={query.category}
        q={query.q}
        deals={query.deals}
        condition={query.condition}
        brand={query.brand}
        price={query.price}
        storage={query.storage}
        storages={storages}
        onApply={(next) => {
          update(next);
          setFiltersOpen(false);
        }}
      />
    </div>
  );
}

function FilterSheet({
  open,
  onClose,
  category,
  q,
  deals,
  condition,
  brand,
  price,
  storage,
  storages,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  category?: string;
  q?: string;
  deals?: boolean;
  condition?: string;
  brand?: string;
  price?: string;
  storage?: string;
  storages: string[];
  onApply: (next: Record<string, string | null>) => void;
}) {
  const [draftCondition, setDraftCondition] = useState(condition ?? "");
  const [draftBrand, setDraftBrand] = useState(brand ?? "");
  const [draftPrice, setDraftPrice] = useState(price ?? "");
  const [draftStorage, setDraftStorage] = useState(storage ?? "");
  const count = shopResults({
    category,
    q,
    deals,
    condition: draftCondition || undefined,
    brand: draftBrand || undefined,
    price: draftPrice || undefined,
    storage: draftStorage || undefined,
  }).length;

  return (
    <Sheet open={open} title="Filter" onClose={onClose} panel="drawer">
      <FilterGroup label="Condition">
        {conditions.map((item) => {
          const selected = draftCondition === item;
          return (
            <ConditionChip
              key={item}
              condition={item}
              selected={selected}
              onClick={() => setDraftCondition(selected ? "" : item)}
            />
          );
        })}
      </FilterGroup>
      <FilterGroup label="Brand">
        {brands().map((item) => (
          <Choice
            key={item}
            selected={draftBrand === item}
            onClick={() => setDraftBrand(draftBrand === item ? "" : item)}
          >
            {item}
          </Choice>
        ))}
      </FilterGroup>
      <FilterGroup label="Price">
        {prices.map((item) => (
          <Choice
            key={item.id}
            selected={draftPrice === item.id}
            onClick={() => setDraftPrice(draftPrice === item.id ? "" : item.id)}
          >
            {item.label}
          </Choice>
        ))}
      </FilterGroup>
      {storages.length > 0 && (
        <FilterGroup label="Storage">
          {storages.map((item) => (
            <Choice
              key={item}
              selected={draftStorage === item}
              onClick={() => setDraftStorage(draftStorage === item ? "" : item)}
            >
              {item}
            </Choice>
          ))}
        </FilterGroup>
      )}
      <Button
        type="button"
        variant="contained"
        fullWidth
        sx={{ mt: 3, height: 48, borderRadius: 999, fontWeight: 700 }}
        onClick={() =>
          onApply({
            condition: draftCondition || null,
            brand: draftBrand || null,
            price: draftPrice || null,
            storage: draftStorage || null,
          })
        }
      >
        Show {count} {count === 1 ? "device" : "devices"}
      </Button>
    </Sheet>
  );
}

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <fieldset className="mt-5">
      <legend className="mb-2 text-sm font-bold">{label}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

function Choice({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Chip
      label={children}
      onClick={onClick}
      clickable
      color={selected ? "primary" : "default"}
      variant={selected ? "filled" : "outlined"}
      sx={{
        height: 48,
        fontWeight: 700,
        bgcolor: selected ? "#135E4B" : "#fff",
        color: selected ? "#fff" : "#000",
        borderColor: "rgba(0,0,0,0.15)",
      }}
    />
  );
}
