# miguel / badsignal — personal site

A chaotic landing page over a real blog engine. Astro, static output, no runtime
framework. The landing is a fixed "chaos layer" that fades out as you scroll into
clean, readable content; writeups are Markdown with syntax highlighting, math,
tags and RSS.

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
---
```

`title`, `description` and `pubDate` are required — `npm run check` fails on a
malformed frontmatter block rather than building something broken.

Tag pages are generated from whatever tags you use. There is no list to maintain;
inventing a tag creates `/tags/<tag>` on the next build.

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

Fenced blocks are highlighted by Shiki with a light and a dark theme, and follow
the theme toggle with no JavaScript. Every block gets a copy button.

With `math: true`, `$inline$` and `$$display$$` render via KaTeX.

## The chaos layer

`src/components/ChaosLayer.astro` holds a `SCATTER`-style array of text and image
items positioned by viewport percentage:

```ts
{ kind: 'text', content: 'segfault is just feedback', x: 14, y: 22, priority: 1 }
```

Moving or adding an element is a one-line data edit — there are no per-element CSS
rules. `priority` drives responsive culling: `3` is hidden below 900px, `2` below
640px, `1` always shows.

**`src/assets/scatter/` is the only colour on the site.** Everything else is
monochrome by design. The five files there are placeholders — swap them for real
screenshots, ASCII art, or photos. See that folder's README.

Identity and links live in `src/lib/site.ts`.

## Theming

`src/styles/tokens.css` is the single source of colour. Dark is the base; light is
an override, selected by `prefers-color-scheme` or forced by the toggle. Nothing
else in the codebase should contain a literal hex value.

## Deploying to Cloudflare Pages

1. Push to a Git remote.
2. Cloudflare dashboard → Workers & Pages → create → Pages → connect the repo.
3. Name the project **`miguelc`**. The name decides the URL, and `site` in
   `astro.config.mjs` is already set to `https://miguelc.pages.dev` to match. If
   the name is taken and Cloudflare assigns a different one, update `site` and
   redeploy, or the sitemap, RSS and canonical links all point somewhere wrong.
4. Build command `npm run build`, output directory `dist`. Node comes from
   `.nvmrc` (22) — Astro 7 refuses anything below 22.12, and the build image's
   own default is older than that.
5. Add a custom domain when you have one, then update `site` again.

`site` is the one setting that cannot be wrong: canonical links, `sitemap-0.xml`
and `rss.xml` are all absolute URLs derived from it, and nothing in the build
warns you when it points at the wrong origin.

`public/_headers` sets caching for the fingerprinted assets and two conservative
security headers. It is Cloudflare-specific; on another host it is inert and the
equivalent lives in that host's own config. There is deliberately no
`Content-Security-Policy` — Astro emits inline scripts and styles, so a careless
one would break the page rather than protect it.

## Accessibility notes

Worth preserving if you edit the chaos layer:

- `.chaos` is `aria-hidden` and `pointer-events: none`. Keep focusable elements
  out of it — the social links are deliberately a sibling, not a child.
- `prefers-reduced-motion` halts the scan line, the pulse, and the cursor trail.
- The cursor trail also never starts on touch devices, and its rAF loop stops
  when the hero scrolls out of view.
