---
outline: deep
---

# MySql、TypeORM、JWT 实现登录注册

通过 **mysql** + **typeorm** + **jwt** + **ValidationPipe** 实现登录注册功能。

## TypeORM

1. 通过 `@PrimaryGeneratedKey`、`@Column`、`@CreateDateColumn`、`@UpdateDateColumn` 声明和数据库表的映射。

2. 通过 `TypeOrmModule.forRoot`、`TypeOrmModule.forFeature` 的动态模块添加数据源，拿到 **User** 的 **Repository**。

3. 用 **Repository** 来做增删改查，实现注册和登录的功能。

## JWT

1. 登录之后，把用户信息通过 **jwt** 的方式放在 **authorization** 的 **header** 里返回。

### Guard

**Guard** 里面取出 header 来做验证，token 正确的话才放行。

1. 运行命令：

```bash
nest g guard login --no-spec --flat
```

2. 实现 jwt 校验的逻辑：

```ts
// login.guard.ts

import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class LoginGuard implements CanActivate {
	@Inject(JwtService)
	private jwtService: JwtService;

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request: Request = context.switchToHttp().getRequest();

		const authorization = request.header('authorization') || '';

		const bearer = authorization.split(' ');

		if (!bearer || bearer.length < 2) {
			throw new UnauthorizedException('登录 token 错误');
		}

		const token = bearer[1];

		try {
			const info = this.jwtService.verify(token);
			(request as any).user = info.user;
			return true;
		} catch (e) {
			throw new UnauthorizedException('登录 token 失效，请重新登录');
		}
	}
}
```

3. 把 **Guard** 应用到 handler：

```ts
	@Get('aaa')
	@UseGuards(LoginGuard)
	aaa() {
		return 'aaa';
	}

	@Get('bbb')
	@UseGuards(LoginGuard)
	bbb() {
		return 'bbb';
	}
```

![An image](/nest/nest-2.png)

## ValidationPipe + class-validator

接口参数的校验使用 **ValidationPipe** + **class-validator** 来实现。

1. 安装 class-validator 和 class-transformer 的包：

```bash
pnpm add class-validator class-transformer
```

2. 给 `/user/login` 和 `/user/register` 接口添加 `ValidationPipe`：

> <span style="color:red; font-weight: 600">注意</span>
>
> 引入 **dtos** 时不能只引入 **type**。
>
> i.e. `import { CreateUserDto } ` 而不是 `import type { CreateUserDto }.`

```ts
import { Controller, Post, Body, Inject, Res, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import type { Response } from 'express';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Inject(JwtService)
	private jwtService: JwtService;

	@Post('login')
	async login(@Body(ValidationPipe) user: LoginDto, @Res({ passthrough: true }) res: Response) {
		const foundUser = await this.userService.login(user);

		if (foundUser) {
			const token = await this.jwtService.signAsync({
				user: {
					id: foundUser.id,
					username: foundUser.username
				}
			});
			res.setHeader('token', token);
			return 'login success';
		} else {
			return 'login fail';
		}
	}

	@Post('register')
	async register(@Body(ValidationPipe) user: RegisterDto) {
		return await this.userService.register(user);
	}
}
```

3. 在 dto 里声明参数的约束

```ts
// register.dto.ts 注册

import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class RegisterDto {
	@IsString()
	@IsNotEmpty()
	@Length(6, 30)
	@Matches(/^[a-zA-Z0-9#$%_-]+$/, {
		message: '用户名只能是字母、数字或者 #、$、%、_、- 这些字符'
	})
	username: string;

	@IsString()
	@IsNotEmpty()
	@Length(6, 30)
	password: string;
}
```

```ts
// login.dto.ts 登录

import { IsNotEmpty } from 'class-validator';

export class LoginDto {
	@IsNotEmpty()
	username: string;
	@IsNotEmpty()
	password: string;
}
```
