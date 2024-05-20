---
outline: deep
---

# 常用选项

安装 npm 包 常用选项

## --save-exact

`--save-exact` 是一个选项，可以在使用包管理工具 npm（Node Package Manager）时使用，尤其是在安装依赖包时。这个选项的主要作用是确保在 package.json 文件中精确地保存所安装包的版本号，而不是使用版本范围。

**示例**

假设你运行以下命令：

```bash
npm install lodash@4.17.21 --save-exact
```

package.json 中的 dependencies 部分会更新为：

```json
{
	"dependencies": {
		"lodash": "4.17.21"
	}
}
```

如果不使用 --save-exact，默认情况下会使用 ^ 前缀：

```json
{
	"dependencies": {
		"lodash": "^4.17.21"
	}
}
```
