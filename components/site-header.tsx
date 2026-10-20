"use client";

import { WhatsAppIcon } from "@/components/icons";
import { StoreSearch } from "@/components/store-search";
import { Sheet } from "@/components/sheet";
import { whatsappHref } from "@/lib/site";
import { useStore } from "@/lib/store";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Apple-style global navigation.
 *
 * Structure copied from apple.com's `.globalnav`: a 44px translucent bar,
 * small quiet links, a centred product label, and a full-width flyout panel
 * that dims the page behind it. Kept deliberately sparse — Apple's nav has
 * few items and no decoration.
 */

const navItems = [
  { href: "/shop", label: "Store" },
  { href: "/shop?category=phones", label: "iPhone" },
  { href: "/shop?category=laptops", label: "Mac" },
  { href: "/shop?category=audio", label: "Audio" },
  { href: "/shop?category=creation", label: "iPad" },
  { href: "/friends", label: "Friends" },
  { href: "/track", label: "Support" },
] as const;

/** Flyout contents, keyed by the nav item that opens them. */
const flyouts: Record<string, { title: string; links: { href: string; label: string }[] }[]> = {
  "/shop": [
    {
      title: "Shop by category",
      links: [
        { href: "/shop?category=phones", label: "Phones" },
        { href: "/shop?category=laptops", label: "Laptops" },
        { href: "/shop?category=audio", label: "Audio" },
        { href: "/shop?category=power", label: "Power" },
        { href: "/shop?category=creation", label: "Creation" },
        { href: "/shop?category=gaming", label: "Gaming" },
      ],
    },
    {
      title: "Shop by budget",
      links: [
        { href: "/shop?q=under%20500k", label: "Under ₦500k" },
        { href: "/shop?q=under%20800k", label: "₦500k – ₦800k" },
        { href: "/shop?q=under%201m", label: "₦800k – ₦1m" },
        { href: "/shop?deals=1", label: "Flash deals" },
      ],
    },
    {
      title: "Shop by grade",
      links: [
        { href: "/shop?condition=new_sealed", label: "Brand new sealed" },
        { href: "/shop?condition=grade_a", label: "Pre-owned Grade A" },
        { href: "/shop?condition=grade_b", label: "Pre-owned Grade B" },
        { href: "/shop", label: "All tech" },
      ],
    },
  ],
  "/shop?category=phones": [
    {
      title: "Explore phones",
      links: [
        { href: "/shop?category=phones&brand=Apple", label: "Apple" },
        { href: "/shop?category=phones&brand=Google", label: "Google" },
        { href: "/shop?category=phones&brand=Samsung", label: "Samsung" },
        { href: "/shop?category=phones", label: "All phones" },
      ],
    },
    {
      title: "Quick links",
      links: [
        { href: "/shop?category=phones&sort=price-desc", label: "Flagships" },
        { href: "/shop?category=phones&q=under%20500k", label: "Under ₦500k" },
        { href: "/shop?deals=1", label: "Flash deals" },
      ],
    },
  ],
  "/shop?category=laptops": [
    {
      title: "Explore laptops",
      links: [
        { href: "/shop?category=laptops&brand=Apple", label: "MacBook" },
        { href: "/shop?category=laptops&brand=HP", label: "HP" },
        { href: "/shop?category=laptops&brand=Dell", label: "Dell" },
        { href: "/shop?category=laptops", label: "All laptops" },
      ],
    },
  ],
  "/shop?category=audio": [
    {
      title: "Explore audio",
      links: [
        { href: "/shop?category=audio&brand=Apple", label: "AirPods" },
        { href: "/shop?category=audio&brand=JBL", label: "JBL" },
        { href: "/shop?category=audio&brand=Beats", label: "Beats" },
        { href: "/shop?category=audio", label: "All audio" },
      ],
    },
  ],
  "/shop?category=creation": [
    {
      title: "Explore creation",
      links: [
        { href: "/shop?category=creation&q=ipad", label: "iPad" },
        { href: "/shop?category=creation&q=pencil", label: "Apple Pencil" },
        { href: "/shop?category=creation&q=rayban", label: "Meta Ray-Ban" },
        { href: "/shop?category=creation", label: "All creation" },
      ],
    },
  ],
};

const mobileGroups = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All tech" },
      { href: "/shop?category=phones", label: "Phones" },
      { href: "/shop?category=laptops", label: "Laptops" },
      { href: "/shop?category=audio", label: "Audio" },
      { href: "/shop?category=power", label: "Power" },
      { href: "/shop?category=creation", label: "Creation" },
      { href: "/shop?category=gaming", label: "Gaming" },
      { href: "/shop?deals=1", label: "Flash deals" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/track", label: "Track your order" },
      { href: whatsappHref(), label: "WhatsApp support", external: true },
      { href: "/policies/warranty", label: "Warranty" },
      { href: "/policies/returns", label: "Returns" },
      { href: "/policies/delivery", label: "Delivery" },
    ],
  },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const { count } = useStore();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const [searchPath, setSearchPath] = useState<string | null>(null);
  const [openFlyout, setOpenFlyout] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const menuOpen = menuPath === pathname;
  const searchOpen = searchPath === pathname;

  useEffect(() => {
    if (!openFlyout) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenFlyout(null);
    }
    function onPointer(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenFlyout(null);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [openFlyout]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  function closeSoon() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenFlyout(null), 120);
  }

  function openNow(href: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenFlyout(href);
  }

  const activeFlyout = openFlyout ? flyouts[openFlyout] : null;

  return (
    <header className="sticky top-0 z-40">
      {/* Dim the page behind an open flyout, as Apple does. */}
      {openFlyout && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpenFlyout(null)}
          className="fixed inset-0 top-11 z-30 cursor-default bg-black/20"
          tabIndex={-1}
        />
      )}

      <div className="relative z-40 bg-white/80 backdrop-blur-xl backdrop-saturate-180">
        <div ref={navRef} className="store-wide">
          <nav
            aria-label="Global"
            className="flex h-11 items-center justify-between text-[12px]"
          >
            <Link
              href="/"
              aria-label="Fzmobile home"
              className="flex shrink-0 items-center opacity-80 transition-opacity hover:opacity-100"
            >
              <Image src="/brand/logo-black.svg" alt="" width={76} height={20} priority unoptimized />
            </Link>

            {/* Desktop links */}
            <div className="hidden items-center gap-8 lg:flex">
              {navItems.map((item) => {
                const hasFlyout = Boolean(flyouts[item.href]);
                const isOpen = openFlyout === item.href;
                return (
                  <div
                    key={item.href}
                    onMouseEnter={() => (hasFlyout ? openNow(item.href) : closeSoon())}
                    onMouseLeave={closeSoon}
                  >
                    <Link
                      href={item.href}
                      aria-expanded={hasFlyout ? isOpen : undefined}
                      onFocus={() => (hasFlyout ? openNow(item.href) : undefined)}
                      className={`transition-opacity hover:opacity-100 ${
                        isOpen ? "opacity-100" : "opacity-80"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-5">
              <button
                type="button"
                aria-label="Search"
                onClick={() => setSearchPath(pathname)}
                className="cursor-pointer opacity-80 transition-opacity hover:opacity-100"
              >
                <Search className="size-4" />
              </button>

              <a
                href={whatsappHref()}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp support"
                className="hidden opacity-80 transition-opacity hover:opacity-100 lg:block"
              >
                <WhatsAppIcon className="size-4" />
              </a>

              <Link
                href="/cart"
                aria-label={count > 0 ? `Bag, ${count} ${count === 1 ? "item" : "items"}` : "Bag"}
                className="relative opacity-80 transition-opacity hover:opacity-100"
              >
                <ShoppingBag className="size-4" />
                {count > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-apple-button px-1 text-[10px] font-semibold text-white">
                    {count}
                  </span>
                )}
              </Link>

              <button
                type="button"
                aria-label="Menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuPath(pathname)}
                className="cursor-pointer opacity-80 transition-opacity hover:opacity-100 lg:hidden"
              >
                <Menu className="size-4" />
              </button>
            </div>
          </nav>
        </div>

        {/* Full-width flyout panel */}
        {activeFlyout && (
          <div
            onMouseEnter={() => openNow(openFlyout!)}
            onMouseLeave={closeSoon}
            className="absolute inset-x-0 top-full hidden border-t border-apple-line bg-white/95 backdrop-blur-xl lg:block"
          >
            <div className="store-wide py-10">
              <div className="grid grid-cols-3 gap-10">
                {activeFlyout.map((column) => (
                  <div key={column.title}>
                    <p className="type-caption mb-3 uppercase tracking-wider">{column.title}</p>
                    <ul className="space-y-1.5">
                      {column.links.map((link) => (
                        <li key={link.href + link.label}>
                          <Link
                            href={link.href}
                            onClick={() => setOpenFlyout(null)}
                            className="text-[17px] font-semibold text-apple-ink transition-colors hover:text-apple-link"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile menu sheet */}
      <Sheet open={menuOpen} title="Menu" onClose={() => setMenuPath(null)}>
        <nav className="flex flex-col py-2">
          <div className="px-3 pb-4">
            <StoreSearch autoFocus autoComplete />
          </div>

          {mobileGroups.map((group) => (
            <div key={group.title} className="mb-6">
              <p className="type-caption mb-2 px-3 uppercase tracking-wider">{group.title}</p>
              <ul className="px-3">
                {group.links.map((link) => (
                  <li key={link.href + link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setMenuPath(null)}
                        className="flex h-11 items-center border-b border-apple-line text-[17px] text-apple-ink last:border-0"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={() => setMenuPath(null)}
                        className="flex h-11 items-center border-b border-apple-line text-[17px] text-apple-ink last:border-0"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </Sheet>

      {/* Mobile search sheet */}
      <Sheet open={searchOpen} title="Search" onClose={() => setSearchPath(null)}>
        <div className="flex items-start gap-2 py-2">
          <div className="min-w-0 flex-1">
            <StoreSearch autoFocus autoComplete />
          </div>
          <button
            type="button"
            onClick={() => setSearchPath(null)}
            className="mt-1 flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-hover"
            aria-label="Close search"
          >
            <X className="size-5" />
          </button>
        </div>
      </Sheet>
    </header>
  );
}
