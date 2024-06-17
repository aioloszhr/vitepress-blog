---
outline: deep
---

# `IOC`

后端系统有很多的对象，这些对象之间的关系错综复杂，如果手动创建并组装对象比较麻烦，所以后端框架一般都提供了 `IoC` 机制。

- `Controller` 对象：接收 `http` 请求，调用 `Service`，返回响应。
- `Service` 对象：实现业务逻辑。
- `Repository` 对象：实现对数据库的增删改查。

## `IOC` 机制

`IoC` 机制是在 `class` 上标识哪些是可以被注入的，它的依赖是什么，然后从入口开始扫描这些对象和依赖，自动创建和组装对象。

## `Nest` 项目中使用 `IOC`

Nest 项目中如何创建对象：

![An image](/nest/ioc/ioc-1.png)

### `AppService` 对象

声明了 `@Injectable`，代表这个 `class` 可注入，那么 `nest` 就会把它的对象放到 `IOC` 容器里。

### `AppController` 对象

![An image](/nest/ioc/ioc-2.png)

声明了 `@Controller`，代表这个 `class` 可注入，那么 `nest` 就会把它的对象放到 `IOC` 容器里。

<span style="color: red; font-weight: bold">注：</span> `Controller` 只需要被注入，所以用 `@Controller` 修饰器声明。

而 `Service` 可以被注入也可以注入到别的对象中，所以用 `@Injectable` 修饰器声明。

`Controller` 对象中，依赖声明的方式：

1. 构造器：

![An image](/nest/ioc/ioc-2.png)

2. 通过属性的方式声明依赖：

![An image](/nest/ioc/ioc-3.png)

### `AppModule` 对象

通过 `@Module` 声明模块。

- `controllers`：控制器，只能被注入。

- `providers`：可以被注入，也可以注入别的对象，比如 `AppService`。

![An image](/nest/ioc/ioc-4.png)

### 入口模块 `main`

![An image](/nest/ioc/ioc-5.png)

那么 `nest` 就会从 `AppModule` 开始解析 `class` 上通过装饰器声明的依赖信息，自动创建和组装对象。

![An image](/nest/ioc/ioc-6.png)

所以 `AppController` 只是声明了对 `AppService` 的依赖，就可以调用它的方法了：

![An image](/nest/ioc/ioc-7.png)

`nest` 在背后自动做了对象创建和依赖注入的工作。

## `Nest` 中的模块机制

可以把不同业务的 `controller`、`service` 等放到不同模块里。

以 `OtherModule`，`OtherService` 为例。

1. 将`OtherService` 添加到 `OtherModule` 的 `providers` 中：

![An image](/nest/ioc/ioc-8.png)

2. 在 `OtherModule` 的 `exports` 中导出：

![An image](/nest/ioc/ioc-9.png)

3. 那当 `AppModule` 引用了 `OtherModule` 之后，就可以注入它 `exports` 的 `OtherService` 了：

![An image](/nest/ioc/ioc-10.png)

4. 在 `AppService` 里注入：

```ts
import { OtherService } from './other/other.service';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
	@Inject(OtherService)
	private otherService: OtherService;

	getHello(): string {
		return 'Hello World!' + this.otherService.xxx();
	}
}
```
