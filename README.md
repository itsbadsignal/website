# miguelc — personal site

Hand-written HTML. One small stylesheet (`style.css`), one font, one script
(`prank.js`). No framework, no build step, no package.json: the files in this
repository are the files the browser gets.

Design: black page, warm white text (`#edeae6`), one muted gold (`#c8b99a`,
deep `#8a7a5a`), JetBrains Mono. Structure borrowed from minimal personal
blogs: name left and four links right, a "latest" post, a dense
`year · month  title` archive, an index of every page, a JS warning bar on top
and a centred footer.

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
   meta tags, the `canonical` link, the `<h1>`, the date line, the italic
   `<p class="lede">` summary, the body and the metadata block. Body is plain
   HTML: `<p>`, `<h2>`, `<h3>`, `<ul>`, `<pre><code>`, `<table>`,
   `<blockquote>`, `<mark>` for an inverted highlight. No classes needed.
3. Replace `cover.png` (640×360, black-and-white dithered) or delete the
   `<img class="cover">`.
4. On the home page, point the **latest** section at the new post and add it
   to the top of the **posts** list. Add the same line to `blog/index.html`
   (and `writeups/index.html` if tagged ctf or writeup):

   ```html
   <li><span>2026 · 11</span> <a href="/blog/new-slug/">title in lowercase</a></li>
   ```

5. For each tag, add the line to `tags/<tag>/index.html` (copy an existing
   tag folder for a new tag) and update the count in `tags/index.html`.
6. Update the previous post's `.pager` to link forward to the new one.
7. Add an `<item>` to the top of `rss.xml` and a `<url>` to `sitemap.xml`.

## The prank

`prank.js` is the only JavaScript. Sit idle on any page for 45 seconds and
the site "gets defaced": it glitches, a fake terminal announces a breach and a
wipe countdown, and any click or key reveals the joke and a nudge to disable
JavaScript by default. It fires once per browser session; `?prank` in the URL
fires it after 3 seconds for testing. Its styles live inside the script. The
404 page leaves it out.

## Style rules

- Colours: `#000` page, `#edeae6` text, `#8f8c88` for `.dim` and the italic
  `.lede`, `#c8b99a` gold for section labels and hovers, `#8a7a5a` for link
  underlines, the warning bar and the title cursor. Nothing else.
- `<h2>` on its own is a small gold section label (`latest`, `posts`);
  inside `<article>` it is a 26px heading.
- Lists of posts use `<ul class="posts">`; column blocks use
  `<div class="cols">` with an `<h3>` and a `<p>` per column.
