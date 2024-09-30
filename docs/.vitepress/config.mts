import { defineConfig } from 'vitepress';

export default defineConfig({
	base: '/vitepress-blog/',
	description: 'A VitePress Site',
	/** 添加网站图标 */
	head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/vitepress-blog/ray.svg' }]],
	themeConfig: {
		/** 导航栏上显示的 Logo，位于站点标题前 */
		logo: '/ray.svg',
		siteTitle: '个人博客',
		/** 启用本地搜索 */
		search: {
			provider: 'local'
		},
		/** 添加导航 */
		nav: [
			{ text: '首页', link: '/' },
			{ text: 'Html & Css', link: '/src/html-css/html/' },
			{ text: 'JavaScript', link: '/src/javascript/regular-expression/' },
			{
				text: '框架',
				items: [
					{
						text: 'React',
						items: [
							{ text: '源码', link: '/src/framework/react/sourceCode/fiber/' },
							{ text: 'hooks', link: '/src/framework/react/hooks/' }
						]
					},
					{ text: 'Nest', link: '/src/framework/nest/section-3/' },
					{ text: 'Zustand', link: '/src/framework/zustand/' },
					{
						text: 'Vue3',
						items: [
							{ text: '全局API', link: '/src/framework/vue3/globalApi/' },
							{ text: '组合式API', link: '/src/framework/vue3/compositionApi/' }
						]
					},
					{
						text: 'Vue-rouer',
						link: '/src/framework/vue-router/navigation-guard/'
					}
				]
			},
			{ text: '命令', link: '/src/command/git/common/' },
			{ text: '算法', link: '/src/algorithm/array/' },
			{ text: '构建工具', link: '/src/build-tools/webpack/base/' },
			{ text: '工程化', link: '/src/project/configure/' },
			{ text: '实战', items: [{ text: 'React Admin', link: '/src/actual-combal/react-admin/section-3/' }] },
			{ text: '性能优化', link: '/src/performance/' },
		],
		sidebar: {
			'/src/html-css/': [
				{ text: 'Html', link: '/src/html-css/html/' },
				{
					text: 'Css',
					collapsed: true,
					items: [
						{
							text: '布局',
							items: [
								{ text: '响应式布局', link: '/src/html-css/css/responsive/layout/' },
								{ text: '解决方案', link: '/src/html-css/css/responsive/solution/' }
							]
						},
						{
							text: '样式属性',
							link: '/src/html-css/css/attribute/'
						}
					]
				}
			],
			'/src/javascript/': [{ text: '正则表达式', link: '/src/javascript/regular-expression/' }],
			'/src/framework/react/sourceCode/': [
				{
					text: '源码',
					collapsed: true,
					items: [{ text: 'fiber', link: '/src/framework/react/sourceCode/fiber/' }]
				}
			],
			'/src/framework/react/hooks/': [
				{
					text: 'hooks',
					collapsed: true,
					items: [{ text: 'hooks', link: '/src/framework/react/hooks/' }]
				}
			],
			'/src/framework/nest/': [
				{
					text: 'Nest',
					collapsed: true,
					items: [
						{ text: 'Nest CLI', link: '/src/framework/nest/section-3/' },
						{ text: 'IOC', link: '/src/framework/nest/section-5/' },
						{ text: '使用多种Provider，灵活注入对象', link: '/src/framework/nest/section-7/' },
						{ text: '全局模块和生命周期', link: '/src/framework/nest/section-8/' },
						{ text: 'AOP', link: '/src/framework/nest/section-9/' },
						{ text: '快速掌握TypeORM', link: '/src/framework/nest/section-46/' },
						{ text: 'Configuration配置', link: '/src/framework/nest/section-55/' },
						{ text: '两种登录状态保存方式：JWT、Session', link: '/src/framework/nest/section-56/' },
						{ text: 'MySql、TypeORM、JWT实现登录注册', link: '/src/framework/nest/section-57/' },
						{ text: 'Interceptor拦截器', link: '/src/framework/nest/section-58/' }
					]
				}
			],
			'/src/framework/zustand/': [{ text: 'zustand', link: '/src/framework/zustand/' }],
			'/src/framework/vue-router/': [
				{
					text: 'Vue-Router',
					collapsed: true,
					items: [
						{ text: '动态路由匹配', link: '/src/framework/vue-router/dynamic-router-matching/' },
						{ text: '导航守卫', link: '/src/framework/vue-router/navigation-guard/' }
					]
				}
			],
			'/src/command/': [
				{
					text: 'Git',
					collapsed: true,
					items: [
						{ text: '常用命令', link: '/src/command/git/common/' },
						{ text: '问题', link: '/src/command/git/problem/' }
					]
				},
				{
					text: 'Npm',
					collapsed: true,
					items: [
						{ text: '常用选项', link: '/src/command/npm/options/' },
						{ text: '常用命令', link: '/src/command/npm/common/' }
					]
				},
				{
					text: 'Linux',
					collapsed: true,
					items: [
						{ text: '常用命令', link: '/src/command/linux/common/' }
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
			],
			'/src/build-tools/': [
				{
					text: 'Webpack',
					collapsed: true,
					items: [
						{ text: '基础', link: '/src/build-tools/webpack/base/' },
						{ text: '性能优化', link: '/src/build-tools/webpack/performance/' }
					]
				},
				{
					text: 'Vite',
					link: '/src/build-tools/vite/'
				}
			],
			'/src/actual-combal/react-admin/': [
				{
					text: 'zr-admin后台管理系统开发记录',
					collapsed: true,
					items: [
						{ text: '实现登录功能', link: '/src/actual-combal/react-admin/section-3/' },
						{ text: '封装axios', link: '/src/actual-combal/react-admin/section-4/' },
						{ text: '雪花算法', link: '/src/actual-combal/react-admin/section-6/' },
						{ text: '通过RBAC模型实现前后端动态菜单和动态路由', link: '/src/actual-combal/react-admin/section-8/' },
						{
							text: 'websocket实现用户权限变更推送消息推送，自动刷新',
							link: '/src/actual-combal/react-admin/section-10/'
						}
					]
				}
			],
			'/src/project/': [
				{
					text: '项目搭建',
					link: '/src/project/configure/'
				}
			]
		}
	}
});
