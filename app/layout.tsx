import { MuiProvider } from "@/components/mui-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StoreProvider } from "@/lib/store";
import type { Metadata } from "next";
import { Bricolage_Grotesque, Lato } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: {
    default: "Fzmobile",
    template: "%s · Fzmobile",
  },
  description:
    "Trusted tech in Nigeria. Every listing shows the exact colour, storage, and condition.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${bricolage.variable} ${lato.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white font-sans text-black">
        <MuiProvider>
          <StoreProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </StoreProvider>
        </MuiProvider>
      </body>
    </html>
  );
}
