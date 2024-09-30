---
outline: deep
---

# 项目初始化 & Eslint、Prettier、Husky、lint-staged、commitlint、commitizen

该篇文章以vite5.x + vue3.x为例。

## 项目初始化

本次搭建采用vite提供模板，运行相关命令生成vite默认提供的项目模板。
使用pnpm进行项目管理，如果未安装，请先执行命令`npm install pnpm -g`安装`pnpm`。

注：node版本 20.17.1 npm版本 10.8.2

```zsh
pnpm create vite zr-map --template vue-ts
```
注：zr-map为项目名称，template后接模版类型

## Eslint

以`eslint9.x`为例

### 安装依赖

```zsh
pnpm add eslint @eslint/js typescript-eslint eslint-plugin-vue globals -D
```
### 规则配置

在`src`同层级新建`eslint.config.js`（Esnext）或`eslint.config.mjs`（commonjs）文件

在`eslint`配置文件中，添加如下内容：

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
在`package.json`中添加如下命令：

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

以`Prettier3.x`为例

### 安装依赖

```zsh
pnpm add prettier eslint-plugin-prettier eslint-config-prettier -D
```
`eslint-plugin-prettier`：这是一个 `ESLint` 插件，它将 `Prettier` 应用到 `ESLint` 中。它会使用 `Prettier` 来格式化代码，并将格式化结果作为 `ESLint` 的一项规则来检查代码。使用该插件可以在代码检查的同时，自动格式化代码，使其符合 `Prettier` 的规则。

`eslint-config-prettier` ：这是一个 `ESLint` 配置规则的包，它将禁用与 `Prettier` 冲突的 ESLint 规则。使用该插件可以确保 `ESLint` 规则与 `Prettier` 的代码格式化规则保持一致，避免二者之间的冲突。

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

## husky & lint-staged

`lint-staged`：只对暂存区（staged files）的文件运行配置的命令，这通常是代码风格检查器（如Eslint、Prettier）、代码格式化工具或测试套件。

`husky`：是一个用于简化`Git`钩子（hooks）的设置的工具，允许开发者轻松地在各种`Git`事件触发时运行脚本。例如，在提交之前`（pre-commit）`、推送之前`（pre-push）`、或者在提交信息被写入后`（commit-msg）`等。

### 安装依赖

```zsh
pnpm add husky lint-staged -D
```
### `husky`初始化 

执行命令：

```zsh
pnpm exec husky init
```
执行命令之后，会在`.husky/`文件夹下生成`pre-commit`脚本,并且会在`package.json`中生成`prepare`命令。

```json
{
  "scripts": {
    "prepare": "husky",
  },
}
```
在`package.json`中添加`lint-staged`和`husky`配置：

```json
{
    "husky": {
        "hooks": {
            "pre-commit": "lint-staged"
        }
    },
    "lint-staged": {
        "*.{ts,vue,js}": [
            "eslint --fix",
            "prettier --write"
        ]
    }
}
```
修改`.husky/pre-commit`钩子内容为`pnpm dlx lint-staged`。

![An image](/configuration/configuration-1.png)

这样配置完成之后，再进行`git`提交时，将只检查暂存区（staged）的文件，不会检查项目所有文件，加快了每次提交 `lint` 检查的速度，同时也不会被历史遗留问题影响。

![An image](/configuration/configuration-2.png)

## commitlint

`commitlint` 检查 `git commit` 时的 `message` 格式是否符合规范。

### 安装依赖

```zsh
pnpm add commitlint @commitlint/config-conventional -D
```
`@commitlint/config-conventional`：是一个规范配置，标识采用什么规范来执行消息校验, 这个默认是Angular的提交规范。

### 规则配置

在`src`同层级目录下新建`commitlint.config.js`文件，内容如下：

```js
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build',
        'ci',
        'chore',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
        'addLog',
      ],
    ],
  },
}
```
### 新增钩子

新增`husky`的`commit-msg`钩子，执行如下命令：

```zsh
echo "pnpm dlx commitlint --edit "$1"" > .husky/commit-msg 
```
修改`package.json`中的`husky`配置：

```json
"husky": {
    "hooks": {
        "pre-commit": "lint-staged",
        "commit-msg": "commitlint --config commitlint.config.js"
    }
},
```
效果：

![An image](/configuration/configuration-3.png)

## 配置可视化的提交提示

### 安装依赖：

```zsh
pnpm add commitizen cz-conventional-changelog -D
```
### 规则配置

在`package.json`中增加`commitizen`的配置，并增加命令：

```json
{
    "script": {
        "commit": "git-cz"
    },
    "config": {
        "commitizen": {
            "path": "node_modules/cz-conventional-changlog"
        }
    }
}
```
效果如下：

![An image](/configuration/configuration-4.png)

## 配置自定义提交规范

### 安装依赖

```zsh
pnpm add cz-customizable commitlint-config-cz -D
```
### 变更配置

变更`commitlint-config-js`的配置，采用自定义配置：

```js
export default {
    extends: ['cz'],
    rules: {}
}
```
注：如果采用自定义配置，则`@commitlint/config-conventional`依赖不需要安装。

增加自定义`.cz-config.cjs`文件，内容如下：

```js
module.exports = {
	types: [
		{value: 'feat', name: '✨新增:    新的内容'},
		{value: 'fix', name: '🐛修复:    修复一个Bug'},
		{value: 'docs', name: '📝文档:    变更的只有文档'},
		{value: 'style', name: '💄格式:    空格, 分号等格式修复'},
		{value: 'refactor', name: '️♻️重构:    代码重构，注意和特性、修复区分开'},
		{value: 'perf', name: '️️⚡️性能:    提升性能'},
		{value: 'test', name: '✅测试:    添加一个测试'},
		{value: 'build', name: '🔧工具:    开发工具变动(构建、脚手架工具等)'},
		{value: 'rollback', name: '⏪回滚:    代码回退'},
		{value: 'addLog', name: '👨🏻‍💻添加log:    代码回退'},
	],
	scopes: [
		{name: 'leetcode'},
		{name: 'javascript'},
		{name: 'typescript'},
		{name: 'Vue'},
		{name: 'node'},
	],
	// override the messages, defaults are as follows
	messages: {
		type: '选择一种你的提交类型:',
		scope: '选择一个scope (可选):',
		// used if allowCustomScopes is true
		customScope: 'Denote the SCOPE of this change:',
		subject: '短说明:\n',
		body: '长说明，使用"|"换行(可选)：\n',
		breaking: '非兼容性说明 (可选):\n',
		footer: '关联关闭的issue，例如：#31, #34(可选):\n',
		confirmCommit: '确定提交说明?(yes/no)',
	},
	allowCustomScopes: true,
	allowBreakingChanges: ['特性', '修复'],
	// limit subject length
	subjectLimit: 100,
};
```
修改`package.json`中增加`commitizen`的配置，如下：

```json
{
  "config": {
    "commitizen": {
      "path": "node_modules/cz-customizable"
    },
    "cz-customizable": {
      "config": ".cz-config.cjs"
    }
  }
}
```
效果如下：

![An image](/configuration/configuration-5.png)

## 配置使用`git commit`走自定义流程

新增`husky`的`prepare-commit-msg`钩子，并增加脚本内容：

```zsh
echo "exec < /dev/tty && node_modules/.bin/cz --hook || true" > .husky/prepare-commit-msg
```
最终效果如下：

![An image](/configuration/configuration-6.png)











