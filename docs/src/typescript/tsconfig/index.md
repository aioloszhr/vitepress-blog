---
outline: deep
---

# tscongfig配置

## 构建相关

### 构建解析相关

#### paths

`paths` 类似于 `Webpack` 中的 `alias`，允许你通过 `@/utils` 或类似的方式来简化导入路径，它的配置方式是这样的：

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/utils/*": ["src/utils/*", "src/other/utils/*"]1
    }
  }
}
```
<span style="color:red; font-weight: bold">需要注意的是</span>，`paths` 的解析是基于 `baseUrl` 作为相对路径的，因此需要确保指定了 `baseUrl` 。在填写别名路径时，我们可以传入一个数组，**项目打包构建时**，`TypeScript` 会依次解析这些路径，直到找到一个确实存在的路径。
