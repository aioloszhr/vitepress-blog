---
outline: deep
---

# Vite 中配置 Mock 数据

在 vite 开发环境中使用`vite-plugin-mock-dev-server`、`mockjs`插件，模拟请求和数据响应。

## 文档

[vite-plugin-mock-dev-server](https://vite-plugin-mock-dev-server.netlify.app/)
[mockjs](http://mockjs.com/)

## 使用

### 安装

```bash
pnpm add mockjs
pnpm add vite-plugin-mock-dev-server -D
```

### 配置

vite.config.ts

```ts
import { defineConfig } from 'vite';
import mockDevServerPlugin from 'vite-plugin-mock-dev-server';

export default defineConfig({
	plugins: [mockDevServerPlugin()],
	/** 开发服务器配置 */
	server: {
		port: 8080,
		proxy: {
			'/zhyy': {
				target: 'https://10.188.58.44:8081',
				changeOrigin: true,
				secure: false
			}
		}
	}
});
```

注：插件会读取 `server.proxy` 的配置，对匹配的 **url** 启用 **mock** 匹配。

### 编写 Mock 文件

xxx.mock.ts

```ts
import { defineMock } from 'vite-plugin-mock-dev-server';

export default defineMock({
	url: '/api/test',
	body: {
		a: 1,
		b: 2
	}
});
```

## 插件说明

### vite-plugin-mock-dev-server

方法

**1. mockDevServerPlugin(options)**

options

**2. defineMock(config)**

mock 配置帮助函数，提供类型检查帮助。

- config 配置

```ts
export default defineMock({
	/**
	 * 请求地址，支持 `/api/user/:id` 格式
	 */
	url: '/api/test',
	/**
	 * 接口支持的请求方法
	 *
	 * @type string | string[]
	 * @default ['POST','GET']
	 *
	 */
	method: ['GET', 'POST'],
	/**
	 * 是否启用当前 mock请求
	 *
	 * 在实际场景中，我们一般只需要某几个mock接口生效，
	 * 而不是所有mock接口都启用。
	 * 对当前不需要mock的接口，可设置为 false
	 *
	 * @default true
	 */
	enable: true,
	/**
	 * 设置接口响应延迟，单位：ms
	 *
	 * @default 0
	 */
	delay: 1000,
	/**
	 * 响应状态码
	 *
	 * @default 200
	 */
	status: 200,
	/**
	 * 响应状态文本
	 */
	statusText: 'OK',
	/**
	 * 请求验证器，通过验证器则返回 mock数据，否则不使用当前mock。
	 * 这对于一些场景中，某个接口需要通过不同的入参来返回不同的数据，
	 * 验证器可以很好的解决这一类问题，将同个 url 分为多个 mock配置，
	 * 根据 验证器来判断哪个mock配置生效。
	 *
	 * @type { headers?: object; body?: object; query?: object; params?: object; refererQuery?: object  }
	 *
	 * 如果 validator 传入的是一个对象，那么验证方式是严格比较 请求的接口
	 * 中，headers/body/query/params 的各个`key`的`value`是否全等，
	 * 全等则校验通过
	 *
	 * @type ({ headers: object; body: object; query: object; params: object; refererQuery: object }) => boolean
	 * 如果 validator 传入的是一个函数，那么会讲 请求的接口相关数据作为入参，提供给使用者进行自定义校验，并返回一个 boolean
	 *
	 */
	validator: {
		headers: {},
		body: {},
		query: {},
		params: {},
		/**
		 * refererQuery 验证了请求来源页面 URL 中的查询参数，
		 * 这使得可以直接在浏览器地址栏中修改参数以获取不同的模拟数据。
		 */
		refererQuery: {}
	},
	/**
	 *
	 * 响应状态 headers
	 *
	 * @type Record<string, any>
	 *
	 * @type (({ query, body, params, headers }) => Record<string, any>)
	 * 入参部分为 请求相关信息
	 */
	headers: {
		'Content-Type': 'application/json'
	},

	/**
	 * 响应体数据
	 * 定义返回的响应体数据内容。
	 * 在这里，你可以直接返回JavaScript支持的数据类型如 `string/number/array/object` 等
	 * 同时，你也可以使用如 `mockjs` 等库来生成数据内容
	 *
	 * @type string | number | array | object 直接返回定义的数据
	 *
	 * @type (request: { headers, query, body, params }) => any | Promise<any>
	 * 如果传入一个函数，那么可以更加灵活的定义返回响应体数据
	 */
	body: {},

	/**
	 * 如果通过 body 配置不能解决mock需求，
	 * 那么可以通过 配置 response，暴露http server 的接口，
	 * 实现完全可控的自定义配置
	 *
	 * 在 req参数中，已内置了 query、body、params 的解析，
	 * 你可以直接使用它们
	 *
	 * 别忘了，需要通过 `res.end()` 返回响应体数据，或者需要跳过mock，那么别忘了调用 `next()`
	 */
	response(req, res, next) {
		res.end();
	}
});
```
