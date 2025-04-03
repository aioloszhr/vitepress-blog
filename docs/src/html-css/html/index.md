---
outline: deep
---

# Html

## HTML 元素

### `<script>`

#### type 属性

2. `ES6` 模块 (现代浏览器支持)

- `type="importmap"`
    * 含义：定义模块的导入映射（Import Maps），用于将模块标识符映射到实际 URL。
    * 示例：
    ```html
    <script type="importmap">
    {
        "imports": {
            "lodash": "https://cdn.example.com/lodash.js"
        }
    }
    </script>
    ```
## 属性

### tabIndex

`tabindex` 属性用于控制 HTML 元素是否可以通过键盘（如 **Tab 键**）聚焦，并决定其在焦点顺序中的位置。当应用在 `<div>` 这类非交互元素时，它有以下作用：

### 使 `<div>` 可聚焦

- 默认行为：`<div>` 无法通过 Tab 键聚焦（因为它不是交互元素如 `<button>` 或 `<a>`）。
- 添加 `tabindex`：通过设置 `tabindex`，可以让 `<div>` 被键盘或脚本聚焦。
```html
<div tabindex="0">按 Tab 键可聚焦我</div>
```