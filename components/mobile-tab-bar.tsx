"use client";

import { useStore } from "@/lib/store";
import { Grid2x2, Home, MapPin, ShoppingBag, Zap } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const hiddenPrefixes = ["/product", "/cart", "/checkout", "/pay"];

type TabIcon = ComponentType<{ className?: string } | SVGProps<SVGSVGElement>>;

export function MobileTabBar() {
  const pathname = usePathname();
  const { count } = useStore();
  const hidden = hiddenPrefixes.some((prefix) => pathname.startsWith(prefix));
  if (hidden) return null;

  const tabs: {
    href: string;
    label: string;
    icon: TabIcon;
    active: boolean;
    external?: boolean;
    badge?: number;
  }[] = [
    { href: "/", label: "Home", icon: Home, active: pathname === "/" },
    {
      href: "/shop",
      label: "Categories",
      icon: Grid2x2,
      active: pathname.startsWith("/shop") && !pathname.includes("deals"),
    },
    {
      href: "/cart",
      label: "Cart",
      icon: ShoppingBag,
      active: pathname.startsWith("/cart"),
      badge: count,
    },
    {
      href: "/shop?deals=1",
      label: "Deals",
      icon: Zap,
      active: pathname.includes("deals"),
    },
    {
      href: "/track",
      label: "Track",
      icon: MapPin,
      active: pathname.startsWith("/track"),
    },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-black/8 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <ul className="mx-auto grid h-[4.25rem] max-w-lg grid-cols-5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const className = `relative flex flex-col items-center justify-center gap-0.5 transition-colors duration-200 ${
            tab.active ? "text-deep" : "text-muted"
          }`;
          const body = (
            <>
              <span
                className={`relative inline-flex items-center justify-center rounded-full px-3 py-1 transition-colors duration-200 ${
                  tab.active ? "bg-deep/10 text-deep" : ""
                }`}
              >
                <Icon className="size-[22px]" />
                {tab.badge != null && tab.badge > 0 && (
                  <span className="absolute -right-0.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-deep px-1 text-[9px] font-bold text-white">
                    {tab.badge}
                  </span>
                )}
              </span>
              <span className="text-[10px] font-semibold tracking-wide">{tab.label}</span>
            </>
          );
          return (
            <li key={tab.label}>
              {tab.external ? (
                <a href={tab.href} className={className} target="_blank" rel="noreferrer">
                  {body}
                </a>
              ) : (
                <Link href={tab.href} className={className}>
                  {body}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
