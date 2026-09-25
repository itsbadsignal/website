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
  /** Default social card (1200x627, LinkedIn's recommended size). */
  ogImage: '/og.png',
  /** Shown in the chaos layer's status readout. */
  status: 'online',
} as const;

export const socials: ReadonlyArray<{ label: string; href: string }> = [
  { label: 'github', href: 'https://github.com/badsignal' },
  { label: 'rss', href: '/rss.xml' },
];

/**
 * The three panels across the top of the landing page.
 *
 * Placeholder content — edit freely. Keep items short: they are set on one line
 * each and wrap badly once they pass roughly forty characters.
 */
export const panels: ReadonlyArray<{ title: string; items: readonly string[] }> = [
  {
    title: 'reading',
    items: [
      'the elements of computing systems',
      'code: the hidden language of computer hardware and software',
      'the bible',
    ],
  },
  {
    title: 'now',
    items: [
      'drivers license',
      'building from first principles',
      "clearing life's backlog",
    ],
  },
  {
    title: 'stats',
    items: ['security engineer @ layer8', 'building @loki', 'c, python, arch btw'],
  },
];

export const nav: ReadonlyArray<{ label: string; href: string }> = [
  { label: 'index', href: '/' },
  { label: 'writeups', href: '/blog' },
  { label: 'tags', href: '/tags' },
];
