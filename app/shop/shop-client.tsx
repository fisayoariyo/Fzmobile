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
import { Package, SlidersHorizontal } from "lucide-react";
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

      <div className="mt-8 flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-medium tracking-tight text-[#202124] md:text-4xl">{title}</h1>
          <p className="mt-1 text-sm text-[#5f6368]">
            {rows.length} {rows.length === 1 ? "device" : "devices"} available
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-[#dadce0] bg-white px-4 text-xs font-medium text-[#202124] shadow-xs transition-all hover:border-[#bdc1c6] hover:bg-[#f8f9fa] hover:shadow-sm"
        >
          <SlidersHorizontal className="size-3.5 text-[#5f6368]" />
          <span>Filters</span>
          {active.length > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-[#c2e7ff] text-[11px] font-bold text-[#001d35]">
              {active.length}
            </span>
          )}
        </button>

        <div className="relative">
          <label className="sr-only" htmlFor="sort">
            Sort
          </label>
          <select
            id="sort"
            value={query.sort}
            onChange={(event) => update({ sort: event.target.value })}
            className="h-10 cursor-pointer rounded-full border border-[#dadce0] bg-white px-4 pr-8 text-xs font-medium text-[#202124] shadow-xs transition-all hover:border-[#bdc1c6] hover:bg-[#f8f9fa] hover:shadow-sm focus:border-[#1a73e8] focus:outline-none"
          >
            <option value="newest">Sort by: Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="deals">Best Deals</option>
          </select>
        </div>
      </div>

      {active.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-medium text-[#5f6368]">Active:</span>
          {active.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[#c2e7ff] bg-[#e8f0fe] pl-3 pr-1.5 text-xs font-medium text-[#174ea6]"
            >
              <span>{chip.label}</span>
              <button
                type="button"
                onClick={() => update({ [chip.key]: null })}
                className="flex size-5 cursor-pointer items-center justify-center rounded-full text-[#174ea6] transition-colors hover:bg-[#c2e7ff]"
                aria-label={`Remove filter ${chip.label}`}
              >
                <span aria-hidden="true" className="text-sm font-bold leading-none">×</span>
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={() => router.replace("/shop")}
            className="ml-2 cursor-pointer text-xs font-medium text-[#1a73e8] hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      {rows.length === 0 ? (
        <div className="py-20 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full border border-[#dadce0] bg-[#f8f9fa] text-[#5f6368]">
            <Package className="size-8" />
          </div>
          <p className="font-display text-2xl font-medium text-[#202124]">Nothing matches these filters.</p>
          <p className="mt-2 text-sm text-[#5f6368]">Try selecting different categories, price ranges, or conditions.</p>
          <button
            type="button"
            onClick={() => router.replace("/shop")}
            className="mt-6 inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-[#1a73e8] px-6 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#1557b0]"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
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
    <Sheet open={open} title="Filter devices" onClose={onClose} panel="drawer">
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

      <button
        type="button"
        className="mt-8 flex h-12 w-full cursor-pointer items-center justify-center rounded-full bg-[#1a73e8] text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#1557b0]"
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
      </button>
    </Sheet>
  );
}

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <fieldset className="mt-5">
      <legend className="mb-2 text-xs font-medium uppercase tracking-wider text-[#5f6368]">{label}</legend>
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
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex cursor-pointer items-center justify-center rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
        selected
          ? "border-[#c2e7ff] bg-[#c2e7ff] text-[#001d35]"
          : "border-[#dadce0] bg-white text-[#3c4043] hover:bg-[#f8f9fa]"
      }`}
    >
      {children}
    </button>
  );
}
