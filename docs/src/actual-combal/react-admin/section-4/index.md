---
outline: deep
---

# 封装 `axios`

## 实现刷新 token 接口

前端把`refreshToken`传给后端，后端拿到`refreshToken`去`redis`中检查当前`refreshToken`是否失效，<span style="color:red">如果失效就报错</span>，没失效就颁发一个新的`token`给前端。这里注意一下，不要生成新的`refreshToken`返回给前端，不然如果别人拿到一次`refreshToken`后，可以一直刷新拿新`token`了。

```ts
// src/modules/auth/controller/auth.controller.ts
...
	@ApiOperation({ description: '刷新token' })
	@Post('refresh/token')
	async refreshToken(refreshTokenDTO: RefreshTokenDTO) {
		if (!refreshTokenDTO.refreshToken) {
			throw new HttpException('用户凭证已过期，请重新登录！', HttpStatus.UNAUTHORIZED);
		}
	}
```

```ts
// src/modules/auth/service/auth.service.ts
 ...
 async refreshToken(refreshTokenDto: RefreshTokenDTO) {
		const userId = await this.redisClient.get(`refreshToken:${refreshTokenDto.refreshToken}`);

		if (!userId) {
			throw new HttpException('用户凭证已过期，请重新登录！', HttpStatus.UNAUTHORIZED);
		}

		const { expire } = this.apiConfigService.redisConfig;

		const token = uuid();

		await this.redisClient
			.multi()
			.set(`token:${token}`, JSON.stringify({ userId, refreshTokenDto }))
			.expire(`token:${token}`, expire)
			.exec();

		// TTL（Time to Live）是指键的剩余存活时间
		const refreshExpire = await this.redisClient.ttl(
			`refreshToken:${refreshTokenDto.refreshToken}`
		);

		return {
			expire,
			token,
			refreshExpire,
			refreshToken: refreshTokenDto.refreshToken
		};
	}
...
```

## 统一返回值

1. 在 `axios` 的响应拦截器中捕获异常，接口报错统一在响应拦截器中弹出，不用在每一处单独处理。

```ts
// src/request/index.ts
import axios, {
	AxiosInstance,
	AxiosRequestConfig,
	AxiosResponse,
	CreateAxiosDefaults,
	InternalAxiosRequestConfig
} from 'axios';
import { useGlobalStore } from '@/stores/global';
import { antdUtils } from '@/utils/antd';

export type Response<T> = Promise<[boolean, T, AxiosResponse<T>]>;

class Request {
	constructor(config?: CreateAxiosDefaults) {
		this.axiosInstance = axios.create(config);

		this.axiosInstance.interceptors.request.use((axiosConfig: InternalAxiosRequestConfig) =>
			this.requestInterceptor(axiosConfig)
		);
		this.axiosInstance.interceptors.response.use(
			(response: AxiosResponse<unknown, unknown>) => this.responseSuccessInterceptor(response),
			(error: any) => this.responseErrorInterceptor(error)
		);
	}

	private axiosInstance: AxiosInstance;

	private async requestInterceptor(axiosConfig: InternalAxiosRequestConfig): Promise<any> {
		const { token } = useGlobalStore.getState();
		// 为每个接口注入token
		if (token) {
			axiosConfig.headers.Authorization = `Bearer ${token}`;
		}
		return Promise.resolve(axiosConfig);
	}

	private async responseSuccessInterceptor(response: AxiosResponse<any, any>): Promise<any> {
		return Promise.resolve([false, response.data, response]);
	}

	private async responseErrorInterceptor(error: any): Promise<any> {
		const { status } = error?.response || {};
		if (status === 401) {
			// TODO 刷新token
		} else {
			antdUtils.notification?.error({
				message: '出错了',
				description: error?.response?.data?.message
			});
			return Promise.resolve([true, error?.response?.data]);
		}
	}

	request<T, D = any>(config: AxiosRequestConfig<D>): Response<T> {
		return this.axiosInstance(config);
	}

	get<T, D = any>(url: string, config?: AxiosRequestConfig<D>): Response<T> {
		return this.axiosInstance.get(url, config);
	}

	post<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Response<T> {
		return this.axiosInstance.post(url, data, config);
	}

	put<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Response<T> {
		return this.axiosInstance.put(url, data, config);
	}

	delete<T, D = any>(url: string, config?: AxiosRequestConfig<D>): Response<T> {
		return this.axiosInstance.delete(url, config);
	}
}

const request = new Request({ timeout: 30000 });

export default request;
```

接口响应是一个元组类型。

- 元组第一个值是 `boolean` 类型，表示接口是成功还是失败。

- 第二个值是后端响应的数据。

- 第三个值是 `axios` 的 `response` 对象。

2. 封装自定义 `hooks` 函数 ` useRequest`

```ts
// src/hooks/use-request/index.ts
import { useCallback, useEffect, useState } from 'react';
import { Response } from '@/request';

interface RequestOptions {
	manual?: boolean;
	defaultParams?: any[];
}

interface RequestResponse<T> {
	error: boolean | undefined;
	data: T | undefined;
	loading: boolean;
	run(...params: any): void;
	runAsync(...params: any): Response<T>;
}

export function useRequest<T>(
	serviceMethod: (...args: any) => Response<T>,
	options?: RequestOptions
): RequestResponse<T> {
	const [loading, setLoading] = useState<boolean>(false);
	const [data, setData] = useState<T>();
	const [error, setError] = useState<boolean>();

	const resolveData = async () => {
		setLoading(true);
		const [error, requestData] = await serviceMethod(...(options?.defaultParams || []));
		setLoading(false);
		setData(requestData);
		setError(error);
	};

	const runAsync = useCallback(
		async (...params: any) => {
			setLoading(true);
			const res = await serviceMethod(...params);
			setLoading(false);
			return res;
		},
		[serviceMethod]
	);

	const run = useCallback(
		async (...params: any) => {
			setLoading(true);
			const [error, requestData] = await serviceMethod(...params);
			setLoading(false);
			setData(requestData);
			setError(error);
		},
		[serviceMethod]
	);

	useEffect(() => {
		if (!options?.manual) {
			resolveData();
		}
	}, [options]);

	return {
		loading,
		error,
		data,
		run,
		runAsync
	};
}
```

## 无感刷新 `token`

### 背景

1. 双 `token` 的好处：

`access token` 每个请求都要求被携带，这样它暴露的概率会变大，但是它的有效期又很短，即使暴露了，也不会造成特别大的损失。而 `refresh token` 只有在 `access token` 失效的时候才会用到，使用的频率比 `access token` 低很多，所以暴露的概率也小一些。如果只使用一个 `token`，要么把这个 `token` 的有效期设置的时间很长，要么动态在后端刷新，那如果这个 `token` 暴露后，可以一直用这个 `token` 干坏事，如果把这个 `token` 有效期设置很短，并且后端也不自动刷新，那用户可能用一会就要跳到登录页取登录一下，这样用户体验很差。所以采用双 `token` 的方式去实现登录。

2. 无感刷新 `token` 实现方式：

在 `axios` 异常拦截器，发现响应的 `code` 是 **401** 的，说明 `token` 已经过期了，这时候我们需要调刷新 `token` 获取新的 `token`，然后使用新的 `token` 回放上一次 **401** 的接口。如果刷新 `token` 的接口报错了，说明刷新 `token` 也过期了，这时候我们跳到登录页面让用户重新登录。

刷新 `token` 的时候有 2 个需要注意的点:

- 如果同时有很多接口 401，那不能每个都调一下刷新 token 接口去刷新 token，只需要刷新一次就行了。

- 在刷新 `token` 没返回之前，又有新接口进来，如果正常请求的话，必然也会 **401**，所以我们需要给拦截一下。

解决方案：我们需要设置一个表示是否正在刷新 `token` 的变量和一个请求队列，如果正在刷新 `token`，那我们把新的 **401** 接口都插入到一个队列中，
然后等刷新接口拿到新接口了，把队列里的请求一起回放。解决第二个问题也很简单了，在请求拦截器中，判断是否正在刷新 `token`，如果正在刷新 `token`，也加入到队列中，等刷新 `token` 返回后，也一起回放。

### 定义变量和队列

```ts
// 是否正在刷新token
private refreshTokenFlag = false;

// 请求队列
private requestQueue: { resolve: any; config: any; type: 'reuqest' | 'response';}[] = [];
```

### 改造响应拦截器

```ts
private async responseErrorInterceptor(error: any): Promise<any> {
	const { status, config } = error?.response || {};
	if (status === 401) {
		// 如果接口401，把当前接口插入到队列中，然后刷新token
		return new Promise(resolve => {
			this.requestQueue.unshift({ resolve, config, type: 'response' });
			// 如果已经调用刷新token接口，则不需要再调用。
			if (this.refreshTokenFlag) return;

			this.refreshToken();
		});
	} else {
		antdUtils.notification?.error({
			message: '出错了',
			description: error?.response?.data?.message
		});
		return Promise.resolve([true, error?.response?.data]);
	}
}
```

### 添加刷新 token 的方法

```ts
/** 刷新token接口 */
private async refreshToken() {
	// 准备刷新token，需要把标记设置成true
	this.refreshTokenFlag = true;

	// 如果刷新token不存在，则跳转到登录页
	const { refreshToken } = useGlobalStore.getState();

	if (!refreshToken) {
		console.log('xxx');
	}

	// 调用刷新接口
	const [error, data] = await loginService.refreshToken(refreshToken);

	// 如果刷新接口报错
	if (error) {
		console.log('xxx');
	}

	// 把新的token设置到新的全局变量中
	useGlobalStore.setState({
		token: data.token,
		refreshToken: data.refreshToken
	});

	this.requestByQueue();
}

private requestByQueue() {
	if (!this.requestQueue.length) return;

	// 回放队列里的接口，这里不能使用for循环，因为里面有await，使用for循环会让回放变成同步执行
	Array.from({ length: this.requestQueue.length }).forEach(async () => {
		const record = this.requestQueue.shift();
		if (!record) {
			return;
		}

		const { config, resolve, type } = record;
		if (type === 'response') {
			// 如果响应为401，则取config直接再请求一下就行了
			resolve(await this.request(config));
		} else if (type === 'reuqest') {
			// 如果在请求拦截器中被拦截，只需要执行resolve方法，把config放进去。这里需要把新的token放进去。
			const { token } = useGlobalStore.getState();
			config.headers.Authorization = `Bearer ${token}`;
			resolve(config);
		}
	});
}
```

### 改造请求拦截器

```ts
private async requestInterceptor(axiosConfig: InternalAxiosRequestConfig): Promise<any> {
	if ([refreshTokenUrl].includes(axiosConfig.url || '')) {
		return Promise.resolve(axiosConfig);
	}

	if (this.refreshTokenFlag) {
		return new Promise(resolve => {
			this.requestQueue.push({
				resolve,
				config: axiosConfig,
				type: 'reuqest'
			});
		});
	}


	const { token } = useGlobalStore.getState();
	// 为每个接口注入token
	if (token) {
		axiosConfig.headers.Authorization = `Bearer ${token}`;
	}
	return Promise.resolve(axiosConfig);
}
```

### 测试验证

**google** 浏览器最多同时能进行 **6** 个请求，但是对同一个接口多次请求，是串行的，必须等上一个接口响应结束后才会请求下一个。

## 实现请求限流 **没搞懂**

### 背景

有的服务器害怕被攻击，设置了同一个用户同一时间只能请求几个接口，如果超出限制就会报错。

### 实现思路

设置一个变量表示当前有多少个请求正在请求，如果同时请求的数量超出我们设置的最大值，就进入队列不要请求，在接口响应成功后，检查队列里有没有请求，

如果有就取出(最大值-当前请求数量)个请求去执行
