import { CategoryChips } from "@/components/category-chips";
import { FriendsRow } from "@/components/friends-row";
import { ProductCard } from "@/components/product-card";
import { SearchPill } from "@/components/search-pill";
import { TrackForm } from "@/components/track-form";
import { flashDeals } from "@/lib/catalog";
import Link from "next/link";

export default function HomePage() {
  const deals = flashDeals();

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6">
      <div className="pt-4">
        <SearchPill />
      </div>
      <div className="mt-4">
        <CategoryChips />
      </div>

      <section className="max-w-xl py-10 md:py-16">
        <h1 className="font-display text-[2rem] font-medium leading-[1.15] tracking-tight md:text-5xl">
          100% Authentic Tech. Fast Delivery.
        </h1>
        <p className="mt-3 text-sm text-muted md:text-base">
          12-Month Warranty · Same-Day Dispatch
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex h-12 cursor-pointer items-center rounded-full bg-deep px-6 font-bold text-white transition-colors duration-200 hover:bg-[#0f4a3b]"
        >
          Shop Certified Devices
        </Link>
      </section>

      <section className="pb-12">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="font-display text-2xl font-medium">Flash Deals</h2>
          <Link href="/shop?deals=1" className="text-sm font-bold text-deep">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-x-5">
          {deals.map(({ product, variant }) => (
            <ProductCard key={variant.id} product={product} variant={variant} />
          ))}
        </div>
      </section>

      <section className="border-t border-line py-12">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="font-display text-2xl font-medium">See What Our Friends Say</h2>
          <Link href="/friends" className="text-sm font-bold text-deep">
            Explore
          </Link>
        </div>
        <FriendsRow />
      </section>

      <section className="border-t border-line py-12">
        <h2 className="font-display text-2xl font-medium">Track your order</h2>
        <p className="mt-2 mb-5 max-w-md text-sm text-muted">
          Use the Order ID and the phone number from checkout. No account needed.
        </p>
        <TrackForm />
      </section>
    </div>
  );
}
