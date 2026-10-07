#!/usr/bin/env node
/*
 * Turn any photo into a post cover: cropped to 16:9, greyscale, then ordered-
 * dithered to pure black and white with a 4x4 Bayer matrix, like an early Mac
 * screen or a newspaper halftone. Then wire it into the post's frontmatter.
 *
 *   npm run cover                          newest image in ~/Downloads -> newest post
 *   npm run cover -- <photo>               that photo -> newest post
 *   npm run cover -- <post-slug>           newest image in ~/Downloads -> that post
 *   npm run cover -- <photo> <post-slug>
 *
 * Options:
 *   --alt "..."  the coverAlt text. Without it, an existing coverAlt is kept,
 *                or a TODO is written for you to fill in.
 *   --white 0.85 the grey level that becomes solid white (lower = brighter).
 *                Dark photos usually want 0.5-0.7.
 *   --black 0.05 the grey level that becomes solid black (higher = darker).
 *   --focus attention   where to crop from: attention (finds the subject),
 *                entropy, centre, north, south, east, west.
 *
 * Writes src/content/blog/<post-slug>/cover.png and adds `cover` and
 * `coverAlt` to the frontmatter if they are missing. Re-running replaces the
 * cover, so tweak --white and run again until it looks right.
 *
 * The output is 640x360: the width of the post list, so covers show at 1:1
 * there and scale up elsewhere with crisp, unblurred dots (see .cover--pixel
 * in global.css).
 */
import sharp from 'sharp';
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { extname, join } from 'node:path';

const W = 640;
const H = 360;
const INK = 17; // --fg, #111
const PAPER = 255;
const BLOG = 'src/content/blog';
const DOWNLOADS = join(homedir(), 'Downloads');
const IMAGE = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.heic', '.tif', '.tiff']);

// 4x4 Bayer matrix, as thresholds in (0, 1)
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

function fail(msg) {
  console.error(`error: ${msg}\n\nusage: npm run cover -- [photo] [post-slug] [--alt "..."] [--white 0.85] [--black 0.05] [--focus attention]`);
  process.exit(1);
}

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};
const alt = flag('alt', undefined);
const white = Number(flag('white', '0.85'));
const black = Number(flag('black', '0.05'));
const focus = flag('focus', 'attention');
if (!(black >= 0 && white <= 1 && black < white)) fail('need 0 <= --black < --white <= 1');

/** The most recently modified entry of `dir` that passes `keep`. */
function newest(dir, keep) {
  if (!existsSync(dir)) return undefined;
  return readdirSync(dir)
    .map((name) => join(dir, name))
    .filter(keep)
    .map((path) => ({ path, t: statSync(path).mtimeMs }))
    .sort((a, b) => b.t - a.t)[0]?.path;
}

const isImage = (p) => IMAGE.has(extname(p).toLowerCase()) && statSync(p).isFile();
const isPost = (p) => existsSync(join(p, 'index.md')) || existsSync(join(p, 'index.mdx'));

// Positionals: a path that exists is the photo, anything else is the slug.
let input;
let slug;
for (const a of args) {
  if (existsSync(a) && statSync(a).isFile()) input = a;
  else slug = a;
}

input ??= newest(DOWNLOADS, isImage);
if (!input) fail(`no photo given and no images in ${DOWNLOADS}`);

const postDir = slug ? join(BLOG, slug) : newest(BLOG, isPost);
if (!postDir || !isPost(postDir)) fail(slug ? `no post at ${join(BLOG, slug)} (the slug is the folder name)` : `no posts in ${BLOG}`);

console.log(`photo: ${input}`);
console.log(`post:  ${postDir}`);

// ---- dither ----
const { data } = await sharp(input)
  .rotate() // respect EXIF orientation from phone photos
  .resize(W, H, { fit: 'cover', position: focus })
  .greyscale()
  .normalise()
  .raw()
  .toBuffer({ resolveWithObject: true });

const out = Buffer.alloc(W * H);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = y * W + x;
    const v = Math.min(1, Math.max(0, (data[i] / 255 - black) / (white - black)));
    out[i] = v > BAYER[(y % 4) * 4 + (x % 4)] ? PAPER : INK;
  }
}

await sharp(out, { raw: { width: W, height: H, channels: 1 } })
  .png({ compressionLevel: 9, palette: true, colours: 2 })
  .toFile(join(postDir, 'cover.png'));

const ink = out.reduce((n, v) => n + (v === INK ? 1 : 0), 0) / out.length;
console.log(`wrote ${join(postDir, 'cover.png')} (${W}x${H}, 1-bit, ${Math.round(ink * 100)}% black)`);
if (ink > 0.7) console.log('  mostly black: try --white 0.6 (or lower) for a brighter cover');
if (ink < 0.15) console.log('  mostly white: try --black 0.2 for deeper shadows');

// ---- frontmatter ----
const md = existsSync(join(postDir, 'index.md')) ? join(postDir, 'index.md') : join(postDir, 'index.mdx');
const src = readFileSync(md, 'utf8');
const m = src.match(/^---\n([\s\S]*?)\n---/);
if (!m) fail(`${md} has no frontmatter block`);

let fm = m[1];
const q = (s) => `'${s.replace(/'/g, "''")}'`;
if (!/^cover:/m.test(fm)) fm += '\ncover: ./cover.png';
if (alt !== undefined) {
  fm = /^coverAlt:/m.test(fm) ? fm.replace(/^coverAlt:.*$/m, `coverAlt: ${q(alt)}`) : fm + `\ncoverAlt: ${q(alt)}`;
} else if (!/^coverAlt:/m.test(fm)) {
  fm += `\ncoverAlt: 'TODO: describe the cover for screen readers'`;
}

if (fm !== m[1]) {
  writeFileSync(md, src.replace(m[0], `---\n${fm}\n---`));
  console.log(`updated ${md} frontmatter`);
}
if (/^coverAlt: 'TODO/m.test(fm)) console.log(`  coverAlt is still a TODO: fill it in, or re-run with --alt "..."`);
