---
outline: deep
---

# 响应式API: 工具函数 

## isRef()

在Vue 3中，`toRef`是Composition API提供的一个工具函数，用于将响应式对象的某个属性转换为一个**保持响应式连接**的ref。以下是其核心用法和注意事项：

### 基本用法

1. **导入`toRef`:**
```javascript
import { reactive, toRef } from 'vue';
```
2. **创建响应式对象:**
```javascript
const state = reactive({ count: 0 , name: 'Vue' })
```
3. **转换为ref:**
```javascript
const countRef = toRef(state, 'count');
```
- `countRef`是一个ref，其`.value`与`state.count`保持同步。
- 修改`countRef.value`将更新`state.count`，反之亦然。

### 与`ref()`的区别

- `ref()`：创建独立的ref，复制当前值，与原属性断开连接。
```javascript
const copy = ref(state.count); // 复制初始值，无响应式连接
state.count++; 
console.log(copy.value); // 仍为0
```

- `toRef()`：创建的ref与原属性保持响应式连接。
```javascript
const linkedRef = toRef(state, 'count');
state.count++;
console.log(linkedRef.value); // 同步为1
```
### 注意事项

- **源对象需为响应式**： `toRef`依赖对象的响应式，普通对象无效。
- **属性需存在**：若属性不存在，`toRef`不会自动创建响应式属性。
- **深层嵌套对象**：若替换整个嵌套对象，`toRef`可能不会追踪新对象（需确保路径稳定）。
- **只读属性**：若原属性是只读的（如`readonly`对象），生成的ref也会是只读的。





