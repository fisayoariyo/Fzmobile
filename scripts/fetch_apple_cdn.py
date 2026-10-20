"""
Manufacturer product images → public/products

Apple (works well):
  https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/{asset}?wid=800&hei=800&fmt=jpeg&qlt=90
  Use a browser UA. Asset ids look like:
    iphone-16-finish-select-202409-6-1inch-ultramarine
    MQD83  (AirPods part code)
    MHJE3  (20W adapter)

Google Store:
  Page scrape often returns tiny og:image banners — prefer Wikimedia Commons
  for Pixel packshots (see fetch_pixel_commons.py).

Samsung:
  images.samsung.com gallery URLs are region/SKU brittle; many 404.
"""
from __future__ import annotations

import pathlib
import ssl
import time
import urllib.request

OUT = pathlib.Path("public/products")
OUT.mkdir(parents=True, exist_ok=True)
CTX = ssl.create_default_context()
UA = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    ),
    "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

APPLE_CDN = (
    "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/"
    "{asset}?wid=800&hei=800&fmt=jpeg&qlt=90"
)

APPLE_ASSETS: dict[str, list[str]] = {
    "iphone-16.jpg": ["iphone-16-finish-select-202409-6-1inch-ultramarine"],
    "iphone-16-plus.jpg": ["iphone-16-finish-select-202409-6-7inch-ultramarine"],
    "iphone-16-pro.jpg": ["iphone-16-pro-finish-select-202409-6-3inch-naturaltitanium"],
    "iphone-15.jpg": ["iphone-15-finish-select-202309-6-1inch-blue"],
    "iphone-15-pro.jpg": ["iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium"],
    "iphone-15-pro-max.jpg": ["iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium"],
    "iphone-14.jpg": ["iphone-14-finish-select-202209-6-1inch-blue"],
    "iphone-14-pro.jpg": ["iphone-14-pro-finish-select-202209-6-1inch-deeppurple"],
    "iphone-13.jpg": [
        "iphone-13-blue-select-2021",
        "iphone-13-pink-select-2021",
        "iphone-13-midnight-select-2021",
    ],
    "iphone-12.jpg": [
        "iphone-12-black-select-2020",
        "iphone-12-blue-select-2020",
        "iphone12-black-select-2020",
    ],
    "iphone-12-pro.jpg": ["iphone-12-pro-graphite-hero"],
    "iphone-12-pro-max.jpg": ["iphone-12-pro-max-graphite-hero"],
    "iphone-11.jpg": ["iphone11-black-select-2019"],
    # Verified against Apple's buy-iphone manifest. Note the real lineup has no
    # plain "iPhone 17 Pro Max" — the 6.9" flagship is the iPhone 18 Pro.
    "iphone-air.jpg": ["iphone-air-finish-select-skyblue-202509"],
    "iphone-17.jpg": ["iphone-17-finish-select-lavender-202509"],
    "iphone-17-pro.jpg": ["iphone-17-pro-finish-select-202509-6-3inch-cosmicorange"],
    "iphone-17-pro-max.jpg": ["iphone-18-pro-finish-select-burgundy-202609"],
    "airpods-pro.jpg": ["MQD83"],
    "ipad-10.jpg": ["ipad-10th-gen-finish-select-202212-blue-wifi"],
    "ipad-11.jpg": ["ipad-air-finish-select-gallery-202405-11inch-blue-wifi"],
    "apple-pencil.jpg": ["MU8F2"],
    "macbook-pro-14.jpg": ["mbp14-spacegray-select-202110"],
    "macbook-pro-13.jpg": ["mbp-spacegray-select-202206"],
    "macbook-pro-15.jpg": ["mbp15touch-space-select-201807"],
    "adapter.jpg": ["MHJE3"],
    "beats-pill.jpg": ["MW2D3"],
}


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=40, context=CTX) as res:
        return res.read()


def try_save(name: str, url: str) -> bool:
    try:
        data = fetch(url)
        if len(data) < 5000:
            print(f"TINY {name} {len(data)}")
            return False
        if data[:15].lower().startswith(b"<!doctype") or b"<html" in data[:60].lower():
            print(f"HTML {name}")
            return False
        (OUT / name).write_bytes(data)
        print(f"OK {name} {len(data)}")
        return True
    except Exception as exc:
        print(f"FAIL {name} {exc}")
        return False


def main() -> None:
    for dest, assets in APPLE_ASSETS.items():
        time.sleep(0.2)
        for asset in assets:
            if try_save(dest, APPLE_CDN.format(asset=asset)):
                break
        else:
            print(f"MISS {dest}")
    print("DONE")


if __name__ == "__main__":
    main()
