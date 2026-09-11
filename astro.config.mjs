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
      // Dual themes emit --shiki-dark-* custom properties alongside the light
      // values, so code blocks follow the theme toggle with no JavaScript.
      // Astro renames Shiki's `.shiki` class to `.astro-code`; style that.
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: false,
    },
  },
});
