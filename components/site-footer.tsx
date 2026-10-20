"use client";

import { WhatsAppIcon } from "@/components/icons";
import { BANK, whatsappHref } from "@/lib/site";
import { ChevronDown, Landmark, MapPin, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const columns = [
  {
    title: "Shop",
    links: [
      ["All tech", "/shop"],
      ["Phones", "/shop?category=phones"],
      ["Laptops", "/shop?category=laptops"],
      ["Audio", "/shop?category=audio"],
      ["Power", "/shop?category=power"],
      ["Flash deals", "/shop?deals=1"],
    ],
  },
  {
    title: "Company",
    links: [
      ["Friends", "/friends"],
      ["Track order", "/track"],
      ["WhatsApp", whatsappHref()],
    ],
  },
  {
    title: "Support",
    links: [
      ["Warranty", "/policies/warranty"],
      ["Returns", "/policies/returns"],
      ["Delivery", "/policies/delivery"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Privacy", "/policies/privacy"],
      ["Terms", "/policies/terms"],
    ],
  },
] as const;

function FooterLink({ label, href }: { label: string; href: string }) {
  const className =
    "block py-1.5 text-sm text-muted transition-colors hover:text-brand md:py-1 md:text-xs";

  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

export function SiteFooter() {
  const [openColumn, setOpenColumn] = useState<string | null>(null);

  return (
    <footer className="mt-auto border-t border-line bg-surface text-ink">
      <div className="store-container grid gap-10 py-12 md:grid-cols-[1.1fr_2fr] md:gap-16 md:py-16">
        <div>
          <Image
            src="/brand/logo-black.svg"
            alt="Fzmobile"
            width={124}
            height={34}
            unoptimized
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Authentic tech in Nigeria. Exact colour, storage, and grade — prices in Naira.
          </p>
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-medium text-brand shadow-xs transition-colors hover:bg-hover"
          >
            <WhatsAppIcon className="size-4 text-[#25D366]" />
            Chat on WhatsApp
          </a>
        </div>

        {/* Mobile: accordions. Desktop: static columns. */}
        <div className="md:hidden">
          {columns.map((column) => {
            const open = openColumn === column.title;
            return (
              <div key={column.title} className="border-b border-line/70 last:border-b-0">
                <button
                  type="button"
                  onClick={() => setOpenColumn(open ? null : column.title)}
                  aria-expanded={open}
                  className="flex w-full cursor-pointer items-center justify-between py-3.5 text-left"
                >
                  <span className="text-sm font-semibold text-ink">{column.title}</span>
                  <ChevronDown
                    className={`size-4 text-muted transition-transform duration-200 ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {open && (
                  <div className="pb-3">
                    {column.links.map(([label, href]) => (
                      <FooterLink key={href} label={label} href={href} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="hidden grid-cols-4 gap-8 md:grid">
          {columns.map((column) => (
            <div key={column.title}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink">
                {column.title}
              </p>
              <ul>
                {column.links.map(([label, href]) => (
                  <li key={href}>
                    <FooterLink label={label} href={href} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Payment & trust row */}
      <div className="border-t border-line">
        <div className="store-container flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-muted">
            <span className="inline-flex items-center gap-2">
              <Landmark className="size-4 text-brand" />
              Bank transfer · {BANK.bank}
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="size-4 text-good" />
              Receipt verified before dispatch
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-4 text-muted" />
              Lagos, Nigeria
            </span>
          </div>
          <Link
            href="/policies/delivery"
            className="text-xs font-medium text-brand hover:underline"
          >
            How delivery &amp; payment work →
          </Link>
        </div>
      </div>

      <div className="border-t border-line py-6 pb-28 md:pb-6">
        <div className="store-container flex flex-col items-center justify-between gap-2 text-xs text-faint sm:flex-row">
          <p>© {new Date().getFullYear()} Fzmobile. All rights reserved.</p>
          <p>Authentic Tech Store · Nigeria</p>
        </div>
      </div>
    </footer>
  );
}
