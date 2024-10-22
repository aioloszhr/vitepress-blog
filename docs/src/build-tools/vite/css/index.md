---
outline: deep
---

# CSS

本文介绍在`vite`中，如何对`CSS`进行处理。

## CSS 预处理器

`Vite` 同时提供了对 `.scss`, `.sass`, `.less`, `.styl` 和 `.stylus` 文件的内置支持。
需要安装对应的预处理依赖：

```zsh
# .scss 和 .sass
pnpm add -D sass-embedded # 或 sass

# .less
pnpm add -D less

# .styl 和 .stylus
pnpm add -D stylus
```