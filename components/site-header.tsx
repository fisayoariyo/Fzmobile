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
import { useState } from "react";

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

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center px-2 md:px-4">
        <button
          type="button"
          className="flex size-12 cursor-pointer items-center justify-center"
          aria-label="Menu"
          onClick={() => setMenuPath(pathname)}
        >
          <Menu className="size-6" />
        </button>
        <Link href="/" className="ml-1" aria-label="Fzmobile home">
          <Image src="/brand/logo-black.svg" alt="" width={118} height={32} priority unoptimized />
        </Link>
        <div className="ml-auto flex items-center">
          <button
            type="button"
            className="flex size-12 cursor-pointer items-center justify-center"
            aria-label="Search"
            onClick={openSearch}
          >
            <Search className="size-6" />
          </button>
          <a
            href={whatsappHref()}
            className="flex size-12 cursor-pointer items-center justify-center"
            aria-label="WhatsApp support"
            target="_blank"
            rel="noreferrer"
          >
            <WhatsAppIcon className="size-6" />
          </a>
          <Link
            href="/cart"
            className="relative flex size-12 cursor-pointer items-center justify-center"
            aria-label={count > 0 ? `Cart, ${count} ${count === 1 ? "item" : "items"}` : "Cart"}
          >
            <ShoppingBag className="size-6" />
            {count > 0 && (
              <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-deep px-1 text-[11px] font-bold text-white">
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
