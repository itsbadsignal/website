# Scatter imagery

The landing page is deliberately sparse: monochrome type, a faint grid, corner
brackets, and **one** image — an ASCII rendering of a portrait in the top-right
corner, knocked back with `opacity` so it reads as texture rather than as content.

It was busier once (five scattered screenshots, and later the photo with the ASCII
version below it). That was dropped on purpose. Adding images back turns the
background into collage and the page loses the quiet it has now, so add a second
one only deliberately.

## How the ASCII portrait is made

`portrait.jpg` is the source: a grayscale subject on a solid white ground. It is
not shown on the page. `ascii.png` is rendered from it by
`scripts/ascii-portrait.py` (run it from the repo root; the setup is in its
docstring), in the site's mono face, light glyphs on a transparent ground.

The glyphs trace the photo's *light* parts inside the silhouette (cap brim, the
glitch streaks, the lit ear), because on a dark page it is the light that reads.
The dark mass keeps a floor of sparse glyphs so the silhouette still holds.

## Swapping the portrait

Replace `portrait.jpg` with another subject on a plain white ground and re-run the
script. A strong silhouette matters more than detail: at 80 columns only the big
light and dark shapes survive.

To put a plain image in the corner instead, drop it in this folder and point the
`IMAGES` entry's `src` in `src/components/ChaosLayer.astro` at it. Art that is dark
on transparency needs `subject: 'dark'`, which `chaos.css` inverts so it does not
vanish into the ground.

Astro optimizes and lazy-loads everything in `src/assets/`, including animated GIFs
(left unprocessed so the animation survives). Files dropped in `public/` are **not**
optimized — keep scatter imagery here.

## Positioning

Each entry in `IMAGES` carries `x` / `y` as viewport percentages, plus optional
`rotate`, `opacity`, `width` and `priority`. Moving an image is a one-line edit —
there are no per-element CSS rules to hunt down.

`priority` controls responsive culling:

- `1` — always shown
- `2` — hidden below 640px
- `3` — hidden below 900px

## Sizing

Aim for 250–450px wide on screen. Opacity is the lever that keeps it in the
background. Watch the interaction with the art's own alpha: the glyphs in
`ascii.png` cover only ~5% of the image, so it takes a high `opacity` (0.7) to
register at all.
