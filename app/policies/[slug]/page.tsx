import type { Metadata } from "next";
import { notFound } from "next/navigation";

const pages: Record<string, { title: string; body: string[] }> = {
  warranty: {
    title: "Warranty",
    body: [
      "Every device is listed with a 12-month warranty summary. The exact cover depends on the condition grade.",
      "Brand New Sealed units follow the manufacturer warranty where it applies in Nigeria. Pre-owned Grade A and Grade B units are covered by Fzmobile for faults that were not described on the listing.",
      "Cosmetic wear that matches the published grade is not a fault. The full exclusion list is still being confirmed with operations before launch.",
    ],
  },
  returns: {
    title: "Returns",
    body: [
      "If a device arrives with a fault that the listing did not describe, contact WhatsApp support with the Order ID.",
      "Returns for a change of mind, and the restocking rules for each grade, are still being confirmed.",
    ],
  },
  delivery: {
    title: "Delivery",
    body: [
      "Lagos orders go out with a Same-State rider. Other Nigerian states go through a motor park. International orders go with DHL or FedEx.",
      "The fee and estimate are shown before you place the order. After dispatch, tracking shows the rider, the park and vehicle, or the courier number.",
      "Same-day dispatch applies to orders whose payment is verified before 2:00pm WAT, on days the store is verifying transfers.",
    ],
  },
  privacy: {
    title: "Privacy",
    body: [
      "Checkout collects your name, phone number, and delivery address. That is what we need to confirm payment and deliver the device.",
      "Receipts are private. They are visible to the store and to you through your order, and they are not published.",
      "You can ask for a copy of your data, or for it to be deleted, once accounts are available. Until then, ask on WhatsApp with the phone number used at checkout.",
    ],
  },
  terms: {
    title: "Terms",
    body: [
      "Fzmobile sells technology only: phones, computing, gaming, audio, content-creation gear, and power utilities.",
      "The price you pay is the total shown at checkout, in Nigerian Naira. Payment in this version is by bank transfer, confirmed by a person before dispatch.",
      "Pre-owned devices are sold on the grade shown on the listing. Placing the order confirms you have read that grade.",
    ],
  },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = pages[slug];
  return { title: page?.title ?? "Policy" };
}

export default async function PolicyPage({ params }: Props) {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) notFound();

  return (
    <article className="mx-auto max-w-2xl px-4 py-10 md:px-6">
      <h1 className="font-display text-4xl font-medium">{page.title}</h1>
      <div className="mt-6 space-y-4 text-base leading-relaxed">
        {page.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}
