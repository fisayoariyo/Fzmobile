"use client";

import { CATEGORIES } from "@/lib/catalog";
import Chip from "@mui/material/Chip";
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
    <div className="scroll-row -mx-4 flex gap-2 overflow-x-auto px-4 md:-mx-6 md:px-6">
      {chips.map((chip) => {
        const selected = active === chip.id;
        return (
          <Chip
            key={chip.id}
            component={Link}
            href={chip.href}
            clickable
            label={chip.label}
            color={selected ? "primary" : "default"}
            variant={selected ? "filled" : "outlined"}
            sx={{
              height: 48,
              fontWeight: 700,
              bgcolor: selected ? "#02A6FB" : "#fff",
              color: selected ? "#fff" : "#000",
              borderColor: "rgba(0,0,0,0.15)",
              "&:hover": {
                bgcolor: selected ? "#0284c7" : "rgba(0,0,0,0.03)",
              },
            }}
          />
        );
      })}
    </div>
  );
}
