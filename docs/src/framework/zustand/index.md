---
outline: deep
---

# `Zustand`

## 为什么是 `Zustand` ？

### 状态共享

### 状态变更

在 `Zustand` 中 ，函数可以直接写，不用区分同步或者异步：

```ts
// zustand store 写法

// store.ts
import create from 'zustand';

const initialState = {
	// ...
};

export const useStore = create((set, get) => ({
	...initialState,
	createNewDesignSystem: async () => {
		const { params, toggleLoading } = get();

		// zustand 中异步函数的写法
		toggleLoading();
		const res = await dispatch('/hitu/remote/create-new-ds', params);
		toggleLoading();

		if (!res) return;

		set({ created: true, designId: res.id });
	},
	toggleLoading: () => {
		set({ loading: !get().loading });
	}
}));

// CreateForm.tsx
import { useStore } from './store';

const CreateForm: FC = () => {
	const { createNewDesignSystem } = useStore();

	// ...
};
```

`Zustand` **会默认将所有的函数保持同一引用**，所以默认的写法，不会造成 **重复渲染** 。

### 状态派生

1. `hooks` 写法

在 `hooks` 场景下， 状态派生的方法可以使用 `useMemo` ：

```ts
// hooks 写法

const App = () => {
	const [name, setName] = useState('');
	const url = useMemo(() => URL_HITU_DS_BASE(name || ''), [name]);
	// ...
};
```

2. `Zustand` 写法

`zustand` 用了类似 `redux selector` 的方法，实现相应的状态派生，这个方式使得 `useStore` 的用法变得极其灵活和实用。而这种 `selector` 的方式使得 `zustand` 下细颗粒度的性能优化变为可能，且优化成本很低。

```ts
// zustand 的 selector 用法

// 写法1
const App = () => {
	const url = useStore(s => URL_HITU_DS_BASE(s.name || ''));
	// ...
};

// 写法2 将 selector 单独抽为函数
export const dsUrlSelector = s => URL_HITU_DS_BASE(s.name || '');
const App = () => {
	const url = useStore(dsUrlSelector);
	// ...
};
```

写法 2 可以将 `selector` 抽为独立函数，那么可以将其拆分到独立文件来管理派生状态。由于这些 `selector` 都是纯函数，所以能轻松实现测试覆盖。

### 性能优化

在裸 `hooks` 的状态管理下，要做性能优化得专门起一个专项来分析与实施。但基于 `zustand` 的 `useStore` 和 `selector` 用法，我们可以实现低成本、

渐进式的性能优化。

案例：比如 `ProEditor` 中一个叫 `TableConfig` 的面板组件，对应的左下图中圈起来的部分。而右下图则是相应的代码，可以看到这个组件从 `useStore`

中解构了 `tabKey` 和 `internalSetState` 的方法。

![An image](/zustand/zustand-1.png)

用 `useWhyDidYouUpdate` 来检查下，如果直接用解构引入，会造成什么样的情况：

![An image](/zustand/zustand-2.png)

虽然 `tabs`、`internalSetState` 没有变化，但是其中的 `config` 数据项 `（data、columns 等）` 发生了变化，

进而使得 `TableConfig` 组件触发重渲染。

性能优化方法也很简单，只要利用 `zustand` 的 `selector`，将得到的对象聚焦到我们需要的对象，只监听这几个对象的变化即可。

```ts
// 性能优化方法

import shallow from 'zustand/shallow'; // zustand 提供的内置浅比较方法
import { useStore, ProTableStore } from './store';

const selector = (s: ProTableStore) => ({
	tabKey: s.tabKey,
	internalSetState: s.internalSetState
});

const TableConfig: FC = () => {
	const { tabKey, internalSetState } = useStore(selector, shallow);
};
```

TableConfig 的性能优化就做好了

![An image](/zustand/zustand-3.png)

基于这种模式，性能优化就会变成极其简单无脑的操作，而且对于前期的功能实现的侵入性极小，代码的后续可维护性极高。

![An image](/zustand/zustand-4.png)

## `Zustand` 实践

在 `React` 中使用 `Zustand`。

### 安装 `Zustand`

以 `pnpm` 包管理工具为例。

```bash
pnpm add zustand
```

### 基于 `Zustand` 的渐进式状态管理
