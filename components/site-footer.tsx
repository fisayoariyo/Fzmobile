import { WhatsAppIcon } from "@/components/icons";
import { whatsappHref } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";

const columns = [
  {
    title: "Shop",
    links: [
      ["All tech", "/shop"],
      ["Phones", "/shop?category=phones"],
      ["Laptops", "/shop?category=laptops"],
      ["Audio", "/shop?category=audio"],
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

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[#dadce0] bg-[#f8f9fa] text-[#202124]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.2fr_2fr] md:gap-16 md:px-6 md:py-16">
        <div>
          <Image
            src="/brand/logo-black.svg"
            alt="Fzmobile"
            width={124}
            height={34}
            unoptimized
          />
          <p className="mt-4 max-w-xs text-xs leading-relaxed text-[#5f6368] md:text-sm">
            Authentic tech in Nigeria. Exact colour, storage, and grade — prices in Naira.
          </p>
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#dadce0] bg-white px-5 py-2.5 text-xs font-medium text-[#1a73e8] shadow-xs transition-colors hover:bg-[#f1f3f4]"
          >
            <WhatsAppIcon className="size-4 text-[#25D366]" />
            Chat on WhatsApp
          </a>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {columns.map((column) => (
            <div key={column.title}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#202124]">
                {column.title}
              </p>
              <ul className="space-y-1">
                {column.links.map(([label, href]) => (
                  <li key={href}>
                    {href.startsWith("http") ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-xs leading-6 text-[#5f6368] transition-colors hover:text-[#1a73e8]"
                      >
                        {label}
                      </a>
                    ) : (
                      <Link
                        href={href}
                        className="block text-xs leading-6 text-[#5f6368] transition-colors hover:text-[#1a73e8]"
                      >
                        {label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-[#dadce0] py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-xs text-[#70757a] sm:flex-row md:px-6">
          <p>© {new Date().getFullYear()} Fzmobile. All rights reserved.</p>
          <p>Lagos, Nigeria · Authentic Tech Store</p>
        </div>
      </div>
    </footer>
  );
}
