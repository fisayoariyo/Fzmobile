"""Fill remaining Pixel packshots and normalize sizes."""
from __future__ import annotations

import pathlib
import ssl
import urllib.parse
import urllib.request

from PIL import Image

OUT = pathlib.Path("public/products")
CTX = ssl.create_default_context()
UA = {"User-Agent": "FzmobileCatalogBot/1.0 (local catalogue build)"}


def get(url: str) -> bytes:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60, context=CTX) as res:
        return res.read()


def save_thumb(dest: str, title: str, max_side: int = 1400) -> None:
    url = (
        "https://commons.wikimedia.org/wiki/Special:FilePath/"
        + urllib.parse.quote(title)
        + f"?width={max_side}"
    )
    data = get(url)
    path = OUT / dest
    path.write_bytes(data)
    im = Image.open(path).convert("RGB")
    im.thumbnail((max_side, max_side))
    im.save(path, "JPEG", quality=88, optimize=True)
    print(f"OK {dest} {path.stat().st_size} {im.size}")


def main() -> None:
    save_thumb("pixel-6.jpg", "Google Pixel 6 Sorta Seafoam rear.jpg")
    # refresh oversized / weak files
    for dest, title in [
        ("pixel-7-pro.jpg", "Google Pixel 7 Pro Hazel.jpg"),
        ("pixel-8-pro.jpg", "Google Pixel 8 Pro.jpg"),
    ]:
        try:
            save_thumb(dest, title)
        except Exception as exc:
            print(f"SKIP {dest} {exc}")
            # fall back: keep existing if large enough
            path = OUT / dest
            if path.exists() and path.stat().st_size > 40_000:
                im = Image.open(path).convert("RGB")
                im.thumbnail((1400, 1400))
                im.save(path, "JPEG", quality=88, optimize=True)
                print(f"NORM {dest} {path.stat().st_size}")

    # Prefer Apple store packshots where downloaded
    swaps = {
        "iphone-16.jpg": "iphone-16-apple.jpg",
        "iphone-15.jpg": "iphone-15-apple.jpg",
        "iphone-14.jpg": "iphone-14-apple.jpg",
        "airpods-pro.jpg": "airpods-apple.jpg",
        "ipad-10.jpg": "ipad-apple.jpg",
        "macbook-pro-14.jpg": "mbp-apple.jpg",
        "adapter.jpg": "adapter-apple.jpg",
    }
    for dest, src in swaps.items():
        src_path = OUT / src
        dest_path = OUT / dest
        if src_path.exists() and src_path.stat().st_size > 20_000:
            data = src_path.read_bytes()
            dest_path.write_bytes(data)
            print(f"SWAP {dest} <- {src} {len(data)}")

    print("DONE")


if __name__ == "__main__":
    main()
