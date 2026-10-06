import { FriendsRow } from "@/components/friends-row";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "See What Our Friends Say",
  description: "Unboxings from verified Fzmobile buyers.",
};

export default function FriendsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <h1 className="max-w-xl font-display text-4xl font-medium">See What Our Friends Say</h1>
      <p className="mt-3 max-w-xl text-sm text-muted">
        Verified Buyer means the video is tied to a real Fzmobile order. The badge cannot be added by the poster.
      </p>
      <div className="mt-8">
        <FriendsRow layout="grid" />
      </div>
    </div>
  );
}
