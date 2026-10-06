import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "store.storeimages.cdn-apple.com" },
      { protocol: "https", hostname: "www.apple.com" },
      { protocol: "https", hostname: "cdsassets.apple.com" },
      { protocol: "https", hostname: "images.samsung.com" },
      { protocol: "https", hostname: "image-us.samsung.com" },
      { protocol: "https", hostname: "uk.jbl.com" },
      { protocol: "https", hostname: "www.jbl.com" },
      { protocol: "https", hostname: "www.beatsbydre.com" },
      { protocol: "https", hostname: "assets.ray-ban.com" },
      { protocol: "https", hostname: "www.ray-ban.com" },
      { protocol: "https", hostname: "i.dell.com" },
      { protocol: "https", hostname: "ssl-product-images.www8-hp.com" },
      { protocol: "https", hostname: "www.hp.com" },
    ],
  },
};

export default nextConfig;
