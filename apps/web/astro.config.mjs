// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import Icons from 'unplugin-icons/vite';
import starlightSidebarTopics from 'starlight-sidebar-topics';
import starlightBlog from 'starlight-blog'

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'MauKode',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
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
						exclude: ['/blog', '/blog/*']
					}
				),
				starlightBlog()
			],
			favicon: '/favicon.ico',
			logo: {
				src: './src/assets/maukode-logo.svg',
				alt: 'Maukode Logo'
			}
		}),
	],
	vite: {
		plugins: [
			Icons({ compiler: 'astro' })
		]
	}
});
