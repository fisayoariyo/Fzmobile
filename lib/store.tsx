"use client";

import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";
import { getVariant } from "./catalog";
import { deliveryFor } from "./delivery";
import type { Order } from "./types";

const CART_KEY = "fzmobile-cart";
const ORDER_KEY = "fzmobile-orders";

export type CartLine = { variantId: string; qty: number };

type PlaceInput = {
  name: string;
  phone: string;
  address: Order["address"];
};

type Snapshot = {
  lines: CartLine[];
  orders: Order[];
  ready: boolean;
};

type StoreValue = {
  ready: boolean;
  lines: CartLine[];
  count: number;
  orders: Order[];
  add: (variantId: string, qty?: number) => void;
  setQty: (variantId: string, qty: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
  placeOrder: (input: PlaceInput) => Order;
  attachReceipt: (orderId: string) => void;
  findOrder: (orderId: string, phone: string) => Order | null;
  orderById: (orderId: string) => Order | null;
};

const serverSnapshot: Snapshot = { lines: [], orders: [], ready: false };
let snapshot: Snapshot = serverSnapshot;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function persist() {
  localStorage.setItem(CART_KEY, JSON.stringify(snapshot.lines));
  localStorage.setItem(ORDER_KEY, JSON.stringify(snapshot.orders));
}

function commit(next: Snapshot) {
  snapshot = next;
  if (next.ready) persist();
  emit();
}

export function seedOrder(): Order {
  return {
    id: "FZ-4N8C2P",
    createdAt: "2026-10-05T09:40:00+01:00",
    name: "Adaeze Okonkwo",
    phone: "08031234567",
    address: {
      line: "14 Admiralty Way",
      city: "Lekki",
      state: "Lagos",
      country: "Nigeria",
    },
    items: [
      {
        variantId: "air-256-blue-new",
        name: "iPhone Air",
        summary: "Blue · 256GB · eSIM",
        condition: "new_sealed",
        unitPrice: 1_250_000,
        qty: 1,
        art: "phone",
        colorHex: "#A8C7DC",
        image: "/products/iphone-air.jpg",
      },
    ],
    tier: "same-state",
    deliveryFee: 3500,
    subtotal: 1_250_000,
    total: 1_253_500,
    status: "in_transit",
    hasReceipt: true,
    logistics: {
      riderName: "Tunde Bakare",
      riderPhone: "08099887766",
    },
  };
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const storedCart = JSON.parse(localStorage.getItem(CART_KEY) || "[]") as CartLine[];
    const storedOrders = JSON.parse(localStorage.getItem(ORDER_KEY) || "[]") as Order[];
    const orders = Array.isArray(storedOrders) ? storedOrders : [];
    if (!orders.some((order) => order.id === "FZ-4N8C2P")) orders.unshift(seedOrder());
    commit({
      lines: Array.isArray(storedCart) ? storedCart : [],
      orders,
      ready: true,
    });
  } catch {
    commit({ lines: [], orders: [seedOrder()], ready: true });
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function makeOrderId() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "FZ-";
  for (let index = 0; index < 6; index += 1) {
    id += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return id;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const current = useSyncExternalStore(subscribe, () => snapshot, () => serverSnapshot);
  useEffect(() => {
    hydrate();
  }, []);
  const count = current.lines.reduce((sum, line) => sum + line.qty, 0);

  const value: StoreValue = {
    ready: current.ready,
    lines: current.lines,
    count,
    orders: current.orders,
    add(variantId, qty = 1) {
      const found = getVariant(variantId);
      if (!found || found.variant.stock < 1) return;
      const existing = snapshot.lines.find((line) => line.variantId === variantId);
      const nextQty = Math.min(found.variant.stock, (existing?.qty ?? 0) + qty);
      const lines = existing
        ? snapshot.lines.map((line) =>
            line.variantId === variantId ? { ...line, qty: nextQty } : line,
          )
        : [...snapshot.lines, { variantId, qty: nextQty }];
      commit({ ...snapshot, lines });
    },
    setQty(variantId, qty) {
      const found = getVariant(variantId);
      if (!found) return;
      const lines =
        qty <= 0
          ? snapshot.lines.filter((line) => line.variantId !== variantId)
          : snapshot.lines.map((line) =>
              line.variantId === variantId
                ? { ...line, qty: Math.min(found.variant.stock, qty) }
                : line,
            );
      commit({ ...snapshot, lines });
    },
    remove(variantId) {
      commit({
        ...snapshot,
        lines: snapshot.lines.filter((line) => line.variantId !== variantId),
      });
    },
    clear() {
      commit({ ...snapshot, lines: [] });
    },
    placeOrder(input) {
      if (snapshot.lines.length === 0) throw new Error("Your cart is empty.");
      const items: Order["items"] = [];
      let subtotal = 0;
      for (const line of snapshot.lines) {
        const found = getVariant(line.variantId);
        if (!found || found.variant.stock < line.qty) {
          throw new Error("A device in your cart is no longer available.");
        }
        subtotal += found.variant.price * line.qty;
        items.push({
          variantId: found.variant.id,
          name: found.product.name,
          summary: `${found.variant.colorName} · ${found.variant.storage}`,
          condition: found.variant.condition,
          unitPrice: found.variant.price,
          qty: line.qty,
          art: found.product.art,
          colorHex: found.variant.colorHex,
          image: found.variant.image || found.product.image,
        });
      }
      const quote = deliveryFor(input.address.state, input.address.country);
      if (!quote) throw new Error("Choose a delivery address.");
      const order: Order = {
        id: makeOrderId(),
        createdAt: new Date().toISOString(),
        name: input.name.trim(),
        phone: input.phone,
        address: input.address,
        items,
        tier: quote.tier,
        deliveryFee: quote.fee,
        subtotal,
        total: subtotal + quote.fee,
        status: "awaiting_receipt",
      };
      commit({ ...snapshot, orders: [order, ...snapshot.orders], lines: [] });
      return order;
    },
    attachReceipt(orderId) {
      commit({
        ...snapshot,
        orders: snapshot.orders.map((order) => {
          if (order.id !== orderId) return order;
          const canReplace =
            order.status === "awaiting_receipt" || order.status === "payment_rejected";
          return {
            ...order,
            hasReceipt: true,
            rejectReason: undefined,
            status: canReplace ? "pending_verification" : order.status,
          };
        }),
      });
    },
    findOrder(orderId, phone) {
      const id = orderId.trim().toUpperCase();
      return (
        snapshot.orders.find((order) => order.id.toUpperCase() === id && order.phone === phone) ??
        null
      );
    },
    orderById(orderId) {
      return snapshot.orders.find((order) => order.id === orderId) ?? null;
    },
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used within StoreProvider");
  return value;
}
