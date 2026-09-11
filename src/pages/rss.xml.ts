import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getPosts } from '../lib/posts';
import { site } from '../lib/site';

export const GET: APIRoute = async (context) => {
  const posts = await getPosts();

  return rss({
    title: site.name,
    description: site.description,
    // context.site comes from `site` in astro.config.mjs; without it the feed
    // would emit relative URLs and fail validation.
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
      categories: [...post.data.tags],
    })),
    customData: '<language>en</language>',
  });
};
