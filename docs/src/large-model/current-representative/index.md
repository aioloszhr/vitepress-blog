# 当前代表性的大模型

## 大模型概览

### 随着规模增加的能力演化

随着模型参数规模和预训练数据规模的不断增加，模型能力与任务效果会随之改善。
- 在逻辑推理、复杂任务处理方面的能力得到显著改进行。
- 更强的指令能力遵循能力

### 预训练语言模型质变到大规模语言模型

1. <span style="color: blue; font-weight: 600">训练数据：</span> 多元化
- 不再仅仅是自然语言文本，而是多种数据的组合：自然语言文本、编程代码、化学分子式、乃至基因序列、甚至图像。
2. <span style="color: blue; font-weight: 600">训练方式：</span> 从掩码训练（BERT为典型）全面转向自回归预训练（GPT为典型）。
3. <span style="color: blue; font-weight: 600">模型架构：</span> 从双向Transformer转向单向Transformer（Decorder-only）。
4. <span style="color: blue; font-weight: 600">应用方式：</span> 从微调走向更为友好的提示学习，逼近人机对话形式。

## `GPT`系列大模型

### <span style="color:red; font-weight:600">GPT系列的版本演化</span>

- <span style="color: blue; font-weight: 600">GPT-1：</span> 单向自回归建模 + 有监督微调，探索"预训练+微调"范式下的自然语言任务求解能力。
- <span style="color: blue; font-weight: 600">GPT-2：</span> 单向自回归建模 + 更多的数据、更大的模型，探索基于自然语言提示的多任务解决能力。
- <span style="color: blue; font-weight: 600">GPT-3：</span> 探索了千亿参数规模的语言模型效果，提出了基于“上下文学习”的任务解决能力。
- <span style="color: blue; font-weight: 600">GPT-3.5/ChatGPT：</span> 指令微调 + 人类反馈 + 对话优化
- <span style="color: blue; font-weight: 600">GPT-4：</span> 多模态能力，更长的上下文理解与处理能力，更高效的训练与预测，更广泛的高价值应用场景。
- GPT-4在各种专业和学术基准上表现出人类相当的水平，包括约前10%的成绩通过模拟律师资格考试。
- 强大的多模态处理能力扩大了GPT-4的应用范围，同时生成式的幻觉、安全问题均有较大的改善。

| OpenAI 发布 GPT-4 使用指南 |
| ---------------------------- |
| 写出清晰的指令 
| 提供参考的文本
| 将复杂的任务拆分为更简单的子任务
| 给模型时间 「思考」
| 使用外部工具
| 系统地测试变更

## `Llama`系列大模型

- 开源自回归模型，基于`Transformer`架构，参数规模从 **7B** 到 **405B** 不等

| 版本特点比 | Llama-1 | Llama-2 | Llama-3 | Llama-3.1 | Llama-3.2 |
| :------- | :------- | :------- | :------- | :--------- | :--------- |
| 模型规模 | 7B-65B | 7B-70B | 8B-70B | 8B-405B | 1B-90B |
| 数据规模 | 1.4T | 2T | 15T | 15T | 9T |
| 多模态 | ❎ | ❎ | ❎ | ❎ | ✅ |
| 多语言 | ❎ | ❎ | ❎ | ✅ | ✅ | 
| 工具调用 | ❎ | ❎ | ❎ | ✅ | ✅ |
| 训练范式 | 预训练 | 预训练 + 指令微调 + RLHF | 预训练 + 指令微调 + DPO | 预训练 + 指令微调 + DPO | 预训练 + 指令微调 + DPO | 
| 上下文长度 | 2K | 4K | 8K | 131K | 131K | 
| 主要演变 | -- | 增加后训练 | 扩展预训练 | 1. 增加模型规模。2. 增加多语言和工具能力。3. 扩展上下文长度 | 1. 增加端侧模型。2. 增加多模态能力 | 

## 国产大模型

- <span style="color: blue; font-weight: 600">通义千问（Qwen）</span>是阿里云研发的预训练语言模型，执行理解、生成和解释人类语言、图片和文档等任务，在创意文案、办公助理、学习助手、趣味生活等方面为使用者提供丰富的交互体验。
- 具备中英文理解、数学推理、代码理解等能力。

## 大模型使用方式

### 通过GUI界面调用（适合案例测试）
### 代码调用

1. 环境准备（可选）：
- `VSCode` 开发工具
- 利用`Miniconda`进行`Python`环境管理

### 大模型本地部署开源平台：`Ollama`, `LM Studio`
1. `Ollama`: https://ollama.com/
- **用户体验**：以其简单和易于安装而闻名，特别适合初学者和非技术用护。
- **可定制性**：提供创建定制语言模型和运行各种预训练模型的灵活性。
- **开源**：完全开源、有助于提高透明度和社区参与。
- **支持的操作系统**：适用于 `macOS`、`Windows`和`Linux`。且处理器支持AVX。

2. `LM Studio`: https://lmstudio.ai/
- **功能集**：提供更广泛的功能集，包括发现、下载和运行本地`LLM`，以及应用内聊天界面以及与`OpenAI`兼容的本地服务器的兼容性。
- **UI 友好性**；与 `Ollama`相比，被认为对用户界面更加友好。
- **模型选择**：模型目录：提供来自 `Hugging Face`等来源的更广泛的模型选择。
- **支持的操作系统**：适用于 `M1/M2/M3 Mac`或具有支持 `AVX2` 处理器的 `Windows PC`或者`Linux`

### Web与API调用：`OpenAI`, `Dashscope API`
### 大模型本地私有化部署：`Flask`, `MindlE`

## 多模态大模型
- <span style="color: blue; font-weight: 600">多模态大模型</span>的能力突破，成为大模型前沿发展的新趋势和焦点。
- 极大拓展大模型能力边界和应用场景，智能跃迁的下一个关键引擎。

| 技术概要 |
| :------- |
| **主要目标：** 基于大数据和人类反馈进行学习，与用户通过对话进行交互，能够处理多模态信息及多种任务，深层推理与常识运用能力大幅度提升 |
| **关键技术：** 多模态模型架构、多模态指令遵循、多模态推理、轻量化部署、多模态对齐等  |

| 里程碑 |
| :------- |
| **2023/03/15**：OpenAI发布<span style="color: blue; font-weight: 600">多模态对话模型GPT-4</span> |
| **2023/09/20**：OpenAI发布<span style="color: blue; font-weight: 600">文生图模型DALL·E 3</span> |
| **2023/09/25**：OpenAI全面整合<span style="color: blue; font-weight: 600">多模态能力</span> |
| **2023/12/06**：Google发布<span style="color: blue; font-weight: 600">多模态模型 Gemini</span> |
| **2024/03/04**：Anthropic发布<span style="color: blue; font-weight: 600">多模态模型 Claude 3</span> |
| **2024/05/13**：OpenAI发布原生<span style="color: blue; font-weight: 600">多模态模型 GPT-4o</span> |

![An image](/llm/llm-1.png)

### 多模态大模型的通用工作模式

- <span style="color: blue; font-weight: 600">通用工作模式</span>：多模态编码 > 特征融合模块 > 多模态解码器，支持多模态输入与多模态生成
- <span style="color: blue; font-weight: 600">常见模态</span>：文本、图像、视频、语音等
![An image](/llm/llm-2.png)

### 多模态大模型的代表性架构
![An image](/llm/llm-3.png)

1. `LLM`为中心的架构：
![An image](/llm/llm-4.png)

2. 一体化多模态架构
![An image](/llm/llm-5.png)

## 总结与思考

**1. 大模型的演化过程中呈现出多样化数据、自回归训练目标、单向Transformer的趋势，应用上从微调走向更为友好的提示学习，逼近人集对话形式**

**2. Open API较早地面向公众开放的大模型服务平台，用户可以通过API适用GPT模型**

**3. Llama系列的开源大模型展示了如何仅使用公开可用的数据集来训练最先进的模型**

**4. 国产大模型取得显著进展，数量迅速增长、应用落地水平不断提升**

**5. 多模态大模型极大地拓展了大模型能力边界和应用场景**


