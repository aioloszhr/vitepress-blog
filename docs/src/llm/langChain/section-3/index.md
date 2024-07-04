---
outline: deep
---

# langchan.js 的介绍、安装和快速入门

## 什么是 LCEL

LCEL（LangChain Expression Language） 是 langchain 无论是 python 还是 js 版本都在主推的新设计。

LCEL 从底层设计的目标就是支持 从原型到生产 完整流程不需要修改任何代码，也就是我们在写的任何原型代码不需要太多的改变就能支持生产级别的各种特性（比如并行、steaming 等），具体来说会有这些优势：

- 并行，只要是整个 chain 中有可以并行的步骤就会自动的并行，来减少使用时的延迟。
- 自动的重试和 fallback。大部分 chain 的组成部分都有自动的重试（比如因为网络原因的失败）和回退机制，来解决很多请求的出错问题。 而不需要我们去写代码 cover 这些问题。
- 对 chain 中间结果的访问，在旧的写法中很难访问中间的结果，而 LCEL 中可以方便的通过访问中间结果来进行调试和记录。
- LCEL 会自动支持 LangSimith 进行可视化和记录。这是 langchain 官方推出的记录工具，可以记录一条 chian 运行过程中的大部分信息，来方便调试 LLM 找到是哪些中间环节的导致了最终结果较差。这部分我们会在后续的章节中涉及到。

一条 Chain 组成的每个模块都是继承自 Runnable 这个接口，而一条 Chain 也是继承自这个接口，所以一条 Chain 也可以很自然的成为另一个 Chain 的一个模块。并且所有 Runnable 都有相同的调用方式。 所以在我们写 Chain 的时候就可以自由组合多个 Runnable 的模块来形成复杂的 Chain。

对于任意 Runnable 对象，其都会有这几个常用的标准的调用接口：

- invoke 基础的调用，并传入参数
- batch 批量调用，输入一组参数
- stream 调用，并以 stream 流的方式返回数据
- streamLog 除了像 stream 流一样返回数据，并会返回中间的运行结果

### invoke

`HumanMessage`: 构建一个用户输入。

<span style="color:red; font-weight:bold">注：</span> `chatModel` 需要输入的是一个 `Message` 列表。

```ts
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';

const model = new ChatOpenAI();

await model.invoke([new HumanMessage('Tell me a joke')]);
```

以上就是一个基础的对 `Runnable` 接口的调用，输出结果：

```ts
AIMessage {
  lc_serializable: true,
  lc_kwargs: {
    content: "Why don't scientists trust atoms?\n\nBecause they make up everything!",
    additional_kwargs: { function_call: undefined, tool_calls: undefined },
    response_metadata: {}
  },
  lc_namespace: [ "langchain_core", "messages" ],
  content: "Why don't scientists trust atoms?\n\nBecause they make up everything!",
  name: undefined,
  additional_kwargs: { function_call: undefined, tool_calls: undefined },
  response_metadata: {
    tokenUsage: { completionTokens: 13, promptTokens: 11, totalTokens: 24 },
    finish_reason: "stop"
  }
}
```

加入 `StringOutputParser` 来处理输出，其作用，将 OpenAI 返回的复杂对象提取出最核心的字符串。

```ts
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';

const chatModel = new ChatOpenAI();
const outputPrase = new StringOutputParser();

const simpleChain = chatModel.pipe(outputPrase);

await simpleChain.invoke([new HumanMessage('Tell me a joke')]);
```

输出一个普通文本，而不是 OpenAI 返回的复杂对象：

```ts
"Why don't scientists trust atoms?\n\nBecause they make up everything.";
```

在 LCEL 中，使用 `.pipe()` 方法来组装多个 `Runnable` 对象形成完整的 `Chain`，可以看到用对单个模块同样的 `invoke` 方法去调用整个 `chain`。 因为无论是单个模块还是由模块组装而成的多个 `chain` 都是 `Runnable`。

## batch

批量调用

```ts
await simpleChain.batch([[new HumanMessage('Tell me a joke')], [new HumanMessage('Hi, Who are you?')]]);
```

返回值是一个列表：

```ts
[
	"Why don't scientists trust atoms?\n\nBecause they make up everything!",
	"Hello! I'm OpenAI, or more specifically an artificial intelligence programmed to help answer questio"
];
```

## stream

因为 LLM 的很多调用都是一段一段的返回的，如果等到完整地内容再返回给用户，就会让用户等待比较久，影响用户的体验。而 LCEL 开箱就支持 steaming，依旧使用定义的基础 Chain，就可以直接获得 streaming 的能力：

```ts
const stream = await simpleChain.stream([new HumanMessage('Tell me a joke')]);

for await (const chunk of stream) {
	console.log(chunk);
}
```

返回值：

```diff
Why
 don
't
 scientists
 trust
 atoms
?


Because
 they
 make
 up
 everything
!
```

## fallback

`withFallbacks` 是任何 `runnable` 都有的一个函数，可以给当前 `runnable` 对象添加 `fallback` 然后生成一个带 `fallback` 的 `RunnableWithFallbacks` 对象，这适合将自己的 `fallback` 逻辑增加到 `LCEL` 中。

创建一个一定会失败的 llm:

```ts
import { ChatOpenAI } from '@langchain/openai';

const fakeLLM = new ChatOpenAI({
	azureOpenAIApiKey: '123',
	maxRetries: 0
});

await fakeLLM.invoke('你好');
```

因为大多 `runnable` 都自带出错重试的机制，所以在这将重试的次数 `maxRetries` 设置为 0。

创建一个可以成功的 llm，并设置为 fallback:

```ts
const realLLM = new ChatOpenAI();
const llmWithFallback = fakeLLM.withFallbacks({
	fallbacks: [realLLM]
});

await llmWithFallback.invoke('你好');
```

因为无论是 llm model 或者其他的模块，还是整个 chain 都是 runnable 对象，所以可以给整个 LCEL 流程中的任意环节去增加 fallback，来避免一个环节出问题卡住剩下环境的运行。

当然，也可以给整个 chain 增加 fallback，例如一个复杂但输出高质量的结果的 chain 可以设置一个非常简单的 chain 作为 fallback，可以在极端环境下保证至少有输出。
