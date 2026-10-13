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

  const isDeals =
    pathname === "/shop" &&
    typeof window !== "undefined" &&
    window.location.search.includes("deals");

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
      active: pathname.startsWith("/shop") && !isDeals,
    },
    {
      href: "/shop?deals=1",
      label: "Deals",
      icon: Zap,
      active: isDeals || pathname.includes("deals"),
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
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#dadce0] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      <ul className="mx-auto grid h-[4.25rem] max-w-md grid-cols-5 items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const body = (
            <div className="flex flex-col items-center justify-center">
              <span
                className={`relative inline-flex items-center justify-center rounded-full px-4 py-1 transition-colors duration-200 ${
                  tab.active ? "bg-[#c2e7ff] text-[#001d35]" : "text-[#5f6368]"
                }`}
              >
                <Icon className="size-5" />
                {tab.badge != null && tab.badge > 0 && (
                  <span className="absolute -right-0.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#1a73e8] px-1 text-[9px] font-bold text-white">
                    {tab.badge}
                  </span>
                )}
              </span>
              <span
                className={`mt-1 text-xs transition-colors duration-200 ${
                  tab.active
                    ? "font-semibold text-[#001d35]"
                    : "font-normal text-[#5f6368] hover:text-[#202124]"
                }`}
              >
                {tab.label}
              </span>
            </div>
          );

          return (
            <li key={tab.label} className="flex justify-center">
              {tab.external ? (
                <a
                  href={tab.href}
                  className="w-full py-1 text-center"
                  target="_blank"
                  rel="noreferrer"
                >
                  {body}
                </a>
              ) : (
                <Link href={tab.href} className="w-full py-1 text-center">
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
