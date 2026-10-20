"use client";

import { CATEGORIES } from "@/lib/catalog";
import Link from "next/link";

export function CategoryChips({ active }: { active?: string }) {
  const chips = [
    { id: "all", label: "All", href: "/shop" },
    ...CATEGORIES.map((category) => ({
      id: category.id,
      label: category.label,
      href: `/shop?category=${category.id}`,
    })),
  ];

  return (
    <div className="scroll-row -mx-4 flex gap-2 overflow-x-auto px-4 py-1 md:-mx-6 md:px-6">
      {chips.map((chip) => {
        const selected = active === chip.id;
        return (
          <Link
            key={chip.id}
            href={chip.href}
            className={`inline-flex shrink-0 items-center justify-center rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
              selected
                ? "border-pill bg-pill text-brand-ink"
                : "border-line bg-white text-ink hover:bg-surface"
            }`}
          >
            {chip.label}
          </Link>
        );
      })}
    </div>
  );
}
