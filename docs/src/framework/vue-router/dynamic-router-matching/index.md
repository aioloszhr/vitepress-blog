---
outline: deep
---

# 🚲 动态路由匹配

## 捕获所有路由或 404 Not found 路由

常规参数只匹配 url 片段之间的字符，用 `/` 分隔。如果我们想匹配任意路径，我们可以使用自定义的 路径参数 正则表达式，在 路径参数 后面的括号中加入 正则表达式 :

```ts
const routes = [
	// 将匹配所有内容并将其放在 `route.params.pathMatch` 下
	{ path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
	// 将匹配以 `/user-` 开头的所有内容，并将其放在 `route.params.afterUser` 下
	{ path: '/user-:afterUser(.*)', component: UserGeneric }
];
```
