"""
Normalise product images to web size.

Manufacturer and Commons originals range from 800px to 8000px wide and up to
150MB for RAW exports. Product cards render at most ~600px, so every file is
scaled to fit a 1200px box on the long edge and written back as a progressive
JPEG. Anything already within budget is left untouched.
"""

from __future__ import annotations

import pathlib
from PIL import Image

OUT = pathlib.Path("public/products")
MAX_EDGE = 1200
QUALITY = 88
SKIP_UNDER = 400_000  # bytes; already light enough


def main() -> None:
    total_before = 0
    total_after = 0
    for path in sorted(OUT.glob("*.jpg")) + sorted(OUT.glob("*.png")):
        before = path.stat().st_size
        total_before += before

        if path.suffix.lower() == ".png":
            target = path.with_suffix(".jpg")
        else:
            target = path

        with Image.open(path) as im:
            w, h = im.size
            needs_resize = max(w, h) > MAX_EDGE
            needs_reencode = before > SKIP_UNDER or path.suffix.lower() == ".png"

            if not needs_resize and not needs_reencode:
                total_after += before
                continue

            im = im.convert("RGB")
            if needs_resize:
                im.thumbnail((MAX_EDGE, MAX_EDGE), Image.LANCZOS)
            im.save(target, "JPEG", quality=QUALITY, optimize=True, progressive=True)

        after = target.stat().st_size
        total_after += after
        if target != path:
            path.unlink()
        print(
            f"{target.name:26} {w}x{h} -> {im.size[0]}x{im.size[1]}  "
            f"{before:>12,} -> {after:>9,}"
        )

    print(f"\ntotal {total_before:,} -> {total_after:,} bytes")


if __name__ == "__main__":
    main()
