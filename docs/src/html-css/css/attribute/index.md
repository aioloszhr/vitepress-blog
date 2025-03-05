---
outline: deep
---

# 属性

## user-select

在 CSS 中，`user-select` 属性用于控制用户能否选中页面中的文本或元素内容。

### 语法和取值

```css
.element {
  user-select: none | auto | text | all | contain;
}
```
- `none`：禁用用户选择。
- `auto`：默认值，允许用户选择文本。
- `text`：允许用户选中文本。
- `all`：允许用户一键选中整个元素的内容（如点击一次选中所有文本）。
- `contain`：允许在元素内开始选择，但选择范围被限制在该元素内（实验性特性，兼容性差）。
