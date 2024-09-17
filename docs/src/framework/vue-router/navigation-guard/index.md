---
outline: deep
---

# 🚲 导航守卫

## 全局前置守卫

使用 `router.beforeEach` 注册一个全局前置守卫：

```ts
const router = createRouter({ ... })

router.beforeEach((to, from) => {
  // ...
  // 返回 false 以取消导航
  return false
})
```

当一个导航触发时，全局前置守卫按照创建顺序调用。守卫是异步解析执行，此时导航在所有守卫 resolve 完之前一直处于等待中。

每个守卫方法接收两个参数：

- `to`: 即将要进入的目标
- `from`: 当前导航正要离开的路由

可以返回的值如下:

- `false`: 取消当前的导航。如果浏览器的 URL 改变了(可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 `from` 路由对应的地址。

- 一个路由地址: 通过一个路由地址重定向到一个不同的地址，如同调用 `router.push()`，且可以传入诸如 `replace: true` 或 `name: 'home'` 之类的选项。它会中断当前的导航，同时用相同的 `from` 创建一个新导航。

```ts
router.beforeEach(async (to, from) => {
	if (
		// 检查用户是否已登录
		!isAuthenticated &&
		// ❗️ 避免无限重定向
		to.name !== 'Login'
	) {
		// 将用户重定向到登录页面
		return { name: 'Login' };
	}
});
```

如果遇到了意料之外的情况，可能会抛出一个 `Error`。这会取消导航并且调用 `router.onError()` 注册过的回调。

如果什么都没有，`undefined` 或返回 `true`，则导航是有效的，并调用下一个导航守卫
