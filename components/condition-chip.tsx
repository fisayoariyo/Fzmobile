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
            ? "border border-[#c2e7ff] bg-[#c2e7ff] text-[#001d35] shadow-xs"
            : "border border-[#d2e3fc] bg-[#e8f0fe]/70 text-[#1a73e8] hover:bg-[#e8f0fe]"
        } ${className ?? ""}`}
      >
        {label}
      </button>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border border-[#d2e3fc] bg-[#e8f0fe] px-2.5 py-0.5 text-[11px] font-medium text-[#1a73e8] ${
        className ?? ""
      }`}
    >
      {label}
    </span>
  );
}
