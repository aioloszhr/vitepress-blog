---
outline: deep
---

# 🚲 组合式API

## setup

![An image](/vue/setup.png)

### Setup 上下文

#### 暴露公共属性

`expose` 函数用于显式地限制该组件暴露出的属性，当父组件通过模板引用访问该组件的实例时，将仅能访问 expose 函数暴露出的内容：

```ts
export default {
	setup(props, { expose }) {
		// 让组件实例处于 “关闭状态”
		// 即不向父组件暴露任何东西
		expose();

		const publicCount = ref(0);
		const privateCount = ref(0);
		// 有选择地暴露局部状态
		expose({ count: publicCount });
	}
};
```

### 与渲染函数一起使用

## 响应式：核心

### watch()

侦听一个或多个响应式数据源，并在数据源变化时调用所给的回调函数。

第三个可选的参数是一个对象，支持以下这些选项：

- `immediate`: 在侦听器创建时立即触发回调。第一次调用时旧值是 `undefined`。
