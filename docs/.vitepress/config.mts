import { defineConfig } from 'vitepress';

export default defineConfig({
	base: '/vitepress-blog/',
	description: 'A VitePress Site',
	/** 添加网站图标 */
	head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/vitepress-blog/ray.svg' }]],
	themeConfig: {
		/** 导航栏上显示的 Logo，位于站点标题前 */
		logo: '/ray.svg',
		/** 启用本地搜索 */
		search: {
			provider: 'local'
		},
		/** 添加导航 */
		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'React', link: '/src/react/hooks/' },
			{ text: '命令', link: '/src/command/git/' },
			{ text: '算法', link: '/src/algorithm/' }
		],
		sidebar: {
			'/src/react/': [
				{
					text: 'React',
					items: [{ text: 'hooks', link: '/src/react/hooks/' }]
				}
			],
			'/src/command/': [
				{
					text: '命令',
					items: [{ text: 'Git', link: '/src/command/git/' }]
				}
			]
		}
	}
});
