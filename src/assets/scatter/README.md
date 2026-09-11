# Scatter imagery

**These images carry all of the site's colour.** Everything else — type, brackets,
grid, rules — is deliberately monochrome and driven by `src/styles/tokens.css`. If
this folder is empty the landing page reads as sterile rather than chaotic, which is
the single easiest way to lose the reference site's character.

The five files here are **placeholders**. Swap them for real personal imagery:
a terminal capture, a disassembly pane, a debugger session, ASCII art, a photo,
a screenshot of something you built. Anything with colour and personality.

## Swapping an image

1. Drop the file in this folder (`.png`, `.jpg`, `.gif`, `.webp`).
2. Open `src/components/ChaosLayer.astro` and point the matching entry's `src`
   at the new filename.

Astro optimizes and lazy-loads everything in `src/assets/`, including animated GIFs
(left unprocessed so the animation survives). Files dropped in `public/` are **not**
optimized — keep scatter imagery here.

## Positioning

Each entry in `SCATTER` carries `x` / `y` as viewport percentages, plus optional
`rotate`, `opacity`, `width` and `priority`. Moving an image is a one-line edit —
there are no per-element CSS rules to hunt down.

`priority` controls responsive culling, which matters most for images since they take
the most space:

- `1` — always shown
- `2` — hidden below 640px
- `3` — hidden below 900px

## Sizing

Aim for 250–450px wide on screen at `opacity: 0.4–0.8`. They should sit *in* the
background, not on top of it — readable as texture, not as content.
