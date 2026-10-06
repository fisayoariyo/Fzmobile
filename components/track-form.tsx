"use client";

import { normalizeNgPhone } from "@/lib/format";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function TrackForm() {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  return (
    <form
      className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end"
      onSubmit={(event) => {
        event.preventDefault();
        const normalized = normalizeNgPhone(phone);
        if (!orderId.trim() || !normalized) {
          setError("Enter the Order ID and the phone number used at checkout.");
          return;
        }
        setError("");
        router.push(
          `/track?order=${encodeURIComponent(orderId.trim().toUpperCase())}&phone=${encodeURIComponent(normalized)}`,
        );
      }}
    >
      <TextField
        label="Order ID"
        value={orderId}
        onChange={(event) => setOrderId(event.target.value)}
        placeholder="FZ-4N8C2P"
        autoComplete="off"
      />
      <TextField
        label="Phone number"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        placeholder="0803 123 4567"
        slotProps={{ htmlInput: { inputMode: "tel", autoComplete: "tel" } }}
      />
      <Button
        type="submit"
        variant="contained"
        sx={{ height: 48, borderRadius: 999, px: 3, fontWeight: 700 }}
      >
        Track
      </Button>
      {error && (
        <p className="text-sm text-black md:col-span-3" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
