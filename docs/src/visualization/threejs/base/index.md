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

2. 调试摄像机视角：

```js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// 初始化摄像机
const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
// 设置摄像机的位置。
camera.position.set(12, 64, 1199);
camera.lookAt(0, 0, 0);
// 轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 监听 change 事件，打印出摄像机的位置
// 获取调式好的摄像机位置值
// 更新摄像机位置
controls.addEventListener('change', () => {
    console.log(camera.position);
})
```
## 曲线

注意：**曲线API**就是一些计算曲线坐标的公式，从中取出一些点，用**点模型**或**线模型**画出来。

### 椭圆曲线 (EllipseCurve)

创建一个形状为椭圆的曲线。 将 `xRadius` 与 `yRadius` 设为相等的值它将会成为一个圆。

1. 示例：

```js
import * as THREE from 'three';

// 使用 EllipseCurve 创建椭圆曲线，椭圆中心是 0 0 ，长短半轴分别是100、50。
const arc = new THREE.EllipseCurve(0, 0, 100, 50);
// 使用 getPoints 方法返回一组 divisions + 1 的点。
// 参数 divisions：分段数，默认值是5。
const points = arc.getPoints(20);

const geometry = new THREE.BufferGeometry();
geometry.setFromPoints(pointsList);

// 点
const material = new THREE.PointsMaterial({
    color: new THREE.Color('orange'),
    size: 10
});

const points = new THREE.Points(geometry, material);

console.log(points);

export default points;
```
2. 参数：

- `aX`: 椭圆的中心的X坐标，默认值为0。
- `aY`: 椭圆的中心的Y坐标，默认值为0。
- `xRadius`: X轴向上椭圆的半径，默认值为1。 
- `yRadius`: Y轴向上椭圆的半径，默认值为1。
- `aStartAngle`: 以弧度来表示，从正X轴算起曲线开始的角度，默认值为0。
- `aEndAngle`: 以弧度来表示，从正X轴算起曲线终止的角度，默认值为2 x Math.PI。
- `aClockwise`: 椭圆是否按照顺时针方向来绘制，默认值为false。
- `aRotation`: 以弧度表示，椭圆从X轴正方向逆时针的旋转角度（可选），默认值为0。
**注：`aX` 和 `aY`相等时，画出来的是圆形**

### 样条曲线 (SplineCurve)

从一系列的点中，创建一个平滑的二维样条曲线。

1. 示例：

```js
import * as THREE from 'three';

// 创建一组点。
// Vector2：二维向量。
const arr = [
    new THREE.Vector2( -100, 0 ),
	new THREE.Vector2( -50, 50 ),
	new THREE.Vector2( 0, 0 ),
	new THREE.Vector2( 50, -50 ),
	new THREE.Vector2( 100, -30 ),
	new THREE.Vector2( 100, 0 )
];

// 创建样条曲线。
const curve = new THREE.SplineCurve(arr);
// 使用 getPoints 方法返回一组 divisions + 1 的点。
// 参数 divisions：分段数，默认值是5。
const pointsArr = curve.getPoints(20);

const geometry = new THREE.BufferGeometry();
geometry.setFromPoints(pointsArr);

// 线
const material = new THREE.LineBasicMaterial({ 
    color: new THREE.Color('orange') 
});
const line = new THREE.Line( geometry, material );

// 点
const pointsMaterial = new THREE.PointsMaterial({
    color: new THREE.Color('orange'),
    size: 5
});
const points = new THREE.Points( geometry, pointsMaterial );

// 将点添加到线中
line.add(points);

export default line;
```
**注：样条曲线 `SplineCurve` 会把传入的点用线连接起来 **

### 二维二次贝塞尔曲线 (QuadraticBezierCurve)
 
创建一条平滑的二维**二次贝塞尔曲线**， 由起点、终点和一个控制点所定义。

1. 示例：

```js
import * as THREE from 'three';

const p1 = new THREE.Vector2(0, 0);
const p2 = new THREE.Vector2(50, 200);
const p3 = new THREE.Vector2(100, 0);

const curve = new THREE.QuadraticBezierCurve(p1, p2, p3);
const pointsArr = curve.getPoints(20);

const geometry = new THREE.BufferGeometry();
geometry.setFromPoints(pointsArr);
const material = new THREE.LineBasicMaterial({
    color: new THREE.Color('orange')
});
const line = new THREE.Line( geometry, material );

export default line;
```
2. 参数：

- `v0`：起点。
- `v1`：中间的控制点，控制曲线曲率。
- `v2`：终点。

### 三维三次贝塞尔曲线 (CubicBezierCurve3)

创建一条平滑的三维**三次贝塞尔曲线**， 由起点、终点和两个控制点所定义。

1. 示例：

```js
import * as THREE from 'three';

const p1 = new THREE.Vector3(-100, 0, 0);
const p2 = new THREE.Vector3(50, 100, 0);
const p3 = new THREE.Vector3(100, 0, 100);
const p4 = new THREE.Vector3(100, 0, 0);

const curve = new THREE.CubicBezierCurve3(p1, p2, p3, p4);
const pointsArr = curve.getPoints(20);

const geometry = new THREE.BufferGeometry();
geometry.setFromPoints(pointsArr);

const material = new THREE.LineBasicMaterial({
    color: new THREE.Color('orange')
});
const line = new THREE.Line( geometry, material );

export default line;
```
2. 参数：

- `v0`：起点。
- `v1`：第一个控制点。
- `v2`：第二个控制点。
- `v3`：终点。

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

### 球缓冲几何体（SphereGeometry）

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
## 材质

### 虚线材质（LineDashedMaterial）

1. 示例：

```js
import * as THREE from 'three';
// BoxGeometry（立方缓冲几何体）想渲染线模型，需要使用 EdgesGeometry（边缘几何体）转换成线框模型。
const boxGeometry = new THREE.BoxGeometry(100, 100, 100);
const geometry = new THREE.EdgesGeometry(boxGeometry);
// 使用 LineDashedMaterial 虚线材质
const material = new THREE.LineDashedMaterial(({
    color: new THREE.Color('orange'),
    dashSize: 10, // 虚线大小，是指破折号和间隙之和
    gapSize: 10 // 间隙的大小
}));
const line = new THREE.Line(geometry, material);
// 调用 computeLineDistances 方法来计算虚线
line.computeLineDistances();
console.log(line);
export default line;
```
### 基础网格材质（MeshBasicMaterial）

1. 示例：

```js
import * as THREE from 'three';
const geometry = new THREE.PlaneGeometry(100, 100);
// 网格模型基础材质
const material = new THREE.MeshBasicMaterial(({
    color: new THREE.Color('orange'), // 设置颜色
    // 利用 transparent 和 opacity 设置透明度
    transparent: true, 
    opacity: 0.5
}));
const mesh = new THREE.Mesh(geometry, material);
// 获取 color 对象
const color = mesh.material.color
// 使用 setStyle 方法设置颜色
color.setStyle('red');
export default mesh;
```
2. 属性：

- `aoMap`（用作**纹理**）： 该纹理的红色通道用作环境遮挡贴图。默认值为`null`。`aoMap`需要第二组`UV`。

## 纹理贴图

**纹理贴图**经常用来做地板、墙面。

### 纹理（Texture）

## 加载器

### TextureLoader

加载`texture`的一个类。内部使用`ImageLoader`加载文件。

1. 示例：

```js
import * as THREE from 'three';
// 创建纹理贴图
const loader = new THREE.TextureLoader();
const texture = loader.load('./diqiu.jpg');
// 使用纹理进行材质创建
const material = new THREE.MeshBasicMaterial({ map: texture })
```

## 核心

### BufferGeometry

如果想自定义其它形状的几何体，可以使用**BufferGeometry**通过顶点构造出来。
<span style="color:red">注：</span>`BufferGeometry`是所有几何体的父类。

## 附件 / 核心

### CurvePath

一个扩展了`Curve`的抽象基类。`CurvePath`仅仅是一个已连接的曲线的数组，但保留了曲线的API。

1. 示例：

```js
import * as THREE from 'three';

const p1 = new THREE.Vector2(0, 0);
const p2 = new THREE.Vector2(100, 100);
const line1 = new THREE.LineCurve(p1, p2);

const arc = new THREE.EllipseCurve(0, 100, 100 , 100, 0, Math.PI);

const p3 = new THREE.Vector2(-100, 100);
const p4 = new THREE.Vector2(0, 0);
const line2 = new THREE.LineCurve(p3, p4);

const curvePath = new THREE.CurvePath();
curvePath.add(line1);
curvePath.add(arc);
curvePath.add(line2);

const pointsArr = curvePath.getPoints(20);
const geometry = new THREE.BufferGeometry();
geometry.setFromPoints(pointsArr);

const material = new THREE.LineBasicMaterial({
    color: new THREE.Color('pink')
});

const line = new THREE.Line(geometry, material);

export default line;
```

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

