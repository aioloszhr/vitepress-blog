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
			{ text: 'JavaScript', link: '/src/javaScript/' },
			{ text: 'React', link: '/src/react/sourceCode/fiber/' },
			{ text: '命令', link: '/src/command/git/common/' },
			{ text: '算法', link: '/src/algorithm/array/' }
		],
		sidebar: {
			'/src/react/': [
				{
					text: '源码',
					items: [{ text: 'fiber', link: '/src/react/sourceCode/fiber/' }]
				}
			],
			'/src/command/': [
				{
					text: 'Git',
					items: [
						{ text: '常用命令', link: '/src/command/git/common/' },
						{ text: '问题', link: '/src/command/git/problem/' }
					]
				}
			],
			'/src/javaScript/': [
				{
					text: '数组',
					items: [{ text: 'api', link: '/src/javaScript/' }]
				}
			],
			'/src/algorithm/': [
				{
					text: '数据结构',
					collapsed: true,
					items: [
						{ text: '数组', link: '/src/algorithm/array/' },
						{ text: '栈、队列、链表', link: '/src/algorithm/linear-structure/' },
						{ text: '树、二叉树', link: '/src/algorithm/tree/' }
					]
				}
			]
		}
	}
});
