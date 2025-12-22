import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://www.coherencemind.net',
  output: 'static',
  integrations: [react(), tailwind(), sitemap()]
});
