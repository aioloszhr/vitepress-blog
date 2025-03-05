---
outline: deep
---

# Html

## tabIndex

`tabindex` 属性用于控制 HTML 元素是否可以通过键盘（如 **Tab 键**）聚焦，并决定其在焦点顺序中的位置。当应用在 `<div>` 这类非交互元素时，它有以下作用：

### 使 `<div>` 可聚焦

- 默认行为：`<div>` 无法通过 Tab 键聚焦（因为它不是交互元素如 `<button>` 或 `<a>`）。
- 添加 `tabindex`：通过设置 `tabindex`，可以让 `<div>` 被键盘或脚本聚焦。
```html
<div tabindex="0">按 Tab 键可聚焦我</div>
```