"use client";

import { conditionMeta } from "@/lib/catalog";
import type { Condition } from "@/lib/types";

export function ConditionChip({
  condition,
  className,
  onClick,
  selected,
}: {
  condition: Condition;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}) {
  const meta = conditionMeta[condition];
  const label = meta?.label ?? condition;

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center justify-center rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
          selected
            ? "border border-pill bg-pill text-brand-ink shadow-xs"
            : "border border-brand-soft bg-brand-soft/70 text-brand hover:bg-brand-soft"
        } ${className ?? ""}`}
      >
        {label}
      </button>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border border-brand-soft bg-brand-soft px-2.5 py-0.5 text-[11px] font-medium text-brand ${
        className ?? ""
      }`}
    >
      {label}
    </span>
  );
}
