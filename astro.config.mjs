// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// Update this to the real domain before relying on RSS or the sitemap —
// both emit absolute URLs derived from it.
export const SITE = 'https://example.com';

export default defineConfig({
  site: SITE,
  integrations: [mdx(), sitemap()],
  markdown: {
    /*
     * Astro 7 defaults to the Sätteri processor, which parses math but does not
     * render it. remark-math + rehype-katex need the unified processor, so it is
     * selected explicitly here — passing plugins as top-level `markdown.remarkPlugins`
     * still works but is deprecated.
     */
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    shikiConfig: {
      // The site is dark only, so a single theme is enough: Shiki writes the
      // colours inline and no CSS swap is needed.
      // Astro renames Shiki's `.shiki` class to `.astro-code`; style that.
      theme: 'github-dark',
      wrap: false,
    },
  },
});
