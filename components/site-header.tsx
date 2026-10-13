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
      className={`sticky top-0 z-40 border-b border-[#dadce0]/60 bg-white/95 backdrop-blur-md ${
        hideOnMobileHome ? "hidden md:block" : ""
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center px-4 md:h-18 md:px-6">
        <button
          type="button"
          className="flex size-10 cursor-pointer items-center justify-center rounded-full text-[#5f6368] transition-colors hover:bg-[#f1f3f4] md:hidden"
          aria-label="Menu"
          onClick={() => setMenuPath(pathname)}
        >
          <Menu className="size-5" />
        </button>
        <Link href="/" className="ml-1 flex items-center md:ml-0" aria-label="Fzmobile home">
          <Image src="/brand/logo-black.svg" alt="" width={118} height={32} priority unoptimized />
        </Link>

        <nav className="ml-8 hidden items-center gap-1.5 md:flex">
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
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#e8f0fe] font-semibold text-[#1a73e8]"
                    : "text-[#5f6368] hover:bg-[#f8f9fa] hover:text-[#1a73e8]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            className="flex size-10 cursor-pointer items-center justify-center rounded-full text-[#5f6368] transition-colors hover:bg-[#f1f3f4]"
            aria-label="Search"
            onClick={openSearch}
          >
            <Search className="size-5" />
          </button>
          <a
            href={whatsappHref()}
            className="hidden size-10 cursor-pointer items-center justify-center rounded-full text-[#5f6368] transition-colors hover:bg-[#f1f3f4] sm:flex"
            aria-label="WhatsApp support"
            target="_blank"
            rel="noreferrer"
          >
            <WhatsAppIcon className="size-5 text-[#5f6368]" />
          </a>
          <Link
            href="/cart"
            className="relative flex size-10 cursor-pointer items-center justify-center rounded-full text-[#5f6368] transition-colors hover:bg-[#f1f3f4]"
            aria-label={count > 0 ? `Cart, ${count} ${count === 1 ? "item" : "items"}` : "Cart"}
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#1a73e8] px-1.5 text-[10px] font-semibold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      <Sheet open={menuOpen} title="Menu" onClose={closeMenu}>
        <nav className="flex flex-col py-2">
          <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-wider text-[#5f6368]">
            Shop
          </p>
          <div className="flex flex-col gap-0.5">
            {shopLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={`flex h-11 items-center rounded-xl px-3 text-sm transition-colors hover:bg-[#f8f9fa] hover:text-[#1a73e8] ${
                  "strong" in link && link.strong
                    ? "font-semibold text-[#202124]"
                    : "font-normal text-[#5f6368]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <p className="mt-5 px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-[#5f6368]">
            Support
          </p>
          <div className="flex flex-col gap-0.5">
            {supportLinks.map((link) =>
              "external" in link && link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={closeMenu}
                  className="flex h-11 items-center rounded-xl px-3 text-sm font-normal text-[#5f6368] transition-colors hover:bg-[#f8f9fa] hover:text-[#1a73e8]"
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
                  className={`flex h-11 items-center rounded-xl px-3 text-sm transition-colors hover:bg-[#f8f9fa] hover:text-[#1a73e8] ${
                    "strong" in link && link.strong
                      ? "font-semibold text-[#202124]"
                      : "font-normal text-[#5f6368]"
                  }`}
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>

          <p className="mt-5 px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-[#5f6368]">
            Policies
          </p>
          <div className="flex flex-wrap gap-2 px-3 pt-1">
            {policyLinks.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
                className="rounded-full bg-[#f8f9fa] px-3.5 py-1.5 text-xs text-[#5f6368] transition-colors hover:bg-[#e8f0fe] hover:text-[#1a73e8]"
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
      </Sheet>

      <Sheet open={searchOpen} title="Search" onClose={() => setSearchPath(null)}>
        <div className="py-2">
          <SearchPill autoFocus />
        </div>
      </Sheet>
    </header>
  );
}
