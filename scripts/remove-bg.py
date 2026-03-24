#!/usr/bin/env python3
"""Remove white background from images using flood-fill from edges."""
import sys
from pathlib import Path
from PIL import Image

TOLERANCE = 30  # how close to white a pixel must be to count as background

def is_bg(pixel, tol):
    """Check if pixel is close to white."""
    if len(pixel) == 4:
        r, g, b, a = pixel
        if a == 0:
            return True
    else:
        r, g, b = pixel[:3]
    return r >= 255 - tol and g >= 255 - tol and b >= 255 - tol

def flood_fill_transparent(img, tolerance):
    """Flood-fill white pixels from edges, making them transparent."""
    img = img.convert("RGBA")
    w, h = img.size
    pixels = img.load()
    visited = set()
    queue = []

    # seed from all edge pixels
    for x in range(w):
        queue.append((x, 0))
        queue.append((x, h - 1))
    for y in range(h):
        queue.append((0, y))
        queue.append((w - 1, y))

    while queue:
        x, y = queue.pop()
        if (x, y) in visited:
            continue
        if x < 0 or x >= w or y < 0 or y >= h:
            continue
        visited.add((x, y))
        if not is_bg(pixels[x, y], tolerance):
            continue
        pixels[x, y] = (0, 0, 0, 0)
        queue.append((x + 1, y))
        queue.append((x - 1, y))
        queue.append((x, y + 1))
        queue.append((x, y - 1))

    return img

def main():
    if len(sys.argv) < 2:
        print("Usage: remove-bg.py <image.png> [image2.png ...]")
        print("       remove-bg.py --all  (process all in assets/images/library/)")
        sys.exit(1)

    if sys.argv[1] == "--all":
        script_dir = Path(__file__).resolve().parent
        library = script_dir.parent / "assets" / "images" / "library"
        files = sorted(library.glob("*.png"))
    else:
        files = [Path(f) for f in sys.argv[1:]]

    sys.setrecursionlimit(10_000_000)

    for path in files:
        if not path.exists():
            print(f"SKIP: {path} not found")
            continue
        img = Image.open(path)
        result = flood_fill_transparent(img, TOLERANCE)
        result.save(path, "PNG")
        print(f"OK: {path.name}")

if __name__ == "__main__":
    main()
