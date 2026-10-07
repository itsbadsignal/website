/**
 * Single source of truth for identity and links.
 * Components read from here rather than hardcoding strings.
 */

export const site = {
  name: 'miguelc',
  handle: 'badsignal',
  title: 'miguelc',
  description:
    'Systems, reverse engineering, vulnerability research and CTF writeups.',
  /** The one-line statement across the top of the index. */
  lede: 'I take things apart, work out why they broke, and write it down.',
  /** Default social card (1200x627, LinkedIn's recommended size). */
  ogImage: '/og.png',
} as const;

export const socials: ReadonlyArray<{ label: string; href: string }> = [
  { label: 'github', href: 'https://github.com/badsignal' },
  { label: 'rss', href: '/rss.xml' },
];

/**
 * The "now" box on the index. Keep items short: they are set one per line.
 */
export const now: ReadonlyArray<{ label: string; value: string }> = [
  { label: 'job', value: 'security engineer @ layer8' },
  { label: 'building', value: '@loki' },
  { label: 'reading', value: 'the elements of computing systems' },
  { label: 'learning', value: 'to drive' },
  { label: 'stack', value: 'c, python, arch btw' },
];

/** The header menu. It wraps, so order matters more than count. */
export const nav: ReadonlyArray<{ label: string; href: string }> = [
  { label: 'index', href: '/' },
  { label: 'blog', href: '/blog' },
  { label: 'tags', href: '/tags' },
  { label: 'now', href: '/now' },
  { label: 'projects', href: '/projects' },
  { label: 'uses', href: '/uses' },
  { label: 'library', href: '/library' },
  { label: 'bookmarks', href: '/bookmarks' },
  { label: 'about', href: '/about' },
  { label: 'contact', href: '/contact' },
];
