---
outline: deep
---

# Vite

## vite + ts 项目省略后缀

```ts
export default defineConfig({
    ...
	resolve: {
		/**
		 *
		 * 预设别名
		 * - @: src 根目录
		 * - @api: src/axios/api 根目录
		 * - @images: src/assets/images 根目录
		 * - @mock: mock 根目录
		 */
		alias: {
			'@': path.resolve(__dirname, './src')
		},
        // 导入时想要省略的扩展名列表。注意，不 建议忽略自定义导入类型的扩展名（例如：.vue），因为它会影响 IDE 和类型支持。
		extensions: ['.js', '.ts', '.json']
	},
    ...
});
```

## 在 vite + vue 工程中 JSX 的使用方式

1. 安装插件：@vitejs/plugin-vue-jsx

2. 在 vite.config.ts 中添加支持

```ts
export default defineConfig({
    ...
	plugins: [
		viteVueJSX(),
	]
    ...
});
```

3. **如果是ts工程**，在tsconfig.json中添加配置项：

```json
    // vue.js编译器会将jsx转换为vue的渲染函数调用，以实现在vue组件中使用jsx的功能
    "jsxImportSource": "vue",
```

## 在 vite 中如何使用svg，并优雅封装svgIcon组件

### 如何使用svg

#### 安装插件**vite-svg-loader**

**vite-svg-loader**: 可以像使用 Vue 组件那样使用svg图

#### 使用

1. 在 vite.config.ts 中的配置：

```ts
import viteSvgLoader from 'vite-svg-loader';

export default defineConfig({
	plugins: [
		viteSvgLoader({
			defaultImport: 'url' // 默认以 url 形式导入 svg
		})
	]
});
```

2. 在 vite-env.d.ts 配置

```ts
/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />
```

不配置的话，打包会报错

3. 组件里使用

记得要在路径后加 `?component` , 表示像组件一样使用，**可以加样式直接修改**。

### 优雅封装svgIcon组件

#### 安装插件

安装插件**vite-plugin-svg-icons**

#### 配置

1. 在 `vite.config.ts` 中的配置

```ts
import viteSvgLoader from 'vite-svg-loader';

export default defineConfig({
	plugins: [
		createSvgIconsPlugin({
			// 指定需要缓存的图标文件夹
			iconDirs: svgIconResolve(),
			// 指定symbolId的格式
			symbolId: 'icon-[dir]-[name]',
			// 自定义插入的位置
			inject: 'body-last',
			// 自定义dom id
			customDomId: '__svg__icons__dom__'
		})
	]
});
```

2. 在 `main.ts` 中的配置

```ts
import 'virtual:svg-icons-register'; // vite-plugin-svg-icons 脚本，启用 svg 雪碧图
...
```

#### 封装**SvgIcon**组件

```ts
// prop.ts
import type { PropType } from 'vue';
import type { MaybeArray } from '@/types';

const props = {
	color: {
		type: String,
		default: 'currentColor'
	},
	prefix: {
		type: String,
		default: 'icon'
	},
	name: {
		type: String,
		required: true
	},
	size: {
		type: [Number, String],
		default: 14
	},
	width: {
		type: [Number, String],
		default: 0
	},
	height: {
		type: [Number, String],
		default: 0
	},
	customClassName: {
		/** 自定义 class name */
		type: String,
		default: null
	},
	depth: {
		/** 图标深度 */
		type: Number,
		default: 1
	},
	cursor: {
		/** 鼠标指针样式 */
		type: String,
		default: 'default'
	},
	onClick: {
		type: [Function, Array] as PropType<MaybeArray<(e: MouseEvent) => void>>,
		default: null
	}
};

export default props;
```

```ts
// index.ts
import { defineComponent, computed } from 'vue'
import './index.scss'

import { completeSize, call } from '@/utils'
import props from './props'

export default defineComponent({
  name: 'ZRIcon',
  props,
  setup(props) {
    const symbolId = computed(() => `#${props.prefix}-${props.name}`)
    const cssVars = computed(() => {
      const cssVar = {
        '--zr-icon-width': props.width ? completeSize(props.width) : completeSize(props.size),
        '--zr-icon-height': props.height ? completeSize(props.height) : completeSize(props.size),
        '--zr-icon-depth': props.depth,
        '--zr-icon-cursor': props.cursor,
        '--zr-icon-color': props.color
      }

      return cssVar
    })

    const iconClick = (e: MouseEvent) => {
      const { onClick } = props

      if (onClick) {
        call(onClick, e)
      }
    }

    return {
      symbolId,
      cssVars,
      iconClick
    }
  },
  render() {
    return (
      <span
        class={['zr-icon', this.customClassName]}
        style={[this.cssVars]}
        onClick={this.iconClick.bind(this)}
      >
        <svg
          {...({
            RayIconAttribute: 'zr-icon',
            ariaHidden: true
          } as object)}
        >
          <use
            {...{
              'xlink:href': this.symbolId
            }}
            fill={this.color}
          />
        </svg>
      </span>
    )
  }
})
```

```scss
// index.scss
.zr-icon {
	position: relative;
	width: var(--zr-icon-width);
	height: var(--zr-icon-height);
	border: none;
	outline: none;
	text-align: center;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	color: var(--zr-icon-color);
	transform: translateZ(0);
	opacity: var(--zr-icon-depth);
	cursor: var(--zr-icon-cursor);

	& svg[ZrIconAttribute='zr-icon'] {
		width: var(--zr-icon-width);
		height: var(--zr-icon-height);
		fill: currentColor;
	}
}

.zr-icon-path__animate {
	stroke-dasharray: var(--zr-icon-path-length);
	stroke-dashoffset: var(--zr-icon-path-length);
	animation: zrIconPathAnimate 2s forwards;
}

@keyframes zrIconPathAnimate {
	to {
		stroke-dashoffset: 0;
	}
}
```
