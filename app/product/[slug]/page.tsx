import { FriendsRow } from "@/components/friends-row";
import { friends, getProduct } from "@/lib/catalog";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BuyBox } from "./buy-box";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ v?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Device" };
  return { title: product.name, description: product.description };
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { v } = await searchParams;
  const product = getProduct(slug);
  if (!product) notFound();
  const related = friends.filter((friend) => friend.productSlug === product.slug);

  return (
    <div>
      <BuyBox product={product} initialVariantId={v ?? ""} />
      <div className="mx-auto max-w-6xl px-4 pb-24 md:px-6 md:pb-16">
        <h2 className="font-display text-2xl font-medium">Specifications</h2>
        <p className="mt-3 max-w-2xl text-base text-muted leading-relaxed">{product.description}</p>
        <div className="mt-6 max-w-xl rounded-2xl bg-surface p-6">
          <dl className="divide-y divide-line">
            {product.specs.map((spec) => (
              <div key={spec.label} className="flex justify-between gap-6 py-3 text-sm first:pt-0 last:pb-0">
                <dt className="text-muted">{spec.label}</dt>
                <dd className="text-right font-bold">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-5 font-display text-2xl font-medium">See What Our Friends Say</h2>
            <FriendsRow items={related} />
          </section>
        )}
      </div>
    </div>
  );
}
