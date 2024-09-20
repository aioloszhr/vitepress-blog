---
outline: deep
---

# 🎨 全局API

vue3的全局API包含两个部分：应用实例和通用API

## 应用实例

### api

#### createApp()

创建一个应用实例

## 通用API

### defineComponent

在定义 Vue 组件时，提供【类型推到】的辅助函数

### nextTick()

Vue的`nextTick`其本质是对`Javascript`执行原理`EventLoop`的一种应用。`nextTick`是将回调函数放到一个异步队列中，保证在异步更新DOM的`watcher`后面，从而获取到更新后的DOM。

场景：
因为在`created()`钩子函数中，页面的DOM还未渲染，这时候也没办法操作DOM。所以，此时如果想要操作DOM，必须将操作的代码放在`nextTick()`的回调函数中。
