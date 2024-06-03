---
outline: deep
---

# 两种登录状态保存方式：JWT、Session

- 服务端存储的 session + cookie 的方案
- 客户端存储的 jwt token 的方案

## 服务端存储的 session + cookie

session + cookie 给 http 添加状态的方案是服务端保存 session 数据，然后把 id 放入 cookie 返回，cookie 是自动携带的，每个请求可以通过
cookie 里的 id 查找到对应的 session，从而实现请求的标识。这种方案能实现需求，但是有 CSRF、分布式 session、跨域等问题，不过都是有解决方案的。

## 客户端存储的 token

token 的方案常用 json 格式来保存，叫做 **json web token**，简称 **JWT**

JWT 由三部分组成：header、payload、verify signature

- **header：** 保存当前的加密算法。

- **payload：** 具体存储的数据。

- **verify signature：** 把 header 和 payload 还有 salt 做一次加密之后生成的。（salt，盐，就是一段任意的字符串，增加随机性）

这三部分会分别做 Base64，然后连在一起就是 JWT 的 header，放到某个 header。

比如 authorization 中：

```ts
authorization: Bearer xxxxx.xxxxx.xxxx
```

请求的时候把这个 header 带上，服务端就可以解析出对应的 header、payload、verify signature 这三部分，然后根据 header 里的算法也对 header、payload 加上 salt 做一次加密，如果得出的结果和 verify signature 一样，就接受这个 token。

把状态数据都保存在 payload 部分，这样就实现了有状态的 http:

![An image](/nest/nest-1.png)

JWT 的方案是把状态数据保存在 header 里，每次请求需要手动携带，没有 session + cookie 方案的 CSRF、分布式、跨域的问题，但是也有安全性、性能、没法控制等问题。

### 安全性

因为 JWT 把数据直接 Base64 之后就放在了 header 里，那别人就可以轻易从中拿到状态数据，比如用户名等敏感信息，也能根据这个 JWT 去伪造请求。所以 JWT 要搭配 https 来用，让别人拿不到 header。

### 性能

JWT 把状态数据都保存在了 header 里，每次请求都会带上，比起只保存个 id 的 cookie 来说，请求的内容变多了，性能也会差一些。所以 JWT 中也不要保存太多数据。

### 没法控制让 JWT 失效

session 因为是存在服务端的，那我们就可以随时让它失效，而 JWT 不是，因为是保存在客户端，那我们是没法手动让他失效的。

**问题：** 比如踢人、退出登录、改完密码下线这种功能就没法实现。

**解决方案：** 可以配合 redis 来解决，记录下每个 token 对应的生效状态，每次先去 redis 查下 jwt 是否是可用的，这样就可以让 jwt 失效。
