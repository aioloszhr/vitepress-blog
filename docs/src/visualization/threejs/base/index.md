---
outline: deep
---

# 基本概念

## 摄像机

### Camera

### 透视相机 (PerspectiveCamera)

1. 示例：
```js
const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
scene.add( camera );
```
2. 参数：
- fov： Field of View，影响可视范围角度、离物体远近，，默认是 50。
- aspect： 可视范围宽高比，一般设置网页宽高比，默认值是 1。
- near： 近裁截面距离，一般保持默认值 0.1，当你需要截掉一些特别近的物体的时候，把它加大。
- far： 远裁截面距离，默认值是2000，如果有的物体被裁截掉看不到了，就需要调大 far 把它们包含进来。
<span style="color:red">注：</span>我们看到的 `3D` 世界就是这个视椎体的 `near` 和 `far` 之间的部分。

## 几何体

1. **所有几何体都是一堆顶点数据，构成一堆三角形，三角形构成了任何几何体。**

2. `Three.js` 提供了一种优化顶点存储的方案：存储一份不重复的顶点数据，然后存储一份顶点索引的顺序，其中

- 顶点数据(Float32Array)：`geometry.attributes.position`
- 索引数据(Unit16Array)：`geometry.index`

3. 几何体支持分段，也就是分成几段再细分三角形，分段越多顶点和三角形越多，渲染越精细，但性能也会变差，所以要设置一个适中的值，一般保持默认就行。

### 平面缓冲几何体 (PlaneGeometry)

1. 示例：

```js
import * as THREE from 'three';
const geometry = new THREE.PlaneGeometry(100, 100, 2, 3);
const material = new THREE.MeshBasicMaterial(({
    color: new THREE.Color('orange'),
    wireframe: true
}));
const mesh = new THREE.Mesh(geometry, material);
console.log(mesh);
export default mesh;
```

2. 参数：
- `width`：平面沿着 X 轴的宽度。默认值是 `1`。
- `height`：平面沿着 Y 轴的高度。默认值是 `1`。
- `widthSegments`：（可选）平面的宽度分段数，默认值是 `1`。
- `heightSegments`：（可选）平面的高度分段数，默认值是 `1`。

### 圆柱缓冲几何体（CylinderGeometry）

1. 示例：

```js
import * as THREE from 'three';
const geometry = new THREE.CylinderGeometry(50, 50, 80);
const material = new THREE.MeshBasicMaterial(({
    color: new THREE.Color('orange'),
    wireframe: true,
}));
const mesh = new THREE.Mesh(geometry, material);
export default mesh;
```
2. 参数：

- `radiusTop`：圆柱的顶部半径，默认值是1。
- `radiusBottom`：圆柱的底部半径，默认值是1。
- `height`：圆柱的高度，默认值是1。
- `radialSegments`：圆柱侧面周围的分段数，默认为32。
- `eightSegments`：圆柱侧面沿着其高度的分段数，默认值为1。


## 物体

### 点（Point）

1. 示例：

```js
import * as THREE from 'three';
// 创建自定义几何体
const geometry = new THREE.BufferGeometry();
// 创建顶点数据
const vertices = new Float32Array([
    0, 0, 0,
    100, 0, 0,
    0, 100, 0,
    0, 0, 100,
    100, 100, 0
]);
// 存储和 BufferGeometry 相关联的 attribute
const attribute = new THREE.BufferAttribute(vertices, 3);
geometry.attributes.position = attribute;
// 点模型材质 PointsMaterial
const material = new THREE.PointsMaterial({
    color: new THREE.Color('orange'),
    size: 10
});
// 渲染点模型
const points = new THREE.Points(geometry, material);
// 对外部导出点模型
export default points;
```

### 线（Line）

1. 示例：

```js
import * as THREE from 'three';
// 创建自定义几何体
const geometry = new THREE.BufferGeometry();
// 创建顶点数据
const vertices = new Float32Array([
    0, 0, 0,
    100, 0, 0,
    0, 100, 0,
    0, 0, 100,
    100, 100, 0,
    200, 100, 0
]);
// 存储和 BufferGeometry 相关联的 attribute
const attribute = new THREE.BufferAttribute(vertices, 3);
geometry.attributes.position = attribute;
// 线模型材质 LineBasicMaterial
const material = new THREE.LineBasicMaterial({
    color: new THREE.Color('orange')
});
// Line 首尾不连接
// const line = new THREE.Line(geometry, material);
// LineLoop 首尾连接
// const line = new THREE.LineLoop(geometry, material);
// LineSegments 每2个点一段线
const line = new THREE.LineSegments(geometry, material);
export default line;
```
### 网格（Mesh）

`Mesh` 网格的三角形有正反的区别， 配置 `side : THREE.DoubleSide` 支持正反面都渲染。
<span style="color:red; font-weight: 700">注：</span>`Three.js` 规定了：**从相机看过去的方向，如果一个三角形是逆时针连接的顶点，就是正面，顺时针就是反面。**

1. 示例：
```js
import * as THREE from 'three';
// 创建自定义几何体
const geometry = new THREE.BufferGeometry();
// 创建顶点数据
const vertices = new Float32Array([
    0, 0, 0,
    100, 0, 0,
    0, 100, 0,
    100, 100, 0
]);
// 存储和 BufferGeometry 相关联的 attribute
const attribute = new THREE.BufferAttribute(vertices, 3);
geometry.attributes.position = attribute;
// 创建索引集合
const indexes = new Uint16Array([
    // 0, 1, 2, 2, 1, 3 // 正面可见
    0, 1, 2, 2, 3, 1 // 正反面都有三角形，但是不一样
]);
geometry.index = new THREE.BufferAttribute(indexes, 1);
// 网格模型材质 MeshBasicMaterial 
const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color('orange'),
    // 正反面可见
    side: THREE.DoubleSide
});
const mesh = new THREE.Mesh(geometry, material);
export default mesh;
```
## 核心

### BufferGeometry

如果想自定义其它形状的几何体，可以使用**BufferGeometry**通过顶点构造出来。
<span style="color:red">注：</span>`BufferGeometry`是所有几何体的父类。

## 辅助对象

### AxesHelper

1. 定义：用于简单模拟3个坐标轴的对象. 
<span style="color:red">注：</span>红色代表 `X` 轴. 绿色代表 `Y` 轴. 蓝色代表 `Z` 轴.

2. 示例：

```js
// 参数是坐标轴的长度，设置 200
const axesHelper = new THREE.AxesHelper(200);
scene.add(axesHelper);
```

### CameraHelper

1. 定义：用于模拟相机视锥体的辅助对象.它使用 `LineSegments` 来模拟相机视锥体.

2. 示例：

```js
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const helper = new THREE.CameraHelper(camera);
scene.add(helper);
```

## Threejs 渲染流程

在 `Scene` 中添加各种  `Mesh`, 每个 `Mesh` 都是由几何体 `Geometry` 和材质 `Material` 构成，设置相机 `Camera` 的角度和可视范围，设置灯光 `Light` 的位置，然后通过渲染器 `Renderer` 渲染到 `canvas` 元素上，把这个 `canvas` 挂载到 `dom`。

