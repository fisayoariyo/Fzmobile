import { sellPrice } from "./pricing";
import type { CategoryId, Condition, Friend, Product, Variant } from "./types";

export const CATEGORIES: { id: CategoryId; label: string; name: string }[] = [
  { id: "phones", label: "Phones", name: "Mobile" },
  { id: "laptops", label: "Laptops", name: "Computing" },
  { id: "audio", label: "Audio", name: "Audio" },
  { id: "power", label: "Power", name: "Power Utilities" },
  { id: "creation", label: "Creation", name: "Content Creation" },
  { id: "gaming", label: "Gaming", name: "Gaming" },
];

export const conditionMeta: Record<
  Condition,
  { label: string; blurb: string; definition: string }
> = {
  new_sealed: {
    label: "Brand New Sealed",
    blurb: "Factory-sealed and never activated.",
    definition:
      "Factory-sealed, unopened, and never activated. The original seal is intact, with the manufacturer box and accessories.",
  },
  grade_a: {
    label: "Pre-Owned Grade A",
    blurb: "Fully functional, with little or no visible wear.",
    definition:
      "UK used / open-box units that are fully functional with little or no visible wear. Battery health and accessories are listed on the variant.",
  },
  grade_b: {
    label: "Pre-Owned Grade B",
    blurb: "Fully functional, with visible cosmetic wear.",
    definition:
      "Fully functional with visible cosmetic wear. Light to moderate scratches or scuffs, no cracks, and all functions tested.",
  },
};

const warranty =
  "12-month warranty on this device. Grade-by-grade terms are on the warranty page.";

const IMG = {
  iphoneAir: "/products/iphone-air.jpg",
  iphone17: "/products/iphone-17.jpg",
  iphone17Pro: "/products/iphone-17-pro.jpg",
  iphone17ProMax: "/products/iphone-17-pro-max.jpg",
  iphone16: "/products/iphone-16.jpg",
  iphone16Plus: "/products/iphone-16-plus.jpg",
  iphone15: "/products/iphone-15.jpg",
  iphone15Pro: "/products/iphone-15-pro.jpg",
  iphone15ProMax: "/products/iphone-15-pro-max.jpg",
  iphone14: "/products/iphone-14.jpg",
  iphone14Pro: "/products/iphone-14-pro.jpg",
  iphone13: "/products/iphone-13.jpg",
  iphone12: "/products/iphone-12.jpg",
  iphone12Pro: "/products/iphone-12-pro.jpg",
  iphone12ProMax: "/products/iphone-12-pro-max.jpg",
  iphone11: "/products/iphone-11.jpg",
  adapter: "/products/adapter.jpg",
  airpodsPro: "/products/airpods-pro.jpg",
  ipad10: "/products/ipad-10.jpg",
  ipad11: "/products/ipad-11.jpg",
  pencil: "/products/apple-pencil.jpg",
  mbp14: "/products/macbook-pro-14.jpg",
  mbp13: "/products/macbook-pro-13.jpg",
  mbp15: "/products/macbook-pro-15.jpg",
  tabA: "/products/samsung-tab.jpg",
  jbl720: "/products/jbl-720.jpg",
  jblFlip: "/products/jbl-flip.jpg",
  jblXtreme: "/products/jbl-xtreme.jpg",
  jblBoom: "/products/jbl-boombox.jpg",
  beatsPill: "/products/beats-pill.jpg",
  rayban: "/products/rayban-meta.jpg",
  hp: "/products/hp-laptop.jpg",
  dell: "/products/dell-laptop.jpg",
  pixel6: "/products/pixel-6.jpg",
  pixel6Pro: "/products/pixel-6-pro.jpg",
  pixel7: "/products/pixel-7.jpg",
  pixel7a: "/products/pixel-7a.jpg",
  pixel7Pro: "/products/pixel-7-pro.jpg",
  pixel8: "/products/pixel-8.jpg",
  pixel8Pro: "/products/pixel-8-pro.jpg",
  pixel9: "/products/pixel-9.jpg",
  pixel9Pro: "/products/pixel-9-pro.jpg",
  pixel9ProXl: "/products/pixel-9-pro-xl.jpg",
} as const;

type RawVariant = Omit<Variant, "price"> & { cost: number; price?: number };

function priced(variants: RawVariant[]): Variant[] {
  return variants.map((variant) => ({
    ...variant,
    price: sellPrice(variant.cost),
  }));
}

function phone(
  partial: Omit<Product, "category" | "art" | "warranty" | "optionLabel" | "variants"> & {
    variants: RawVariant[];
  },
): Product {
  return {
    category: "phones",
    art: "phone",
    warranty,
    optionLabel: "Storage",
    ...partial,
    variants: priced(partial.variants),
  };
}

export const products: Product[] = [
  phone({
    slug: "iphone-air-256",
    name: "iPhone Air",
    brand: "Apple",
    image: IMG.iphoneAir,
    createdAt: "2026-10-01",
    description: "Brand-new NonActive units and UK-used Air configurations, listed by colour and SIM setup.",
    specs: [
      { label: "Storage", value: "256GB / 512GB" },
      { label: "SIM", value: "eSIM" },
      { label: "Status", value: "New NonActive and UK used" },
    ],
    variants: [
      {
        id: "air-256-blue-new",
        colorName: "Blue",
        colorHex: "#A8C7DC",
        storage: "256GB · eSIM",
        condition: "new_sealed",
        cost: 1_150_000,
        stock: 2,
        note: "NonActive",
        deal: true,
      },
      {
        id: "air-256-cloud-new",
        colorName: "Cloud White",
        colorHex: "#F5F5F0",
        storage: "256GB · eSIM",
        condition: "new_sealed",
        cost: 1_170_000,
        stock: 2,
        note: "NonActive",
      },
      {
        id: "air-256-black-a",
        colorName: "Black",
        colorHex: "#1C1C1E",
        storage: "256GB · eSIM",
        condition: "grade_a",
        cost: 1_040_000,
        stock: 1,
        note: "UK used",
      },
      {
        id: "air-256-colors-a",
        colorName: "Colors",
        colorHex: "#7BA3C9",
        storage: "256GB · eSIM",
        condition: "grade_a",
        cost: 1_060_000,
        stock: 2,
        note: "UK used",
      },
      {
        id: "air-512-esim-a",
        colorName: "Mixed",
        colorHex: "#D1D1D6",
        storage: "512GB · eSIM",
        condition: "grade_a",
        cost: 1_170_000,
        stock: 1,
        note: "UK used",
      },
    ],
  }),
  phone({
    slug: "iphone-17-256",
    name: "iPhone 17",
    brand: "Apple",
    image: IMG.iphone17,
    createdAt: "2026-09-28",
    description: "New Phys&eSim unit with active warranty, and UK-used Pro / Pro Max stock.",
    specs: [
      { label: "Series", value: "iPhone 17" },
      { label: "Warranty", value: "Active on new sealed unit" },
    ],
    variants: [
      {
        id: "17-256-new",
        colorName: "Standard",
        colorHex: "#C7C7CC",
        storage: "256GB · Phys&eSim",
        condition: "new_sealed",
        cost: 1_150_000,
        stock: 3,
        note: "0cc Active Warranty",
        deal: true,
      },
    ],
  }),
  phone({
    slug: "iphone-17-pro",
    name: "iPhone 17 Pro",
    brand: "Apple",
    image: IMG.iphone17Pro,
    createdAt: "2026-09-29",
    description: "UK-used 17 Pro, eSIM, listed by finish.",
    specs: [{ label: "SIM", value: "eSIM" }],
    variants: [
      {
        id: "17pro-256-blue-a",
        colorName: "Blue",
        colorHex: "#3A5F8A",
        storage: "256GB · eSIM",
        condition: "grade_a",
        cost: 1_370_000,
        stock: 1,
      },
      {
        id: "17pro-256-silver-a",
        colorName: "Silver",
        colorHex: "#E5E5EA",
        storage: "256GB · eSIM",
        condition: "grade_a",
        cost: 1_400_000,
        stock: 1,
      },
    ],
  }),
  phone({
    slug: "iphone-17-pro-max",
    name: "iPhone 17 Pro Max",
    brand: "Apple",
    image: IMG.iphone17ProMax,
    createdAt: "2026-09-30",
    description: "UK-used Pro Max, eSIM.",
    specs: [{ label: "SIM", value: "eSIM" }],
    variants: [
      {
        id: "17pm-256-a",
        colorName: "Mixed",
        colorHex: "#4A4A4C",
        storage: "256GB · eSIM",
        condition: "grade_a",
        cost: 1_480_000,
        stock: 2,
      },
      {
        id: "17pm-512-a",
        colorName: "Mixed",
        colorHex: "#4A4A4C",
        storage: "512GB · eSIM",
        condition: "grade_a",
        cost: 1_660_000,
        stock: 1,
      },
    ],
  }),
  phone({
    slug: "iphone-16",
    name: "iPhone 16",
    brand: "Apple",
    image: IMG.iphone16,
    createdAt: "2026-09-10",
    description: "UK-used iPhone 16, eSIM and Phys&eSim.",
    specs: [],
    variants: [
      {
        id: "16-256-esim-a",
        colorName: "Mixed",
        colorHex: "#5E5CE6",
        storage: "256GB · eSIM",
        condition: "grade_a",
        cost: 800_000,
        stock: 2,
      },
      {
        id: "16-256-phys-a",
        colorName: "Mixed",
        colorHex: "#5E5CE6",
        storage: "256GB · Phys&eSim",
        condition: "grade_a",
        cost: 810_000,
        stock: 2,
      },
    ],
  }),
  phone({
    slug: "iphone-16-plus",
    name: "iPhone 16 Plus",
    brand: "Apple",
    image: IMG.iphone16Plus,
    createdAt: "2026-09-11",
    description: "UK-used 16 Plus.",
    specs: [],
    variants: [
      {
        id: "16p-128-esim-a",
        colorName: "Mixed",
        colorHex: "#F2A4C2",
        storage: "128GB · eSIM",
        condition: "grade_a",
        cost: 790_000,
        stock: 1,
      },
      {
        id: "16p-128-pink-a",
        colorName: "Pink",
        colorHex: "#F2A4C2",
        storage: "128GB · eSIM",
        condition: "grade_a",
        cost: 800_000,
        stock: 1,
      },
      {
        id: "16p-256-esim-a",
        colorName: "Mixed",
        colorHex: "#F2A4C2",
        storage: "256GB · eSIM",
        condition: "grade_a",
        cost: 890_000,
        stock: 1,
      },
    ],
  }),
  phone({
    slug: "iphone-15",
    name: "iPhone 15",
    brand: "Apple",
    image: IMG.iphone15,
    createdAt: "2026-08-20",
    description: "UK-used iPhone 15 Phys&eSim.",
    specs: [],
    variants: [
      {
        id: "15-128-a",
        colorName: "Mixed",
        colorHex: "#3A6EA5",
        storage: "128GB · Phys&eSim",
        condition: "grade_a",
        cost: 590_000,
        stock: 3,
      },
      {
        id: "15-256-a",
        colorName: "Mixed",
        colorHex: "#3A6EA5",
        storage: "256GB · Phys&eSim",
        condition: "grade_a",
        cost: 645_000,
        stock: 2,
      },
    ],
  }),
  phone({
    slug: "iphone-15-pro",
    name: "iPhone 15 Pro",
    brand: "Apple",
    image: IMG.iphone15Pro,
    createdAt: "2026-08-21",
    description: "UK-used 15 Pro eSIM.",
    specs: [],
    variants: [
      {
        id: "15pro-128-a",
        colorName: "Blue Titanium",
        colorHex: "#4A5C73",
        storage: "128GB · eSIM",
        condition: "grade_a",
        cost: 695_000,
        stock: 1,
      },
    ],
  }),
  phone({
    slug: "iphone-15-pro-max",
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    image: IMG.iphone15ProMax,
    createdAt: "2026-08-22",
    description: "UK-used 15 Pro Max, physical SIM.",
    specs: [],
    variants: [
      {
        id: "15pm-256-a",
        colorName: "Mixed",
        colorHex: "#A89F91",
        storage: "256GB · Phys",
        condition: "grade_a",
        cost: 910_000,
        stock: 1,
        deal: true,
      },
    ],
  }),
  phone({
    slug: "iphone-14",
    name: "iPhone 14",
    brand: "Apple",
    image: IMG.iphone14,
    createdAt: "2026-07-15",
    description: "UK-used iPhone 14.",
    specs: [],
    variants: [
      {
        id: "14-128-a",
        colorName: "Mixed",
        colorHex: "#3B6EA5",
        storage: "128GB · Phys&eSim",
        condition: "grade_a",
        cost: 415_000,
        stock: 3,
      },
      {
        id: "14-256-a",
        colorName: "Mixed",
        colorHex: "#3B6EA5",
        storage: "256GB · Phys&eSim",
        condition: "grade_a",
        cost: 485_000,
        stock: 2,
      },
      {
        id: "14-512-a",
        colorName: "Mixed",
        colorHex: "#3B6EA5",
        storage: "512GB · eSIM",
        condition: "grade_a",
        cost: 485_000,
        stock: 1,
      },
    ],
  }),
  phone({
    slug: "iphone-14-pro",
    name: "iPhone 14 Pro",
    brand: "Apple",
    image: IMG.iphone14Pro,
    createdAt: "2026-07-16",
    description: "UK-used 14 Pro, eSIM and Phys&eSim.",
    specs: [],
    variants: [
      {
        id: "14pro-128-esim-a",
        colorName: "Deep Purple",
        colorHex: "#594F63",
        storage: "128GB · eSIM",
        condition: "grade_a",
        cost: 565_000,
        stock: 1,
      },
      {
        id: "14pro-128-phys-a",
        colorName: "Deep Purple",
        colorHex: "#594F63",
        storage: "128GB · Phys&eSim",
        condition: "grade_a",
        cost: 620_000,
        stock: 1,
      },
      {
        id: "14pro-256-esim-a",
        colorName: "Deep Purple",
        colorHex: "#594F63",
        storage: "256GB · eSIM",
        condition: "grade_a",
        cost: 620_000,
        stock: 1,
      },
      {
        id: "14pro-256-phys-a",
        colorName: "Deep Purple",
        colorHex: "#594F63",
        storage: "256GB · Phys&eSim",
        condition: "grade_a",
        cost: 660_000,
        stock: 1,
      },
    ],
  }),
  phone({
    slug: "iphone-13",
    name: "iPhone 13",
    brand: "Apple",
    image: IMG.iphone13,
    createdAt: "2026-06-10",
    description: "UK-used iPhone 13.",
    specs: [],
    variants: [
      {
        id: "13-128-a",
        colorName: "Mixed",
        colorHex: "#FAE0D8",
        storage: "128GB",
        condition: "grade_a",
        cost: 355_000,
        stock: 4,
      },
      {
        id: "13-256-a",
        colorName: "Mixed",
        colorHex: "#FAE0D8",
        storage: "256GB",
        condition: "grade_a",
        cost: 390_000,
        stock: 3,
      },
    ],
  }),
  phone({
    slug: "iphone-12",
    name: "iPhone 12",
    brand: "Apple",
    image: IMG.iphone12,
    createdAt: "2026-05-01",
    description: "UK-used iPhone 12.",
    specs: [],
    variants: [
      {
        id: "12-64-a",
        colorName: "Mixed",
        colorHex: "#023B63",
        storage: "64GB",
        condition: "grade_a",
        cost: 240_000,
        stock: 3,
      },
      {
        id: "12-128-a",
        colorName: "Mixed",
        colorHex: "#023B63",
        storage: "128GB",
        condition: "grade_a",
        cost: 280_000,
        stock: 4,
      },
      {
        id: "12-256-a",
        colorName: "Mixed",
        colorHex: "#023B63",
        storage: "256GB",
        condition: "grade_a",
        cost: 310_000,
        stock: 2,
      },
    ],
  }),
  phone({
    slug: "iphone-12-pro",
    name: "iPhone 12 Pro",
    brand: "Apple",
    image: IMG.iphone12Pro,
    createdAt: "2026-05-02",
    description: "UK-used 12 Pro.",
    specs: [],
    variants: [
      {
        id: "12pro-128-a",
        colorName: "Pacific Blue",
        colorHex: "#2C4E6E",
        storage: "128GB",
        condition: "grade_a",
        cost: 345_000,
        stock: 2,
      },
      {
        id: "12pro-256-a",
        colorName: "Pacific Blue",
        colorHex: "#2C4E6E",
        storage: "256GB",
        condition: "grade_a",
        cost: 370_000,
        stock: 2,
      },
      {
        id: "12pro-512-a",
        colorName: "Pacific Blue",
        colorHex: "#2C4E6E",
        storage: "512GB",
        condition: "grade_a",
        cost: 390_000,
        stock: 1,
      },
    ],
  }),
  phone({
    slug: "iphone-12-pro-max",
    name: "iPhone 12 Pro Max",
    brand: "Apple",
    image: IMG.iphone12ProMax,
    createdAt: "2026-05-03",
    description: "UK-used 12 Pro Max. 512GB is not priced on this list yet.",
    specs: [],
    variants: [
      {
        id: "12pm-128-a",
        colorName: "Pacific Blue",
        colorHex: "#2C4E6E",
        storage: "128GB",
        condition: "grade_a",
        cost: 415_000,
        stock: 2,
      },
      {
        id: "12pm-256-a",
        colorName: "Pacific Blue",
        colorHex: "#2C4E6E",
        storage: "256GB",
        condition: "grade_a",
        cost: 455_000,
        stock: 2,
      },
    ],
  }),
  phone({
    slug: "iphone-11",
    name: "iPhone 11",
    brand: "Apple",
    image: IMG.iphone11,
    createdAt: "2026-04-01",
    description: "UK-used iPhone 11.",
    specs: [],
    variants: [
      {
        id: "11-64-a",
        colorName: "Black",
        colorHex: "#1F2020",
        storage: "64GB",
        condition: "grade_a",
        cost: 220_000,
        stock: 5,
        deal: true,
      },
      {
        id: "11-128-a",
        colorName: "Black",
        colorHex: "#1F2020",
        storage: "128GB",
        condition: "grade_a",
        cost: 255_000,
        stock: 4,
      },
    ],
  }),
  phone({
    slug: "google-pixel-9-pro-xl",
    name: "Google Pixel 9 Pro XL",
    brand: "Google",
    image: IMG.pixel9ProXl,
    createdAt: "2026-09-28",
    description: "UK-used Pixel 9 Pro XL. Gemini-ready camera phone with the larger Pro XL display.",
    specs: [
      { label: "Origin", value: "UK used" },
      { label: "Display", value: "Pro XL" },
    ],
    variants: [
      {
        id: "p9pxl-128-uk",
        colorName: "Obsidian",
        colorHex: "#1C1C1E",
        storage: "128GB",
        condition: "grade_a",
        cost: 680_000,
        stock: 2,
        note: "UK used",
        deal: true,
      },
      {
        id: "p9pxl-256-uk",
        colorName: "Obsidian",
        colorHex: "#1C1C1E",
        storage: "256GB",
        condition: "grade_a",
        cost: 760_000,
        stock: 2,
        note: "UK used",
      },
    ],
  }),
  phone({
    slug: "google-pixel-9",
    name: "Google Pixel 9",
    brand: "Google",
    image: IMG.pixel9,
    createdAt: "2026-09-27",
    description: "UK-used Pixel 9 with Gemini on-device AI.",
    specs: [{ label: "Origin", value: "UK used" }],
    variants: [
      {
        id: "p9-128-uk",
        colorName: "Obsidian",
        colorHex: "#1C1C1E",
        storage: "128GB",
        condition: "grade_a",
        cost: 580_000,
        stock: 3,
        note: "UK used",
      },
    ],
  }),
  phone({
    slug: "google-pixel-8-pro",
    name: "Google Pixel 8 Pro",
    brand: "Google",
    image: IMG.pixel8Pro,
    createdAt: "2026-09-20",
    description: "Pixel 8 Pro in UK-used and US-import grades. Same storage listed twice when origin pricing differs.",
    specs: [
      { label: "Origins", value: "UK used · US import" },
      { label: "Camera", value: "Pro triple" },
    ],
    variants: [
      {
        id: "p8p-128-uk",
        colorName: "Obsidian",
        colorHex: "#1C1C1E",
        storage: "128GB · UK",
        condition: "grade_a",
        cost: 500_000,
        stock: 2,
        note: "UK used",
      },
      {
        id: "p8p-256-uk",
        colorName: "Obsidian",
        colorHex: "#1C1C1E",
        storage: "256GB · UK",
        condition: "grade_a",
        cost: 530_000,
        stock: 2,
        note: "UK used",
      },
      {
        id: "p8p-128-us",
        colorName: "Obsidian",
        colorHex: "#1C1C1E",
        storage: "128GB · US",
        condition: "grade_a",
        cost: 445_000,
        stock: 2,
        note: "🇺🇸 US import",
        deal: true,
      },
    ],
  }),
  phone({
    slug: "google-pixel-8",
    name: "Google Pixel 8",
    brand: "Google",
    image: IMG.pixel8,
    createdAt: "2026-09-18",
    description: "Pixel 8 UK-used and US-import units. Pick the origin that matches the price band.",
    specs: [{ label: "Origins", value: "UK used · US import" }],
    variants: [
      {
        id: "p8-128-uk",
        colorName: "Obsidian",
        colorHex: "#1C1C1E",
        storage: "128GB · UK",
        condition: "grade_a",
        cost: 400_000,
        stock: 3,
        note: "UK used",
      },
      {
        id: "p8-256-uk",
        colorName: "Obsidian",
        colorHex: "#1C1C1E",
        storage: "256GB · UK",
        condition: "grade_a",
        cost: 430_000,
        stock: 2,
        note: "UK used",
      },
      {
        id: "p8-128-us",
        colorName: "Obsidian",
        colorHex: "#1C1C1E",
        storage: "128GB · US",
        condition: "grade_a",
        cost: 315_000,
        stock: 3,
        note: "🇺🇸 US import",
        deal: true,
      },
    ],
  }),
  phone({
    slug: "google-pixel-7-pro",
    name: "Google Pixel 7 Pro",
    brand: "Google",
    image: IMG.pixel7Pro,
    createdAt: "2026-09-10",
    description: "Pixel 7 Pro with separate UK and US price points where they differ.",
    specs: [{ label: "Origins", value: "UK used · US import" }],
    variants: [
      {
        id: "p7p-128-uk",
        colorName: "Obsidian",
        colorHex: "#1C1C1E",
        storage: "128GB · UK",
        condition: "grade_a",
        cost: 370_000,
        stock: 2,
        note: "UK used",
      },
      {
        id: "p7p-256-uk",
        colorName: "Obsidian",
        colorHex: "#1C1C1E",
        storage: "256GB · UK",
        condition: "grade_a",
        cost: 390_000,
        stock: 2,
        note: "UK used",
      },
      {
        id: "p7p-128-us",
        colorName: "Obsidian",
        colorHex: "#1C1C1E",
        storage: "128GB · US",
        condition: "grade_a",
        cost: 350_000,
        stock: 2,
        note: "🇺🇸 US import",
      },
    ],
  }),
  phone({
    slug: "google-pixel-7a",
    name: "Google Pixel 7a",
    brand: "Google",
    image: IMG.pixel7a,
    createdAt: "2026-09-08",
    description: "UK-used Pixel 7a — compact Tensor phone at an entry price.",
    specs: [{ label: "Origin", value: "UK used" }],
    variants: [
      {
        id: "p7a-128-uk",
        colorName: "Charcoal",
        colorHex: "#3C4043",
        storage: "128GB",
        condition: "grade_a",
        cost: 250_000,
        stock: 4,
        note: "UK used",
        deal: true,
      },
    ],
  }),
  phone({
    slug: "google-pixel-7",
    name: "Google Pixel 7",
    brand: "Google",
    image: IMG.pixel7,
    createdAt: "2026-09-06",
    description: "US-import Pixel 7.",
    specs: [{ label: "Origin", value: "US import" }],
    variants: [
      {
        id: "p7-128-us",
        colorName: "Obsidian",
        colorHex: "#1C1C1E",
        storage: "128GB",
        condition: "grade_a",
        cost: 280_000,
        stock: 3,
        note: "🇺🇸 US import",
      },
    ],
  }),
  phone({
    slug: "google-pixel-6-pro",
    name: "Google Pixel 6 Pro",
    brand: "Google",
    image: IMG.pixel6Pro,
    createdAt: "2026-09-04",
    description: "US-import Pixel 6 Pro.",
    specs: [{ label: "Origin", value: "US import" }],
    variants: [
      {
        id: "p6p-128-us",
        colorName: "Stormy Black",
        colorHex: "#1C1C1E",
        storage: "128GB",
        condition: "grade_a",
        cost: 280_000,
        stock: 2,
        note: "🇺🇸 US import",
      },
    ],
  }),
  phone({
    slug: "google-pixel-6",
    name: "Google Pixel 6",
    brand: "Google",
    image: IMG.pixel6,
    createdAt: "2026-09-02",
    description: "US-import Pixel 6.",
    specs: [{ label: "Origin", value: "US import" }],
    variants: [
      {
        id: "p6-256-us",
        colorName: "Sorta Seafoam",
        colorHex: "#9BB7A8",
        storage: "256GB",
        condition: "grade_a",
        cost: 240_000,
        stock: 2,
        note: "🇺🇸 US import",
        deal: true,
      },
    ],
  }),
  {
    slug: "apple-adapters",
    name: "Apple USB-C Power Adapter",
    brand: "Apple",
    category: "power",
    art: "accessory",
    image: IMG.adapter,
    createdAt: "2026-09-01",
    warranty,
    optionLabel: "Model",
    description: "Authentic Apple adapters.",
    specs: [{ label: "Brand", value: "Apple authentic" }],
    variants: priced([
      {
        id: "adapter-20w",
        colorName: "White",
        colorHex: "#F5F5F7",
        storage: "20W · 3 Pin",
        condition: "new_sealed",
        cost: 26_000,
        stock: 12,
      },
      {
        id: "adapter-40w-2",
        colorName: "White",
        colorHex: "#F5F5F7",
        storage: "40W · 60W Max · 2 Pin",
        condition: "new_sealed",
        cost: 48_000,
        stock: 8,
      },
      {
        id: "adapter-40w-3",
        colorName: "White",
        colorHex: "#F5F5F7",
        storage: "40W · 60W Max · 3 Pin",
        condition: "new_sealed",
        cost: 55_000,
        stock: 8,
      },
    ]),
  },
  {
    slug: "meta-rayban-wayfarer",
    name: "Meta Ray-Ban Wayfarer",
    brand: "Meta",
    category: "creation",
    art: "glasses",
    image: IMG.rayban,
    createdAt: "2026-08-01",
    warranty,
    optionLabel: "Lens",
    description: "Used and new-open Meta Ray-Ban smart glasses.",
    specs: [{ label: "Model", value: "Wayfarer" }],
    variants: priced([
      {
        id: "rb-dark-a",
        colorName: "Dark",
        colorHex: "#1A1A1A",
        storage: "Wayfarer 1",
        condition: "grade_a",
        cost: 320_000,
        stock: 1,
        note: "Used",
      },
      {
        id: "rb-clear-a",
        colorName: "Clear",
        colorHex: "#D8D8D8",
        storage: "Wayfarer 1",
        condition: "grade_a",
        cost: 340_000,
        stock: 1,
        note: "Used",
      },
      {
        id: "rb-transition-new",
        colorName: "Transition",
        colorHex: "#6B6B6B",
        storage: "Transition",
        condition: "new_sealed",
        cost: 450_000,
        stock: 1,
        note: "New open",
      },
    ]),
  },
  {
    slug: "airpods-pro-3",
    name: "AirPods Pro 3",
    brand: "Apple",
    category: "audio",
    art: "headphones",
    image: IMG.airpodsPro,
    createdAt: "2026-09-20",
    warranty,
    optionLabel: "Condition",
    description: "New NonActive and open-box Pro 3.",
    specs: [{ label: "Connector", value: "USB-C" }],
    variants: priced([
      {
        id: "app3-new",
        colorName: "White",
        colorHex: "#F5F5F7",
        storage: "Standard",
        condition: "new_sealed",
        cost: 285_000,
        stock: 4,
        note: "NonActive",
        deal: true,
      },
      {
        id: "app3-open",
        colorName: "White",
        colorHex: "#F5F5F7",
        storage: "Open box",
        condition: "grade_a",
        cost: 260_000,
        stock: 2,
      },
    ]),
  },
  {
    slug: "airpods-replacements",
    name: "AirPods replacements",
    brand: "Apple",
    category: "audio",
    art: "accessory",
    image: IMG.airpodsPro,
    createdAt: "2026-09-05",
    warranty,
    optionLabel: "Part",
    description: "Cases and single ears for AirPods 4, Pro 2, and Pro 3.",
    specs: [],
    variants: priced([
      {
        id: "rep-4anc-case",
        colorName: "White",
        colorHex: "#F5F5F7",
        storage: "AirPods 4 ANC Case",
        condition: "new_sealed",
        cost: 60_000,
        stock: 5,
      },
      {
        id: "rep-4-ear",
        colorName: "White",
        colorHex: "#F5F5F7",
        storage: "AirPods 4 Ear",
        condition: "new_sealed",
        cost: 60_000,
        stock: 5,
      },
      {
        id: "rep-pro2-case",
        colorName: "White",
        colorHex: "#F5F5F7",
        storage: "Pro 2 USB-C Case",
        condition: "new_sealed",
        cost: 100_000,
        stock: 4,
      },
      {
        id: "rep-pro2-ear",
        colorName: "White",
        colorHex: "#F5F5F7",
        storage: "Pro 2 Ear",
        condition: "new_sealed",
        cost: 80_000,
        stock: 4,
      },
      {
        id: "rep-pro3-ear",
        colorName: "White",
        colorHex: "#F5F5F7",
        storage: "Pro 3 Ear",
        condition: "new_sealed",
        cost: 100_000,
        stock: 3,
      },
    ]),
  },
  {
    slug: "jbl-tune-720bt",
    name: "JBL Tune 720BT",
    brand: "JBL",
    category: "audio",
    art: "headphones",
    image: IMG.jbl720,
    createdAt: "2026-08-12",
    warranty,
    optionLabel: "Storage",
    description: "Wireless on-ear headphones.",
    specs: [],
    variants: priced([
      {
        id: "jbl-720",
        colorName: "Black",
        colorHex: "#111111",
        storage: "Standard",
        condition: "new_sealed",
        cost: 70_000,
        stock: 6,
      },
    ]),
  },
  {
    slug: "jbl-flip-7",
    name: "JBL Flip 7",
    brand: "JBL",
    category: "audio",
    art: "speaker",
    image: IMG.jblFlip,
    createdAt: "2026-08-13",
    warranty,
    optionLabel: "Storage",
    description: "Portable Bluetooth speaker.",
    specs: [],
    variants: priced([
      {
        id: "jbl-flip7",
        colorName: "Black",
        colorHex: "#111111",
        storage: "Standard",
        condition: "new_sealed",
        cost: 125_000,
        stock: 4,
      },
    ]),
  },
  {
    slug: "jbl-xtreme-4",
    name: "JBL Xtreme 4",
    brand: "JBL",
    category: "audio",
    art: "speaker",
    image: IMG.jblXtreme,
    createdAt: "2026-08-14",
    warranty,
    optionLabel: "Storage",
    description: "Portable party speaker.",
    specs: [],
    variants: priced([
      {
        id: "jbl-xtreme4",
        colorName: "Black",
        colorHex: "#111111",
        storage: "Standard",
        condition: "new_sealed",
        cost: 340_000,
        stock: 3,
      },
    ]),
  },
  {
    slug: "jbl-boombox-4",
    name: "JBL Boombox 4",
    brand: "JBL",
    category: "audio",
    art: "speaker",
    image: IMG.jblBoom,
    createdAt: "2026-08-15",
    warranty,
    optionLabel: "Storage",
    description: "Large portable Boombox.",
    specs: [],
    variants: priced([
      {
        id: "jbl-boom4",
        colorName: "Black",
        colorHex: "#111111",
        storage: "Standard",
        condition: "new_sealed",
        cost: 620_000,
        stock: 2,
      },
    ]),
  },
  {
    slug: "beats-pill",
    name: "Beats Pill",
    brand: "Beats",
    category: "audio",
    art: "speaker",
    image: IMG.beatsPill,
    createdAt: "2026-08-16",
    warranty,
    optionLabel: "Storage",
    description: "Beats Pill portable speaker.",
    specs: [],
    variants: priced([
      {
        id: "beats-pill",
        colorName: "Black",
        colorHex: "#111111",
        storage: "Standard",
        condition: "new_sealed",
        cost: 220_000,
        stock: 3,
      },
    ]),
  },
  {
    slug: "ipad-10th-gen",
    name: "iPad 10th Gen",
    brand: "Apple",
    category: "laptops",
    art: "tablet",
    image: IMG.ipad10,
    createdAt: "2026-07-01",
    warranty,
    optionLabel: "Storage",
    description: "Used 10th Gen cellular.",
    specs: [{ label: "Connectivity", value: "Cellular" }],
    variants: priced([
      {
        id: "ipad10-64-a",
        colorName: "Blue",
        colorHex: "#6B8FA3",
        storage: "64GB · Cellular",
        condition: "grade_a",
        cost: 410_000,
        stock: 1,
      },
    ]),
  },
  {
    slug: "ipad-11th-gen",
    name: "iPad 11th Gen",
    brand: "Apple",
    category: "laptops",
    art: "tablet",
    image: IMG.ipad11,
    createdAt: "2026-09-18",
    warranty,
    optionLabel: "Storage",
    description: "New Wi-Fi iPad, listed by finish.",
    specs: [{ label: "Connectivity", value: "Wi-Fi" }],
    variants: priced([
      {
        id: "ipad11-blue",
        colorName: "Blue",
        colorHex: "#6B8FA3",
        storage: "128GB · Wi-Fi",
        condition: "new_sealed",
        cost: 590_000,
        stock: 3,
      },
      {
        id: "ipad11-silver",
        colorName: "Silver",
        colorHex: "#E3E4E6",
        storage: "128GB · Wi-Fi",
        condition: "new_sealed",
        cost: 600_000,
        stock: 2,
      },
      {
        id: "ipad11-pink",
        colorName: "Pink",
        colorHex: "#E8B4C4",
        storage: "128GB · Wi-Fi",
        condition: "new_sealed",
        cost: 605_000,
        stock: 2,
        deal: true,
      },
    ]),
  },
  {
    slug: "samsung-tab-a11-plus",
    name: "Galaxy Tab A11+",
    brand: "Samsung",
    category: "laptops",
    art: "tablet",
    image: IMG.tabA,
    createdAt: "2026-09-12",
    warranty,
    optionLabel: "Storage",
    description: "Samsung Tab A11+ 5G.",
    specs: [{ label: "Connectivity", value: "5G" }],
    variants: priced([
      {
        id: "taba11",
        colorName: "Graphite",
        colorHex: "#3A3A3C",
        storage: "128GB · 5G",
        condition: "new_sealed",
        cost: 325_000,
        stock: 3,
      },
    ]),
  },
  {
    slug: "apple-pencil-usbc",
    name: "Apple Pencil USB-C",
    brand: "Apple",
    category: "creation",
    art: "accessory",
    image: IMG.pencil,
    createdAt: "2026-09-08",
    warranty,
    optionLabel: "Storage",
    description: "New Apple Pencil with USB-C.",
    specs: [],
    variants: priced([
      {
        id: "pencil-usbc",
        colorName: "White",
        colorHex: "#F5F5F7",
        storage: "USB-C",
        condition: "new_sealed",
        cost: 120_000,
        stock: 6,
      },
    ]),
  },
  {
    slug: "hp-elitebook-830-g8",
    name: "HP EliteBook 830 G8",
    brand: "HP",
    category: "laptops",
    art: "laptop",
    image: IMG.hp,
    createdAt: "2026-06-01",
    warranty,
    optionLabel: "Setup",
    description: "Core i5 11th Gen, 13\" non-touch, keyboard light, HDMI, USB-C.",
    specs: [
      { label: "CPU", value: "Core i5 · 11th Gen" },
      { label: "Memory", value: "8GB" },
      { label: "Storage", value: "256GB SSD" },
      { label: "Display", value: "13\" Non-Touch" },
    ],
    variants: priced([
      {
        id: "hp-830-g8",
        colorName: "Silver",
        colorHex: "#C8C8C8",
        storage: "8GB · 256GB",
        condition: "grade_a",
        cost: 380_000,
        stock: 2,
      },
    ]),
  },
  {
    slug: "hp-elitebook-840-g7",
    name: "HP EliteBook 840 G7",
    brand: "HP",
    category: "laptops",
    art: "laptop",
    image: IMG.hp,
    createdAt: "2026-06-02",
    warranty,
    optionLabel: "Setup",
    description: "Core i5 10th Gen, 14\" non-touch.",
    specs: [
      { label: "CPU", value: "Core i5 · 10th Gen" },
      { label: "Memory", value: "8GB" },
      { label: "Storage", value: "256GB SSD" },
      { label: "Display", value: "14\" Non-Touch" },
    ],
    variants: priced([
      {
        id: "hp-840-g7",
        colorName: "Silver",
        colorHex: "#C8C8C8",
        storage: "8GB · 256GB",
        condition: "grade_a",
        cost: 380_000,
        stock: 2,
      },
    ]),
  },
  {
    slug: "hp-elitebook-830-g7-x360",
    name: "HP EliteBook 830 G7 x360",
    brand: "HP",
    category: "laptops",
    art: "laptop",
    image: IMG.hp,
    createdAt: "2026-06-03",
    warranty,
    optionLabel: "Setup",
    description: "Core i5-10310U, 13\" touchscreen convertible.",
    specs: [
      { label: "CPU", value: "Core i5-10310U · 10th Gen" },
      { label: "Memory", value: "8GB" },
      { label: "Storage", value: "256GB SSD" },
      { label: "Display", value: "13\" Touch" },
    ],
    variants: priced([
      {
        id: "hp-830-g7-x360",
        colorName: "Silver",
        colorHex: "#C8C8C8",
        storage: "8GB · 256GB",
        condition: "grade_a",
        cost: 400_000,
        stock: 1,
      },
    ]),
  },
  {
    slug: "hp-elitebook-850-g8",
    name: "HP EliteBook 850 G8",
    brand: "HP",
    category: "laptops",
    art: "laptop",
    image: IMG.hp,
    createdAt: "2026-06-04",
    warranty,
    optionLabel: "Setup",
    description: "Core i7 11th Gen, 15\", 2GB dedicated graphics.",
    specs: [
      { label: "CPU", value: "Core i7 · 11th Gen" },
      { label: "Memory", value: "8GB" },
      { label: "Storage", value: "256GB SSD" },
      { label: "Display", value: "15\" Non-Touch" },
      { label: "Graphics", value: "2GB dedicated" },
    ],
    variants: priced([
      {
        id: "hp-850-g8",
        colorName: "Silver",
        colorHex: "#C8C8C8",
        storage: "8GB · 256GB",
        condition: "grade_a",
        cost: 540_000,
        stock: 1,
      },
    ]),
  },
  {
    slug: "dell-precision-5530",
    name: "Dell Precision 5530",
    brand: "Dell",
    category: "laptops",
    art: "laptop",
    image: IMG.dell,
    createdAt: "2026-06-05",
    warranty,
    optionLabel: "Setup",
    description: "Core i7 8th Gen workstation notebook.",
    specs: [
      { label: "CPU", value: "Core i7 · 8th Gen" },
      { label: "Memory", value: "16GB" },
      { label: "Storage", value: "512GB SSD" },
    ],
    variants: priced([
      {
        id: "dell-5530",
        colorName: "Silver",
        colorHex: "#B8B8B8",
        storage: "16GB · 512GB",
        condition: "grade_a",
        cost: 380_000,
        stock: 1,
      },
    ]),
  },
  {
    slug: "macbook-pro-2018-15",
    name: "MacBook Pro 2018",
    brand: "Apple",
    category: "laptops",
    art: "laptop",
    image: IMG.mbp15,
    createdAt: "2026-05-20",
    warranty,
    optionLabel: "Setup",
    description: "15\" Core i7, 4GB AMD Radeon Pro 560X, Touch Bar.",
    specs: [
      { label: "Year", value: "2018" },
      { label: "Display", value: "15\"" },
      { label: "CPU", value: "Core i7" },
      { label: "GPU", value: "AMD Radeon Pro 560X 4GB" },
    ],
    variants: priced([
      {
        id: "mbp2018-15",
        colorName: "Space Gray",
        colorHex: "#7D7E80",
        storage: "16GB · 512GB",
        condition: "grade_a",
        cost: 550_000,
        stock: 1,
      },
    ]),
  },
  {
    slug: "macbook-pro-2020-intel",
    name: "MacBook Pro 2020",
    brand: "Apple",
    category: "laptops",
    art: "laptop",
    image: IMG.mbp13,
    createdAt: "2026-05-21",
    warranty,
    optionLabel: "Setup",
    description: "13\" Core i5 Intel, Touch ID and Touch Bar.",
    specs: [
      { label: "Year", value: "2020" },
      { label: "Display", value: "13\"" },
      { label: "CPU", value: "Core i5" },
    ],
    variants: priced([
      {
        id: "mbp2020-i5",
        colorName: "Space Gray",
        colorHex: "#7D7E80",
        storage: "16GB · 1TB",
        condition: "grade_a",
        cost: 700_000,
        stock: 1,
      },
    ]),
  },
  {
    slug: "macbook-pro-m1-2020",
    name: "MacBook Pro M1 2020",
    brand: "Apple",
    category: "laptops",
    art: "laptop",
    image: IMG.mbp13,
    createdAt: "2026-05-22",
    warranty,
    optionLabel: "Setup",
    description: "13\" M1 MacBook Pro.",
    specs: [
      { label: "Year", value: "2020" },
      { label: "Chip", value: "Apple M1" },
      { label: "Display", value: "13\"" },
    ],
    variants: priced([
      {
        id: "mbpm1-8-256",
        colorName: "Space Gray",
        colorHex: "#7D7E80",
        storage: "8GB · 256GB",
        condition: "grade_a",
        cost: 670_000,
        stock: 1,
      },
      {
        id: "mbpm1-16-256",
        colorName: "Space Gray",
        colorHex: "#7D7E80",
        storage: "16GB · 256GB",
        condition: "grade_a",
        cost: 820_000,
        stock: 1,
      },
      {
        id: "mbpm1-16-512",
        colorName: "Space Gray",
        colorHex: "#7D7E80",
        storage: "16GB · 512GB",
        condition: "grade_a",
        cost: 900_000,
        stock: 1,
      },
    ]),
  },
  {
    slug: "macbook-pro-14-2021",
    name: "MacBook Pro 14 2021",
    brand: "Apple",
    category: "laptops",
    art: "laptop",
    image: IMG.mbp14,
    createdAt: "2026-05-23",
    warranty,
    optionLabel: "Setup",
    description: "14\" M1 Pro.",
    specs: [
      { label: "Year", value: "2021" },
      { label: "Chip", value: "Apple M1 Pro" },
      { label: "Display", value: "14\"" },
    ],
    variants: priced([
      {
        id: "mbp14-16-512",
        colorName: "Space Gray",
        colorHex: "#7D7E80",
        storage: "16GB · 512GB",
        condition: "grade_a",
        cost: 1_150_000,
        stock: 1,
        deal: true,
      },
      {
        id: "mbp14-32-512",
        colorName: "Space Gray",
        colorHex: "#7D7E80",
        storage: "32GB · 512GB",
        condition: "grade_a",
        cost: 1_250_000,
        stock: 1,
      },
    ]),
  },
];

export const friends: Friend[] = [
  {
    id: "chioma",
    name: "Chioma",
    productSlug: "iphone-air-256",
    productLabel: "iPhone Air",
    caption: "Blue 256GB eSIM, NonActive seal intact.",
  },
  {
    id: "emeka",
    name: "Emeka",
    productSlug: "airpods-pro-3",
    productLabel: "AirPods Pro 3",
    caption: "New NonActive pair. Box was sealed.",
  },
  {
    id: "amina",
    name: "Amina",
    productSlug: "ipad-11th-gen",
    productLabel: "iPad 11th Gen",
    caption: "Pink 128GB Wi-Fi, brand new.",
  },
];

export function categoryById(id: string) {
  return CATEGORIES.find((category) => category.id === id);
}

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getVariant(variantId: string) {
  for (const product of products) {
    const variant = product.variants.find((item) => item.id === variantId);
    if (variant) return { product, variant };
  }
  return null;
}

export function searchProducts(query: string) {
  const raw = query.trim().toLowerCase();
  if (!raw) return [];

  // Parse natural budget expressions like: "under 800k", "500k", "700,000", "< 600k", "below 1m"
  let maxBudget: number | null = null;
  const minBudget: number | null = null;

  const kMatch = raw.match(/(?:under|below|less than|max|<=?)\s*(\d+(?:\.\d+)?)\s*k\b/i) ||
                 raw.match(/(\d+(?:\.\d+)?)\s*k\b/i);
  if (kMatch) {
    maxBudget = parseFloat(kMatch[1]) * 1000;
  }

  const mMatch = raw.match(/(?:under|below|less than|max|<=?)\s*(\d+(?:\.\d+)?)\s*m\b/i);
  if (mMatch) {
    maxBudget = parseFloat(mMatch[1]) * 1000000;
  }

  const numMatch = raw.match(/(?:under|below|less than|max|<=?)\s*(?:₦|n)?\s*(\d{3,}(?:,\d{3})*)/i);
  if (numMatch && !maxBudget) {
    maxBudget = parseInt(numMatch[1].replace(/,/g, ""), 10);
  }

  // Filter out the budget phrase from keyword search if present
  const cleanedKeywords = raw
    .replace(/(?:under|below|less than|max|<=?|cheap|budget|around|about)\s*/gi, "")
    .replace(/(\d+(?:\.\d+)?)\s*[km]\b/gi, "")
    .replace(/(?:₦|n)?\s*\d{3,}(?:,\d{3})*/gi, "")
    .trim();

  return products.filter((product) => {
    // Check budget constraint against product variants
    if (maxBudget !== null) {
      const minProductPrice = fromPrice(product);
      if (minProductPrice > maxBudget) return false;
    }
    if (minBudget !== null) {
      const maxProductPrice = Math.max(...product.variants.map((v) => v.price));
      if (maxProductPrice < minBudget) return false;
    }

    if (!cleanedKeywords) return true;

    const category = categoryById(product.category)?.name ?? "";
    const haystack = [product.name, product.brand, category, product.description]
      .join(" ")
      .toLowerCase();

    return haystack.includes(cleanedKeywords);
  });
}

export function flashDeals() {
  const deals: { product: Product; variant: Variant }[] = [];
  for (const product of products) {
    for (const variant of product.variants) {
      if (variant.deal && variant.stock > 0) deals.push({ product, variant });
    }
  }
  return deals;
}

export type ShopQuery = {
  category?: string;
  q?: string;
  condition?: string;
  brand?: string;
  price?: string;
  storage?: string;
  sort?: string;
  deals?: boolean;
};

function priceBand(variant: Variant, price?: string) {
  if (!price) return true;
  if (price === "under-500") return variant.price < 500000;
  if (price === "mid") return variant.price >= 500000 && variant.price <= 1000000;
  if (price === "over-1000") return variant.price > 1000000;
  return true;
}

export function shopResults(query: ShopQuery) {
  const rawQ = query.q?.trim().toLowerCase() ?? "";
  const rows: { product: Product; variant: Variant }[] = [];

  // Parse natural budget expressions from query string
  let queryMaxBudget: number | null = null;
  if (rawQ) {
    const kMatch = rawQ.match(/(?:under|below|less than|max|<=?)\s*(\d+(?:\.\d+)?)\s*k\b/i) ||
                   rawQ.match(/(\d+(?:\.\d+)?)\s*k\b/i);
    if (kMatch) queryMaxBudget = parseFloat(kMatch[1]) * 1000;

    const mMatch = rawQ.match(/(?:under|below|less than|max|<=?)\s*(\d+(?:\.\d+)?)\s*m\b/i);
    if (mMatch) queryMaxBudget = parseFloat(mMatch[1]) * 1000000;

    const numMatch = rawQ.match(/(?:under|below|less than|max|<=?)\s*(?:₦|n)?\s*(\d{3,}(?:,\d{3})*)/i);
    if (numMatch && !queryMaxBudget) {
      queryMaxBudget = parseInt(numMatch[1].replace(/,/g, ""), 10);
    }
  }

  const cleanedQ = rawQ
    .replace(/(?:under|below|less than|max|<=?|cheap|budget|around|about)\s*/gi, "")
    .replace(/(\d+(?:\.\d+)?)\s*[km]\b/gi, "")
    .replace(/(?:₦|n)?\s*\d{3,}(?:,\d{3})*/gi, "")
    .trim();

  for (const product of products) {
    if (query.category && product.category !== query.category) continue;
    if (query.brand && product.brand !== query.brand) continue;

    if (cleanedQ) {
      const category = categoryById(product.category)?.name ?? "";
      const haystack = [product.name, product.brand, category, product.description].join(" ").toLowerCase();
      if (!haystack.includes(cleanedQ)) continue;
    }

    const matches = product.variants.filter((variant) => {
      if (query.condition && variant.condition !== query.condition) return false;
      if (query.storage && variant.storage !== query.storage) return false;
      if (query.deals && !variant.deal) return false;
      if (queryMaxBudget !== null && variant.price > queryMaxBudget) return false;
      return priceBand(variant, query.price);
    });

    if (matches.length === 0) continue;
    const pricedRows = [...matches].sort((a, b) => a.price - b.price);
    const variant = pricedRows.find((item) => item.stock > 0) ?? pricedRows[0];
    rows.push({ product, variant });
  }

  const sort = query.sort || "newest";
  rows.sort((a, b) => {
    if (sort === "price-asc") return a.variant.price - b.variant.price;
    if (sort === "price-desc") return b.variant.price - a.variant.price;
    if (sort === "deals") {
      const discount = (variant: Variant) =>
        variant.compareAt && variant.compareAt > variant.price
          ? variant.compareAt - variant.price
          : variant.deal
            ? 1
            : 0;
      return discount(b.variant) - discount(a.variant);
    }
    return b.product.createdAt.localeCompare(a.product.createdAt);
  });

  return rows;
}

export function brands() {
  return [...new Set(products.map((product) => product.brand))].sort();
}

export function storageOptions(category?: string) {
  const values = new Set<string>();
  for (const product of products) {
    if (category && product.category !== category) continue;
    for (const variant of product.variants) {
      if (variant.storage !== "Standard") values.add(variant.storage);
    }
  }
  return [...values];
}

export function fromPrice(product: Product) {
  return Math.min(...product.variants.map((variant) => variant.price));
}
