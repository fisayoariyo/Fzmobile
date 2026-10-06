import { whatsappHref } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";

const links = [
  ["Warranty", "/policies/warranty"],
  ["Returns", "/policies/returns"],
  ["Delivery", "/policies/delivery"],
  ["Privacy", "/policies/privacy"],
  ["Terms", "/policies/terms"],
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-black/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:px-6">
        <Image
          src="/brand/logo-black.svg"
          alt="Fzmobile"
          width={118}
          height={32}
          unoptimized
          className="self-start"
        />
        <nav className="flex flex-col gap-3 md:flex-row md:gap-6">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="text-sm font-bold">
              {label}
            </Link>
          ))}
          <a href={whatsappHref()} className="text-sm font-bold text-deep" target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </nav>
        <p className="text-sm text-muted">Tech only. Prices in Nigerian Naira.</p>
      </div>
    </footer>
  );
}
