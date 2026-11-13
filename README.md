# miguelc — personal site

Hand-written HTML. One small stylesheet (`style.css`), one font, one script
(`prank.js`). No framework, no build step, no package.json: the files in this
repository are the files the browser gets.

Design: black page, warm white text (`#edeae6`), muted gold (`#c8b99a`,
deep `#8a7a5a`). Poppins for reading, JetBrains Mono for labels.

- **Front page** (`index.html`): a full-screen framed hero after joeyz.space:
  grid background, corner brackets, the four "now" columns, "miguel" set large
  with blurred echoes, a faded ASCII portrait top right (`.portrait`), a
  corrupted block of ▓▒░ characters and a signal wave, two quotes (Feynman, Fischer), a ▶ button
  that runs the prank (`/?prank`) and faint shapes, then a dated feed of posts
  beside an index of every page.
- **Blog, writeups, tags** after zerodayengineering.com/research: logo and
  uppercase `BLOG / WRITEUPS / …` nav, a big gold centred title, uppercase
  topic links, and entries with `author | date | tags |`, gold title,
  summary, `—— Read more` and the cover on the right.
- **Posts** end with a Metadata block and a `‹ Newer / Older ›` pager.

## Running it locally

Any static server, from the repo root:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploying (Cloudflare Pages)

In the Pages project settings: **Framework preset: None**, **Build command:
empty**, **Build output directory: `/`**. `_headers` and `404.html` are picked
up automatically.

## Layout

```
index.html                 home: lede, now, latest posts
blog/index.html            every post
blog/<slug>/index.html     a post (+ its cover.png)
writeups/ roadmap/ tags/ now/ projects/ dotfiles/ library/ hacking/ about/ contact/
404.html  rss.xml  sitemap.xml
style.css  prank.js  mark.svg  favicon.svg  fonts/  og.png  .well-known/
```

Every page uses the same `<head>`, `<header>` and `<footer>`. Copy them from
any existing page.

## Writing a post

1. Copy `blog/one-script-and-its-a-prank/` to `blog/<new-slug>/`.
2. In the new `index.html` change: `<title>`, the `description` / `og:*`
   meta tags, the `canonical` link, the `.meta` line, the `<h1>`, the italic
   `.lede`, the body, the Metadata block and the pager. Body is plain HTML:
   `<p>`, `<h2>`, `<h3>`, `<ul>`, `<pre><code>`, `<table>`, `<blockquote>`.
3. Replace `cover.png` (640×360, black-and-white dithered) or delete the
   `<img class="cover">`.
4. Copy an `<article class="entry">` block to the top of `blog/index.html`
   (and `writeups/index.html` if tagged ctf or writeup, and each
   `tags/<tag>/index.html`) and edit it. A new tag needs a new `tags/<tag>/`
   folder and a link in every page's `.filters` and in `tags/index.html`.
5. On the front page, add an `<article>` to the top of the `.log` feed.
6. Update the previous post's pager, then add an `<item>` to the top of
   `rss.xml` and a `<url>` to `sitemap.xml`.

## Tracking the roadmap

`roadmap/index.html` is the OSVR roadmap: one badge per milestone, top to
bottom, and each one opens to show its steps. Progress lives in the HTML, so
visitors see what you have pushed. Edit it by hand:

- **Tick a step:** change `<li>` to `<li class="done">`.
- **Earn a badge:** change `<details class="badge">` to
  `<details class="badge done">` (side badges keep `side`:
  `class="badge side done"`).
- **Move the current badge:** the one you are working on has `now`. Take it
  off the old one and add it to the next.

The "x / 18 badges · y steps done" line at the top counts the `done` marks by
itself (CSS counters), so there is no number to update.

## The prank

`prank.js` is the only JavaScript. Sit idle on any page for 45 seconds and
the site "gets defaced": it glitches, a fake terminal announces a breach and a
wipe countdown, and any click or key reveals the joke and a nudge to disable
JavaScript by default. It fires once per browser session; `?prank` in the URL
fires it after 3 seconds for testing. Its styles live inside the script. The
404 page leaves it out.

## Style rules

- Colours: `#000` page, `#edeae6` text, `#8f8c88` dim, `#c8b99a` gold for
  links, labels and hovers, `#8a7a5a` deep gold for big titles. Nothing else.
- The mark (`mark.svg`) is an open eye inside a square frame. `favicon.svg`
  is the same drawing on black.
- No motion. The front page's scattered pieces hide below 800px wide.
