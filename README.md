# miguelc — personal site

A quiet, text-first journal: one monospace face, a narrow centred column on pure
white, thin rules, and a numbered log of posts grouped by year, each with a cover
and a short excerpt. Astro builds it to plain HTML and CSS. The only
JavaScript shipped is `public/prank.js` (see "The prank" below). Posts are
Markdown with syntax highlighting, math, tags and RSS.

## Running it

```sh
npm install
npm run dev        # http://localhost:4321 (drafts visible)
npm run build      # -> dist/
npm run preview    # serve the built output
npm run check      # type + frontmatter schema errors
```

## Writing a post

Create `src/content/blog/<slug>.md` — the filename becomes the URL
(`/blog/<slug>`).

```markdown
---
title: 'Classic stack overflow to ret2libc'
description: 'One sentence, shown on cards, in <meta> and in the feed.'
pubDate: 2026-08-14
tags: ['ctf', 'pwn']
draft: false   # true hides it from the built site, but not from `npm run dev`
math: false    # true loads KaTeX CSS on this post only
cover: ./cover.jpg          # optional thumbnail, kept beside the post
coverAlt: 'What the image shows'
---
```

`title`, `description` and `pubDate` are required — `npm run check` fails on a
malformed frontmatter block rather than building something broken.

Tag pages are generated from whatever tags you use. There is no list to maintain;
inventing a tag creates `/tags/<tag>` on the next build.

### Covers

`cover` is the post's image in every list and its banner on the post page. It
needs the post to be a folder (`src/content/blog/<slug>/index.md` + `cover.jpg`).
Both are cropped to 16:9. The log shows `description` as the excerpt, clamped
to two lines. A post without a cover gets a striped pattern
generated from its slug (`coverPattern` in `src/lib/posts.ts`), so it never
looks broken and never changes between builds.

### Generating a cover

Covers are generated with ChatGPT using the prompt below, so they match the
logo: 1-bit black on white, drawn as scanlines, with a slight glitch. Fill in
the three bracketed lines for each post:

```
Create a cover image for a blog post. Follow the style rules exactly.

POST
Title: [POST TITLE]
Summary: [ONE OR TWO SENTENCES ABOUT THE POST]
Subject to depict: [ONE CONCRETE OBJECT OR IDEA, e.g. "a padlock", "a stack of memory blocks", "a broken chain", "a radio antenna"]

STYLE RULES
- Format: landscape 16:9 (1792x1024). The image will be cropped to 16:9, so keep the subject in the middle 80%.
- Palette: pure white background (#FFFFFF) and solid black ink (#111111) only. No grey fills, no gradients, no shadows, no other colours.
- Rendering: 1-bit pixel art drawn as horizontal scanlines. Build every shape from thin horizontal black bars with small white gaps between them, like an old CRT or a dot-matrix printout. Where shading is needed, use ordered dithering (a checkerboard of black and white pixels), never grey.
- Glitch: one or two horizontal bands of the image slipped a few pixels sideways, and a few stray black pixels leaking off the edges of the subject. Keep it subtle; the subject must still read instantly.
- Composition: one single subject, centred or slightly off-centre, taking up about 30-40% of the frame. Everything else is empty white space. No background scenery, no frame, no border, no vignette.
- Mood: minimal, technical and quiet, like an icon from a 1980s terminal manual that has started to corrupt.
- Strictly no text, letters, numbers, logos, watermarks or signatures anywhere in the image.
- No 3D, no photorealism, no lens effects, no glow, no neon, no cyberpunk cityscapes, no hooded hackers, no green Matrix code.

Output only the image.
```

Save the result beside the post as `cover.png` and add it to the frontmatter:

```yaml
cover: ./cover.png
coverAlt: 'A pixel padlock drawn in scanlines, one band slipped sideways'
```

Tips:

- Pick a physical subject, not an abstract idea. "A key with a missing tooth"
  works better than "authentication bypass". For a CTF writeup, depict the
  core trick: a ladder for privilege escalation, an overflowing cup for a
  buffer overflow, a mask for spoofing.
- If it comes back grey or soft, reply: *"Redo it as strict 1-bit: only
  #FFFFFF and #111111, no anti-aliasing, more visible scanline gaps."*
- If it adds text, reply: *"Same image, remove every letter and number."*
- To keep a series consistent, attach a previous cover to a new chat and start
  with *"Match the exact style of this image"* before the prompt.

### Images

For a post with images, make it a folder and reference them relatively:

```
src/content/blog/my-writeup/
  index.md
  disassembly.png
```

```markdown
![Alt text describing the screenshot](./disassembly.png)
```

Astro optimizes and lazy-loads these at build time. Images in `public/` are served
**unoptimized** — keep post images beside the post.

### Code and math

Fenced blocks are highlighted by Shiki's `github-light` theme, with the colours
inlined at build time.

With `math: true`, `$inline$` and `$$display$$` render via KaTeX.

## The prank

`public/prank.js` is loaded with `is:inline`, so Astro never bundles it. It is
the only script on the site. If a visitor sits idle for 45s, the page glitches,
then a fake terminal "defaces" the site and counts down to a wipe. Any click or
key (or the end of the countdown) reveals that it's a joke and points them to
disable-javascript.org. It runs once per browser session, never on the 404 page
(`prank={false}` on `BaseLayout`), and skips the glitch under
`prefers-reduced-motion`.

Append `?prank` to any URL to fire it after 3s, ignoring the once-per-session
guard.

Identity, menu links and the "now" box live in `src/lib/site.ts`.

## Theming

`src/styles/tokens.css` is the single source of colour: white, near-black, grey, one link blue.
Light only, with no dark mode. Nothing else in the codebase should contain a
literal hex value. Rules are `var(--rule)` (1px solid), and there are no
shadows.

## Deploying to Cloudflare Pages

1. Push to a Git remote.
2. Cloudflare dashboard → Workers & Pages → Create. **Do not take the default
   button.** The create flow leads to a *Worker*, and a Worker is served from
   `<name>.<account-subdomain>.workers.dev`, never from `.pages.dev`. Pick the
   **Pages** tab, then "Connect to Git".
3. Name the project **`miguelc`**. The name decides the project's default
   `.pages.dev` URL. `site` in `astro.config.mjs` points at the custom domain
   instead (step 6), so the project name does not affect the build.
4. Build command `npm run build`, output directory `dist`. Node comes from
   `.nvmrc` (22) — Astro 7 refuses anything below 22.12, and the build image's
   own default is older than that.
5. If a Worker for this repo already exists, delete it. Two origins serving the
   same HTML is worth avoiding, and it is one less thing to redeploy by mistake.
6. The site is served from the custom domain `miguelc.space` (registered at
   Spaceship, DNS on Cloudflare, attached under the Pages project's Custom
   domains), and `site` is set to it. The project's default `.pages.dev` address
   still serves the same build, but canonical links point at the custom domain.

`site` is the one setting that cannot be wrong: canonical links, `sitemap-0.xml`
and `rss.xml` are all absolute URLs derived from it, and nothing in the build
warns you when it points at the wrong origin.

`public/_headers` sets caching for the fingerprinted assets and two conservative
security headers. It is Cloudflare-specific; on another host it is inert and the
equivalent lives in that host's own config. There is deliberately no
`Content-Security-Policy` — Astro emits inline scripts and styles, so a careless
one would break the page rather than protect it.

## Accessibility notes

- The prank overlay is a modal dialog: it takes focus when it opens, the reveal
  focuses the close button, Esc closes it, and focus returns to where it was.
- `prefers-reduced-motion` drops the glitch and the typing animation.
- The layout is one column at every width; the menu wraps as plain links.
