/**
 * Single source of truth for identity and links.
 * Components read from here rather than hardcoding strings.
 */

export const site = {
  /** The oversized cursor-trailing hero word. */
  name: 'miguel',
  handle: 'badsignal',
  title: 'miguel',
  description:
    'Systems, reverse engineering, vulnerability research and CTF writeups.',
  /** Shown in the chaos layer's status readout. */
  status: 'online',
} as const;

export const socials: ReadonlyArray<{ label: string; href: string }> = [
  { label: 'github', href: 'https://github.com/badsignal' },
  { label: 'rss', href: '/rss.xml' },
];

export const nav: ReadonlyArray<{ label: string; href: string }> = [
  { label: 'index', href: '/' },
  { label: 'writeups', href: '/blog' },
  { label: 'tags', href: '/tags' },
];
