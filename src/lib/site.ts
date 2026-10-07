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
  { label: 'GitHub', href: 'https://github.com/badsignal' },
  { label: 'RSS', href: '/rss.xml' },
];

/**
 * The "now" box on the index. Keep items short: they are set one per line.
 */
export const now: ReadonlyArray<{ label: string; value: string }> = [
  { label: 'job', value: 'security engineer @ layer8' },
  { label: 'reading', value: 'the elements of computing systems' },
  { label: 'learning', value: 'basic maths and driving' },
  { label: 'stack', value: 'c, python, arch btw' },
];

/**
 * The header menu, laid out as three rows of four with the socials last, so
 * keep it at 10 entries. The logo is the link home.
 */
export const nav: ReadonlyArray<{ label: string; href: string }> = [
  { label: 'Blog', href: '/blog' },
  { label: 'Writeups', href: '/writeups' },
  { label: 'Tags', href: '/tags' },
  { label: 'Now', href: '/now' },
  { label: 'Projects', href: '/projects' },
  { label: 'Dotfiles', href: '/dotfiles' },
  { label: 'Library', href: '/library' },
  { label: 'Hacking', href: '/hacking' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];
