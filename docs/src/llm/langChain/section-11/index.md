---
outline: deep
---

# RAG: 基于私域数据进行问答

构建一个基于私域数据回答问题的 RAG bot 的所有碎片：

- 我们掌握了如何使用 `Prompt Template` 来构建可复用的 `prompt` 模板。
- 我们掌握了使用如何根据私域数据的类型来对数据进行分块（splitter）。
- 我们掌握了构建私域数据的 `vector db`。
- 我们掌握了根据相似性去查询 `vector db` 中最相关的上下文。

## 加载和切割原始数据

这里我们收集球状闪电的原文数据，我这里使用的是 txt 格式的数据。

注意，因为版权原因，此数据集只能用于本地测试，如果要对外服务需要得到版权相关的授权才可以。在我们提供大模型相关服务时，经常会涉及到文字和数据源
**版权问题**，需要大家格外注意，当然为了学习的本地测试是没问题的。

使用 langchain 提供的 `TextLoader` 工具函数来加载 txt 中的数据：

```ts
import { TextLoader } from 'langchain/document_loaders/fs/text';

const loader = new TextLoader('data/qiu.txt');
const docs = await loader.load();
```

加载出来的数据结构：

```ts
[
  Document {
    pageContent: "三体前传：球状闪电 作者：刘慈欣\r\n" +
      "\r\n" +
      "内容简介：\r\n" +
      "　　没有《球状闪电》，就没有后来的《三体》！\r\n" +
      "　　《三体》前传！\r\n" +
      "　　亚洲首位雨果奖得主刘慈欣的三大长篇之一！（《三体》《球状闪电》《超新星纪..."
    metadata: { source: "data/qiu.txt" }
  }
]
```

加载出来是一个非常巨大的 Document 对象，显然超出大部分 LLM 的上下文限制，所以需要对原文进行切割：

```ts
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

const splitter = new RecursiveCharacterTextSplitter({
	chunkSize: 500,
	chunkOverlap: 100
});
```

切分后结果的数据格式：

```ts
console.log(splitDocs[4])

Document {
  pageContent: "“是啊，理想主义者和玩世不恭的人都觉得对方很可怜，可他们实际都很幸运。”妈妈若有所思地说。\r\n" +
    "　　平时成天忙碌的爸爸妈妈这时都变成了哲学家，倒好像这是他们在过生日。\r\n" +
    "　　“妈，别动！”我说着，从妈妈"... 330 more characters,
  metadata: { source: "data/qiu.txt", loc: { lines: { from: 35, to: 42 } } }
}
```

`RecursiveCharacterTextSplitter`， 根据内置的一些字符对原始文本进行递归的切分，来保持相关的文本片段相邻，保持切分结果内部的语意相关性。

Langchain 内置了适用于不同场景的切分工具函数，一般来说，在初期可以直接使用 `RecursiveCharacterTextSplitter`，这是比较通用的切分函数，可以在完整实现所有 Chain 之后，再去看切分函数是否影响了最终的质量，来决定是调整切分的参数，还是选择其他切分工具。

## 构建 vector store 和 retriever

有了切割后的数据后，需要将每个数据块构建成 vector，然后存出来 vector store 中，这里我们使用 tongyi 的 text-embedding-v2 模型：

```ts
import { AlibabaTongyiEmbeddings } from '@langchain/community/embeddings/alibaba_tongyi';

const client = new AlibabaTongyiEmbeddings({
	apiKey // tongyi的apiKey
});
```

需要创建一个存储 embedding vector 的 vector store，因为每次对数据进行 embedding 都需要花费一定的价格，所以最好是将 embedding 的结果永久存储在数据库中，方便在服务中使用。以 `Faiss` 向量数据库为例：

```ts
import { FaissStore } from '@langchain/community/vectorstores/faiss';

const vectorStore = await FaissStore.fromDocuments(splitDocs, this.tongyiEmbedding);
const directory = 'src/database/qiu';
await vectorStore.save(directory);
```

这部分代码会运行比较久，需要对数据块中每一个数据调用 embedding 模型并存储在内存的 store 中。 然后，就可以从 vectorstore 获取到一个 retriever 实例：

```ts
const retriever = vectorstore.asRetriever(2);
```

传入参数 2，指每次获取 vector store 中最相关的两条数据。默认返回的数据是根据 similarity 进行排序的，也就是跟用户问题最相关的两条数据。一般不需要设置的特别大，要不给 LLM 的内容太多，费用会变大。

测试一下返回的结果：

```ts
const res = await retriever.invoke('原文中，谁提出了宏原子的假设？并详细介绍给我宏原子假设的理论');
```

```ts
[
  Document {
    pageContent: "“她都刻了些什么？”\r\n" +
      "　　“一个数学模型，全面描述宏原子的数学模型。”\r\n" +
      "　　“哦，我们真该带个数码相机来的。”\r\n" +
      "　　“没关系，我都记在脑子里了。”\r\n" +
      "　　“怎么可能呢？那么多？”\r\n" +
      "　　“其中的"... 760 more characters,
    metadata: {
      source: "data/qiu.txt",
      loc: { lines: { from: 2197, to: 2223 } }
    }
  },
  Document {
    pageContent: "“如果人类生活在一个没有摩擦力的世界，牛顿三定律可能会在更早的时候由更普通的人来发现。当你本身已经成为一个量子态的宏粒子，理解那个世界自然比我们要容易得多。”\r\n" +
      "　　于是，基地开始了捕获宏原子核的工作"... 882 more characters,
    metadata: {
      source: "data/qiu.txt",
      loc: { lines: { from: 2222, to: 2229 } }
    }
  }
]
```

返回值是跟宏原子理论最相关的两条数据，当然这种结构并不能直接输入给 LLM，需要加一个简单的后处理函数，把它处理成普通的文本：

```ts
const convertDocsToString = (documents: Document[]): string => {
	return documents.map(document => document.pageContent).join('\n');
};
```

有了这些，就能构建出一个简单的获取数据库中相关上下文的 chain:

```ts
const contextRetriverChain = RunnableSequence.from([input => input.question, retriever, convertDocsToString]);
```

`RunnableSequence` 在这里就是构建了一个简单的 chain，传入一个数组，并且把第一个 `Runnable` 对象返回的结果自动输入给后面的 `Runnable` 对象。
在这里，`contextRetriverChain`，接收一个 `input` 对象作为输入，然后从中获得 `question` 属性，然后传递给 `retriever`，返回的 `Document` 对象输入作为参数传递给 `convertDocsToString` 然后被转换成纯文本。

## 构建 Template

构建用户提问的 template，使用 `ChatPromptTemplate` 来构建我们的 `prompt`，使用简单的 `prompt` 技巧，并在其中定义两个变量 `context` 和 `question`:

```ts
import { ChatPromptTemplate } from '@langchain/core/prompts';

const TEMPLATE = `
你是一个熟读刘慈欣的《球状闪电》的终极原著党，精通根据作品原文详细解释和回答问题，你在回答时会引用作品原文。
并且回答时仅根据原文，尽可能回答用户问题，如果原文中没有相关内容，你可以回答“原文中没有相关内容”，

以下是原文中跟用户回答相关的内容：
{context}

现在，你需要基于原文，回答以下问题：
{question}`;

const prompt = ChatPromptTemplate.fromTemplate(TEMPLATE);
```

在运行时，只要将对应的变量传递给 prompt 就能将 prompt 中对应的变量替换成真实值。

在设计 prompt，使用一些简单的 `prompt engineering` 的技巧，比如：

- 并且回答时仅根据原文 - 这里固定 LLM 回答的范围只能根据原文内容。
- 如果原文中没有相关内容，你可以回答“原文中没有相关内容” - 这里来减少 LLM 回答时候的幻想问题。

## 实现完整的 Chain

可以把上述所有内容连在一起，来实现完整的对话 Chain。

1. 定义 LLM 模型，以 KimiApi 为例：

```ts
import { ChatOpenAI } from '@langchain/openai';

const client = new ChatOpenAI({
	openAIApiKey: apiKey, // kimiApi的apiKey
	modelName, // 模型名称
	configuration: {
		baseURL: baseUrl // kimiApi对外提供的url
	}
});
```

2. 组装完整的 chain，其中 StringOutputParser 会将 LLM 的输出转换成普通的文本：

```ts
const ragChain = RunnableSequence.from([
	{
		context: contextRetriverChain,
		question: input => input.question
	},
	prompt,
	this.kimiApiClient,
	new StringOutputParser()
]);
```

3. 调用 rag chatbot:

```ts
const answer = await ragChain.invoke({
	question: '详细描述原文中有什么跟直升机相关的场景'
});

console.log(answer);
```
