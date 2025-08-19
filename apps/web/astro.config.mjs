// @ts-check
import { defineConfig } from 'astro/config';

import starlight from '@astrojs/starlight';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'maukode.com',
      // ADD THIS SIDEBAR CONFIGURATION
      sidebar: [
        {
          label: 'Guides',
          items: [
            // Each item is a link. You must add your pages here.
            { label: 'Introduction', link: '/docs/intro' },
          ],
        },
      ],
    }), 
    react()
  ],

  vite: {
    plugins: [tailwindcss()]
  }
});