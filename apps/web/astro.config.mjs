// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import Icons from 'unplugin-icons/vite';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: '@maukode',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			sidebar: [
				{
					label: 'Headless Media',
					items: [
						{ label: 'Getting Started', autogenerate: {directory: '/headless-media/getting-started/'} },
						{ label: 'Frameworks', autogenerate: { directory: '/headless-media/frameworks/' } }
					],
				}
			],
		}),
	],
	vite: {
		plugins: [
			Icons({compiler: 'astro'})
		]
	}
});
