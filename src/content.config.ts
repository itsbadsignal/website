import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// `z` re-exported from 'astro:content' is deprecated; import it from astro/zod.
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      /** Loads KaTeX CSS on this post only. */
      math: z.boolean().default(false),
      /** Thumbnail on cards and banner on the post. Kept beside the post: `./cover.jpg`. */
      cover: image().optional(),
      coverAlt: z.string().default(''),
    }),
});

export const collections = { blog };

