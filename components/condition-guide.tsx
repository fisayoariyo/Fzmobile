import { conditionMeta } from "@/lib/catalog";
import type { Condition } from "@/lib/types";
import { PackageOpen, Sparkles, ShieldCheck } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

type Icon = ComponentType<{ className?: string } | SVGProps<SVGSVGElement>>;

const order: Condition[] = ["new_sealed", "grade_a", "grade_b"];

const detail: Record<
  Condition,
  { icon: Icon; seal: string; wear: string; warranty: string }
> = {
  new_sealed: {
    icon: Sparkles,
    seal: "Factory seal intact",
    wear: "No wear — never activated",
    warranty: "12-month warranty",
  },
  grade_a: {
    icon: ShieldCheck,
    seal: "Open box / UK used",
    wear: "Little or no visible wear",
    warranty: "12-month warranty",
  },
  grade_b: {
    icon: PackageOpen,
    seal: "Pre-owned",
    wear: "Light to moderate scratches",
    warranty: "12-month warranty",
  },
};

const rows: { label: string; key: "seal" | "wear" | "warranty" }[] = [
  { label: "Seal", key: "seal" },
  { label: "Wear", key: "wear" },
  { label: "Warranty", key: "warranty" },
];

export function ConditionGuide() {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {order.map((condition) => {
        const meta = conditionMeta[condition];
        const info = detail[condition];
        const Icon = info.icon;
        return (
          <div
            key={condition}
            className="flex flex-col rounded-2xl border border-line bg-white p-5"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-surface text-brand">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-3 text-base font-semibold text-ink">{meta.label}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">{meta.blurb}</p>

            <dl className="mt-4 space-y-1.5 border-t border-line pt-4">
              {rows.map((row) => (
                <div key={row.label} className="flex gap-3 text-xs">
                  <dt className="w-16 shrink-0 text-faint">{row.label}</dt>
                  <dd className="text-ink">{info[row.key]}</dd>
                </div>
              ))}
            </dl>
          </div>
        );
      })}
    </div>
  );
}
