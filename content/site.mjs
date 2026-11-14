// Everything the build reads that isn't a page: identity, menu, now, library.
export const SITE = 'https://miguelc.space';
export const NAME = 'miguelc';
export const AUTHOR = 'miguel';
export const DESC = 'Systems, reverse engineering, vulnerability research and CTF writeups.';

// The header menu: three columns, top to bottom.
export const MENU = [
  [['about', '/about/'], ['blog', '/blog/'], ['roadmap', '/roadmap/']],
  [['projects', '/projects/'], ['library', '/library/'], ['now', '/now/']],
  [['setup', '/setup/'], ['wetware', '/wetware/'], ['tags', '/tags/']],
];

// /now/ and the columns at the top of the front page.
export const NOW = [
  ['work', ['security engineer @layer8']],
  ['reading', ['code, petzold']],
  ['learning', ['algebra', 'c', 'driving']],
  ['stack', ['python', 'arch linux']],
];

// /library/: [shelf, title, author, cover in library/, note, link]
export const BOOKS = [
  ['reading', 'The Elements of Computing Systems', 'Noam Nisan, Shimon Schocken', 'elements-of-computing-systems.jpg', 'Building a computer from NAND gates up to an operating system. The book behind nand2tetris.', 'https://www.nand2tetris.org/book'],
  ['reading', 'Code: The Hidden Language of Computer Hardware and Software', 'Charles Petzold', 'code.jpg', 'How computers work, from flashlights and telegraph relays to a working CPU.', 'https://www.charlespetzold.com/code/'],
  ['read', 'The Kybalion', 'Three Initiates', 'kybalion.jpg', 'A 1908 summary of Hermetic philosophy as seven principles, starting with "the All is Mind".'],
];
