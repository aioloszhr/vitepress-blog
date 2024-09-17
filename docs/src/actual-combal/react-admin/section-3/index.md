---
outline: deep
---

# 实现登录功能

## 实现方案分析

单 token or 双 token
基本每个 axios 封装自动刷新 token 的文章下面都会有人说都搞自动刷新了，还不如用一个 token，这里我说一下我的理解。先说明我打算使用双 token 这种方案，即一个普通 token 和一个用来刷新 token 的 token。
使用双 token 主要还是从安全角度来说，如果是个人的小网站，不考虑安全的情况下是可以用单 token 的，甚至都可以在每个请求上都带上用户账号和密码，然后后端用账号密码做验证，这样连 token 都不需要了。
个人理解的双 token 的好处是：
`access token` 每个请求都要求被携带，这样它暴露的概率会变大，但是它的有效期又很短，即使暴露了，也不会造成特别大的损失。而 `refresh token` 只有在 access token 失效的时候才会用到，使用的频率比 `access token` 低很多，所以暴露的概率也小一些。如果只使用一个 `token`，要么把这个 `token` 的有效期设置的时间很长，要么动态在后端刷新，那如果这个 `token` 暴露后，别人可以一直用这个 `token` 干坏事，如果把这个 `token` 有效期设置很短，并且后端也不自动刷新，那用户可能用一会就要跳到登录页去登录一下，这样用户体验很差。所以本文采用双 `token` 的方式去实现登录

## 前端密码加密

### 加密方式

非对称加密通俗一点的解释就是通过某种方法生成一对公钥和私钥，把公钥暴露出去给别人，私钥自己保存，别人用公钥加密的文本，

然后用私钥把加密过后的文本解密出来。

### 实现思路

如果使用固定的公钥和私钥，一旦私钥泄漏，所有人的密码都会受到威胁，这种方案安全性不高。我们使用动态的公钥和私钥，前端在登录的时候，先从后端获取一下公钥后端动态生成公钥和私钥，公钥返回给前端，私钥存到 redis 中。前端拿到公钥后，使用公钥对密码加密，然后把公钥和加密过后的密码传给后端，后端通过公钥从 redis 中获取私钥去解密，解密成功后，把私钥从 redis 中删除。

### 具体实现

1. `auth controller`中添加获取公钥接口

```ts
async getPublicKey(): Promise<string> {
    const key = new NodeRSA({ b: 512 });
    const publicKey = key.exportKey('public'); // 获取公钥
    const privateKey = key.exportKey('private'); // 获取私钥
    await this.redisClient.set(`publicKey:${publicKey}`, privateKey);
    return publicKey;
}
```

2. 改造 `login` 方法，解密密码后再去校验密码

```ts
// auth.controller.ts login方法
const password = await this.rsaService.decrypt(loginDTO.publicKey, loginDTO.password);

if (!password) {
	throw new HttpException(
		{
			statusCode: '-1',
			message: '登录出现异常，请重新登录'
		},
		200
	);
}
```

```ts
// rsa.service.ts
const privateKey = await this.redisClient.get(`publicKey:${publicKey}`);

await this.redisClient.del(`publicKey:${publicKey}`);

if (!privateKey) {
	throw new HttpException(
		{
			statusCode: '-1',
			message: '解密私钥错误或已失效'
		},
		200
	);
}

const decrypt = new NodeRSA(privateKey);
// 注：使用NodeRSA并将环境设置为浏览器（会默认使用带有CVE的node加密库），否则，会报错。
decrypt.setOptions({ encryptionScheme: 'pkcs1', environment: 'browser' });
return decrypt.decrypt(data, 'utf8');
```

3. 前端登录方法改造

```ts
// 获取公钥
const [error, publicKey] = await getPublicKey();

if (error) {
	return;
}

// 使用公钥对密码加密
const encrypt = new JSEncrypt();
encrypt.setPublicKey(publicKey);
const password = encrypt.encrypt(values.password) as string;

values.password = password;
values.publicKey = publicKey;
```

<span style="color: red; font-weight: 600">注：</span>jsencrypt 是一个 JavaScript 库，用于在浏览器中进行 RSA 加密和解密操作。

使用 jsencrypt 可以很方便地在前端进行 RSA 公钥加密和私钥解密操作。
