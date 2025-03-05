---
outline: deep
---

# Vite中插件的使用

## unplugin-auto-import

`unplugin-auto-import` 为 `Vite`、`Webpack`、`Rollup` 和 `esbuild` 按需自动导入 API。

### 安装

```zsh
pnpm add unplugin-auto-import -D
```

### 配置

- 在`vite.config.ts`中添加如下配置：

```ts
...
import autoImport from 'unplugin-auto-import/vite';
...

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    ...
    autoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: 'unplugin/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
        filepath: './unplugin/.eslintrc-auto-import.json'
      }
    })
    ...
  ],
})

```

注：`eslintrc`使用来解决`eslint`报错的 **配置项** ，当`enable`为`true`时，会根据`filepath`生成一个`eslint`的 **配置文件**，生成的这个文件需要引入到`eslint`配置项中，例如：

```js
// 以eslint9.x为例
// eslint.config.js

...
import tseslint from 'typescript-eslint'
import { readFile } from "node:fs/promises"
...

// 建立文件链接
const autoImportFile = new URL(
  "./unplugin/.eslintrc-auto-imports.json",
  import.meta.url,
)
// 读取文件内容
const autoImportGlobals = JSON.parse(await readFile(autoImportFile, "utf8"))

export default tseslint.config(
  ...
  {
    languageOptions: {
      globals: { 
        ...
        ...autoImportGlobals.globals,
        ...
      },
    },
  }
  ...
)
```

完成如上配置后，`eslint`报错会消失。需要注意的是，一旦生成配置文件后，最好把`enable`关掉，即改成`false`。
否则这个文件会在每次重新加载的时候重新生成，这会导致`eslint`有时会找不到这个文件。当需要更新配置文件的时候，再把`enable`改成`true`。

## vite-plugin-svg-icons
