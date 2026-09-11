import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/**
 * The single place drafts are filtered and posts are sorted.
 *
 * Every page and the feed must call this rather than filtering independently —
 * one page will eventually be missed, and that leaks an unpublished post.
 * Drafts stay visible in `astro dev` so they can be previewed.
 */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Tags with their post counts, most used first, ties broken alphabetically. */
export async function getTags(): Promise<Array<{ tag: string; count: number }>> {
  const posts = await getPosts();
  const counts = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const posts = await getPosts();
  return posts.filter((p) => p.data.tags.includes(tag));
}

export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Rough reading time; generous enough for code-heavy writeups. */
export function readingTime(body: string | undefined): string {
  const words = (body ?? '').trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min`;
}
