---
outline: deep
---

# `Interceptor` 拦截器

Nest 中 `Intercepter` **拦截器** 的使用。

`rxjs` 是一个处理异步逻辑的库，它的特点就是 operator 多，你可以通过组合 operator 来完成逻辑，不需要自己写。

`nest` 的 `interceptor` 就用了 `rxjs` 来处理响应，但常用的 `operator`：

- tap: 不修改响应数据，执行一些额外逻辑，比如记录日志、更新缓存等。
- map：对响应数据做修改，一般都是改成 `{code, data, message}` 的格式。
- catchError：在 `exception filter` 之前处理抛出的异常，可以记录或者抛出别的异常。
- timeout：处理响应超时的情况，抛出一个 `TimeoutError`，配合 `catchErrror` 可以返回超时的响应。

## 路由级别的 `Interceptor` 拦截器

```ts
// auth.controller.ts
import { Inject, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { CaptchaService } from '../service/captcha.service';
import { ResponseResultInterceptor } from './interceptor/response-result.interceptor';
import { LoginDto } from '../dto/login.dto';

@Controller('auth')
export class AuthController {
	@Inject()
	private authService: AuthService;

	@Inject()
	private captchaService: CaptchaService;

	@HttpCode(HttpStatus.OK)
	// 注入拦截器
	@UseInterceptors(ResponseResultInterceptor)
	@Post('login')
	async login(@Body(ValidationPipe) loginDto: LoginDto) {
		return await this.authService.login(loginDto);
	}

    ...
}
```

## 全局 `Interceptor` 拦截器

1. 在 `main.ts` 中，手动初始化拦截器的实例:

```ts
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseResultInterceptor } from './interceptor/response-result.interceptor';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// 手动 new， 没办法依赖注入
	app.useGlobalInterceptors(new ResponseResultInterceptor());

	await app.listen(3000);
}
bootstrap();
```

2. 使用 `nest` 提供的一个 `token`，用这个 `token` 在 `AppModule` 里声明的 `interceptor`，

`Nest` 会把它作为全局 `interceptor`：

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { ResponseResultInterceptor } from './interceptor/response-result.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
	imports: [],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: ResponseResultInterceptor
		}
	]
})
export class AppModule {}
```

<span style="color:red">注意：</span> 第一种方式不能 **注入依赖** ，不能使用其它的 `Provider`。
