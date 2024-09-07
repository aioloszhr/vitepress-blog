---
outline: deep
---

# Retriever: 构建向量数据库

## 创建 MemoryVectorStore

Vector store 提供提供的是存储向量和原始文档，并且提供基于向量进行相关性检索的能力。Langchain 提供了用于测试时，在 **内存** 中构建的向量数据库，并且支持多种常见的相似性度量方式。

<span style="color:red; font-weight: bold">注意</span>，因为 `embedding` 向量是需要有一定的花费的，所以仅在学习和测试时使用 `MemoryVectorStore`，而在真实项目中，搭建其他向量数据库，或者使用云数据库。所以，这部分可以先看教程，不用跟着操作，在后面使用有持久化能力的 `vector store` 再操作，来节约花费。

创建 `MemoryVectorStore` 的实例，并传入需要 `embeddings` 的模型，调用添加文档的 `addDocuments` 函数，然后 langchain 的 `MemoryVectorStore` 就会自动帮我们完成对每个文档请求 `embeddings` 的模型，然后存入数据库的操作。

```ts
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

const vectorstore = new MemoryVectorStore(embeddings);
await vectorstore.addDocuments(splitDocs);
```

创建一个 `retriever`，这也是可以直接从 `vector store` 的实例中自动生成，这里我们传入了参数 **2**，代表对应每个输入，我们想要返回相似度最高的
**两个文本内容** 。

```ts
const retriever = vectorstore.asRetriever(2);
```

然后，可以使用 `retriever` 来进行文档的提取：

```ts
const res = await retriever.invoke('茴香豆是做什么用的');
```

```ts
[
  Document {
    pageContent: "有喝酒的人便都看着他笑，有的叫道，“孔乙己，你脸上又添上新伤疤了！”他不回答，对柜里说，“温两碗酒，要一碟茴香豆。”便排出九文大钱。他们又故意的高声嚷道，“你一定又偷了人家的东西了！”孔乙己睁大眼睛说",
    metadata: { source: "data/kong.txt", loc: { lines: { from: 7, to: 7 } } }
  },
  Document {
    pageContent: "有几回，邻居孩子听得笑声，也赶热闹，围住了孔乙己。他便给他们一人一颗。孩子吃完豆，仍然不散，眼睛都望着碟子。孔乙己着了慌，伸开五指将碟子罩住，弯腰下去说道，“不多了，我已经不多了。”直起身又看一看豆",
    metadata: { source: "data/kong.txt", loc: { lines: { from: 15, to: 15 } } }
  }
]
```

就提取出跟茴香豆相关的内容。 因为在提取的时候，是根据相似度进行度量的，所以如果用户提问的特别简洁，并没有相应的关键词，就会出现提取的信息错误的问题，例如：

```ts
const res = await retriever.invoke("下酒菜一般是什么？")


[
  Document {
    pageContent: "顾客，多是短衣帮，大抵没有这样阔绰。只有穿长衫的，才踱进店面隔壁的房子里，要酒要菜，慢慢地坐喝。",
    metadata: { source: "data/kong.txt", loc: { lines: { from: 1, to: 1 } } }
  },
  Document {
    pageContent: "有喝酒的人便都看着他笑，有的叫道，“孔乙己，你脸上又添上新伤疤了！”他不回答，对柜里说，“温两碗酒，要一碟茴香豆。”便排出九文大钱。他们又故意的高声嚷道，“你一定又偷了人家的东西了！”孔乙己睁大眼睛说",
    metadata: { source: "data/kong.txt", loc: { lines: { from: 7, to: 7 } } }
  }
]
```

这里第一个数据源是跟下酒菜有关的，但我们这个问题想要的答案明显是从第二个文档信息中才能得到的。所以为了 **提高回答质量**，**返回更多的数据源** 是有价值的。

但如果涉及到多层语意理解才能构建出联系的情况就比较难说了，例如：

```ts
const res = await retriever.invoke("孔乙己用什么谋生？")

[
  Document {
    pageContent: "孔乙己是这样的使人快活，可是没有他，别人也便这么过。",
    metadata: { source: "data/kong.txt", loc: { lines: { from: 17, to: 17 } } }
  },
  Document {
    pageContent: "孔乙己喝过半碗酒，涨红的脸色渐渐复了原，旁人便又问道，“孔乙己，你当真认识字么？”孔乙己看着问他的人，显出不屑置辩的神气。他们便接着说道，“你怎的连半个秀才也捞不到呢？”孔乙己立刻显出颓唐不安模样，",
    metadata: { source: "data/kong.txt", loc: { lines: { from: 11, to: 11 } } }
  }
]
```

这种情况只依靠相似度的对比就很难查找到正确的数据源，需要多层语意的转换才能找到合适数据源。

## 构建本地 vector store

因为对数据生成 embedding 需要一定的花费，所以我们希望把 embedding 的结果持久化，这样可以在应用中持续复用。

facebook 开源的 [faiss](https://github.com/facebookresearch/faiss) 向量数据库，可以将向量数据库导出成文件，并且提供了 python 和 nodejs 的处理方式。

创建一个正常的 nodejs 项目，然后安装依赖：

```bash
pnpm add dotenv faiss-node langchain
```

```ts
const run = async () => {
	const loader = new TextLoader('../data/kong.txt');
	const docs = await loader.load();

	const splitter = new RecursiveCharacterTextSplitter({
		chunkSize: 100,
		chunkOverlap: 20
	});
	const splitDocs = await splitter.splitDocuments(docs);

	const embeddings = new OpenAIEmbeddings();
	const vectorStore = await FaissStore.fromDocuments(splitDocs, embeddings);

	const directory = '../db/kongyiji';
	await vectorStore.save(directory);
};

run();
```

在这段代码中，前半部分就是正常的加载和切割数据，就跟我们前几节课讲的一样。 后半部分因为有 langchain 的模块化，跟 `MemoryVectorStore` 是几乎一致，同样的我们也可以用几乎类似的 `interface` 去切换到其他的 `vector store`。

然后，我们使用：

```ts
await vectorStore.save(directory);
```

去将构建好的 vector store 存储在文件系统中去方便未来复用。

然后，我们就可以写另一个脚本去加载存储好的 `vector store`：

```ts
const directory = '../db/kongyiji';
const embeddings = new OpenAIEmbeddings();
const vectorstore = await FaissStore.load(directory, embeddings);
```

然后就像我们使用 `MemoryVectorStore` 一样，去创建一个 `Retriever` 实例，去获取根据相似度返回的文档：

```ts
const retriever = vectorstore.asRetriever(2);
const res = await retriever.invoke('茴香豆是做什么用的');
```

```ts
[
	{
		pageContent:
			'有喝酒的人便都看着他笑，有的叫道，“孔乙己，你脸上又添上新伤疤了！”他不回答，对柜里说，“温两碗酒，要一碟茴香豆。”便排出九文大钱。他们又故意的高声嚷道，“你一定又偷了人家的东西了！”孔乙己睁大眼睛说',
		metadata: { source: '../data/kong.txt', loc: [Object] }
	},
	{
		pageContent:
			'有几回，邻居孩子听得笑声，也赶热闹，围住了孔乙己。他便给他们一人一颗。孩子吃完豆，仍然不散，眼睛都望着碟子。孔乙己着了慌，伸开五指将碟子罩住，弯腰下去说道，“不多了，我已经不多了。”直起身又看一看豆',
		metadata: { source: '../data/kong.txt', loc: [Object] }
	}
];
```
