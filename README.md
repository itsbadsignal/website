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
