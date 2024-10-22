---
outline: deep
---

# Svg属性

## width、height

`width`、`height`设置用来设置SVG的宽高。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SVG - 属性</title>
</head>
<body>
  <svg width="300" height="300">
    <circle cx="100" cy="100" r="100"/>
  </svg>
</body>
</html>
```

效果如下：
![An image](/svg/svg-1.png)

注意：在不设置宽高的情况下，默认为300 * 150，当内部元素大于300 * 150时，大于部分会被隐藏。

举个例子看一下：在坐标为（100， 100）的地方绘制一个半径为100的圆

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SVG - 属性</title>
</head>
<body>
  <svg>
    <circle cx="100" cy="100" r="100"/>
  </svg>
</body>
</html>
```

效果如下：
![An image](/svg/svg-2.png)

## viewBox

`viewBox` 属性定义了SVG中可以显示的区域。

语法：`viewBox="x y w h"` x、y为起始点，w、h为显示区域的宽高。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SVG - 属性</title>
</head>
<body>
  <svg width="300" height="300" viewBox="0 0 100 100">
    <circle cx="100" cy="100" r="100"/>
  </svg>
</body>
</html>
```

效果如下：
![An image](/svg/svg-3.png)

如图SVG里面的圆只显示了一部份，原因是`viewBox`定义了一个：从`（0, 0）`点开始，宽高为`100 * 100`的显示区域。而这个`100 * 100`的显示区域会放到`300 * 300`(svg宽高)的SVG中去显示，整体就放大了`3`倍。

## version

`version`属性用于指明SVG的版本，也就是指明SVG文档应该遵循的规范。version属性纯粹就是一个说明，对渲染或处理没有任何影响。且目前只有1.0 和 1.1这两个版本。

## xmlns和xmlns:xlink

`xmlns`用于声明命名空间（namespace），这样在SVG标签中写一个a标签，a标签和UA就知道它是SVG的a标签而不是HTML的a标签。

`xmlns:xlink` 表示前缀为xlink的标签和属性，应该由理解该规范的`UA` 使用`xlink规范` 来解释。

注：UA是User Agent的简称。User Agent是Http协议中的一部分，属于头域的组成部分。通俗地讲UA是一种向访问网站提供你所使用的浏览器类型、操作系统、浏览器内核等信息的标识。通过这个标识，用户所访问的网站可以显示不同的排版，从而为用户提供更好的体验或者进行信息统计。

示例：
```html
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    // ......
</svg>
```

