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
			{ text: 'Svg', link: '/src/svg/attribute/' },
			{ text: 'JavaScript', link: '/src/javascript/regular-expression/' },
			{ text: 'TypeScript', link: '/src/typescript/tsconfig/' },
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
						text: 'Vue2',
						items: [
							{ text: 'API', link: '/src/framework/vue2/api/' },
						]
					},
					{
						text: 'Vue3',
						link: '/src/framework/vue3/responsive-api/tool-function/'
					},
					{
						text: 'Vue-rouer',
						link: '/src/framework/vue-router/navigation-guard/'
					}
				]
			},
			{ text: '命令', link: '/src/command/git/common/' },
			{ text: '构建工具', link: '/src/build-tools/webpack/base/' },
			{ text: '工程化', link: '/src/project/configure/' },
			{ text: '性能优化', link: '/src/performance/' },
			{ text: '大模型', link: '/src/large-model/development-process/'},
			{ text: '可视化', link: '/src/visualization/threejs/base/'},
		],
		sidebar: {
			'/src/framework/vue3/responsive-api/tool-function/': [
				{
					text: '组合式API',
					collapsed: true,
					items: [
						{ text: '相应式：工具', link: '/src/framework/vue3/responsive-api/tool-function/' },
					]
				},
			],
			'/src/html-css/': [
				{ text: 'Html', link: '/src/html-css/html/' },
				{
					text: 'Css',
					collapsed: true,
					items: [
						{ text: '属性', link: '/src/html-css/css/attribute/' },
						{ text: '响应式布局', link: '/src/html-css/css/responsive-layout/' },
						{ text: '问题解决方案', link: '/src/html-css/css/questions/' },
					]
				},
				{ text: 'Scss', link: '/src/html-css/scss/' },
			],
			'/src/svg/': [
				{ text: '属性', link: '/src/svg/attribute/'},
				{ text: '图形', link: '/src/svg/graphic/'},
				{ text: '动画', link: '/src/svg/animation/'},
				{ text: '路径', link: '/src/svg/path/'}
			],
			'/src/javascript/': [
				{ text: '正则表达式', link: '/src/javascript/regular-expression/' },
				{ text: '数组', link: '/src/javascript/array/'},
				{ 
					text: '元素对象', 
					collapsed: true, 
					items: [
						{ text: '实例属性', link: '/src/javascript/element-object/attribute/' },
						{ text: '实例方法', link: '/src/javascript/element-object/function/' },
					]
				},
			],
			'/src/typescript/': [
				{ text: 'tsconfig配置', link: '/src/typescript/tsconfig/' },
			],
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
					text: 'Linux',
					collapsed: true,
					items: [
						{ text: '常用命令', link: '/src/command/linux/common/' }
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
					text: 'Pnpm',
					collapsed: true,
					items: [
						{ text: '常用选项', link: '/src/command/pnpm/options/' }
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
					collapsed: true,
					items: [
						{ text: 'CSS', link: '/src/build-tools/vite/css/' },
						{ text: '插件使用', link: '/src/build-tools/vite/others/' }
					]
				}
			],
			'/src/project/': [
				{
					text: 'pnpm + vite + vue3项目搭建',
					link: '/src/project/configure/'
				}
			],
			'/src/large-model/': [
				{ text: '大模型简介', link: '/src/large-model/Introduction/' },
				{ text: '提示词、提示词工程', link: '/src/large-model/prompt/' },
				{ text: 'Agent概念、组成与决策', link: '/src/large-model/agents/' },
				{ text: '什么是RAG？', link: '/src/large-model/rag/' },
			],
			'/src/visualization/': [
				{
					text: 'Threejs',
					collapsed: true,
					items: [
						{ text: '基本概念', link: '/src/visualization/threejs/base/' },
						{ text: '可视化调试', link: '/src/visualization/threejs/visual-debugging/' },
						{ text: '山脉地形图（案例）', link: '/src/visualization/threejs/mountain-map/' },
						{ text: 'uv坐标和uv动画', link: '/src/visualization/threejs/uv/' },
					]
				},
			]
		}
	}
});
