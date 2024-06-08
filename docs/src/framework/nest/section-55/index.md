---
outline: deep
---

# Configuration 配置

Nest 不同环境的配置

## 使用 **@nestjs/config** 包动态读取不同环境的配置

1. 安装 `@nestjs/config` 包

```bash
pnpm add @nestjs/config
```

2. 在 `app.module.ts` 中使用

```ts
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['.env']
		})
	]
})
export class AppModule {}
```

- isGlobal: 将 `ConfigModule.forRoot` 注册为全局模块。
- envFilePath: 指定读取配置文件的路径。

3. 在需要获取配置的地方使用 `ConfigService` 中的 `get` 方法获取

```ts
const value = this.configService.get<string>(key);
```

## 使用 `.env` 的方式来区分环境

1. 安装 `cross-env` 包

```bash
pnpm add cross-env
```

2. 手动配置启动环境的配置,修改 `package.json` 文件启动命令

```json
"scripts": {
    ...
    "start": "cross-env NODE_ENV=dev nest start",
    "start:dev": "cross-env NODE_ENV=dev nest start --watch",
    "start:prod": "cross-env NODE_ENV=prod node dist/main",
    ...
},
```

3. 根据环境来切换配置

```ts
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [`.env.${process.env.NODE_ENV}`]
		})
	],
	controllers: [AppController],
	providers: [AppService, Logger]
})
export class AppModule {}
```

- `.env` 文件存放一些通用的配置，在开发环境和生产环境都保持一样的
- `.env.dev` 文件存放开发环境的配置
- `.env.prod` 文件存放生产部署需要的配置
