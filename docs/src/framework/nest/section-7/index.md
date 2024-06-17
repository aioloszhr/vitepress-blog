---
outline: deep
---

# 使用多种 `Provider`，灵活注入对象

`Nest` 实现了 `IoC` 容器，会从入口模块开始扫描，分析 `Module` 之间的引用关系，对象之间的依赖关系，自动把 `provider` 注入到目标对象。

一般情况下，`provider` 是通过 `@Injectable` 声明，然后在 `@Module` 的 `providers` 数组里注册的 `class`。

## `useClass`

默认的 `token` 就是 `class`，这样不用使用 `@Inject` 来指定注入的 `token`。

![An image](/nest/provider/provider-1.png)

也可以使用字符串类型的 `token`，不过注入的时候要用 `@Inject` 单独指定。

![An image](/nest/provider/provider-2.png)

## `useValue`

使用 `provide` 指定 `token`， 使用 `useValue` 指定注入的对象。

![An image](/nest/provider/provider-3.png)

```ts
{
    provide: 'person',
    useValue: {
        name: 'aaa',
        age: 20
    }
}

```

在 `Controller` 对象中注入：

```ts
@Inject('person') private readonly person: {name: string, age: number}
```

## `useFactory`

- `useFactory` 动态创建对象。

在 `providers` 中使用 `useFactory` 动态创建对象。

```ts
{
    provide: 'person2',
    useFactory() {
        return {
            name: 'bbb',
            desc: 'cccc'
        }
    }
}
```

在 `Controller` 对象中注入：

```ts
@Inject('person2') private readonly person2: {name: string, desc: string}
```

- `useFactory` 支持通过参数注入别的 `provider`

```ts
{
  provide: 'person3',
  useFactory(person: { name: string }, appService: AppService) {
    return {
      name: person.name,
      desc: appService.getHello()
    }
  },
  inject: ['person', AppService]
}
```

通过 `inject` 声明了两个 `token`，一个是字符串 `token` 的 `person`，一个是 `class token` 的 `AppService`。

也就是注入这两个 `provider`：

![An image](/nest/provider/provider-4.png)

- `useFactory` 支持异步：

```ts
{
  provide: 'person5',
  async useFactory() {
    await new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });
    return {
      name: 'bbb',
      desc: 'cccc'
    }
  },
},
```

`Nest` 会等拿到异步方法的结果之后再注入：

![An image](/nest/provider/provider-5.png)

## `useExisting`

`provider` 还可以通过 `useExisting` 来指定别名：

```ts
{
  provide: 'person4',
  useExisting: 'person2'
}
```

<span style="color:red;font-weight:600">注：</span> `person2` 的 `token` 的 `provider` 起个新的 `token` 叫做 `person4`。
