export type CategoryId =
  | "phones"
  | "laptops"
  | "audio"
  | "power"
  | "creation"
  | "gaming";

export type Condition = "new_sealed" | "grade_a" | "grade_b";

export type ArtKind =
  | "phone"
  | "laptop"
  | "tablet"
  | "console"
  | "deck"
  | "headphones"
  | "mic"
  | "camera"
  | "power"
  | "glasses"
  | "speaker"
  | "accessory";

export type Variant = {
  id: string;
  colorName: string;
  colorHex: string;
  storage: string;
  condition: Condition;
  price: number;
  cost?: number;
  compareAt?: number;
  stock: number;
  batteryHealth?: number;
  accessories?: string;
  deal?: boolean;
  image?: string;
  note?: string;
};

export type Product = {
  slug: string;
  name: string;
  brand: string;
  category: CategoryId;
  art: ArtKind;
  image?: string;
  description: string;
  warranty: string;
  optionLabel: string;
  specs: { label: string; value: string }[];
  createdAt: string;
  variants: Variant[];
};

export type Friend = {
  id: string;
  name: string;
  productSlug: string;
  productLabel: string;
  caption: string;
};

export type ShippingTier = "same-state" | "interstate" | "international";

export type OrderStatus =
  | "awaiting_receipt"
  | "pending_verification"
  | "payment_verified"
  | "payment_rejected"
  | "dispatched"
  | "in_transit"
  | "delivered"
  | "cancelled";

export type OrderItem = {
  variantId: string;
  name: string;
  summary: string;
  condition: Condition;
  unitPrice: number;
  qty: number;
  art: ArtKind;
  colorHex: string;
  image?: string;
};

export type Order = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  address: {
    line: string;
    city: string;
    state: string;
    country: string;
  };
  items: OrderItem[];
  tier: ShippingTier;
  deliveryFee: number;
  subtotal: number;
  total: number;
  status: OrderStatus;
  rejectReason?: string;
  hasReceipt?: boolean;
  logistics?: {
    riderName?: string;
    riderPhone?: string;
    parkName?: string;
    driverPhone?: string;
    vehicleNumber?: string;
    carrier?: string;
    trackingNumber?: string;
    trackingUrl?: string;
  };
};
