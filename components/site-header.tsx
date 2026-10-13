"use client";

import { WhatsAppIcon } from "@/components/icons";
import { SearchPill } from "@/components/search-pill";
import { Sheet } from "@/components/sheet";
import { whatsappHref } from "@/lib/site";
import { useStore } from "@/lib/store";
import { Menu, Search, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

const desktopNav = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop?deals=1", label: "Deals" },
  { href: "/friends", label: "Friends" },
  { href: "/track", label: "Track" },
] as const;

const shopLinks = [
  { href: "/shop", label: "All tech", strong: true },
  { href: "/shop?category=phones&brand=Apple", label: "Apple" },
  { href: "/shop?category=phones&brand=Google", label: "Google Pixel" },
  { href: "/shop?category=phones", label: "All phones" },
  { href: "/shop?category=laptops", label: "Laptops" },
  { href: "/shop?category=audio", label: "Audio" },
  { href: "/shop?category=power", label: "Power" },
  { href: "/shop?category=creation", label: "Creation" },
  { href: "/shop?category=gaming", label: "Gaming" },
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
  const isClient = useIsClient();
  const { count } = useStore();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const [searchPath, setSearchPath] = useState<string | null>(null);
  const menuOpen = menuPath === pathname;
  const searchOpen = searchPath === pathname;

  function openSearch() {
    const field = document.getElementById("site-search") as HTMLInputElement | null;
    if (field && !searchOpen) {
      field.focus();
      field.scrollIntoView({ block: "center" });
      return;
    }
    setSearchPath(pathname);
  }

  function closeMenu() {
    setMenuPath(null);
  }

  const hideOnMobileHome = isClient && pathname === "/";

  return (
    <header
      className={`sticky top-0 z-40 border-b border-black/[0.04] bg-white/80 backdrop-blur-xl ${
        hideOnMobileHome ? "hidden md:block" : ""
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center px-2 md:h-[4.5rem] md:px-6">
        <button
          type="button"
          className="flex size-12 cursor-pointer items-center justify-center rounded-xl transition-colors duration-200 hover:bg-surface md:hidden"
          aria-label="Menu"
          onClick={() => setMenuPath(pathname)}
        >
          <Menu className="size-6" />
        </button>
        <Link href="/" className="ml-1 md:ml-0" aria-label="Fzmobile home">
          <Image src="/brand/logo-black.svg" alt="" width={118} height={32} priority unoptimized />
        </Link>

        <nav className="ml-10 hidden items-center gap-7 md:flex">
          {desktopNav.map((link) => {
            const pathOnly = link.href.split("?")[0];
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : link.href.includes("deals")
                  ? false
                  : pathname === pathOnly || pathname.startsWith(`${pathOnly}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors duration-200 ${
                  isActive ? "text-deep" : "text-black/70 hover:text-deep"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            className="flex size-12 cursor-pointer items-center justify-center rounded-xl transition-colors duration-200 hover:bg-surface"
            aria-label="Search"
            onClick={openSearch}
          >
            <Search className="size-5" />
          </button>
          <a
            href={whatsappHref()}
            className="hidden size-12 cursor-pointer items-center justify-center rounded-xl transition-colors duration-200 hover:bg-surface sm:flex"
            aria-label="WhatsApp support"
            target="_blank"
            rel="noreferrer"
          >
            <WhatsAppIcon className="size-5" />
          </a>
          <Link
            href="/cart"
            className="relative flex size-12 cursor-pointer items-center justify-center rounded-xl transition-colors duration-200 hover:bg-surface"
            aria-label={count > 0 ? `Cart, ${count} ${count === 1 ? "item" : "items"}` : "Cart"}
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-deep px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      <Sheet open={menuOpen} title="Menu" onClose={closeMenu}>
        <nav className="flex flex-col pb-4">
          <p className="pb-2 text-xs font-bold uppercase tracking-[0.14em] text-muted">Shop</p>
          {shopLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className={`flex h-12 items-center border-t border-line text-base ${
                "strong" in link && link.strong ? "font-bold" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}

          <p className="mt-6 pb-2 text-xs font-bold uppercase tracking-[0.14em] text-muted">
            Support
          </p>
          {supportLinks.map((link) =>
            "external" in link && link.external ? (
              <a
                key={link.label}
                href={link.href}
                onClick={closeMenu}
                className="flex h-12 items-center border-t border-line text-base"
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={`flex h-12 items-center border-t border-line text-base ${
                  "strong" in link && link.strong ? "font-bold" : ""
                }`}
              >
                {link.label}
              </Link>
            ),
          )}

          <p className="mt-6 pb-2 text-xs font-bold uppercase tracking-[0.14em] text-muted">
            Policies
          </p>
          {policyLinks.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={closeMenu}
              className="flex h-11 items-center border-t border-line text-sm text-muted"
            >
              {label}
            </Link>
          ))}
        </nav>
      </Sheet>

      <Sheet open={searchOpen} title="Search" onClose={() => setSearchPath(null)}>
        <SearchPill autoFocus />
      </Sheet>
    </header>
  );
}
