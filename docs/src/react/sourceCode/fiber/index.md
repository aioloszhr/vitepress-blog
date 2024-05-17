---
outline: deep
---

# Fiber 和并发

## 知悉 Fiber

**Fiber** 实际上是一种核心算法，为了解决**中断和树庞大**的问题，也可以认为 **Fiber** 就是 v16 之后的**虚拟 DOM**。

element、fiber、DOM 元素三者的关系：

- element 对象就是我们的 jsx 代码，上面保存了 props、key、children 等信息。
- DOM 元素就是最终呈现给用户展示的效果。
- 而 fiber 就是充当 element 和 DOM 元素的桥梁，简单来说，**只要 element 发生改变，就会通过 fiber 做一次调和，使对应的 DOM 元素发生改变。**
  ![An image](/fiber/fiber-1.png)

### 虚拟 DOM 如何转化为 Fiber 的？

### beginWork 方法
