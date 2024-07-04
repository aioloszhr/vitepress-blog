---
outline: deep
---

# 如何获取 OpenAI 服务

## 本地大模型

使用 [ollama](https://ollama.com/)，下载好模型后，点开这个 app 后，就会自动在 http://localhost:11434 host 一个 llm 的服务。

在 langchain 中使用本地模型：

```ts
import { Ollama } from '@langchain/community/llms/ollama';

const ollama = new Ollama({
	baseUrl: 'http://localhost:11434',
	model: 'llama3' # 模型名称
});

const res = await ollama.invoke('讲个笑话');
```

如果使用是 deno，需要在 deno.json 中加入这一行依赖别名：

```json
{
    "imports":{
        ...
        "@langchain/community/": "npm:/@langchain/community/",
        ...

    }
}
```
