// Builds the site's HTML from content/. Plain Node, no packages: `node build.mjs`.
// The output is committed, so the server never builds anything.
import fs from 'node:fs';
import { SITE, NAME, AUTHOR, DESC, MENU, NOW, BOOKS } from './content/site.mjs';
import { ROADMAP, ICONS } from './content/roadmap.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const write = (file, text) => {
  fs.mkdirSync(file.split('/').slice(0, -1).join('/') || '.', { recursive: true });
  fs.writeFileSync(file, text);
};
// A content file: a leading <!-- key: value --> block, then the HTML body.
const read = (file) => {
  const src = fs.readFileSync(file, 'utf8');
  const [, head, body] = /^<!--\n([\s\S]*?)\n-->\n([\s\S]*)$/.exec(src);
  const meta = Object.fromEntries(head.split('\n').map((l) => [l.slice(0, l.indexOf(':')), l.slice(l.indexOf(':') + 1).trim()]));
  return { ...meta, body: body.trim() };
};
const MONTHS = 'January February March April May June July August September October November December'.split(' ');
const longDate = (d) => {
  const [y, m, day] = d.split('-').map(Number);
  const sfx = [11, 12, 13].includes(day) ? 'th' : { 1: 'st', 2: 'nd', 3: 'rd' }[day % 10] || 'th';
  return `${MONTHS[m - 1]} ${day}${sfx}, ${y}`;
};

// ---- the page shell ----
const SOURCE_NOTE = `<!--

          ██████████
        ██████████████
      ██████████████████
        ████    ██    ████
      ████    ██    ████
      ██████████████████
    ██████  ██████
          ██████████
          ██  ██  ██

    you opened the source. good instinct.

    no frameworks, no trackers, no cookies.
    every page is plain html. the only script is /prank.js.
    read it before it reads you.

    found a bug? /.well-known/security.txt

-->`;

const head = ({ title, desc = DESC, route, image = '/og.png', note = false }) => {
  const full = title ? `${title} — ${NAME}` : NAME;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(full)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE}${route}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="alternate" type="application/rss+xml" title="${NAME}" href="/rss.xml">
<link rel="stylesheet" href="/style.css">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(full)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE}${route}">
<meta property="og:image" content="${SITE}${image}">
<meta name="twitter:card" content="summary_large_image">
</head>${note ? `\n${SOURCE_NOTE}` : ''}`;
};
const header = (route) => `<header class="top">
  <a href="/" class="mark"><img src="/mark.svg" width="64" height="64" alt="${NAME}, home"></a>
  <nav aria-label="Menu">
${MENU.map((col) => `    <div>${col.map(([l, h]) => `<a href="${h}"${route.startsWith(h) ? ' aria-current="page"' : ''}>${l}</a>`).join('')}</div>`).join('\n')}
  </nav>
</header>`;
const footer = `<footer class="foot">
  <a href="/" class="mark"><img src="/mark.svg" width="64" height="64" alt="${NAME}, home"></a>
  <p><a href="/rss.xml">rss</a></p>
  <p>© 2026 ${NAME}</p>
</footer>`;
const prank = '<div id="pwned" role="dialog" aria-modal="true" aria-label="Site defaced" hidden></div>\n<script src="/prank.js" defer></script>\n';
const page = ({ title, desc, route, image, body, withPrank = true }) => `${head({ title, desc, route, image })}
<body>
${header(route)}
<main>
${body.trim()}
</main>
${footer}
${withPrank ? prank : ''}</body>
</html>
`;
const hero = (title, sub) => `<div class="hero">\n<h1>${esc(title)}</h1>\n<p>${esc(sub)}</p>\n</div>`;
const plain = (route, title, desc, inner, opts = {}) => page({ title, desc, route, ...opts, body: `${hero(title, desc)}\n<article class="post">\n${inner}\n</article>` });

// ---- posts ----
const posts = fs.readdirSync('content/posts').filter((f) => f.endsWith('.html')).map((f) => {
  const p = read(`content/posts/${f}`);
  p.slug = f.replace(/\.html$/, '');
  p.tags = p.tags ? p.tags.split(',').map((t) => t.trim()) : [];
  p.mins = Math.max(1, Math.round(p.body.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length / 200));
  return p;
}).sort((a, b) => b.date.localeCompare(a.date));
const tags = Object.entries(posts.flatMap((p) => p.tags).reduce((c, t) => ({ ...c, [t]: (c[t] || 0) + 1 }), {}))
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
const tagLinks = (p) => p.tags.map((t) => `<a href="/tags/${t}/">${t}</a>`).join(', ');
const meta = (p) => `<p class="meta"><span>${AUTHOR}</span><span><time datetime="${p.date}">${longDate(p.date)}</time></span><span>${tagLinks(p)}</span></p>`;

posts.forEach((p, i) => {
  const newer = posts[i - 1], older = posts[i + 1];
  write(`blog/${p.slug}/index.html`, page({
    title: p.title, desc: p.description, route: `/blog/${p.slug}/`,
    image: p.cover ? `/blog/${p.slug}/${p.cover}` : undefined,
    body: `<article class="post">
${meta(p)}
<h1>${esc(p.title)}</h1>
<p class="lede">${esc(p.description)}</p>
${p.cover ? `<img class="cover" src="${p.cover}" width="1200" height="627" alt="${esc(p.coverAlt || '')}">` : ''}
${p.body}
<section class="metadata">
<h2>Metadata</h2>
<p>Published: <time datetime="${p.date}">${longDate(p.date)}</time></p>
<p>Reading time: ${p.mins} min</p>
<p>Tags: ${tagLinks(p)}</p>
<p>Feed: <a href="/rss.xml">rss</a></p>
</section>
</article>
<nav class="pager">
${newer ? `<a href="/blog/${newer.slug}/">‹ Newer</a>` : '<a href="/blog/">‹ Blog</a>'}
${older ? `<a href="/blog/${older.slug}/">Older ›</a>` : '<span></span>'}
</nav>`,
  }));
});

// ---- blog and tag listings ----
const entry = (p) => `<article class="entry">
<div>
${meta(p)}
<h2><a href="/blog/${p.slug}/">${esc(p.title)}</a></h2>
<p>${esc(p.description)}</p>
<a class="more" href="/blog/${p.slug}/">Read more</a>
</div>
${p.cover ? `<a class="pic" href="/blog/${p.slug}/" tabindex="-1"><img src="/blog/${p.slug}/${p.cover}" width="1200" height="627" alt="${esc(p.coverAlt || '')}"></a>` : '<div></div>'}
</article>`;
const listing = (route, title, sub, desc, current, list) => write(`${route.slice(1)}index.html`, page({ title, desc, route, body: `${hero(title, sub)}
<nav class="filters" aria-label="Topics">
<p><a href="/blog/"${current === 'all' ? ' aria-current="page"' : ''}>all</a></p>
<p>${tags.map(([t]) => `<a href="/tags/${t}/"${current === t ? ' aria-current="page"' : ''}>${t}</a>`).join('<span>·</span>')}</p>
</nav>
${list.length ? list.map(entry).join('\n') : '<p class="empty">Nothing here yet.</p>'}` }));

listing('/blog/', 'Blog', `${NAME} · notes, research and ctf writeups`, 'Every post, newest first.', 'all', posts);
for (const [t, c] of tags) listing(`/tags/${t}/`, t, `${c} ${c === 1 ? 'post' : 'posts'} tagged ${t}`, `Posts tagged ${t}.`, t, posts.filter((p) => p.tags.includes(t)));
write('tags/index.html', page({ title: 'Tags', desc: 'Browse posts by tag.', route: '/tags/', body: `${hero('Tags', `${tags.length} topics, most used first`)}
<nav class="filters" aria-label="Topics">
${tags.map(([t, c]) => `<p><a href="/tags/${t}/">${t}</a> <span>(${c})</span></p>`).join('\n')}
</nav>` }));

// ---- pages ----
for (const name of ['about', 'projects', 'setup', 'wetware']) {
  const p = read(`content/pages/${name}.html`);
  write(`${name}/index.html`, plain(`/${name}/`, p.title, p.description, p.body));
}
{
  const p = read('content/pages/404.html');
  write('404.html', page({ title: p.title, desc: 'Nothing here.', route: '/404', withPrank: false, body: `${hero(p.title, p.description)}\n<article class="post">\n${p.body}\n</article>` }));
}
write('now/index.html', plain('/now/', 'Now', "What I'm doing at the moment.", `<table>
${NOW.map(([k, v]) => `<tr><th>${k}</th><td>${v.join('<br>')}</td></tr>`).join('\n')}
</table>`));
const shelf = (key, label) => {
  const list = BOOKS.filter((b) => b[0] === key);
  return list.length ? `<h2>${label}</h2>
<table>
${list.map(([, t, a, img, note, href]) => `<tr><td class="book"><img src="${img}" width="72" alt="Cover of ${esc(t)}"></td><td>${href ? `<a href="${href}">${esc(t)}</a>` : esc(t)}<br><span class="dim">${esc(a)}</span><br>${esc(note)}</td></tr>`).join('\n')}
</table>` : '';
};
write('library/index.html', plain('/library/', 'Library', 'Books I have read, am reading, or keep coming back to. Not all of them are recommendations.',
  `${shelf('reading', 'Reading')}\n${shelf('read', 'Read')}\n${shelf('shelved', 'On the shelf')}`));

// ---- roadmap ----
{
  // A resource is [title, url, note, done?]; a checklist step is 'text' or ['text', true] once done.
  const li = ([t, u, n, done]) => `      <li${done ? ' class="done"' : ''}>${u ? `<a href="${u}">${esc(t)}</a>` : esc(t)}${n ? ` <span class="kind">${esc(n)}</span>` : ''}</li>`;
  const badge = (b) => `<details class="badge${b.state ? ' ' + b.state : ''}">
  <summary><span class="bdg"><svg viewBox="0 0 64 72" aria-hidden="true"><polygon class="hex" points="32,3 60,19 60,53 32,69 4,53 4,19"/><g class="ico" transform="translate(21 15) scale(.92)">${ICONS[b.icon]}</g><text x="32" y="55">${esc(b.code)}</text></svg></span><span class="nm">${esc(b.name)}</span><span class="mt">${esc(b.meta)} · ${b.rarity}</span></summary>
  <div class="steps">
    <p class="flv">${esc(b.flavor)}</p>
${[
    ...(b.groups || []).map(([h, items]) => `    <h3>${esc(h || 'resources')}</h3>\n    <ol class="res">\n${items.map(li).join('\n')}\n    </ol>`),
    ...(b.checklist ? [`    <h3>steps</h3>\n    <ol>\n${b.checklist.map((c) => (Array.isArray(c) ? c : [c])).map(([t, done]) => `      <li${done ? ' class="done"' : ''}>${esc(t)}</li>`).join('\n')}\n    </ol>`] : []),
  ].join('\n')}
    <p class="dlv"><span>unlock</span>${b.unlock[1] ? `<a href="${b.unlock[1]}">${esc(b.unlock[0])}</a>` : esc(b.unlock[0])}</p>
  </div>
</details>`;
  write('roadmap/index.html', page({ title: 'Roadmap', desc: 'OSVR: from a terminal to a disclosed 0-day, using existing, mostly free resources.', route: '/roadmap/', body: `${hero('Roadmap', 'osvr · vulnerability research, from the terminal to pwn2own')}
<div class="road">
<div class="rail">
${ROADMAP.map((b) => (b.phase ? '<p class="phase">phase 2 · real-world</p>\n' : '') + badge(b)).join('\n')}
</div>
<p class="tally"><span class="earned"></span> / ${ROADMAP.length} badges · <span class="ticks"></span> done</p>
</div>` }));
}

// ---- front page ----
write('index.html', `${head({ route: '/', note: true })}
<body class="home">
${header('/')}
<section class="frame">
${fs.readFileSync('content/home.html', 'utf8').trimEnd().replace('  <!-- facts: built from NOW in content/site.mjs -->', `  <div class="facts">
${NOW.map(([h, items]) => `    <div><h2>${h}</h2><p>${items.join('<br>')}</p></div>`).join('\n')}
  </div>`)}
</section>

<section class="log" id="log">
  <h2>latest</h2>
  <div>
${posts.map((p) => `    <article>
      <time datetime="${p.date}">${p.date.replaceAll('-', '.')}</time>
      <h3><a href="/blog/${p.slug}/">${esc(p.title)}</a></h3>
      <p>${esc(p.description)}</p>
    </article>`).join('\n')}
  </div>
</section>
${footer}
${prank}</body>
</html>
`);

// ---- feeds ----
write('rss.xml', `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>${NAME}</title>
<link>${SITE}/</link>
<description>${DESC}</description>
<language>en</language>
${posts.map((p) => `<item>
  <title>${esc(p.title)}</title>
  <link>${SITE}/blog/${p.slug}/</link>
  <guid>${SITE}/blog/${p.slug}/</guid>
  <description>${esc(p.description)}</description>
  <pubDate>${new Date(p.date + 'T00:00:00Z').toUTCString()}</pubDate>
${p.tags.map((t) => `  <category>${t}</category>`).join('\n')}
</item>`).join('\n')}
</channel>
</rss>
`);
const routes = ['/', '/blog/', '/tags/', '/now/', '/projects/', '/setup/', '/wetware/', '/library/', '/roadmap/', '/about/',
  ...posts.map((p) => `/blog/${p.slug}/`), ...tags.map(([t]) => `/tags/${t}/`)];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r) => `<url><loc>${SITE}${r}</loc></url>`).join('\n')}
</urlset>
`);
console.log(`built ${posts.length} post(s), ${tags.length} tag(s)`);
