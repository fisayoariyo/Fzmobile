"use client";

import { WhatsAppIcon } from "@/components/icons";
import { StoreSearch } from "@/components/store-search";
import { Sheet } from "@/components/sheet";
import { whatsappHref } from "@/lib/site";
import { useStore } from "@/lib/store";
import { ChevronDown, Menu, Search, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const desktopNav = [
  { href: "/shop?deals=1", label: "Deals" },
  { href: "/friends", label: "Friends" },
  { href: "/track", label: "Track" },
] as const;

const megaCategories = [
  { href: "/shop?category=phones", label: "Phones", hint: "iPhone · Pixel · flagship" },
  { href: "/shop?category=laptops", label: "Laptops", hint: "MacBook · HP · Dell" },
  { href: "/shop?category=audio", label: "Audio", hint: "AirPods · JBL · Beats" },
  { href: "/shop?category=power", label: "Power", hint: "Adapters · charging" },
  { href: "/shop?category=creation", label: "Creation", hint: "iPad · Pencil · Meta" },
  { href: "/shop?category=gaming", label: "Gaming", hint: "Consoles · decks" },
] as const;

const megaBrands = [
  { href: "/shop?brand=Apple", label: "Apple" },
  { href: "/shop?brand=Google", label: "Google" },
  { href: "/shop?brand=Samsung", label: "Samsung" },
  { href: "/shop?brand=JBL", label: "JBL" },
  { href: "/shop?brand=HP", label: "HP" },
  { href: "/shop?brand=Dell", label: "Dell" },
] as const;

const megaBudgets = [
  { href: "/shop?q=under%20500k", label: "Under ₦500k" },
  { href: "/shop?q=under%20800k", label: "Under ₦800k" },
  { href: "/shop?q=under%201m", label: "Under ₦1m" },
  { href: "/shop?deals=1", label: "Flash deals" },
] as const;

const mobileShopLinks = [
  { href: "/shop", label: "All tech", strong: true },
  ...megaCategories,
] as const;

const supportLinks = [
  { href: "/track", label: "Track your order", strong: true },
  { href: whatsappHref(), label: "WhatsApp support", external: true },
] as const;

const policyLinks = [
  ["Warranty", "/policies/warranty"],
  ["Returns", "/policies/returns"],
  ["Delivery", "/policies/delivery"],
  ["Privacy", "/policies/privacy"],
  ["Terms", "/policies/terms"],
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const { count } = useStore();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const [searchPath, setSearchPath] = useState<string | null>(null);
  const [megaOpen, setMegaOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const megaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Derive overlay state from the pathname they were opened on, so navigating
  // closes them without an effect that sets state.
  const menuOpen = menuPath === pathname;
  const searchOpen = searchPath === pathname;

  // Escape closes the mega-menu; outside click closes it too.
  useEffect(() => {
    if (!megaOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMegaOpen(false);
    }
    function onPointer(event: MouseEvent) {
      if (megaRef.current && !megaRef.current.contains(event.target as Node)) {
        setMegaOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [megaOpen]);

  // Close the menu on hover-out of the whole mega-menu region.
  useEffect(() => {
    return () => {
      if (megaTimer.current) clearTimeout(megaTimer.current);
    };
  }, []);

  function closeMenuSoon() {
    if (megaTimer.current) clearTimeout(megaTimer.current);
    megaTimer.current = setTimeout(() => setMegaOpen(false), 140);
  }

  const shopActive = pathname.startsWith("/shop");

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-white/95 backdrop-blur-md">
      <div className="store-container flex h-16 items-center gap-2 md:h-18 md:gap-4">
        <button
          type="button"
          className="-ml-2 flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-hover md:hidden"
          onClick={() => setMenuPath(pathname)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
        >
          <Menu className="size-5" />
        </button>

        <Link href="/" className="flex shrink-0 items-center" aria-label="Fzmobile home">
          <Image
            src="/brand/logo-black.svg"
            alt=""
            width={112}
            height={30}
            priority
            unoptimized
          />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <div
            ref={megaRef}
            className="relative"
            onMouseEnter={() => {
              if (megaTimer.current) clearTimeout(megaTimer.current);
              setMegaOpen(true);
            }}
            onMouseLeave={closeMenuSoon}
          >
            <button
              type="button"
              aria-expanded={megaOpen}
              aria-haspopup="true"
              onClick={() => setMegaOpen((open) => !open)}
              className={`flex cursor-pointer items-center gap-1 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                shopActive || megaOpen
                  ? "bg-brand-soft font-semibold text-brand"
                  : "text-muted hover:bg-surface hover:text-brand"
              }`}
            >
              Shop
              <ChevronDown
                className={`size-4 transition-transform duration-200 ${
                  megaOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {megaOpen && (
              <div className="absolute left-0 top-full z-50 pt-2">
                <div className="animate-scale-up w-[620px] rounded-3xl border border-line bg-white p-5 shadow-[0_12px_40px_rgba(60,64,67,0.18)]">
                  <div className="grid grid-cols-[1.6fr_1fr] gap-6">
                    <div>
                      <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-faint">
                        Categories
                      </p>
                      <ul className="grid grid-cols-2 gap-0.5">
                        {megaCategories.map((category) => (
                          <li key={category.href}>
                            <Link
                              href={category.href}
                              className="block rounded-xl px-2 py-2 transition-colors hover:bg-surface"
                            >
                              <span className="block text-sm font-medium text-ink">
                                {category.label}
                              </span>
                              <span className="block truncate text-[11px] text-faint">
                                {category.hint}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-l border-line pl-6">
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-faint">
                        By brand
                      </p>
                      <ul className="mb-4 flex flex-wrap gap-1.5">
                        {megaBrands.map((brand) => (
                          <li key={brand.href}>
                            <Link
                              href={brand.href}
                              className="inline-flex rounded-full border border-line px-3 py-1 text-xs text-ink transition-colors hover:border-brand hover:bg-brand-soft hover:text-brand"
                            >
                              {brand.label}
                            </Link>
                          </li>
                        ))}
                      </ul>

                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-faint">
                        By budget
                      </p>
                      <ul className="flex flex-col gap-0.5">
                        {megaBudgets.map((budget) => (
                          <li key={budget.href}>
                            <Link
                              href={budget.href}
                              className="block rounded-lg px-2 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-surface hover:text-brand"
                            >
                              {budget.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Link
                    href="/shop"
                    className="mt-4 block rounded-2xl bg-surface px-4 py-2.5 text-center text-sm font-semibold text-brand transition-colors hover:bg-brand-soft"
                  >
                    Browse all tech →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {desktopNav.map((link) => {
            const pathOnly = link.href.split("?")[0];
            const isActive =
              !link.href.includes("deals") &&
              (pathname === pathOnly || pathname.startsWith(`${pathOnly}/`));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-soft font-semibold text-brand"
                    : "text-muted hover:bg-surface hover:text-brand"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Inline desktop search — the primary way to find a device */}
        <div className="ml-auto hidden min-w-0 flex-1 justify-end md:flex">
          <StoreSearch />
        </div>

        <div className="ml-auto flex items-center gap-1 md:ml-0 md:gap-1.5">
          <button
            type="button"
            className="flex size-10 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-hover md:hidden"
            aria-label="Search"
            onClick={() => setSearchPath(pathname)}
          >
            <Search className="size-5" />
          </button>
          <a
            href={whatsappHref()}
            className="hidden size-10 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-hover md:flex"
            aria-label="WhatsApp support"
            target="_blank"
            rel="noreferrer"
          >
            <WhatsAppIcon className="size-5 text-muted" />
          </a>
          <Link
            href="/cart"
            className="relative flex size-10 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-hover"
            aria-label={count > 0 ? `Cart, ${count} ${count === 1 ? "item" : "items"}` : "Cart"}
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1.5 text-[10px] font-semibold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile menu sheet */}
      <Sheet open={menuOpen} title="Menu" onClose={() => setMenuPath(null)}>
        <nav className="flex flex-col py-2">
          <div className="px-3 pb-3">
            <StoreSearch autoFocus autoComplete />
          </div>

          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-faint">
            Shop
          </p>
          <div className="grid grid-cols-2 gap-1.5 px-3">
            {mobileShopLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuPath(null)}
                className={`flex h-11 items-center rounded-xl border px-3 text-sm transition-colors ${
                  "strong" in link && link.strong
                    ? "border-brand bg-brand-soft font-semibold text-brand"
                    : "border-line text-ink hover:bg-surface"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <p className="mt-5 px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-faint">
            Support
          </p>
          <div className="flex flex-col gap-0.5 px-3">
            {supportLinks.map((link) =>
              "external" in link && link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuPath(null)}
                  className="flex h-11 items-center rounded-xl px-3 text-sm text-muted transition-colors hover:bg-surface hover:text-brand"
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuPath(null)}
                  className="flex h-11 items-center rounded-xl px-3 text-sm font-semibold text-ink transition-colors hover:bg-surface hover:text-brand"
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>

          <p className="mt-5 px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-faint">
            Policies
          </p>
          <div className="flex flex-wrap gap-2 px-3 pt-1">
            {policyLinks.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuPath(null)}
                className="rounded-full bg-surface px-3.5 py-1.5 text-xs text-muted transition-colors hover:bg-brand-soft hover:text-brand"
              >
                {label}
              </Link>
            ))}
          </div>
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
