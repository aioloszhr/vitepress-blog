---
outline: deep
---

# 元素对象

## offsetHeight

`offsetHeight` 是一个元素对象的只读属性，用于获取元素的布局高度，包括其内容、内边距（padding）、边框（border）的高度，但不包括外边距（margin）。

### 主要特点
1. **包括的内容：**
- 元素的内容区域的高度。
- 内边距（`padding-top` 和 `padding-bottom`）。
- 边框（`border-top` 和 `border-bottom`）的宽度。
2. **不包括的内容：**
- 外边距（`margin-top` 和 `margin-bottom`）。
- 滚动条的高度（如果存在滚动条）。
3. **返回值：**
- `offsetHeight` 返回一个整数值，单位为像素。

### 使用场景
1. **动态布局调整：**
- 可以通过 `offsetHeight` 获取元素的实际高度，从而动态调整布局或与其他元素进行交互。
2. **滚动检测：**
- 在滚动事件中，可以通过比较 `offsetHeight` 和 `scrollHeight` 来判断元素是否完全可见。
3. **自适应设计：**
- 根据元素的实际高度调整样式或行为，例如动态添加滚动条或调整容器大小。

### 注意事项
- `offsetHeight` 是一个只读属性，无法直接修改。
- 如果元素是隐藏的（如 `display: none`），`offsetHeight` 的值通常为 `0`。
- 如果元素有滚动条，`offsetHeight` 仅表示元素的**可视部分高度，不包括隐藏部分**。