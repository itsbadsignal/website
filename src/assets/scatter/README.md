# Scatter imagery

The landing page is deliberately sparse: monochrome type, a faint grid, corner
brackets, and **one** image — a portrait in the top-right corner, knocked back with
`opacity` so it reads as texture rather than as content.

It was busier once (five scattered screenshots carrying all of the page's colour).
That was dropped on purpose. Adding images back turns the background into collage
and the page loses the quiet it has now, so add a second one only deliberately.

## How the portrait was made

`portrait.jpg` is the untouched source: a grayscale subject on a solid white ground.
`portrait.png` is what the page actually imports — the same image with the white
knocked out to transparency, so it composites over the page rather than sitting in
a white box:

```sh
ffmpeg -i portrait.jpg -vf \
  "format=rgba,geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='255-(0.299*r(X,Y)+0.587*g(X,Y)+0.114*b(X,Y))'" \
  portrait.png
```

Alpha is set from luminance rather than keyed on an exact colour, which is what keeps
the edges soft — a hard `colorkey` leaves JPEG ringing around the silhouette.

The site is dark only, and this subject is dark, so it would be black on near-black.
Each entry declares a `subject` tone and `chaos.css` inverts the dark ones.
`filter: invert()` leaves alpha alone, so the knockout survives.

The source is only 400x400, which caps the useful display width at ~260px (Astro
emits 260w and 400w and will not invent detail). Supply a larger source before
scaling it up.

## Swapping the portrait

1. Drop the file in this folder (`.png`, `.jpg`, `.gif`, `.webp`).
2. Open `src/components/ChaosLayer.astro` and point the `IMAGES` entry's `src`
   at the new filename.

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
background. Watch the interaction with the art's own alpha: `ascii.png` is only
~20% opaque to begin with, so it carries a much higher `opacity` than the portrait
to land at a comparable weight.
