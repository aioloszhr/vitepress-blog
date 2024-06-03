---
outline: deep
---

# 响应式布局的实现方案

## 媒体查询

### 移动优先 OR PC 优先

移动优先：

```css
/* iphone6 7 8 */
body {
	background-color: yellow;
}
/* iphone 5 */
@media screen and (max-width: 320px) {
	body {
		background-color: red;
	}
}
/* iphoneX */
@media screen and (min-width: 375px) and (-webkit-device-pixel-ratio: 3) {
	body {
		background-color: #0ff000;
	}
}
/* iphone6 7 8 plus */
@media screen and (min-width: 414px) {
	body {
		background-color: blue;
	}
}
/* ipad */
@media screen and (min-width: 768px) {
	body {
		background-color: green;
	}
}
/* ipad pro */
@media screen and (min-width: 1024px) {
	body {
		background-color: #ff00ff;
	}
}
/* pc */
@media screen and (min-width: 1100px) {
	body {
		background-color: black;
	}
}
```

PC 优先：

```css
/* pc width > 1024px */
body {
	background-color: yellow;
}
/* ipad pro */
@media screen and (max-width: 1024px) {
	body {
		background-color: #ff00ff;
	}
}
/* ipad */
@media screen and (max-width: 768px) {
	body {
		background-color: green;
	}
}
/* iphone6 7 8 plus */
@media screen and (max-width: 414px) {
	body {
		background-color: blue;
	}
}
/* iphoneX */
@media screen and (max-width: 375px) and (-webkit-device-pixel-ratio: 3) {
	body {
		background-color: #0ff000;
	}
}
/* iphone6 7 8 */
@media screen and (max-width: 375px) and (-webkit-device-pixel-ratio: 2) {
	body {
		background-color: #0ff000;
	}
}
/* iphone5 */
@media screen and (max-width: 320px) {
	body {
		background-color: #0ff000;
	}
}
```

## rem 布局

如果通过 rem 来实现响应式的布局，只需要根据视图容器的大小，动态的改变 font-size 即可。

rem 响应式的布局思想：

- 一般不要给元素设置具体的宽度，但是对于一些小图标可以设定具体宽度值
- 高度值可以设置固定值，设计稿有多大，我们就严格有多大
- 所有设置的固定值都用 rem 做单位（首先在 HTML 总设置一个基准值：px 和 rem 的对应比例，然后在效果图上获取 px 值，布局的时候转化为 rem 值)
- js 获取真实屏幕的宽度，让其除以设计稿的宽度，算出比例，把之前的基准值按照比例进行重新的设定，这样项目就可以在移动端自适应了

rem 布局的缺点：

在响应式布局中，必须通过 js 来动态控制根元素 font-size 的大小，也就是说 css 样式和 js 代码有一定的耦合性，且必须将改变 font-size 的代码放在 css 样式之前。

## 视口单位

<span style="color: red">vw</span>表示相对于视图窗口的宽度,<span style="color: red">vh</span>表示相对于视图窗口高度。

![A image](/css/layout.png)

使用视口单位来实现响应式有两种做法：

### 仅使用 vw 作为 CSS 单位

- 对于设计稿的尺寸转换为为单位，我们使用 <span style="color: red">Sass</span> 函数编译

```scss
//iPhone 6尺寸作为设计稿基准
$vm_base: 375;
@function vw($px) {
	@return ($px / 375) * 100vw;
}
```

- 无论是文本还是布局宽度、间距等都使用 vw 作为单位

```scss
.mod_nav {
	background-color: #fff;
	&_list {
		display: flex;
		padding: vm(15) vm(10) vm(10); // 内间距
		&_item {
			flex: 1;
			text-align: center;
			font-size: vm(10); // 字体大小
			&_logo {
				display: block;
				margin: 0 auto;
				width: vm(40); // 宽度
				height: vm(40); // 高度
				img {
					display: block;
					margin: 0 auto;
					max-width: 100%;
				}
			}
			&_name {
				margin-top: vm(2);
			}
		}
	}
}
```

- 1 物理像素线（也就是普通屏幕下 1px,高清屏幕下 0.5px 的情况）采用 transform 属性 scale 实现

```scss
.mod_grid {
    position: relative;
    &::after {
        // 实现1物理像素的下边框线
        content: '';
        position: absolute;
        z-index: 1;
        pointer-events: none;
        background-color: #ddd;
        height: 1px;
        left: 0;
        right: 0;
        top: 0;
        @media only screen and (-webkit-min-device-pixel-ratio: 2) {
            -webkit-transform: scaleY(0.5);
            -webkit-transform-origin: 50% 0%;
        }
    }
    ...
}
```

- 对于需要保持宽高比的图，应该用 padding-top 实现

```scss
.mod_banner {
	position: relative;
	padding-top: percentage(100/700); // 使用padding-top
	height: 0;
	overflow: hidden;
	img {
		width: 100%;
		height: auto;
		position: absolute;
		left: 0;
		top: 0;
	}
}
```

### 搭配 vw 和 rem

虽然采用 vw 适配后的页面效果很好，但是它是利用视口单位实现的布局，依赖视口大小而自动缩放，无论视口过大还是过小，它也随着时候过大或者过小，失去了最大最小宽度的限制，此时我们可以结合 rem 来实现布局

- 给根元素大小设置随着视口变化而变化的 vw 单位，这样就可以实现动态改变其大小

- 限制根元素字体大小的最大最小值，配合 body 加上最大宽度和最小宽度

```scss
// rem 单位换算：定为 75px 只是方便运算，750px-75px、640-64px、1080px-108px，如此类推
$vm_fontsize: 75; // iPhone 6尺寸的根元素大小基准值
@function rem($px) {
	@return ($px / $vm_fontsize) * 1rem;
}
// 根元素大小使用 vw 单位
$vm_design: 750;
html {
	font-size: ($vm_fontsize / ($vm_design / 2)) * 100vw;
	// 同时，通过Media Queries 限制根元素最大最小值
	@media screen and (max-width: 320px) {
		font-size: 64px;
	}
	@media screen and (min-width: 540px) {
		font-size: 108px;
	}
}
// body 也增加最大最小宽度限制，避免默认100%宽度的 block 元素跟随 body 而过大过小
body {
	max-width: 540px;
	min-width: 320px;
}
```
