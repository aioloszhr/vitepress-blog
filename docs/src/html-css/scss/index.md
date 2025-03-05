---
outline: deep
---

# Scss

## 标志符

### !default

在 SCSS 中，`!default` 是一个用于 **变量声明**的特殊标志，它的核心作用是：**为变量设置默认值，但允许该值被更高优先级的赋值覆盖**。

### !global

在 Sass 中，`!global` 是一个用于 **强制修改变量作用域** 的标志符，它允许在局部作用域（如嵌套规则、混合宏或函数内）中声明或覆盖全局变量。

#### 核心作用

| 场景         ｜ 无`global`时 | 使用`global`后 |
| ----------- | ----------- | ----------- |
| 变量已存在全局  | 局部赋值不影响全局变量       | **强制覆盖全局变量**       |
| 变量不存在全局  | 创建局部变量        | **创建全局变量**（即使写在局部作用域内）        |

#### 基础用法示例

**1. 强制覆盖全局变量**

```scss
$color: red; // 全局变量

.button {
  $color: blue !global; // 强制修改全局变量
  background: $color;   // 输出 blue
}

.header {
  background: $color;   // 输出 blue（全局已被修改）
}
```
**2. 在局部作用域创建全局变量**

```scss
.container {
  $font-size: 16px !global; // 创建全局变量
  font-size: $font-size;    // 输出 16px
}

.footer {
  font-size: $font-size;    // 输出 16px（可访问全局变量）
}
```

## 指令

### @at-root

`@at-root` 是 `SCSS` 中的一个指令，用于将嵌套的选择器提升到样式表的根层级，从而控制生成的 `CSS` 结构.

#### 跳出嵌套层级

默认情况下，`@at-root` 会将选择器提升到最外层，**跳出所有嵌套**（包括父选择器和 @media 等规则）。

**示例：**
```scss
.parent {
  color: red;
  @at-root .child {
    color: blue;
  }
}
```
**生成的css：**
```css
.parent { color: red; }
.child { color: blue; }
```
#### 结合媒体查询

默认情况下， `@at-root`会跳出嵌套的 `@media` 规则，但可以通过参数保留媒体查询上下文。

**默认行为 （跳出`@media`）：**
```scss
@media screen {
  .parent {
    @at-root .child {
      color: blue;
    }
  }
}
```
**生成的css：**
```css
@media screen { .parent { ... } }
.child { color: blue; } /* 在 @media 外部 */
```

**使用参数保留`@media`：**
```scss
@media screen {
  .parent {
    @at-root (with: media) {
      .child { color: blue; }
    }
  }
}
```
**生成的css：**
```css
@media screen {
  .child { color: blue; } /* 仍在 @media 内，但不在 .parent 中 */
}
```

#### 生成 BEM 风格类名

避免嵌套导致的多余层级，生成平级类名。
```scss
.block {
  color: red;
  @at-root #{&}__element {
    color: blue;
  }
}
```
**生成的css：**
```css
.block { color: red; }
.block__element { color: blue; }
```
#### 结合父选择器 &

灵活调整选择器结构，生成特定层级关系。
```scss
.parent {
  @at-root .child & {
    color: red;
  }
}
```  
**生成的css：**
```css
.child .parent { color: red; }
```
### @each

在 SCSS 中，`@each` 循环用于遍历 **列表（List） 或 映射（Map）** 中的元素，动态生成样式代码。以下是其核心用法和实际场景：

## 工具模块

### Map

在 Sass 中，`@use 'sass:map';` 用于导入 Sass 内置的 **Map 工具模块**。Map 是 Sass 中的一种数据结构（类似 JavaScript 的 Object 或 Python 的字典），用于存储键值对集合。

#### Map 基础操作

1. 创建Map

```scss
$colors: (
  "primary": #3498db,
  "secondary": #2ecc71,
  "error": #e74c3c
);
```
2. 获取值

```scss
.button {
  color: map.get($colors, "primary"); // 输出 #3498db
}
```

3. 合并Maps

```scss
$theme-colors: (
  "warning": #f1c40f,
  "info": #9b59b6
);

$all-colors: map.merge($colors, $theme-colors);
```

## 语法

### 嵌套写法

### 写法 & + &

在 SCSS 中，`& + &` 是一种利用父选择器符号 `&` 结合 **相邻兄弟选择器（+）** 的嵌套写法，用于生成针对**同一类名连续元素**的样式规则。

#### 基础用法与生成结果

**代码示例**
```scss
.item {
  & + & {
    margin-left: 20px;
  }
}
```
编译后的 css
```css
.item + .item {
  margin-left: 20px;
}
```

**效果说明**
- **选择器含义：**匹配所有紧跟在另一个 .item 元素之后的 .item 元素。
- **典型场景：**
当多个同类元素水平排列时，为**非首个元素**添加间隔样式（如导航菜单项、卡片列表等）。