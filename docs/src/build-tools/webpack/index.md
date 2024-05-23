---
outline: deep
---

# 性能优化

webpack 性能优化案例

## 更新版本

使用最新的 webpack 版本，通过 webpack 自身的迭代优化，来加快构建速度。**webpack5 较于 webpack4，新增了持久化缓存、改进缓存算法等优化**

**遇到的问题**

- The "path" argument must be of type string. Received undefined

解决方法：

```js
output: {
	// v4版本：path: isEnvProduction ? paths.appBuild : undefined;
	path: paths.appBuild;
}
```
