import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://stolenwords.live',
  integrations: [mdx(), sitemap()],
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
});
