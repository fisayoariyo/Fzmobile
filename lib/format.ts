export function naira(amount: number) {
  return `₦${new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 }).format(amount)}`;
}

export function formatWhen(iso: string) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Lagos",
  }).format(new Date(iso));
}

export function normalizeNgPhone(input: string) {
  const digits = input.replace(/\D/g, "");
  const local = digits.startsWith("234") ? `0${digits.slice(3)}` : digits;
  if (/^0\d{10}$/.test(local)) return local;
  return null;
}

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
