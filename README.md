# miguelc — personal site

Hand-written HTML. One 38-line stylesheet (`style.css`), one font, one script
(`prank.js`). No framework, no build step, no package.json: the files in this
repository are the files the browser gets.

Design: **badsignal brutal**. Black page, white ink, one gold accent
(`#e6b422`), JetBrains Mono everywhere, 1px rules, no rounding, no shadows.

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
writeups/ tags/ now/ projects/ dotfiles/ library/ hacking/ about/ contact/
404.html  rss.xml  sitemap.xml
style.css  prank.js  logo.svg  favicon.svg  fonts/  og-v2.png  .well-known/
```

Every page uses the same `<head>`, `<header>` and `<footer>`. Copy them from
any existing page.

## Writing a post

1. Copy `blog/one-script-and-its-a-prank/` to `blog/<new-slug>/`.
2. In the new `index.html` change: `<title>`, the `description` / `og:*`
   meta tags, the `canonical` link, the `<h1>`, the date line, and the body.
   Use plain HTML: `<p>`, `<h2>`, `<h3>`, `<ul>`, `<pre><code>`, `<table>`,
   `<blockquote>`. No classes needed.
3. Replace `cover.png` (a 640×360 black-and-white dithered image) or delete the `<img class="cover">`.
4. Add a row to the post table in `index.html` and `blog/index.html` (and
   `writeups/index.html` if tagged ctf or writeup), newest first. The number is
   the post's permanent count: the next one is `002`.
5. For each tag, add the row to `tags/<tag>/index.html` (copy an existing tag
   folder for a new tag) and update the count in `tags/index.html`.
6. Add an `<item>` to the top of `rss.xml` and a `<url>` to `sitemap.xml`.

A post row looks like this:

```html
<tr><td><small>2026-11-20</small></td><td><small>002</small></td><td><a href="/blog/new-slug/">Title</a></td><td><small><a href="/tags/ctf/">#ctf</a></small></td></tr>
```

## The prank

`prank.js` is the only JavaScript. Sit idle on any page for 45 seconds and
the site "gets defaced": it glitches, a fake terminal announces a breach and a
wipe countdown, and any click or key reveals the joke and a nudge to disable
JavaScript by default. It fires once per browser session; `?prank` in the URL
fires it after 3 seconds for testing. Its styles live inside the script. The
404 page leaves it out.

## Style rules

- Colours: `#000` page, `#fff` text and rules, `#8a8a8a` for `<small>` and
  markers, `#e6b422` gold for links in text, the current page and selection.
  Nothing else.
- Everything is 15px except `<h1>` (28px). Headings stand out by weight, a
  grey `##` and a rule.
- Secondary text goes in `<small>`. Lists of things go in a `<table>`.
