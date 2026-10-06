"""Download manufacturer product images into public/products."""
from __future__ import annotations

import json
import pathlib
import re
import ssl
import time
import urllib.error
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


def fetch(url: str, timeout: int = 40) -> bytes:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout, context=CTX) as res:
        return res.read()


def save(name: str, data: bytes) -> None:
    path = OUT / name
    path.write_bytes(data)
    print(f"OK {name} {len(data)}")


# Known manufacturer CDN / store hero assets (direct product imagery)
DIRECT = {
    # Google Pixel — store.google.com / gstatic product assets
    "pixel-9.jpg": "https://lh3.googleusercontent.com/h1b0sQbQ8Q8Q",  # placeholder replaced below
}

# Better: scrape Google store product JSON / og:image, plus Apple newsroom CDN that works
PAGES = {
    "pixel-9.jpg": "https://store.google.com/us/product/pixel_9?hl=en-US",
    "pixel-9-pro.jpg": "https://store.google.com/us/product/pixel_9_pro?hl=en-US",
    "pixel-9-pro-xl.jpg": "https://store.google.com/us/product/pixel_9_pro_xl?hl=en-US",
    "pixel-8.jpg": "https://store.google.com/us/product/pixel_8?hl=en-US",
    "pixel-8-pro.jpg": "https://store.google.com/us/product/pixel_8_pro?hl=en-US",
    "pixel-7.jpg": "https://store.google.com/us/product/pixel_7?hl=en-US",
    "pixel-7-pro.jpg": "https://store.google.com/us/product/pixel_7_pro?hl=en-US",
    "pixel-7a.jpg": "https://store.google.com/us/product/pixel_7a?hl=en-US",
    "pixel-6.jpg": "https://store.google.com/us/product/pixel_6?hl=en-US",
    "pixel-6-pro.jpg": "https://store.google.com/us/product/pixel_6_pro?hl=en-US",
}

APPLE_DIRECT = {
    "iphone-16-apple.jpg": "https://www.apple.com/v/iphone-16/f/images/overview/welcome/hero__f6b6xq4j5q2e_large.jpg",
    "iphone-15-apple.jpg": "https://www.apple.com/v/iphone-15/c/images/overview/welcome/hero_endframe__e0ajdrs2uaqy_large.jpg",
    "iphone-14-apple.jpg": "https://www.apple.com/newsroom/images/product/iphone/geo/Apple-iPhone-14-iPhone-14-Plus-hero-220907-geo_inline.jpg.large.jpg",
    "airpods-apple.jpg": "https://www.apple.com/v/airpods-pro/q/images/overview/hero/hero__e2jqzba6ikky_large.png",
    "ipad-apple.jpg": "https://www.apple.com/v/ipad/home/ax/images/overview/hero/ipad_hero__ecv2424g3dam_large.jpg",
    "mbp-apple.jpg": "https://www.apple.com/v/macbook-pro/ah/images/overview/welcome/hero_endframe__e6khcvaanbim_large.jpg",
    "adapter-apple.jpg": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MHJE3?wid=1000&hei=1000&fmt=jpeg&qlt=90&.v=0",
}

SAMSUNG_DIRECT = {
    "samsung-s24.jpg": "https://images.samsung.com/is/image/samsung/p6pim/uk/2401/gallery/uk-galaxy-s24-s928-sm-s928bzkgeub-539304132?$650_519_PNG$",
    "samsung-tab-official.jpg": "https://images.samsung.com/is/image/samsung/p6pim/uk/sm-x210nzaaeua/gallery/uk-galaxy-tab-a9-plus-sm-x210-sm-x210nzaaeua-538856758?$650_519_PNG$",
}


def og_image(html: str) -> str | None:
    patterns = [
        r'property=["\']og:image["\']\s+content=["\']([^"\']+)["\']',
        r'content=["\']([^"\']+)["\']\s+property=["\']og:image["\']',
        r'"image"\s*:\s*"(https:[^"]+)"',
        r'(https://lh3\.googleusercontent\.com/[^"\'\s]+)',
        r'(https://www\.gstatic\.com/[^"\'\s]+\.(?:png|jpg|jpeg|webp))',
    ]
    for pat in patterns:
        m = re.search(pat, html, re.I)
        if m:
            return m.group(1).replace("\\u003d", "=").replace("\\/", "/")
    return None


def try_download(name: str, url: str) -> bool:
    try:
        data = fetch(url)
        if len(data) < 3000:
            print(f"TINY {name} {len(data)}")
            return False
        if data[:15].lower().startswith(b"<!doctype") or b"<html" in data[:80].lower():
            print(f"HTML {name}")
            return False
        save(name, data)
        return True
    except Exception as exc:
        print(f"FAIL {name} {exc}")
        return False


def main() -> None:
    # 1) Scrape Google Store product pages for og:image
    for name, page in PAGES.items():
        time.sleep(0.8)
        try:
            html = fetch(page, timeout=30).decode("utf-8", "ignore")
            img = og_image(html)
            print(f"PAGE {name} -> {img[:100] if img else None}")
            if img and try_download(name, img):
                continue
            # fallback candidates in page
            cands = re.findall(
                r"https://(?:lh3\.googleusercontent\.com|www\.gstatic\.com)[^\"'\\s>]+",
                html,
            )
            ok = False
            for cand in cands[:20]:
                cand = cand.rstrip("\\").replace("\\u003d", "=")
                if try_download(name, cand):
                    ok = True
                    break
            if not ok:
                print(f"MISS {name}")
        except Exception as exc:
            print(f"PAGEFAIL {name} {exc}")

    # 2) Apple / Samsung direct assets
    for name, url in {**APPLE_DIRECT, **SAMSUNG_DIRECT}.items():
        time.sleep(0.5)
        try_download(name, url)

    print("DONE")


if __name__ == "__main__":
    main()
