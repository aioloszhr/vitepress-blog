---
outline: deep
---

# Embeddinig: 多数据源加载

RAG 的本质是给 chat bot 外挂数据源，而考虑到各种应用场景，数据源的形式也多种多样，有的是文件/数据库/网络数据/代码 等等情况。 针对此，langchain 提供了一系列的开箱即用的 loader 来帮助开发者处理不同数据源的数据。

## Document 对象

Document 对象可以理解成 langchain 对所有类型的数据的一个统一抽象，其中包含

- `pageContent` 文本内容，即文档对象对应的文本数据
- `metadata` 元数据，文本数据对应的元数据，例如 原始文档的标题、页数等信息，可以用于后面 `Retriver` 基于此进行筛选。

其 TypeScript 对象为：

```ts
interface Document {
	pageContent: string;
	metadata: Record<string, any>;
}
```

`Document` 对象一般是由各种 `Loader` 自动创建，也可以手动创建：

```ts
import { Document } from 'langchain/document';

const test = new Document({ pageContent: 'test text', metadata: { source: 'ABC Title' } });
```

把 `test` 打印出来，就是这样：

```ts
Document {
  pageContent: "test text",
  metadata: { source: "ABC Title" }
}
```

## Loader

处理数据的第一步就是加载数据，正常需要为目标的数据格式（json、csv、txt）来查找需要的库和写加载文件的代码，而有了 langchain 后，其内置了大多数据文件的读取支持，

### TextLoader

对文件所在的路径进行加载

```ts
import { TextLoader } from 'langchain/document_loaders/fs/text';

// data/qiu.txt: 相对路径
const loader = new TextLoader('data/qiu.txt');

const docs = await loader.load();
```

加载后的结果打印出来分析一下：

```ts
[
  Document {
    pageContent: "三体前传：球状闪电 作者：刘慈欣\r\n" +
      "\r\n" +
      "内容简介：\r\n" +
      "　　没有《球状闪电》，就没有后来的《三体》！\r\n" +
      "　　《三体》前传！\r\n" +
      "　　亚洲首位雨果奖得主刘慈欣的三大长篇之一！（《三体》《球状闪电》《超新星纪"... 192095 more characters,
    metadata: { source: "data/qiu.txt" }
  }
]
```

整个返回对象就是一个 `Document` 对象的实例。其中 `pageContent` 是文本的原始内容，而在 `metadata` 中是跟这个对象相关的一些元数据，这里就是加载原始文件的文件名。

### PDFLoader

PDF 是常见的数据来源，很多 chatbot 也支持用户上传任意 pdf 作为外挂数据库，来让聊天内容和背景知识聚焦在某个 pdf 中。

### DirectoryLoader

当需要加载一个文件夹下多种格式的文件时，就可以使用 `DirectoryLoader`，需要预先定义对该文件夹不同文件类型的 Loader。

```ts
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';

const loader = new DirectoryLoader('./data', {
	'.pdf': path => new PDFLoader(path, { splitPages: false }),
	'.txt': path => new TextLoader(path)
});
const docs = await loader.load();
```

## Web Loader

上面主要讲的是从文件中去加载数据，而来自网络的数据也是 chat bot 比较重要的数据源，例如 new bing 等基于搜索的 chat bot，就是根据用的需求去从互联网爬取数据，然后以此为上下文进行回答。

### Github loader

基于某个开源项目构建数据库，然后根据用户提问寻找与此相关的代码片段回答用户问题，是很多开发者梦想中的工具。因为开发中经常遇到文档不全需要自己寻找源代码找到解决办法的场景，让 llm 去寻找和理解显然比我们的速度要快很多。

```ts
import { GithubRepoLoader } from 'langchain/document_loaders/web/github';
import ignore from 'ignore';

const loader = new GithubRepoLoader('https://github.com/RealKai42/qwerty-learner', {
	branch: 'master',
	recursive: false,
	unknown: 'warn',
	ignorePaths: ['*.md', 'yarn.lock', '*.json'],
	accessToken: env['GITHUB_TOKEN']
});
```

- `branch` 要设置正确，有的是 main 有的 master。
- `recursive` 是否递归的访问文件夹内部的内容，如果是为了测试建议是关闭，请求量比较大，等待比较久。
- `ignorePaths` 使用的 git ignore 的语法，忽略掉一些特定格式的文件，这里是我把项目中比较大的 json 给忽略掉了，大家可以根据不同项目的特点进行设置。
- `accessToken` 是 github API 的 accessToken，在没有设置的情况也能访问，但有频率设置。

构建出来的结果：

```ts
[
...,
Document {
    pageContent: "/** @type {import('tailwindcss').Config} */\n" +
      "module.exports = {\n" +
      "  darkMode: ['class'],\n" +
      "  content: ['."... 1652 more characters,
    metadata: {
      source: "tailwind.config.js",
      repository: "https://github.com/RealKai42/qwerty-learner",
      branch: "master"
    }
  },
...
]
```

`GithubRepoLoader` 会在爬取的文件的时候自动记录下相关的 `metadata`，方便后续使用。

### WebLoader

对于 llm 所需要提取的信息是网页中静态的信息时，一般使用 Cheerio 用来提取和处理 html 内容，类似于 python 中的 BeautifulSoup。 这两者都是只能针对静态的 html，无法运行其中的 js, 对大部分场景都是够用的：

```ts
import 'cheerio';
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';

const loader = new CheerioWebBaseLoader('https://kaiyi.cool/blog/github-copilot');

const docs = await loader.load();
```

可以看到打印出来的效果就是纯文本，并不需要我们对其中的 html 标签进行处理。

也可以用类似于 jQuery 的语法对 html 中的元素进行选择和过滤，例如：

```ts
const loader = new CheerioWebBaseLoader('https://kaiyi.cool/blog/github-copilot', {
	selector: 'h3'
});

const docs = await loader.load();
console.log(docs[0].pageContent);
```

就会只输出 h3 标题的内容，也可以根据 css 类等其他选择器对内容进行 filter:

```text
0. 一些基础信息1. 基本使用思路2.变量命名3. 代码速读，代码精读，加注释解析，寻找修改项4. 代码改写，用 xx 库实现整体逻辑5. ai-native 的开发方式6. 报错解析7. 解释 review message8. 提高代码质量，设计优化9. 灵活使用 cmd+i10. 写 commit message11. 基础脚手架、基础 poc12. 中间插入一些唠叨13. llm as doc/search14. 碎碎念15. vsc plugin 开发
```

### Search API

这是给 chatbot 接入网络支持最重要的 API，对于 langchain.js 来说，常用的是 `SearchApiLoader` 和 `SerpAPILoader` 这个两个提供的都是接入搜索的能力，免费计划都是每个月 100 次 search 能力，除了 google 外，也支持 baidu/bing 等常用的搜索引擎。这两个 API 的使用方式大差不差，所以我们这里以 `SerpAPILoader` 来讲解。

```ts
import { SerpAPILoader } from '@langchain/community/document_loaders/web/serpapi';

const apiKey = env['SERP_KEY']; // serpapi 的 apikey
const question = '什么 github copliot';
const loader = new SerpAPILoader({ q: question, apiKey });
const docs = await loader.load();
```

返回结果：

```ts
[
  Document {
    pageContent: '{"title":"GitHub Copilot","type":"Software","entity_type":"kp3_verticals","kgmid":"/g/11q83qbj3d","k'... 7060 more characters,
    metadata: { source: "SerpAPI", responseType: "knowledge_graph" }
  },
  Document {
    pageContent: '{"position":1,"title":"什么是GitHub Copilot？ [共6 个]","link":"https://learn.microsoft.com/zh-cn/shows/in'... 695 more characters,
    metadata: { source: "SerpAPI", responseType: "organic_results" }
  },
  Document {
    pageContent: '{"position":2,"title":"什么是GitHub Copilot？一个适合所有人的人工智能配对程序员","link":"https://juejin.cn/post/709008265'... 650 more characters,
    metadata: { source: "SerpAPI", responseType: "organic_results" }
  },
  ...]
```

serp 非常强大，其不止是返回 google 搜索的结果，并且会爬取每个结果的汇总和信息放在 pageContent，搭配 lanchain 的对应的集成了，提供了开箱即用的接入 google 搜索和爬取内容的能力，也就是给 chatbot 提供了访问互联网的能力。
