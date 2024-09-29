---
outline: deep
---

# 搭建vite5.x + vue3.x 项目

## 项目初始化

本次搭建采用vite提供模板，运行相关命令生成vite默认提供的项目模板。
使用pnpm进行项目管理，未安装请允许`npm install pnpm -g`。

注：node版本 20.17.1 npm版本 10.8.2

```zsh
pnpm create vite zr-map --template vue-ts
```
注：zr-map为项目名称，template后接模版类型

## Eslint

注：eslint的版本 9.x

### 安装

```zsh
pnpm add eslint @eslint/js typescript-eslint eslint-plugin-vue globals -D
```
### 规则配置

1. 从`eslint9.x`开始，在`src`同层级新建`eslint.config.js`（Esnext）或`eslint.config.mjs`（commonjs）文件

2. 在eslint配置文件中，添加配置，以`eslint.config.js`为例：

```ts
// eslint.config.js
import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintPluginVue from "eslint-plugin-vue";

export default tseslint.config(
    /** 忽略的文件，不起用eslint校验 */
    { ignores: ["node_modules", "dist", "public"] },
    eslint.configs.recommended,
    /** ts推荐配置 */
    ...tseslint.configs.recommended,
    ...eslintPluginVue.configs["flat/recommended"],
    {
        languageOptions: {
            globals: { ...globals.browser },
        },
    },
    /** javascript规则 */
    {
        files: ["**/*.{js,mjs,cjs,vue}"],
        rules: {
            "no-console": "error",
        },
    },
    /** vue规则 */
    {
        files: ["**/*.vue"],
        languageOptions: {
            parserOptions: {
                /** typescript项目需要用到这个 */
                parser: tseslint.parser,
                ecmaVersion: "latest",
                /** 允许在.vue 文件中使用 JSX */
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        rules: {},
    },
    /** typescript规则 */
    {
        files: ["**/*.{ts,tsx,vue}"],
        rules: {},
    }
);
```

### 配置命令

在`package.json`中添加命令让`Eslint`起作用：

```json
// package.json
{
  "scripts": {
    "lint": "eslint",
    "lint:fix": "eslint --fix",
  }
}
```

## Prettier

### 安装`Prettier`相关依赖包

```zsh
pnpm add prettier eslint-plugin-prettier eslint-config-prettier -D
```
`eslint-plugin-prettier`：这是一个 `ESLint` 插件，它将 `Prettier` 应用到 `ESLint` 中。它会使用 `Prettier` 来格式化代码，并将格式化结果作为 `ESLint` 的一项规则来检查代码。使用该插件可以在代码检查的同时，自动格式化代码，使其符合 `Prettier` 的规则。
`eslint-config-prettier` ：这是一个 `ESLint` 配置规则的包，它将禁用与 `Prettier` 冲突的 ESLint 规则。使用 该插件可以确保 `ESLint` 规则与 `Prettier` 的代码格式化规则保持一致，避免二者之间的冲突。

注：`eslint-config-prettier`插件必须安装，否则运行`pnpm run lint`会报错：`Error: Cannot find module 'eslint-config-prettier'`。

### 解决`Prettier`和`Eslint`的规则冲突

在`eslint.config.js`中新增`prettier`配置：

```ts
// eslint.config.js
...
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";

...
/** prettier配置 */
eslintPluginPrettier,
...
```
### 配置`Prettier`格式化规则

1. 在`src`同层级下新增文件`prettier.config.js`。

2. 添加格式化规则：

```js
// prettier.config.js
/**
 * @type {import('prettier').Config}
 * @see https://www.prettier.cn/docs/options.html
 */
export default {
  trailingComma: "all",
  singleQuote: true,
  semi: false,
  printWidth: 80,
  arrowParens: "always",
  proseWrap: "always",
  endOfLine: "lf",
  experimentalTernaries: false,
  tabWidth: 2,
  useTabs: false,
  quoteProps: "consistent",
  jsxSingleQuote: false,
  bracketSpacing: true,
  bracketSameLine: false,
  jsxBracketSameLine: false,
  vueIndentScriptAndStyle: false,
  singleAttributePerLine: false
};
```

