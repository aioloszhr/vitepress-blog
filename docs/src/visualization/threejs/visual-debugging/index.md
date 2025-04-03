---
outline: deep
---

# 可视化调试

## dat.gui

### 引入 `dat.gui`

```js
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
```

### 创建 `GUI` 对象

创建 `GUI` 对象：
```js
const gui = new GUI();
```

### 添加控件

- 可视化的调节 `mesh.material.color` 和 `mesh.position` 来改变颜色、位置：
```js
gui.addColor(mesh.material, 'color');
gui.add(mesh.position, 'x').step(10);
gui.add(mesh.position, 'y').step(10);
gui.add(mesh.position, 'z').step(10);
```

- 调节灯光位置 `light.position` 和强度 `light.intensity`：
```js
gui.add(pointLight.position, 'x').step(10);
gui.add(pointLight.position, 'y').step(10);
gui.add(pointLight.position, 'z').step(10);
gui.add(pointLight, 'intensity').step(1000);
```
<span style="color: red; font-weight: 600">注：</span>`step`是步长，也就是每条调多少。

### 分组

通过 `gui.addFolder` 创建两个分组，然后把控件添加到不同分组下就可以了。

```js
const meshFolder = gui.addFolder('立方体');
meshFolder.addColor(mesh.material, 'color');
meshFolder.add(mesh.position, 'x').step(10);
meshFolder.add(mesh.position, 'y').step(10);
meshFolder.add(mesh.position, 'z').step(10);
```

```js
const lightFolder = gui.addFolder('灯光');
lightFolder.add(pointLight.position, 'x').step(10);
lightFolder.add(pointLight.position, 'y').step(10);
lightFolder.add(pointLight.position, 'z').step(10);
lightFolder.add(pointLight, 'intensity').step(1000);
```

### 其它场景的控件











