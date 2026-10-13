"""Fetch manufacturer packshots: Apple CDN, Google Store, Samsung images CDN."""
from __future__ import annotations

import pathlib
import re
import ssl
import time
import urllib.parse
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

# Fill gaps from first pass + refine older iPhones from common select patterns
APPLE_ASSETS = {
    "iphone-13.jpg": [
        "iphone-13-finish-select-2021",
        "iphone-13-pink-select-2021",
        "iphone-13-blue-select-2021",
        "iphone-13-midnight-select-2021",
        "iphone13-blue-select-2021",
        "iphone13-pink-select-2021",
    ],
    "iphone-12.jpg": [
        "iphone-12-black-select-2020",
        "iphone-12-blue-select-2020",
        "iphone12-black-select-2020",
        "iphone12-blue-select-2020",
        "iphone-12-finish-select-2020",
    ],
    "iphone-12-pro.jpg": [
        "iphone-12-pro-pacific-blue-select-2020",
        "iphone12pro-pacific-blue-select-2020",
        "iphone-12-pro-graphite-select-2020",
        "iphone12pro-graphite-select-2020",
    ],
    "iphone-12-pro-max.jpg": [
        "iphone-12-pro-max-pacific-blue-select-2020",
        "iphone12promax-pacific-blue-select-2020",
        "iphone-12-pro-max-graphite-select-2020",
    ],
}

GOOGLE_PAGES = {
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

# Samsung Dynamic Media / gallery (region paths often work with uk or global)
SAMSUNG = {
    "samsung-tab.jpg": [
        "https://images.samsung.com/is/image/samsung/p6pim/uk/sm-x210nzaaeua/gallery/uk-galaxy-tab-a9-plus-wifi-sm-x210-sm-x210nzaaeua-538856758?$650_519_PNG$",
        "https://images.samsung.com/is/image/samsung/p6pim/uk/sm-x210nzaaeua/gallery/uk-galaxy-tab-a9-plus-sm-x210-sm-x210nzaaeua-538856758?$684_547_PNG$",
        "https://images.samsung.com/is/image/samsung/p6pim/levant/sm-x210nzaamea/gallery/levant-galaxy-tab-a9-plus-sm-x210-sm-x210nzaamea-538603146?$650_519_PNG$",
    ],
}


def fetch(url: str, timeout: int = 40) -> bytes:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout, context=CTX) as res:
        return res.read()


def ok_image(data: bytes) -> bool:
    if len(data) < 5000:
        return False
    head = data[:80].lower()
    if head.startswith(b"<!doctype") or b"<html" in head:
        return False
    return (
        data[:3] == b"\xff\xd8\xff"
        or data[:8] == b"\x89PNG\r\n\x1a\n"
        or data[:4] == b"RIFF"
        or data[:4] == b"\x00\x00\x00\x1c"  # some heic rare
    )


def try_save(name: str, url: str) -> bool:
    try:
        data = fetch(url)
        if not ok_image(data):
            print(f"BAD {name} ({len(data)}) {url[:100]}")
            return False
        (OUT / name).write_bytes(data)
        print(f"OK {name} {len(data)}")
        return True
    except Exception as exc:
        print(f"FAIL {name} {exc}")
        return False


def apple_url(asset: str) -> str:
    return APPLE_CDN.format(asset=asset)


def scrape_buy_iphone(model: str) -> list[str]:
    url = f"https://www.apple.com/shop/buy-iphone/{model}"
    try:
        html = fetch(url, timeout=35).decode("utf-8", "ignore")
    except Exception as exc:
        print(f"SCRAPEFAIL {model} {exc}")
        return []
    ids = re.findall(r"as-images\.apple\.com/is/([A-Za-z0-9_\-]+)", html)
    ids += re.findall(r'"(iphone[^"]*(?:select|finish)[^"]*)"', html, re.I)
    seen: set[str] = set()
    out: list[str] = []
    for i in ids:
        i = urllib.parse.unquote(i).split("?")[0]
        if i not in seen and 4 < len(i) < 120:
            seen.add(i)
            out.append(i)
    return out


def google_candidates(html: str) -> list[str]:
    urls: list[str] = []
    for pat in [
        r'property=["\']og:image["\']\s+content=["\']([^"\']+)["\']',
        r'content=["\']([^"\']+)["\']\s+property=["\']og:image["\']',
        r'(https://lh3\.googleusercontent\.com/[^"\'\\\s>]+)',
        r'(https://www\.gstatic\.com/[^"\'\\\s>]+\.(?:png|jpg|jpeg|webp))',
        r'(https://store\.google\.com/[^"\'\\\s>]+\.(?:png|jpg|jpeg|webp))',
    ]:
        for m in re.finditer(pat, html, re.I):
            u = m.group(1).replace("\\u003d", "=").replace("\\/", "/").rstrip("\\")
            if u not in urls:
                urls.append(u)
    return urls


def enlarge_gstatic(url: str) -> str:
    # bump common size suffixes when present
    return re.sub(r"=s\d+", "=s1000", url)


def main() -> None:
    print("=== Apple gaps ===")
    for dest, assets in APPLE_ASSETS.items():
        # Prefer scrape first for older phones
        model = dest.replace(".jpg", "").replace("iphone-", "iphone-")
        scraped: list[str] = []
        if dest.startswith("iphone-"):
            slug = dest.replace(".jpg", "")
            scraped = scrape_buy_iphone(slug)
            print(f"SCRAPE {slug}: {len(scraped)}")
            for a in scraped[:8]:
                print(f"  {a}")
        time.sleep(0.4)
        tried = assets + [a for a in scraped if "select" in a.lower() or "finish" in a.lower()]
        for asset in tried:
            if try_save(dest, apple_url(asset)):
                break
        else:
            print(f"MISS {dest}")

    print("\n=== Google Store pages ===")
    for dest, page in GOOGLE_PAGES.items():
        time.sleep(0.7)
        try:
            html = fetch(page, timeout=35).decode("utf-8", "ignore")
        except Exception as exc:
            print(f"PAGEFAIL {dest} {exc}")
            continue
        cands = google_candidates(html)
        print(f"{dest}: {len(cands)} candidates")
        ok = False
        for cand in cands[:25]:
            for url in (enlarge_gstatic(cand), cand):
                if try_save(dest, url):
                    ok = True
                    break
            if ok:
                break
        if not ok:
            print(f"MISS {dest}")

    print("\n=== Samsung ===")
    for dest, urls in SAMSUNG.items():
        for url in urls:
            if try_save(dest, url):
                break
        else:
            print(f"MISS {dest}")

    print("DONE")


if __name__ == "__main__":
    main()
