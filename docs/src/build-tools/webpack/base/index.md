---
outline: deep
---

# 基础

## Webpack的作用

`Webpack`是一个现代的前端模块打包工具，它用于构建和优化`Web`应用程序的前端资源，包括JavaScript、Css、图片、字体等。
`Webpack`的目标是将项目的所有依赖项（模块，资源文件）打包到一个或多个最终的静态文件中，以便在浏览器中加载，改善前端开发的工作流程，
提高代码的可维护性和性能，解决了模块化、资源管理、性能优化和自动化等多个关键问题。

## Webpack的构建流程

- 读取配置文件：`Webpack`首选会读取项目中的配置文件（通常是webpack.config.js），改配置文件包含了构建过程中的各种配置，如入口文件、输出目录、加载器（loaders）、插件（plugins）等。

- 解析入口文件：`Webpack`会根据配置文件中定义的入口点（entry points）来解析应用程序的依赖关系。入口文件通常是应用程序的主要JavaScript文件，但也可以有多个入口文件。

- 依赖解析：`Webpack`分析入口文件和其依赖的模块，构建成一个依赖分析图，以确定哪些模块依赖于其他模块，以及它们之间的依赖关系。

- 加载器处理（loader）：`Webpack`使用加载器处理来处理不同类型的资源文件，如CSS、图片、字体等。加载器允许开发人员在构建过程中转换这些资源文件，以便将它们整合到最终的输出文件中。默认情况下，`webpack`只支持对`js`和`json`文件进行打包，但是像`css`、`html`、`png`等其他类型的文件，`webpack`则无能为力。因此，就需要配置相应的`loader`进行文件内容的解析转换。

- 插件处理（Plugin）：`Webpack`提供了插件系统，插件用于执行各种任务，如代码压缩、资源优化、HTML生成、热模块替换（HMR）等。插件可以根据需要自定义`Webpack`的构建过程。

- 生成输出文件：`Webpack`根据入口文件和依赖关系图生成一个或多个输出文件。这些输出文件包括JavaScript文件、CSS文件、图片、字体等资源文件

- 优化和压缩：`Webpack`可以进行各种优化，包括代码压缩、Tree Shaking、懒加载等，以减小包的大小并提高性能

- 生成SOURCE MAPS：Webpack可以生成Source Maps，以便在开发中进行调试。`Source Maps`是一种映射文件，将最终输出文件映射回源代码文件。

- 输出到指定目录：最终的构建结果被输出到配置文件中指定的目录中，通常是`dist`的目录。输出文件的命名和目录结构也可以根据配置进行自定义。

- 完成构建过程：`Webpack`构建过程完成后，它会生成构建报告，包括构建成功或失败的信息，输出文件的大小等统计信息。

## Webpack 热更新的原理

![An image](/webpack/base/base-1.png)

开发服务器和客户端通过websocket建立连接

- 监控文件变化：Webpack的开发服务器会监控项目中所有的模块文件，包括：JS文件、CSS文件、模块文件等
- 模块热替换：当你在代码中做出更改并保存时，Webpack检查到文件变化，会首选通过热替换插件（Hot Module Replacement Plugin ）生成新的模块代码
- 构建更新的模块：生成的新模块代码会被构建成一个独立的文件或数据块
- 通知客户端：Webpack开发服务器会将更新的模块代码信息发送到浏览器
- 浏览器端处理：浏览器接收到更新的模块信息后，会在不刷新页面的情况下通过热替换运行时（Hot Module Replacement Runtime）替换相应的模块
- 应用程序状态保存：热更新可以保存应用的状态。当修改代码不会丢失已有的数据、用户登录状态等
- 回调处理：允许在模块更新时执行自定义的回调函数，可以处理待定的逻辑，以确保模块更新后的正确性

## Webpack常用Loader

- image-loader: 加载并且压缩图片文件
- less-loader: 加载并编译LESS文件
- sass-loader: 加载并编译SASS/SCSS文件
- css-loader: 加载CSS，支持模块化、压缩、文件导入等特性，使用`css-loader`必须配合使用`style-loader`
- style-loader: 用于将CSS编译完成的样式，挂载到页面的style标签上。需要注意`loader`执行顺序，`style-loader`要放在第一位，`loader`都是从后往前执行
- postcss-loader: 扩展CSS语法，使用下一代CSS，可以配合`autoprefixer`自动补齐CSS3前缀
- eslint-loader: 通过ESlint检查Javascript代码
- vue-loader: 加载并编译vue组件
- file-loader: 把文件输出到一个文件夹中，在代码通过相对URL去引用输出的文件（处理图片和字体）
- url-loader: 与`file-loader`类似，区别是用户可以设置一个阈值，大于阈值会给`file-loader`处理，小于阈值返回文件base64形式编码（处理图片和字体）

## Webpack常用plugin

`webpack`中的`plugin`赋予其各种灵活的功能，例如打包优化、资源管理、环境变量注入等，它们会运行在`webpack`的不同阶段（钩子 / 生命周期），贯穿了`webpack`整个编译周期。目的在于解决 `loader` 无法实现的其他事。
常用的plugin如下：

- HtmlWebpackPlugin: 简化 HTML 文件创建 (依赖于 html-loader)
- mini-css-extract-plugin: 分离样式文件，CSS 提取为独立文件，支持按需加载 (替代extract-text-webpack-plugin)
- clean-webpack-plugin: 目录清理

## loader和plugin的区别

`loader`是文件加载器，能够加载资源文件，并对这些文件进行一些处理，诸如编译、压缩等，最终一起打包到指定的文件中；`plugin`赋予了`webpack`各种灵活的功能，例如打包优化、资源管理、环境变量注入等，目的是解决 `loader` 无法实现的其他事。

在运行时机上，`loader` 运行在打包文件之前；`plugin`则是在整个编译周期都起作用。
在配置上，`loader`在`module.rules`中配置，作为模块的解析规则，类型为数组。每一项都是一个 `Object`，内部包含了 `test`(类型文件)、`loader`、`options` (参数)等属性；`plugin`在 `plugins` 中单独配置，类型为数组，每一项是一个 `plugin` 的实例，参数都通过构造函数传入。

## Webpack构建速度的提升

- 升级Webpack最新版本：使用最新版本的Webpack，因为每个新版本通常都会包含性能改进和优化

- 使用持久缓存：配置Webpack以生产长期缓存的文件名，在构建时只有修改过的文件需要重新构建

- 使用多进程/多线程构建：使用thread-loader、happyPack等插件可以将构建过程分成多个进程或线程

- 使用DllPlugin和HardSourceWebpackPlugin：`DllPlugin`可以将第三方库预先打包成单独的文件，减少构建时间。`HardSourceWebpackPlugin`可以缓存中间文件，加速后续构建过程

- 使用Tree Shaking：配置Webpack的Tree Shaking机制，去除未使用的代码，减小生成的文件体积

- 移除不必要的插件：移除不必要的插件和配置，避免不必要的复杂性和性能开销

## 如何减少打包后的代码体积

- 代码分割（Code Splitting）：将应用程序的代码划分为多个代码块，按需加载
- Tree Shaking：配置Webpack的Tree Shaking机制，去除未使用的代码
- 压缩代码：使用工具如UglifyJS或Terser来压缩JavaScript代码
- 使用生产模式：在Webpack中使用生产模式，通过设置mode: 'production'来启用优化
- 使用压缩工具：使用现代的压缩工具，如Brotli和Gzip，来对静态资源进行压缩
- 利用CDN加速：将项目中引用的静态资源路径修改为CDN上的路径，减少图片、字体等静态资源等打包

## Webpack的Tree Shaking的原理

`Webpack`的`Tree Shaking`是一个利用`ES6`模块静态结构特性来去除生产环境下不必要代码的过程。
其工作原理：

- 当`Webpack`分析代码时，它会标记出所有的`import`和`export`语句
- 然后，当`Webpack`确定某个模块没有被导入时，它会在生成的bundle中排除这个模块的代码
- 同时，`Webpack`还会进行递归的标记清理，以确保所有未使用的依赖项不会出现在最终的bundle中

```ts
module.exports = {
	// ...
	optimization: {
		usedExports: true,
		concatenateModules: true,
		minimize: true
	}
	// ...
};
```
