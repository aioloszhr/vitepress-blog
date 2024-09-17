---
outline: deep
---

## eslint + prettier + husky + lint-staged + commitlint

### editorConfig

#### 什么是editorConfig

官方的解释：

> EditorConfig 有助于为跨各种编辑器和 IDE 处理同一项目的多个开发人员维护一致的编码风格。EditorConfig 项目由用于定义编码样式的文件格式和一组文本编辑器插件组成，这些插件使编辑器能够读取文件格式并遵循定义的样式。

#### 如何使用

1. EditorConfig插件： vscode 中安装插件 `EditorConfig for VS Code`，webstorm 默认支持。

2. .editorConfig自定义文件： editorconfig 自定义文件是用来定义编辑器的编码格式规范，编辑器的行为会与 .editorconfig 文件中定义的一致，**并且其优先级比编辑器自身的设置要高**。

3. .editorConfig文件格式：

```bash
root = true # 控制配置文件 .editorconfig 是否生效的字段
​
[**] # 匹配全部文件
indent_style = space # 缩进风格，可选space｜tab
indent_size = 2 # 缩进的空格数
charset = utf-8 # 设置字符集
trim_trailing_whitespace = true # 删除一行中的前后空格
insert_final_newline = true # 设为true表示使文件以一个空白行结尾
end_of_line = lf
​
[**.md] # 匹配md文件
trim_trailing_whitespace = false
```

### Eslint

#### 初始化Eslint

```bash
    pnpm create @eslint/config@latest
```

完成后会在项目下生成一个`eslint.config.js`文件, <span style="color:red">该文件位于项目根目录下，与 src 同级</span>

文件内容如下：

```js
import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';

export default [
	{ files: ['**/*.{js,mjs,cjs,ts,vue}'] },
	{ languageOptions: { globals: globals.browser } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	...pluginVue.configs['flat/essential'],
	{ files: ['**/*.vue'], languageOptions: { parserOptions: { parser: tseslint.parser } } }
];
```

内容解释：

```js
import globals from 'globals';
// 导入了 `globals`全局变量的库模块，该模块提供了一组预定义的全局变量（如 window、document 等），这些变量通常在不同的环境（如浏览器、Node.js）中可用。在 ESLint 配置中，你可以使用这个模块来指定代码所运行的环境，从而定义全局变量。

import pluginJs from '@eslint/js';
//针对 JavaScript 的 ESLint 配置和规则。保持 JavaScript 代码的一致性和质量

import tseslint from 'typescript-eslint';
// 导入 `typescript-eslint` 插件（ `typescript-eslint/parser` 和 `typescript-eslint/eslint-plugin`）。提供了对 TypeScript 的支持，包括 TS 的解析器和推荐的规则集，用于在 TypeScript 文件中进行 lint 检查。

import pluginVue from 'eslint-plugin-vue';
// 导入 `eslint-plugin-vue` 插件，提供了 Vue.js 特有 ESLint 规则。确保 Vue 文件（`.vue` 文件）中的代码符合 Vue.js 的最佳实践和代码风格指南

export default [
	{ files: ['**/*.{js,mjs,cjs,ts,vue}'] },
	//**文件匹配**：`files` 属性指定了哪些文件类型（JavaScript、TypeScript、Vue 文件等）将应用这些规则

	{ languageOptions: { globals: globals.browser } },
	//1.  **全局变量**：`languageOptions` 配置了浏览器环境下的全局变量。

	// **插件和规则**：
	pluginJs.configs.recommended,
	//`pluginJs.configs.recommended` 引入了 `@eslint/js` 插件的推荐规则。

	...tseslint.configs.recommended,
	// 引入 `typescript-eslint` 插件的推荐规则

	...pluginVue.configs['flat/essential'],
	// 引入`eslint-plugin-vue` 插件的基础规则

	{
		files: ['**/*.vue'],
		// 针对 Vue 文件配置

		languageOptions: { parserOptions: { parser: tseslint.parser } }
		//为 `.vue` 文件指定了 TypeScript 解析器
	}
];
```

#### 搭建配置

##### 配置 eslint(eslint.config.js)

完整配置：

```js
import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import standard from 'eslint-config-standard';

export default [
	// 指定文件匹配模式
	{
		files: ['**/*.{js,mjs,cjs,ts,vue}']
	},
	// 指定全局变量和环境
	{
		languageOptions: {
			globals: globals.browser,
			ecmaVersion: 12, // 使用最新的 ECMAScript 语法
			sourceType: 'module' // 代码是 ECMAScript 模块
		}
	},
	// 使用的扩展配置
	pluginJs.configs.recommended,
	pluginVue.configs['flat/essential'],
	standard, // 该插件还没有和eslint@9版本适配
	// 自定义规则
	{
		rules: {
			indent: ['error', 2], // 缩进使用 2 个空格
			'linebreak-style': ['error', 'unix'], // 使用 Unix 风格的换行符
			quotes: ['error', 'single'], // 使用单引号
			semi: ['error', 'never'], // 语句末尾不加分号
			'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // 生产环境中警告 console 使用，开发环境中关闭规则
			'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off' // 生产环境中警告 debugger 使用，开发环境中关闭规则
		}
	}
];
```

##### 配置 vite.config.ts 之中的 Eslint

```ts
// 导入Eslint插件
import eslintPlugin from 'vite-plugin-eslint';

plugins: [
	// eslint插件配置
	eslintPlugin({
		include: ['src/**/*.js', 'src/**/*.vue', 'src/**/*.ts'], // 指定需要检查的文件
		exclude: ['node_modules/**', 'dist/**'], // 指定不需要检查的文件
		fix: true, // 是否自动修复
		cache: false // 是否启用缓存
	})
];
```

### prettier

#### prettier安装和配置

1. 安装

```bash
pnpm add prettier eslint-plugin-prettier eslint-config-prettier -D
```

2. 配置

在与 `src` 同级目录下，新建 `prettier.config.js` 文件。

内容如下：

```js
// prettier.config.js
export default {
	printWidth: 100, // 最大行长规则通常设置为 100 或 120。
	tabWidth: 2, // 指定每个标签缩进级别的空格数。
	useTabs: false, // 使用制表符而不是空格缩进行。
	semi: false, // true（默认）: 在每条语句的末尾添加一个分号。false：仅在可能导致 ASI 失败的行的开头添加分号。
	vueIndentScriptAndStyle: true, // Vue 文件脚本和样式标签缩进
	singleQuote: true, // 使用单引号而不是双引号
	quoteProps: 'as-needed', // 引用对象中的属性时，仅在需要时在对象属性周围添加引号。
	bracketSpacing: true, // 在对象文字中的括号之间打印空格。
	trailingComma: 'none', // "none":没有尾随逗号。"es5": 在 ES5 中有效的尾随逗号（对象、数组等），TypeScript 中的类型参数中没有尾随逗号。"all"- 尽可能使用尾随逗号。
	bracketSameLine: false, // 将>多行 HTML（HTML、JSX、Vue、Angular）元素放在最后一行的末尾，而不是单独放在下一行（不适用于自闭合元素）。
	jsxSingleQuote: false, // 在 JSX 中使用单引号而不是双引号。
	arrowParens: 'always', // 在唯一的箭头函数参数周围始终包含括号。
	insertPragma: false, // 插入编译指示
	requirePragma: false, // 需要编译指示
	proseWrap: 'never', // 如果散文超过打印宽度，则换行
	htmlWhitespaceSensitivity: 'strict', // 所有标签周围的空格（或缺少空格）被认为是重要的。
	endOfLine: 'lf', // 确保在文本文件中仅使用 ( \n)换行，常见于 Linux 和 macOS 以及 git repos 内部。
	rangeStart: 0 // 格式化文件时，回到包含所选语句的第一行的开头。
};
```

#### 解决Prettier和Eslint冲突

<span style="color:red">eslint-plugin-prettier</span>插件的作用：不仅提供文件解析，代码fix，也顺带提供了一些规则配置，比如它会把跟prettier冲突的ESlint规则给off掉，并使用自己的规则，也就是说，二选一，让你选prettier。

````js
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'


export default [
  {files: ["**/*.{js,mjs,cjs,ts,vue}"]},
  {languageOptions: { globals: globals.browser, ecmaVersion: 12, sourceType: 'module',  parserOptions: {parser: tseslint.parser}, // 使用 TypeScript 解析器 }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  	// 自定义规则
	{
		rules: {
			indent: ['error', 2], // 缩进使用 2 个空格
			'linebreak-style': ['error', 'unix'], // 使用 Unix 风格的换行符
			quotes: ['error', 'single'], // 使用单引号
			semi: ['error', 'never'], // 语句末尾不加分号
			'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // 生产环境中警告 console 使用，开发环境中关闭规则
			'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off' // 生产环境中警告 debugger 使用，开发环境中关闭规则
		}
	},
  /**
  * prettier 配置
  * 会合并根目录下的prettier.config.js 文件
  * @see https://prettier.io/docs/en/options
  */
  eslintPluginPrettierRecommended
];```
````

#### 在vscode中的使用

1. 安装 `prettier` 插件

2. 在项目中新建 `.vscode` 文件夹，并新加文件 `settings.json`

内容如下：

```json
"editor.formatOnSave": true,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "vscode.json-language-features"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[less]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[scss]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
```
