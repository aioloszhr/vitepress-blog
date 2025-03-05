---
outline: deep
---

# 响应式布局

## 等比缩放

**等比缩放响应式方案**多用于大屏。

### 实现方案

#### 基于rem的自适应方法

- 首选计算缩放比，根据屏幕大小动态设置，根元素`html`的`fontSize`值。

```css
/* 动态计算根元素字体大小 */
html {
    font-size: calc((100vw / 1920) * 100);
}
```

- 设置样式，需要将元素单位`px`转为`rem`。

```scss
// px 转 rem 函数
@function px-to-rem($px) {
  @return ($px / 100) * 1rem;
}
```

