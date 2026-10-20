"use client";

import { WhatsAppIcon } from "@/components/icons";
import { BANK, whatsappHref } from "@/lib/site";
import { ChevronDown, Landmark, MapPin, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

/**
 * Apple-style footer: a hairline top border on the #f5f5f7 band, four tight
 * link columns in small type, then the legal block. Apple keeps this dense
 * and quiet — no logo wall, no dark slab.
 */

const columns = [
  {
    title: "Shop and Learn",
    links: [
      ["All tech", "/shop"],
      ["Phones", "/category/phones"],
      ["Laptops", "/category/laptops"],
      ["Audio", "/category/audio"],
      ["Power", "/category/power"],
      ["Creation", "/category/creation"],
      ["Gaming", "/category/gaming"],
    ],
  },
  {
    title: "Shop by grade",
    links: [
      ["Brand new sealed", "/shop?condition=new_sealed"],
      ["Pre-owned Grade A", "/shop?condition=grade_a"],
      ["Pre-owned Grade B", "/shop?condition=grade_b"],
      ["Flash deals", "/shop?deals=1"],
    ],
  },
  {
    title: "Account",
    links: [
      ["Cart", "/cart"],
      ["Track an order", "/track"],
      ["Checkout", "/checkout"],
      ["Friends of Fzmobile", "/friends"],
    ],
  },
  {
    title: "Support",
    links: [
      ["Warranty", "/policies/warranty"],
      ["Returns & refunds", "/policies/returns"],
      ["Delivery fees", "/policies/delivery"],
      ["WhatsApp support", whatsappHref()],
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
    "block py-1 text-[12px] leading-[1.33337] tracking-[-0.01em] text-apple-muted transition-colors hover:text-apple-ink hover:underline";

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
    <footer className="mt-auto bg-apple-band pb-28 pt-6 md:pb-6">
      <div className="store-wide">
        {/* Trust strip — Apple opens its footer with a note line. */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-apple-line pb-5 text-[12px] leading-[1.33337] tracking-[-0.01em] text-apple-muted">
          <span className="inline-flex items-center gap-1.5">
            <Landmark className="size-3.5" />
            Bank transfer · {BANK.bank}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="size-3.5" />
            Receipt verified before dispatch
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5" />
            Lagos, Nigeria
          </span>
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-apple-link hover:underline"
          >
            <WhatsAppIcon className="size-3.5" />
            Chat with us
          </a>
        </div>

        {/* Mobile: accordions. Desktop: five tight columns. */}
        <div className="md:hidden">
          {columns.map((column) => {
            const open = openColumn === column.title;
            return (
              <div key={column.title} className="border-b border-apple-line last:border-b-0">
                <button
                  type="button"
                  onClick={() => setOpenColumn(open ? null : column.title)}
                  aria-expanded={open}
                  className="flex w-full cursor-pointer items-center justify-between py-3 text-left"
                >
                  <span className="text-[12px] font-medium tracking-[-0.01em] text-apple-ink">
                    {column.title}
                  </span>
                  <ChevronDown
                    className={`size-3.5 text-apple-muted transition-transform duration-200 ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {open && (
                  <div className="pb-3">
                    {column.links.map(([label, href]) => (
                      <FooterLink key={label} label={label} href={href} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="hidden grid-cols-5 gap-6 py-6 md:grid">
          {columns.map((column) => (
            <div key={column.title}>
              <p className="mb-2.5 text-[12px] font-semibold tracking-[-0.01em] text-apple-ink">
                {column.title}
              </p>
              <ul>
                {column.links.map(([label, href]) => (
                  <li key={label}>
                    <FooterLink label={label} href={href} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 border-t border-apple-line pt-5 text-[12px] leading-[1.33337] tracking-[-0.01em] text-apple-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Fzmobile. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link href="/policies/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/policies/terms" className="hover:underline">
              Terms of Use
            </Link>
            <Link href="/policies/delivery" className="hover:underline">
              Delivery &amp; Payment
            </Link>
          </div>
          <p>Authentic Tech Store · Nigeria</p>
        </div>
      </div>
    </footer>
  );
}
