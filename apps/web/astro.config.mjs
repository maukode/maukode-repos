// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightSidebarTopics from 'starlight-sidebar-topics';
import starlightBlog from 'starlight-blog'

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	site: 'https://maukode.com',

	integrations: [
		starlight({
			title: 'MauKode',
			customCss: [
				// Path to your Tailwind base styles:
				'./src/styles/global.css',
			],
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/maukode/maukode-repos' }],
			plugins: [
				starlightSidebarTopics(
					[
						// A topic representing a guide section of your project.
						{
							label: 'Headless Media',
							// The page to link to when the topic is clicked.
							link: '/headless-media/',
							// The sidebar configuration for the topic.
							items: [
								{
									label: 'Getting Started',
									autogenerate: { directory: 'headless-media/getting-started/' }
								},
								{
									label: 'Frameworks',
									autogenerate: { directory: 'headless-media/frameworks/' }
								},
							],
						}
					],
					{
						exclude: ['/blog', '/blog/*', '/blog/tags/*', '/contact']
					}
				),
				starlightBlog({
					metrics: {
						readingTime: true,
						words: 'total'
					}
				})
			],
			favicon: '/favicon.ico',
			logo: {
				src: './src/assets/maukode-logo.svg',
				alt: 'Maukode Logo'
			}
		}),
	],

	vite: {
		plugins: [tailwindcss()]
	}
});