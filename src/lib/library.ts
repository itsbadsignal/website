import type { ImageMetadata } from 'astro';
import elements from '../assets/library/elements-of-computing-systems.jpg';
import code from '../assets/library/code.jpg';
import kybalion from '../assets/library/kybalion.jpg';

/**
 * The bookshelf on /library. To add a book, drop its cover in
 * src/assets/library/ (any size, portrait), import it above and add an entry.
 * Covers for most books: https://covers.openlibrary.org/b/isbn/<ISBN>-L.jpg
 */
export type Book = {
  title: string;
  author: string;
  cover: ImageMetadata;
  status: 'reading' | 'read' | 'shelved';
  /** One or two lines: what it is, or what you took from it. */
  note?: string;
  href?: string;
};

export const books: ReadonlyArray<Book> = [
  {
    title: 'The Elements of Computing Systems',
    author: 'Noam Nisan, Shimon Schocken',
    cover: elements,
    status: 'reading',
    note: 'Building a computer from NAND gates up to an operating system. The book behind nand2tetris.',
    href: 'https://www.nand2tetris.org/book',
  },
  {
    title: 'Code: The Hidden Language of Computer Hardware and Software',
    author: 'Charles Petzold',
    cover: code,
    status: 'reading',
    note: 'How computers work, from flashlights and telegraph relays to a working CPU.',
    href: 'https://www.charlespetzold.com/code/',
  },
  {
    title: 'The Kybalion',
    author: 'Three Initiates',
    cover: kybalion,
    status: 'read',
    note: 'A 1908 summary of Hermetic philosophy as seven principles, starting with "the All is Mind".',
  },
];
