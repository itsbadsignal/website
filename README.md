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
npm run new -- "Title"   # start a draft post, print the cover prompt
npm run cover      # newest image in ~/Downloads -> cover of the newest post
```

## Writing a post

Three steps, two of them commands:

```sh
npm run new -- "Classic stack overflow to ret2libc" --tags ctf,pwn
```

This creates `src/content/blog/classic-stack-overflow-to-ret2libc/index.md`
as a draft dated today, prints the cover prompt with the title filled in, and
copies it to the clipboard (via `wl-copy`, `xclip` or `pbcopy`, whichever is
installed; `--no-copy` skips it). The folder name is the slug and the URL:
`/blog/classic-stack-overflow-to-ret2libc`.

Then:

1. **Make the cover image.** In ChatGPT, paste the prompt, fill in the
   `Subject:` line with one physical object, and download the image. Or use a
   photo of your own.
2. **Turn it into the cover:**

   ```sh
   npm run cover -- --alt "A padlock hanging on a chain-link fence"
   ```

   With no file or slug, this takes the **newest image in `~/Downloads`** and
   the **most recently edited post**, dithers the image into
   `cover.png` beside the post, and adds `cover` and `coverAlt` to its
   frontmatter. It prints which photo and post it used.
3. **Write the post**, fill in `description`, and set `draft: false` when it's
   ready.

The frontmatter it starts you with:

```markdown
---
title: 'Classic stack overflow to ret2libc'
description: 'One sentence, shown in lists, in <meta> and in the feed.'
pubDate: 2026-08-14
tags: ['ctf', 'pwn']
draft: true    # hides it from the built site, but not from `npm run dev`
cover: ./cover.png        # added by `npm run cover`
coverAlt: 'What the image shows'
# math: true   # loads KaTeX CSS on this post only
---
```

`title`, `description` and `pubDate` are required: `npm run check` fails on a
malformed frontmatter block rather than building something broken.

Tag pages are generated from whatever tags you use. There is no list to
maintain; inventing a tag creates `/tags/<tag>` on the next build. Posts tagged
`ctf` or `writeup` also appear on `/writeups`.

### Covers

`cover` is the post's image in every list and its banner on the post page.
Every cover is a **1-bit dithered photo**: pure black-and-white dots, like an
early Mac screen or a newspaper halftone. Whatever the subject, they share one
texture and match the site.

`npm run cover` crops to 16:9 (finding the subject), converts to greyscale and
dithers to 640x360. Re-running replaces the cover, so adjust and run again
until it looks right:

| Option | Does |
| --- | --- |
| `--alt "..."` | Sets `coverAlt`. Without it an existing one is kept, or a TODO is written |
| `--white 0.6` | Brighter. Lower is brighter; dark photos usually want 0.5–0.7. Default 0.85 |
| `--black 0.15` | Deeper shadows. Default 0.05 |
| `--focus centre` | Crop position: `attention` (default), `entropy`, `centre`, `north`, `south`, `east`, `west` |

It also reports how much of the cover is black and suggests `--white` or
`--black` when it's too dark or too pale. To use a specific photo or post
instead of the newest ones, pass either or both:
`npm run cover -- ~/Pictures/desk.jpg my-post-slug`.

Covers are served at their own size with crisp pixel scaling, never resized
or converted, since resampling turns the dots into grey mush. A post without
a cover gets a striped pattern generated from its slug (`coverPattern` in
`src/lib/posts.ts`).

### The cover prompt

The prompt lives in `scripts/cover-prompt.txt`, which `npm run new` prints;
edit it there. It asks for a black-and-white documentary photo of one object
in hard side light. Dithering hides most of what makes generated images look
generated, and contrast plus a clear silhouette are what survive it.

Tips:

- Pick an object you could actually photograph. "A key on a table, lit from
  the side" beats "authentication bypass". Better still, photograph your own
  desk, board or book: covers from your own camera fit best of all.
- If the dithered result is a dark blob, ask ChatGPT for "brighter, more white
  space around the subject", or re-run with `--white 0.6`.
- If it adds text, reply: *"Same photo, remove every letter and number."*

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
