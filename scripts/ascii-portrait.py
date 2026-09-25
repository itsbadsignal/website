"""Render src/assets/scatter/portrait.jpg as ASCII art -> ascii.png.

Light glyphs on a transparent ground, in the site's mono face, so it sits on the
dark page the same way the portrait does. Run from the repo root:

    python -m venv .venv && .venv/bin/pip install pillow numpy scipy
    .venv/bin/python scripts/ascii-portrait.py
"""
from PIL import Image, ImageDraw, ImageFont, ImageOps
import numpy as np
from scipy import ndimage

SRC = 'src/assets/scatter/portrait.jpg'
OUT = 'src/assets/scatter/ascii.png'
FONT = 'public/fonts/jetbrains-mono-400.woff2'
SIZE = 720  # 2x the 360px display width, so Astro can emit a sharp 2x variant
COLS = 80
RAMP = ' .:-=+*#%@'
INK = (139, 147, 157, 255)

cw = SIZE / COLS
ch = cw * 2.0  # monospace cells are about twice as tall as they are wide
ROWS = int(SIZE / ch)
font = ImageFont.truetype(FONT, round(cw / 0.6))  # JetBrains Mono advance is 0.6em

g = np.asarray(ImageOps.autocontrast(Image.open(SRC).convert('L'), cutoff=1), dtype=float) / 255

# Silhouette: everything that is not the white ground, holes filled.
sil = ndimage.binary_fill_holes(ndimage.binary_closing(g < 0.9, iterations=4))


def cells(a):
    return np.asarray(Image.fromarray((a * 255).astype(np.uint8)).resize((COLS, ROWS), Image.BOX), dtype=float) / 255


cover = cells(sil.astype(float))
# The photo's edges are soft and light, and cells on the edge would also average
# in the white ground, drawing a bright outline. Sample from just inside instead.
core = ndimage.binary_erosion(sil, iterations=6)
lum = cells(g * core) / np.maximum(cells(core.astype(float)), 1e-6)

# The page is dark, so glyphs carry the photo's light: brightness inside the
# silhouette sets the density, with a floor so the dark mass still reads as shape.
img = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
oy = (SIZE - ROWS * ch) / 2
for r in range(ROWS):
    for c in range(COLS):
        if cover[r, c] < 0.5:
            continue
        v = 0.12 + 0.88 * min(1, lum[r, c] * 1.6)
        d.text((c * cw, oy + r * ch), RAMP[min(len(RAMP) - 1, int(v * len(RAMP)))], font=font, fill=INK)
img.save(OUT)
