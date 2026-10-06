"use client";

import { ConditionChip } from "@/components/condition-chip";
import { getVariant } from "@/lib/catalog";
import { deliveryFor } from "@/lib/delivery";
import { naira, normalizeNgPhone } from "@/lib/format";
import { COUNTRIES, NG_STATES } from "@/lib/site";
import { useStore } from "@/lib/store";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, placeOrder, ready } = useStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [line, setLine] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("Nigeria");
  const [terms, setTerms] = useState(false);
  const [gradeAck, setGradeAck] = useState(false);
  const [error, setError] = useState("");

  const detailed = lines
    .map((item) => {
      const found = getVariant(item.variantId);
      return found ? { ...found, qty: item.qty } : null;
    })
    .filter((item) => item != null);

  const subtotal = detailed.reduce((sum, item) => sum + item.variant.price * item.qty, 0);
  const hasPreowned = detailed.some((item) => item.variant.condition !== "new_sealed");
  const quote = useMemo(() => deliveryFor(state, country), [state, country]);
  const total = subtotal + (quote?.fee ?? 0);

  if (!ready) {
    return <p className="mx-auto max-w-3xl px-4 py-8 text-sm text-muted">Loading checkout…</p>;
  }

  if (detailed.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="font-display text-4xl font-medium">Checkout</h1>
        <p className="mt-4">Your cart is empty.</p>
        <Link href="/shop" className="mt-4 inline-flex font-bold text-deep">
          Shop devices
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-8 md:grid-cols-[1.2fr_0.8fr] md:px-6">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          const normalized = normalizeNgPhone(phone);
          if (!name.trim() || !line.trim() || !city.trim() || !state || !country) {
            setError("Enter your name, phone number, and delivery address.");
            return;
          }
          if (!normalized) {
            setError("Enter a Nigerian number, like 0803 123 4567.");
            return;
          }
          if (!terms || (hasPreowned && !gradeAck)) {
            setError("Accept the terms before placing the order.");
            return;
          }
          try {
            const order = placeOrder({
              name,
              phone: normalized,
              address: { line: line.trim(), city: city.trim(), state, country },
            });
            window.setTimeout(() => router.push(`/pay/${order.id}`), 0);
          } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Could not place the order.");
          }
        }}
      >
        <h1 className="font-display text-4xl font-medium">Checkout</h1>
        <p className="text-sm text-muted">No account needed. We use your phone number to track the order.</p>

        <TextField label="Full name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" />
        <TextField
          label="Phone number"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="0803 123 4567"
          slotProps={{ htmlInput: { inputMode: "tel", autoComplete: "tel" } }}
        />
        <TextField
          label="Address"
          value={line}
          onChange={(event) => setLine(event.target.value)}
          autoComplete="street-address"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="City"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            autoComplete="address-level2"
          />
          <FormControl fullWidth>
            <InputLabel id="state-label">State</InputLabel>
            <Select
              labelId="state-label"
              label="State"
              value={state}
              onChange={(event) => setState(event.target.value)}
            >
              {NG_STATES.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <FormControl fullWidth>
          <InputLabel id="country-label">Country</InputLabel>
          <Select
            labelId="country-label"
            label="Country"
            value={country}
            onChange={(event) => setCountry(event.target.value)}
          >
            {COUNTRIES.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {quote && (
          <div className="rounded-2xl border border-black/10 p-4">
            <p className="text-sm text-muted">Delivery</p>
            <p className="mt-1 font-display text-2xl font-medium">{quote.label}</p>
            <p className="mt-1 text-sm">{quote.estimate}</p>
            <p className="mt-3 font-bold tabular-nums">{naira(quote.fee)}</p>
          </div>
        )}

        <FormControlLabel
          control={<Checkbox checked={terms} onChange={(event) => setTerms(event.target.checked)} />}
          label={
            <span className="text-sm">
              I accept the{" "}
              <Link href="/policies/terms" className="font-bold text-deep">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/policies/delivery" className="font-bold text-deep">
                Delivery
              </Link>{" "}
              policy.
            </span>
          }
        />
        {hasPreowned && (
          <FormControlLabel
            control={<Checkbox checked={gradeAck} onChange={(event) => setGradeAck(event.target.checked)} />}
            label={<span className="text-sm">I have read the condition grade for each pre-owned item in this order.</span>}
          />
        )}
        {error && (
          <p className="text-sm font-bold" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" variant="contained" fullWidth sx={{ height: 48, borderRadius: 999, fontWeight: 700 }}>
          Place order
        </Button>
      </form>

      <aside className="h-fit rounded-2xl border border-black/10 p-4">
        <h2 className="font-display text-2xl font-medium">Order</h2>
        <ul className="mt-4 space-y-4">
          {detailed.map((item) => (
            <li key={item.variant.id} className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold">
                  {item.product.name} × {item.qty}
                </p>
                <p className="text-sm text-muted">
                  {item.variant.colorName} · {item.variant.storage}
                </p>
                <div className="mt-2">
                  <ConditionChip condition={item.variant.condition} />
                </div>
              </div>
              <p className="font-bold tabular-nums">{naira(item.variant.price * item.qty)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="font-bold tabular-nums">{naira(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Delivery</dt>
            <dd className="font-bold tabular-nums">{quote ? naira(quote.fee) : "—"}</dd>
          </div>
          <div className="flex justify-between text-base">
            <dt className="font-bold">Total</dt>
            <dd className="font-bold tabular-nums">{naira(total)}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
