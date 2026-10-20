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

/** Apple-aligned field styling: hairline border, band fill, link-blue focus. */
const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    bgcolor: "#f5f5f7",
    "& fieldset": { borderColor: "#d2d2d7" },
    "&:hover fieldset": { borderColor: "#86868b" },
    "&.Mui-focused fieldset": { borderColor: "#0071e3" },
  },
};

const selectSx = {
  borderRadius: "12px",
  bgcolor: "#f5f5f7",
  "& fieldset": { borderColor: "#d2d2d7" },
  "&:hover fieldset": { borderColor: "#86868b" },
  "&.Mui-focused fieldset": { borderColor: "#0071e3" },
};

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
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-sm text-muted">Loading checkout…</p>
      </div>
    );
  }

  if (detailed.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display text-4xl font-medium tracking-tight">Checkout</h1>
        <p className="mt-3 text-muted">Your cart is empty.</p>
        <Link
          href="/shop"
          className="mt-6 inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-deep px-8 font-semibold text-white shadow-md shadow-deep/20 transition-all hover:bg-deep/90"
        >
          Shop devices
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-8 md:grid-cols-[1.2fr_0.8fr] md:px-6">
      <form
        className="space-y-5"
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
        <div>
          <h1 className="font-display text-4xl font-medium tracking-tight">Checkout</h1>
          <p className="mt-1.5 text-sm text-muted">
            No account needed. We use your phone number to track the order.
          </p>
        </div>

        <div className="space-y-4">
          <TextField
            fullWidth
            label="Full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            sx={fieldSx}
          />
          <TextField
            fullWidth
            label="Phone number"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="0803 123 4567"
            slotProps={{ htmlInput: { inputMode: "tel", autoComplete: "tel" } }}
            sx={fieldSx}
          />
          <TextField
            fullWidth
            label="Address"
            value={line}
            onChange={(event) => setLine(event.target.value)}
            autoComplete="street-address"
            sx={fieldSx}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              fullWidth
              label="City"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              autoComplete="address-level2"
              sx={fieldSx}
            />
            <FormControl fullWidth sx={fieldSx}>
              <InputLabel id="state-label">State</InputLabel>
              <Select
                labelId="state-label"
                label="State"
                value={state}
                onChange={(event) => setState(event.target.value)}
                sx={selectSx}
              >
                {NG_STATES.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <FormControl fullWidth sx={fieldSx}>
            <InputLabel id="country-label">Country</InputLabel>
            <Select
              labelId="country-label"
              label="Country"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              sx={selectSx}
            >
              {COUNTRIES.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {quote && (
          <div className="rounded-2xl border border-black/[0.04] bg-surface p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Delivery Option</p>
            <div className="mt-2 flex items-baseline justify-between gap-4">
              <p className="font-display text-2xl font-medium tracking-tight">{quote.label}</p>
              <p className="text-lg font-bold tabular-nums text-deep">{naira(quote.fee)}</p>
            </div>
            <p className="mt-1 text-sm text-muted">{quote.estimate}</p>
          </div>
        )}

        <div className="space-y-1 pt-1">
          <FormControlLabel
            control={<Checkbox checked={terms} onChange={(event) => setTerms(event.target.checked)} />}
            label={
              <span className="text-sm">
                I accept the{" "}
                <Link href="/policies/terms" className="font-semibold text-deep hover:underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/policies/delivery" className="font-semibold text-deep hover:underline">
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
        </div>

        {error && (
          <div className="rounded-xl border border-red-200/60 bg-red-50 p-3 text-sm font-medium text-red-700" role="alert">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            height: 56,
            borderRadius: 999,
            fontWeight: 700,
            fontSize: "1rem",
            textTransform: "none",
          }}
        >
          Place order
        </Button>
      </form>

      <aside className="h-fit rounded-2xl border border-black/[0.04] bg-surface p-6 shadow-sm">
        <h2 className="font-display text-2xl font-medium tracking-tight">Order</h2>
        <ul className="mt-5 space-y-4">
          {detailed.map((item) => (
            <li
              key={item.variant.id}
              className="flex items-start justify-between gap-3 border-b border-black/[0.04] pb-4 last:border-b-0 last:pb-0"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-snug">
                  {item.product.name} <span className="font-normal text-muted">× {item.qty}</span>
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  {item.variant.colorName} · {item.variant.storage}
                </p>
                <div className="mt-2">
                  <ConditionChip condition={item.variant.condition} />
                </div>
              </div>
              <p className="shrink-0 text-sm font-bold tabular-nums">
                {naira(item.variant.price * item.qty)}
              </p>
            </li>
          ))}
        </ul>
        <dl className="mt-6 space-y-2.5 border-t border-black/[0.06] pt-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="font-semibold tabular-nums">{naira(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Delivery</dt>
            <dd className="font-semibold tabular-nums">{quote ? naira(quote.fee) : "—"}</dd>
          </div>
          <div className="flex justify-between border-t border-black/[0.06] pt-3 text-base">
            <dt className="font-bold">Total</dt>
            <dd className="text-xl font-bold tabular-nums text-deep">{naira(total)}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
