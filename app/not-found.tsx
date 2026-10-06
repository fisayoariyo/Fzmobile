import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <h1 className="font-display text-4xl font-medium">That page is not here.</h1>
      <Link href="/shop" className="mt-6 inline-flex h-12 items-center font-bold text-deep">
        Browse devices
      </Link>
    </div>
  );
}
