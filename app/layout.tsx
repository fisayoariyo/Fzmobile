import { MobileTabBar } from "@/components/mobile-tab-bar";
import { MuiProvider } from "@/components/mui-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StoreProvider } from "@/lib/store";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
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
      className={`${jakarta.variable} font-sans h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#ffffff] font-sans text-[#202124]">
        <MuiProvider>
          <StoreProvider>
            <SiteHeader />
            <main className="flex-1 pb-16 md:pb-0">{children}</main>
            <div className="hidden md:block">
              <SiteFooter />
            </div>
            <MobileTabBar />
          </StoreProvider>
        </MuiProvider>
      </body>
    </html>
  );
}
