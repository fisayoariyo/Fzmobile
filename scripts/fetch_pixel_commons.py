"""Resolve Pixel product photos via Wikimedia Commons API, then fill gaps."""
from __future__ import annotations

import json
import pathlib
import ssl
import time
import urllib.parse
import urllib.request

OUT = pathlib.Path("public/products")
OUT.mkdir(parents=True, exist_ok=True)
CTX = ssl.create_default_context()
UA = {"User-Agent": "FzmobileCatalogBot/1.0 (local catalogue build)"}

QUERIES = {
    "pixel-9.jpg": "Pixel 9 Google phone",
    "pixel-9-pro.jpg": "Pixel 9 Pro Google",
    "pixel-9-pro-xl.jpg": "Pixel 9 Pro XL",
    "pixel-8.jpg": "Google Pixel 8 phone",
    "pixel-8-pro.jpg": "Google Pixel 8 Pro",
    "pixel-7.jpg": "Google Pixel 7 phone",
    "pixel-7-pro.jpg": "Google Pixel 7 Pro",
    "pixel-7a.jpg": "Google Pixel 7a",
    "pixel-6.jpg": "Google Pixel 6 phone",
    "pixel-6-pro.jpg": "Google Pixel 6 Pro",
}

# Prefer these exact Commons titles when known
DIRECT = {
    "pixel-9.jpg": ["Pixel_9.jpg", "Google_Pixel_9_Porcelain.jpg"],
    "pixel-9-pro.jpg": [
        "Google_Pixel_9_Pro_and_Pixel_9_Pro_XL.jpg",
        "Pixel_9_Pro.jpg",
        "Google_Pixel_9_Pro_Hazel.jpg",
    ],
    "pixel-9-pro-xl.jpg": ["Pixel_9_Pro_XL.jpg", "Google_Pixel_9_Pro_XL_Obsidian.jpg"],
    "pixel-8.jpg": [
        "Google_Pixel_8_and_Pixel_8_Pro.jpg",
        "Pixel_8_Obsidian.jpg",
        "Google_Pixel_8_Obsidian.jpg",
    ],
    "pixel-8-pro.jpg": ["Google_Pixel_8_Pro.jpg", "Pixel_8_Pro_Obsidian.jpg"],
    "pixel-7.jpg": [
        "Google_Pixel_7_and_Pixel_7_Pro.jpg",
        "Pixel_7_Obsidian.jpg",
        "Google_Pixel_7.jpg",
    ],
    "pixel-7-pro.jpg": ["Google_Pixel_7_Pro.jpg", "Pixel_7_Pro_Hazel.jpg"],
    "pixel-7a.jpg": ["Google_Pixel_7a_Sea.jpg", "Pixel_7a.jpg", "Google_Pixel_7a.jpg"],
    "pixel-6.jpg": [
        "Google_Pixel_6_and_Pixel_6_Pro.jpg",
        "Pixel_6_Sorta_Seafoam.jpg",
        "Google_Pixel_6.jpg",
    ],
    "pixel-6-pro.jpg": ["Google_Pixel_6_Pro.jpg", "Pixel_6_Pro_Stormy_Black.jpg"],
}


def get(url: str, timeout: int = 45) -> bytes:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout, context=CTX) as res:
        return res.read()


def save_ok(name: str, data: bytes) -> bool:
    if len(data) < 12_000:
        print(f"TINY {name} {len(data)}")
        return False
    if data[:15].lower().startswith(b"<!doctype") or b"<html" in data[:60].lower():
        print(f"HTML {name}")
        return False
    (OUT / name).write_bytes(data)
    print(f"OK {name} {len(data)}")
    return True


def try_filepath(dest: str, title: str) -> bool:
    url = "https://commons.wikimedia.org/wiki/Special:FilePath/" + urllib.parse.quote(
        title
    ) + "?width=1400"
    try:
        return save_ok(dest, get(url))
    except Exception as exc:
        print(f"FAIL {dest} {title} {exc}")
        return False


def search_commons(query: str, limit: int = 8) -> list[str]:
    api = (
        "https://commons.wikimedia.org/w/api.php?"
        + urllib.parse.urlencode(
            {
                "action": "query",
                "format": "json",
                "generator": "search",
                "gsrsearch": query,
                "gsrnamespace": "6",
                "gsrlimit": str(limit),
                "prop": "imageinfo",
                "iiprop": "url|size|mime",
                "iiurlwidth": "1400",
            }
        )
    )
    data = json.loads(get(api).decode("utf-8"))
    pages = data.get("query", {}).get("pages", {})
    titles: list[str] = []
    for page in pages.values():
        info = (page.get("imageinfo") or [{}])[0]
        mime = info.get("mime", "")
        size = info.get("size") or 0
        if not mime.startswith("image/"):
            continue
        if size and size < 20_000:
            continue
        title = page.get("title", "").removeprefix("File:")
        if title:
            titles.append(title)
    return titles


def main() -> None:
    for dest, titles in DIRECT.items():
        existing = OUT / dest
        if existing.exists() and existing.stat().st_size > 40_000:
            print(f"KEEP {dest} {existing.stat().st_size}")
            continue
        ok = False
        for title in titles:
            time.sleep(0.7)
            if try_filepath(dest, title):
                ok = True
                break
        if ok:
            continue
        time.sleep(0.7)
        for title in search_commons(QUERIES[dest]):
            time.sleep(0.7)
            if try_filepath(dest, title):
                ok = True
                break
        if not ok:
            print(f"MISS {dest}")

    # Samsung gallery packshots that often work
    samsung = {
        "samsung-s24.jpg": (
            "https://images.samsung.com/is/image/samsung/p6pim/uk/"
            "sm-s921bzkdeub/gallery/uk-galaxy-s24-s921-sm-s921bzkdeub-539573825"
            "?$650_519_PNG$"
        ),
        "samsung-tab-official.jpg": (
            "https://images.samsung.com/is/image/samsung/p6pim/uk/"
            "sm-x210nzaaeua/gallery/uk-galaxy-tab-a9-plus-wifi-sm-x210-"
            "sm-x210nzaaeua-538856758?$650_519_PNG$"
        ),
    }
    for name, url in samsung.items():
        time.sleep(0.5)
        try:
            save_ok(name, get(url))
        except Exception as exc:
            print(f"FAIL {name} {exc}")

    print("DONE")


if __name__ == "__main__":
    main()
