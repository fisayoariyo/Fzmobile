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
    <footer className="mt-auto bg-slate-900 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1.2fr_2fr] md:gap-16 md:px-6 md:py-20">
        <div>
          <Image
            src="/brand/logo-black.svg"
            alt="Fzmobile"
            width={132}
            height={36}
            unoptimized
            className="brightness-0 invert"
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
            Authentic tech in Nigeria. Exact colour, storage, and grade — prices in Naira.
          </p>
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex h-11 cursor-pointer items-center rounded-full bg-[#25D366] px-5 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            Chat on WhatsApp
          </a>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {columns.map((column) => (
            <div key={column.title}>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{column.title}</p>
              <ul className="mt-4 space-y-3">
                {column.links.map(([label, href]) => (
                  <li key={href}>
                    {href.startsWith("http") ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-slate-300 transition-colors hover:text-white"
                      >
                        {label}
                      </a>
                    ) : (
                      <Link
                        href={href}
                        className="text-sm text-slate-300 transition-colors hover:text-white"
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
      <div className="border-t border-slate-800">
        <p className="mx-auto max-w-6xl px-4 py-5 text-center text-xs text-slate-500 md:px-6">
          © {new Date().getFullYear()} Fzmobile. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
