---
outline: deep
---

# 基本图形

基本图形其实就是插入到SVG标签中的元素，例如：圆形（circle）。

## 圆形（circle）

circle 标签能在屏幕上绘制一个圆形

语法：`<circle cx="100" cy="100" r="100"/>`

属性：`cx、cy`为圆的坐标，`r`为圆的半径

示例：
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SVG - 基本图形</title>
</head>
<body>
  <svg width="300" height="300">
    <circle cx="100" cy="100" r="100"/>
  </svg>
</body>
</html>
```

效果：
![An image](/svg/svg-1.png)
