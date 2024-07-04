---
outline: deep
---

# 学习 LLM 的工具

## Deno 和 Jupyter Notebook

### Deno

Deno 是把 nodejs 中分散的生态整合在一起，并提供更现代的框架支持（基于 Rust 的现代 JavaScript 和 TypeScript 运行时环境）。 例如 Deno 开箱支持 TypeScript、自带格式化工具、自带测试框架、高质量的标准库，并且有比较好的安全性，默认脚本不能访问文件、环境或者网络 等等好用的功能。

### Jupyter Notebook

AI 领域比较常用的工具.

## 配置

Jupyter Notebook 项目开始以 python 为主，后续 deno 提供了 js/ts Kernel 的支持，所以我们需要分别安装这两个。

### 安装 python

python: 最好是 3.9 版本及以上

### 安装 Jupyter Notebook

```bash
pip3 install notebook
```

### 安装 Deno 环境

1. 使用 Shell (macOS 和 Linux):

```sh
curl -fsSL https://deno.land/x/install/install.sh | sh
```

默认安装路径：

```sh
~/.deno/bin/deno
```

2. 使用 PowerShell (Windows):

```bash
iwr https://deno.land/x/install/install.ps1 -useb | iex
```

默认安装路径：

```bash
C:\Users\YourUsername\.deno\bin\deno.exe
```

也可以从 Deno 官方网站 下载二进制文件并将其放置在你希望的路径下。然后，将该路径添加到你的系统 PATH 变量中。

3. 输入命令 `deno --version` 打印出 Deno 版本，说明安装成功。

### 使用 Deno 为 Jupyter Notebook 配置 kernel

```bash
deno jupyter --unstable --install
```

Deno Kernel: 是一个可以执行 Deno 代码的内核. 通过安装 Deno kernel, 可以在 Jupyter Notebook 中编写和运行 Deno 代码。

### 运行 notebook

```bash
jupyter notebook
```

启动成功后，会自动打开网页：

![An image](/jupyter-notebook/jupyter-notebook-1.png)

可以安装 vscode 插件，使用 vscode 去编辑和运行 notebook。

![An image](/jupyter-notebook/jupyter-notebook-2.png)

注：右上角切换 kernel 为 Deno。

![An image](/jupyter-notebook/jupyter-notebook-3.png)

## Deno 依赖管理

Deno 直接从远程拉取依赖，自带缓存机制，而不需要本地安装，例如 lodash 库，不需要像 nodejs 一样使用 npm/yarn 等来安装依赖，而是可以直接从远程引入：

```ts
import _ from "npm:/lodash
```

锁定版本：

```ts
import _ from 'npm:/lodash@4.17.21';
```

这个命令，就会让 deno 从 npm 找到对应的 lodash 包，然后引入，可以在另一个代码块中使用引入后的 `_`，比如：

```ts
const a = _.random(0, 5);
a;
```

![An image](/jupyter-notebook/jupyter-notebook-4.png)

可以在顶层创建一个文件 deno.json 来给设置别名：

```diff
- 1-test-notebook.ipynb
- deno.json
```

deno.json 中的具体内容：

```json
{
	"imports": {
		"lodash": "npm:/lodash@4.17.21"
	},
	"deno.enable": true
}
```

<span style="color:red;font-weight:bold">注：</span>`deno.enable: true`: 是如果你用了 deno 的 vscode 插件，可以让它识别到。

在 vscode 中安装 deno 插件：

![An image](/jupyter-notebook/jupyter-notebook-4.png)

并在 `setting.json` 中，添加配置：

```json
{
	"deno.enable": true,
	"deno.path": "D:\\Program Files\\deno\\deno.exe"
}
```

<span style="color:red;font-weight:bold">注：</span>`deno.path`: 本地安装的 deno 执行文件所在的路径。
