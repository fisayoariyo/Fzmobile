from __future__ import annotations

import json
import pathlib
import ssl
import urllib.parse
import urllib.request

from PIL import Image

OUT = pathlib.Path("public/products")
CTX = ssl.create_default_context()
UA = {"User-Agent": "FzmobileCatalogBot/1.0"}


def api(query: str) -> list[str]:
    params = urllib.parse.urlencode(
        {
            "action": "query",
            "format": "json",
            "generator": "search",
            "gsrsearch": query,
            "gsrnamespace": "6",
            "gsrlimit": "8",
            "prop": "imageinfo",
            "iiprop": "url|size|mime",
            "iiurlwidth": "1400",
        }
    )
    req = urllib.request.Request(
        "https://commons.wikimedia.org/w/api.php?" + params, headers=UA
    )
    data = json.loads(urllib.request.urlopen(req, timeout=40, context=CTX).read().decode())
    titles = []
    for page in data.get("query", {}).get("pages", {}).values():
        info = (page.get("imageinfo") or [{}])[0]
        if not str(info.get("mime", "")).startswith("image/"):
            continue
        if (info.get("size") or 0) < 80_000:
            continue
        title = page.get("title", "").removeprefix("File:")
        # Prefer filenames that mention 7 Pro specifically
        titles.append((0 if "7 Pro" in title or "7_Pro" in title else 1, title, info.get("size")))
    titles.sort()
    return [t[1] for t in titles]


def save(title: str) -> bool:
    url = (
        "https://commons.wikimedia.org/wiki/Special:FilePath/"
        + urllib.parse.quote(title)
        + "?width=1400"
    )
    req = urllib.request.Request(url, headers=UA)
    data = urllib.request.urlopen(req, timeout=60, context=CTX).read()
    path = OUT / "pixel-7-pro.jpg"
    path.write_bytes(data)
    im = Image.open(path).convert("RGB")
    im.thumbnail((1400, 1400))
    im.save(path, "JPEG", quality=88, optimize=True)
    print("OK", title, path.stat().st_size, im.size)
    return True


def main() -> None:
    for query in ["Pixel 7 Pro Hazel", "Pixel 7 Pro Obsidian", "Google Pixel 7 Pro"]:
        for title in api(query):
            try:
                if "7" in title and "Pro" in title and "8" not in title and "9" not in title:
                    save(title)
                    return
            except Exception as exc:
                print("FAIL", title, exc)
    print("MISS")


if __name__ == "__main__":
    main()
