"use client";

import { DeviceArt } from "@/components/device-art";
import type { ArtKind } from "@/lib/types";
import Image from "next/image";
import { useState } from "react";

export function ProductMedia({
  art,
  color,
  image,
  alt,
  className,
  priority = false,
}: {
  art: ArtKind;
  color: string;
  image?: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (!image || failed) {
    return <DeviceArt kind={art} color={color} className={className} />;
  }

  return (
    <div className={`relative bg-white ${className ?? ""}`}>
      <Image
        src={image}
        alt={alt}
        fill
        sizes="(max-width: 768px) 50vw, 320px"
        className="object-contain p-3 md:p-6"
        priority={priority}
        unoptimized={image.startsWith("/products/")}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
