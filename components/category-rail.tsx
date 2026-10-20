import { CATEGORIES, products } from "@/lib/catalog";
import {
  Gamepad2,
  Headphones,
  Laptop,
  Layers,
  Smartphone,
  Tablet,
  Wand2,
  Zap,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import Link from "next/link";

type Icon = ComponentType<{ className?: string } | SVGProps<SVGSVGElement>>;

const iconFor: Record<string, Icon> = {
  phones: Smartphone,
  laptops: Laptop,
  audio: Headphones,
  power: Zap,
  creation: Wand2,
  gaming: Gamepad2,
};

const fallbackIcon: Icon = Tablet;

function countFor(categoryId: string) {
  return products.filter((product) => product.category === categoryId).length;
}

export function CategoryRail() {
  const tiles: { href: string; label: string; count: string; icon: Icon }[] = [
    ...CATEGORIES.map((category) => ({
      href: `/shop?category=${category.id}`,
      label: category.label,
      count: `${countFor(category.id)} products`,
      icon: iconFor[category.id] ?? fallbackIcon,
    })),
    {
      href: "/shop",
      label: "All tech",
      count: `${products.length} products`,
      icon: Layers,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
      {tiles.map((tile) => (
        <Link
          key={tile.href}
          href={tile.href}
          className="card-hover flex flex-col items-start gap-2 rounded-2xl border border-line bg-white p-4 transition-colors hover:border-brand"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-brand-soft text-brand">
            <tile.icon className="size-5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-ink">
              {tile.label}
            </span>
            <span className="block truncate text-xs text-faint">{tile.count}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
