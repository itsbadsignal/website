# miguelc.space

Plain HTML on a black page: one stylesheet, one script (`prank.js`, the idle
prank), no framework, no trackers. The `.html` files in this repo are what the
browser gets.

## Editing

Content lives in `content/`; `build.mjs` wraps it in the shared head, header
and footer and writes the pages. Plain Node, no packages:

```sh
node build.mjs
```

Commit the source and the generated files together. The server never builds.

| To change | Edit |
| --- | --- |
| menu, now, library, site name | `content/site.mjs` |
| about, projects, setup, wetware, 404 | `content/pages/<name>.html` |
| the front-page frame | `content/home.html` |
| the roadmap | `content/roadmap.mjs` |
| the look | `style.css` |

Each page and post starts with a small header, then plain HTML:

```html
<!--
title: Post title
description: One sentence, used in lists, previews and the feed.
date: 2026-11-20
tags: ctf, pwn
cover: cover.png
coverAlt: What the image shows.
-->
<p>The post.</p>
```

## Writing a post

1. Add `content/posts/<slug>.html`. The file name is the URL: `/blog/<slug>/`.
2. Put its cover, if any, at `blog/<slug>/cover.png` (1200×627, also the
   LinkedIn preview).
3. Run `node build.mjs`. Blog, tags, front page, RSS and sitemap update.

## The roadmap

Progress lives in `content/roadmap.mjs`, then `node build.mjs`:

- **earn a badge:** set its `state` to `'done'`; the one in progress is `'now'`
- **tick a resource:** add `true` as its fourth item: `['Modern C', 'https://…', 'free', true]`
- **tick a final-project step:** write it as `['the step', true]`

The counts on `/roadmap/` update themselves.

## Running it locally

```sh
python3 -m http.server 8000
```

## Deploying (Cloudflare Pages)

Framework preset **None**, build command empty, output directory `/`.
`_headers` sets security and cache headers; `_redirects` sends retired
addresses (`/hacking/`, `/contact/`, `/writeups/`, `/dotfiles/`, the old post)
to their replacements.

## Style

Black page, warm white text `#edeae6`, muted gold `#c8b99a` / `#8a7a5a`.
Poppins for text, Cormorant Garamond for post titles, JetBrains Mono for
labels. Fonts are self-hosted under `fonts/` with their licences.
