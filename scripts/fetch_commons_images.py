"""
Fetch real product images for the non-Apple brands from Wikimedia Commons.

Commons hosts freely-licensed photographs of real devices, which is the only
remaining source for models the manufacturers have retired and no longer
serve from their own CDNs. Each entry below was selected by hand from a
search of Commons so the picture actually shows the model in question.
"""

from __future__ import annotations

import pathlib
import ssl
import struct
import time
import urllib.request

OUT = pathlib.Path("public/products")
CTX = ssl.create_default_context()
UA = {
    "User-Agent": (
        "Fzmobile/1.0 (catalog image fetch; "
        "https://github.com/fisayoariyo/Fzmobile) Python-urllib"
    )
}
C = "https://upload.wikimedia.org/wikipedia/commons/"

PICKS: list[tuple[str, str]] = [
    # --- Google Pixel ---
    ("pixel-6.jpg", C + "e/e0/Google_Pixel_6_Sorta_Seafoam_front.jpg"),
    ("pixel-6-pro.jpg", C + "2/25/Google_Pixel_6_Sorta_Seafoam_rear_top-right_01.jpg"),
    ("pixel-7.jpg", C + "5/5d/Google_Pixel_7_20230416_HOF00361_RAW-Export.png"),
    ("pixel-7-pro.jpg", C + "b/b0/Google_Pixel_7_20230416_HOF00365_RAW-Export.png"),
    ("pixel-7a.jpg", C + "a/a6/Google_Pixel_7A.jpg"),
    ("pixel-8.jpg", C + "f/f9/Google_Pixel_8%2C_shown_in_Shibuya_Stream.jpg"),
    ("pixel-8-pro.jpg", C + "5/5c/Google_Pixel_8_Pro%2C_shown_in_Shibuya_Stream.jpg"),
    # --- Samsung ---
    ("samsung-tab.jpg", C + "4/46/Samsung_Galaxy_Tab_A9%2B_tablet.jpg"),
    # --- HP ---
    ("hp-laptop.jpg", C + "9/9a/HP_EliteBook_840_G8.png"),
    # --- Meta ---
    ("rayban-meta.jpg", C + "9/92/Rayban_x_Meta_glasses_Generazione_2_con_lenti_Polaroid%2C_wayfarer.jpg"),
]


def dims(b: bytes) -> tuple[int, int] | None:
    if b[:2] == b"\xff\xd8":
        i = 2
        while i < len(b):
            if b[i] != 0xFF:
                i += 1
                continue
            m = b[i + 1]
            if m in (0xC0, 0xC1, 0xC2):
                h, w = struct.unpack(">HH", b[i + 5:i + 9])
                return w, h
            if m in (0xD8, 0xD9) or 0xD0 <= m <= 0xD7:
                i += 2
                continue
            ln = struct.unpack(">H", b[i + 2:i + 4])[0]
            i += 2 + ln
    if b[:8] == b"\x89PNG\r\n\x1a\n":
        w, h = struct.unpack(">II", b[16:24])
        return w, h
    return None


def main() -> None:
    ok = 0
    for name, url in PICKS:
        for attempt in range(4):
            try:
                req = urllib.request.Request(url, headers=UA)
                with urllib.request.urlopen(req, timeout=60, context=CTX) as res:
                    data = res.read()
                d = dims(data)
                if not d or d[0] < 800:
                    print(f"BAD  {name}: {d}")
                    break
                (OUT / name).write_bytes(data)
                print(f"OK   {name:22} {len(data):>10,}  {d}")
                ok += 1
                break
            except Exception as exc:
                print(f"  retry {attempt + 1} {name}: {exc}")
                time.sleep(4 * (attempt + 1))
        time.sleep(3)
    print(f"\n{ok}/{len(PICKS)} downloaded")


if __name__ == "__main__":
    main()
