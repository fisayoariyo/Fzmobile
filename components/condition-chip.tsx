"use client";

import { conditionMeta } from "@/lib/catalog";
import type { Condition } from "@/lib/types";
import Chip from "@mui/material/Chip";

const fills: Record<Condition, { bg: string; color: string }> = {
  new_sealed: { bg: "#02A6FB", color: "#FFFFFF" },
  grade_a: { bg: "#4BB8FC", color: "#000000" },
  grade_b: { bg: "#A5DDFB", color: "#000000" },
};

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
  const fill = fills[condition];
  return (
    <Chip
      label={conditionMeta[condition].label}
      onClick={onClick}
      clickable={Boolean(onClick)}
      className={className}
      sx={{
        bgcolor: fill.bg,
        color: fill.color,
        fontWeight: 700,
        fontSize: 11,
        height: onClick ? 48 : 28,
        px: onClick ? 1 : 0,
        outline: selected ? "2px solid #000" : "none",
        outlineOffset: 2,
        "& .MuiChip-label": { px: 1.25 },
      }}
    />
  );
}
