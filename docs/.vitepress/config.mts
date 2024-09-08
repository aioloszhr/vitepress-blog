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
					{ text: 'Zustand', link: '/src/framework/zustand/' }
				]
			},
			{ text: '命令', link: '/src/command/git/common/' },
			{ text: '算法', link: '/src/algorithm/array/' },
			{ text: '构建工具', link: '/src/build-tools/webpack/' },
			{ text: '实战', items: [{ text: 'React Admin', link: '/src/actual-combal/react-admin/section-3/' }] },
			{ text: 'AI & LLM', items: [{ text: 'LangChain', link: '/src/llm/langChain/section-1/' }] }
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
					items: [{ text: '性能优化', link: '/src/build-tools/webpack/' }]
				},
				{
					text: 'Vite',
					collapsed: true,
					items: [{ text: '在Vite中配置Mock数据', link: '/src/build-tools/vite/mock/' }]
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
			'/src/llm/langChain/': [
				{
					text: 'LangChain.js 入门和实战',
					collapsed: true,
					items: [
						{ text: '学习 LLM 的工具', link: '/src/llm/langChain/section-1/' },
						{ text: '如何获取 OpenAI 服务', link: '/src/llm/langChain/section-2/' },
						{ text: 'langchan.js的介绍、安装和快速入门', link: '/src/llm/langChain/section-3/' },
						{ text: '检索增强生成（RAG）原理和流程', link: '/src/llm/langChain/section-4/' },
						{ text: 'Prompt: 构建可复用的 Prompt Template', link: '/src/llm/langChain/section-5/' },
						{ text: 'OutputParset: 构建格式化输出', link: '/src/llm/langChain/section-6/' },
						{ text: 'Embeddinig: 多数据源加载', link: '/src/llm/langChain/section-7/' },
						{ text: 'Embeddinig: 大规模数据的预处理', link: '/src/llm/langChain/section-8/' },
						{ text: 'Retriever: 构建向量数据库', link: '/src/llm/langChain/section-9/' },
						{ text: 'Retriever: retriever 常见优化方式', link: '/src/llm/langChain/section-10/' },
						{ text: 'RAG: 基于私域数据进行问答', link: '/src/llm/langChain/section-11/' }
					]
				}
			]
		}
	}
});
