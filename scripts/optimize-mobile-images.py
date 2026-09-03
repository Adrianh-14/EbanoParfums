"""Create delivery-sized copies; keep all original artwork unchanged."""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
jobs = [
    ("tree.png", "tree-mobile.webp", (960, 960), 74),
    ("tree.png", "tree-desktop.webp", (1536, 1536), 82),
    ("logo-horizontal.webp", "logo-mobile.webp", (440, 440), 86),
    ("favicon.png", "brand-mark.webp", (96, 96), 86),
]

for source, destination, bounds, quality in jobs:
    with Image.open(root / source) as original:
        optimized = original.copy()
        if source == "tree.png":
            # The site already uses a black background; flattening avoids a large
            # alpha channel without changing its appearance on that background.
            canvas = Image.new("RGBA", optimized.size, (11, 11, 11, 255))
            optimized = Image.alpha_composite(canvas, optimized.convert("RGBA")).convert("RGB")
        optimized.thumbnail(bounds, Image.Resampling.LANCZOS)
        optimized.save(root / destination, "WEBP", quality=quality, method=6)
        print(f"{destination}: {optimized.width}x{optimized.height}, {(root / destination).stat().st_size:,} bytes")
