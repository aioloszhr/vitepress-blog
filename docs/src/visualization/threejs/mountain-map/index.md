---
outline: deep
---

# 山脉地形图

## 搭建项目

```bash
mkdir mountain-terrain # 创建项目文件夹
cd mountain-terrain # 进入项目文件夹
npm init -y # 初始化 package.json
npm install @types/three -D # 安装用到的 ts 类型
```

## 创建项目文件

### index.html

1. 创建 `index.html` 文件：

```bash
touch index.html
```
2. 编写代码：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>山脉地形图</title>
    <style>
        body {
            margin: 0;
        }
    </style>
</head>
<body>
    <script type="importmap">
    {
        "imports": {
            "three": "https://esm.sh/three@0.174.0/build/three.module.js",
            "three/addons/": "https://esm.sh/three@0.174.0/examples/jsm/",
            "simplex-noise": "https://esm.sh/simplex-noise@4.0.3/dist/esm/simplex-noise.js"
        }
    }
    </script>
    <script type="module" src="./index.js"></script>
</body>
</html>
```

### index.js

1. 创建 `index.js` 文件：

```bash
touch index.js
```

2. 编写代码：

```js
// 引入 threejs
import * as THREE from 'three';
// 引入轨道控制器
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
// 引入物体
import mesh, { updatePosition } from './mesh.js';

// 创建 Scene 场景
const scene = new THREE.Scene();
// 在场景中添加物体
scene.add(mesh);

// 创建坐标轴
const axesHelper = new THREE.AxesHelper(200);
// 在场景中添加坐标轴
// scene.add(axesHelper);

const width = window.innerWidth;
const height = window.innerHeight;

// 创建透视摄像机
const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
camera.position.set(200，200, 200);
camera.lookAt(0, 0, 0);

// 示例化渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染器的尺寸
renderer.setSize(width, height);

// 渲染函数
function render() {
    updatePosition();
    // 绕着 z 轴旋转
    mesh.rotateZ(0.003);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
render();

// 在 body 中添加渲染器的 dom 元素
document.body.appendChild(renderer.domElement);

// 初始化轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
```

### mesh.js

1. 创建 `mesh.js` 文件：

```bash
touch mesh.js
```

2. 编写代码：

```js
// 引入 threejs
import * as ThREE from 'three';
// 引入噪音算法函数
import { createNoise2D } from "simplex-noise";

// 创建平面缓冲几何体
const geometry = new THREE.PlaneGeometry(3000, 3000, 100, 100);

// 创建材质
const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color('orange'), // 设置材质的颜色
    wireframe: true, // 将几何体渲染为线框
})

// 创建物体
const mesh = new THREE.Mesh(geometry, material);

// 绕着x轴旋转物体
mesh.rotateX(Math.PI / 2);

// 更新顶点位置函数
export function updatePosition() {
    // 随机顶点
    const positions = geometry.attributes.position;
    // 顶点会按照 3 个一组来分组，position.count 是分组数，可以通过 setX、setY、setZ 修改某个分组的 xyz 值。
    for (let i = 0; i < positions.count; i++) {
        // 传入 x、y 让噪音算法算出这个位置的z
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = noise2D(x / 300, y / 300) * 50;
        // 传入时间来计算正弦，得到的就是一个不断变化的 -1 到 1 的值
        // Math.sin 是从 -1 到 1 变化的，所以 * 10 就是 -10 到 10 变化，这样就有 20 的高度波动
        // sin 的参数还要传入一个 x 坐标，这样每个顶点变化的值不同，是符合正弦规律的变化
        const sinNum = Math.sin(Date.now() * 0.002 + x * 0.05) * 10;
        positions.setZ(i, z + sinNum);
    }
    // 告诉 GPU 顶点变了，需要重新渲染，不然默认不会更新顶点
    positions.needsUpdate = true;
}

// 导出物体
export default mesh;

```


