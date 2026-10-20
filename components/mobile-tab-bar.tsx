"use client";

import { useStore } from "@/lib/store";
import { Grid2x2, Home, MapPin, ShoppingBag, Zap } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const hiddenPrefixes = ["/product", "/cart", "/checkout", "/pay"];

type TabIcon = ComponentType<{ className?: string } | SVGProps<SVGSVGElement>>;

export function MobileTabBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { count } = useStore();
  const hidden = hiddenPrefixes.some((prefix) => pathname.startsWith(prefix));
  if (hidden) return null;

  const isDeals = pathname === "/shop" && searchParams.has("deals");

  const tabs: {
    href: string;
    label: string;
    icon: TabIcon;
    active: boolean;
    badge?: number;
  }[] = [
    { href: "/", label: "Home", icon: Home, active: pathname === "/" },
    {
      href: "/shop",
      label: "Shop",
      icon: Grid2x2,
      active: pathname.startsWith("/shop") && !isDeals,
    },
    {
      href: "/shop?deals=1",
      label: "Deals",
      icon: Zap,
      active: isDeals,
    },
    {
      href: "/cart",
      label: "Cart",
      icon: ShoppingBag,
      active: pathname.startsWith("/cart"),
      badge: count,
    },
    {
      href: "/track",
      label: "Track",
      icon: MapPin,
      active: pathname.startsWith("/track"),
    },
  ];

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-sm md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="rounded-full border border-white/10 bg-ink/95 px-2 py-1.5 text-white shadow-[0_12px_36px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <ul className="grid grid-cols-5 items-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <li key={tab.label} className="flex justify-center">
                <Link
                  href={tab.href}
                  aria-current={tab.active ? "page" : undefined}
                  className="w-full text-center"
                >
                  <span className="flex flex-col items-center justify-center py-1">
                    <span
                      className={`relative inline-flex items-center justify-center rounded-full px-3 py-1 transition-all duration-200 ${
                        tab.active
                          ? "bg-white/15 text-white"
                          : "text-white/55 hover:text-white"
                      }`}
                    >
                      <Icon className="size-4.5" />
                      {tab.badge != null && tab.badge > 0 && (
                        <span className="absolute -right-0.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[9px] font-bold text-ink">
                          {tab.badge}
                        </span>
                      )}
                    </span>
                    <span
                      className={`mt-0.5 text-[10px] tracking-tight transition-colors duration-200 ${
                        tab.active ? "font-semibold text-white" : "font-normal text-white/55"
                      }`}
                    >
                      {tab.label}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
