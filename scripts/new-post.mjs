#!/usr/bin/env node
/*
 * Start a new post:
 *
 *   npm run new -- "Post title" [--tags ctf,pwn] [--no-copy]
 *
 * Creates src/content/blog/<slug>/index.md as a draft dated today, then prints
 * the cover prompt (scripts/cover-prompt.txt) with the title filled in and
 * copies it to the clipboard when a clipboard tool is available.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const args = process.argv.slice(2);
const noCopy = args.includes('--no-copy');
if (noCopy) args.splice(args.indexOf('--no-copy'), 1);
const tagsAt = args.indexOf('--tags');
const tags = tagsAt === -1 ? [] : args.splice(tagsAt, 2)[1].split(',').map((t) => t.trim()).filter(Boolean);
const title = args.join(' ').trim();

if (!title) {
  console.error('usage: npm run new -- "Post title" [--tags ctf,pwn]');
  process.exit(1);
}

const slug = title
  .normalize('NFKD')
  .replace(/[̀-ͯ]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const dir = join('src/content/blog', slug);
if (existsSync(dir)) {
  console.error(`error: ${dir} already exists`);
  process.exit(1);
}

const d = new Date();
const today = [d.getFullYear(), d.getMonth() + 1, d.getDate()].map((n) => String(n).padStart(2, '0')).join('-');
const q = (s) => `'${s.replace(/'/g, "''")}'`;

mkdirSync(dir, { recursive: true });
writeFileSync(
  join(dir, 'index.md'),
  `---
title: ${q(title)}
description: 'TODO: one sentence, shown in lists, in <meta> and in the feed.'
pubDate: ${today}
tags: [${tags.map(q).join(', ')}]
draft: true
---

Write here.
`
);

const prompt = readFileSync('scripts/cover-prompt.txt', 'utf8')
  .replace('[POST TITLE]', title)
  .trimEnd();

// Whichever clipboard tool exists: Wayland, X11, macOS.
const copied = !noCopy && [
  ['wl-copy', []],
  ['xclip', ['-selection', 'clipboard']],
  ['pbcopy', []],
].some(([cmd, a]) => spawnSync(cmd, a, { input: prompt }).status === 0);

console.log(`created ${dir}/index.md (draft, ${today})\n`);
console.log('--- cover prompt' + (copied ? ' (copied to clipboard)' : '') + ' ---\n');
console.log(prompt);
console.log(`
--- next ---
1. Fill in the Subject line, paste into ChatGPT, download the image.
2. npm run cover -- --alt "What the image shows"
   (takes the newest image in ~/Downloads and applies it to the newest post)
3. Write the post, fill in description, set draft: false.`);
