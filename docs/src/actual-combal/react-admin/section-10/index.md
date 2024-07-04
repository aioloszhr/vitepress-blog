---
outline: deep
---

# websocket 实现用户权限变更推送消息推送，自动刷新

## 后端消息推送方案分析

### 轮询

后端写一个接口，前端没隔几秒去调用一次，看看有没有新消息。这种方案在 `websocket` 没出来以前是最常用的方案。但是缺点也很明显，时间间隔设置太长，消息实时性变差，时间间隔设置太短，会不停的调用接口，服务器压力变大。

### WebSocket

WebSocket 是一种在 Web 浏览器和服务器之间进行全双工通信的协议，相比于传统的 HTTP 协议，它具有以下优势和用途：

1. 实时性：WebSocket 提供了实时的双向数据传输，能够实现高效的实时通信，而不需要通过轮询或长轮询等间接方式。

2. 低延迟：由于 WebSocket 建立在 TCP 连接上，并且使用更轻量级的协议头部，因此可以减少数据传输的延迟，提供更快速的响应时间。

3. 节省带宽：WebSocket 使用较少的网络流量，因为它使用更紧凑和有效的数据帧格式，并且可以使用二进制数据传输，而不仅仅是文本数据。

4. 更强大的功能：相比于 HTTP 请求-响应模型，WebSocket 支持服务器主动推送数据到客户端，从而能够实现实时更新、即时聊天、多人协作和实时数据展示等功能。

5. 兼容性：WebSocket 协议被广泛支持，并且现代的 Web 浏览器都原生支持 WebSocket，无需任何额外插件或库。

基于以上特点，WebSocket 被广泛应用于实时数据传输、在线聊天、多人游戏、实时协作、股票行情、推送通知、实时监控等场景，为 Web 应用程序提供了更好的用户体验和功能扩展性。

### 总结

后端推送消息使用 `webSocket` 是最好的方案。如果要兼容非常老的浏览器，可以使用轮询的方式。

## 实现

### 后端实现

#### 安装 ws 依赖

```bash
pnpm add @nestjs/websockets # ^10.3.9
pnpm add @nestjs/platform-ws # ^10.3.9
pnpm add ws
pnpm add @types/ws
```

#### 封装公共 SocketService

封装一个单例 SocketService（NestJs 依赖注入默认单例模式），每个用户连接都保存在 `connects` 里面，方便后面发送消息。

```ts
// /src/modules/socket/socket.service.ts

import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Socket } from 'socket.io';
import { SocketMessage } from './message';

const socketChannel = 'socket-message';

@Injectable()
export class SocketService implements OnModuleInit {
	connects = new Map<string, Socket[]>();
	private subscriber: Redis; // 监听频道
	private publisher: Redis; // 发布频道

	constructor(@Inject('REDIS_CLIENT') redisClient: Redis) {
		this.subscriber = redisClient.duplicate();
		this.publisher = redisClient.duplicate();
	}

	// 初始化执行的方法
	async onModuleInit() {
		await this.subscriber.subscribe(socketChannel, error => {
			if (!error) {
				console.log('监听成功');
			}
		});
		this.subscriber.on('message', (channel: string, message: string) => {
			if (channel === socketChannel && message) {
				const messageData = JSON.parse(message);
				const { userId, data } = messageData;
				const clients = this.connects.get(userId);

				if (clients?.length) {
					clients.forEach(client => {
						client.send(JSON.stringify(data));
					});
				}
			}
		});
	}

	/**
	 * 添加连接
	 * @param userId 用户id
	 * @param connect 用户socket连接
	 */
	addConnect(userId: string, connect: Socket) {
		const curConnects = this.connects.get(userId);
		if (curConnects) {
			curConnects.push(connect);
		} else {
			this.connects.set(userId, [connect]);
		}
	}

	/**
	 * 给指定用户发消息
	 * @param userId 用户id
	 * @param data 数据
	 */
	sendMessage<T>(userId: string, data: SocketMessage<T>) {
		this.publisher.publish(socketChannel, JSON.stringify({ userId, data }));
	}
}
```

#### 消息对象

```ts
// /src/modules/socket/message.ts

export enum SocketMessageType {
	/**
	 * 权限变更
	 */
	PermissionChange = 'PermissionChange',
	/**
	 * 密码重置
	 */
	PasswordChange = 'PasswordChange',
	/**
	 * token过期
	 */
	TokenExpire = 'TokenExpire',
	/**
	 * Ping
	 */
	Ping = 'Ping',
	/**
	 * PONG
	 */
	Pong = 'Pong'
}

export class SocketMessage<T = any> {
	/**
	 * 消息类型
	 */
	type: SocketMessageType;
	/**
	 * 消息内容
	 */
	data?: T;
	constructor(type: SocketMessageType, data?: T) {
		this.type = type;
		this.data = data;
	}
}
```

#### SocketGateway

```ts
// /src/modules/socket/socket.gateway.ts

import { Inject } from '@nestjs/common';
import {
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import * as http from 'http';
import { Redis } from 'ioredis';
import { SocketService } from './socket.service';
import { SocketMessageType } from './message';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;
	@Inject('REDIS_CLIENT')
	private redisClient: Redis;
	@Inject(SocketService)
	private socketService: SocketService;

	// 建立socket连接
	async handleConnection(client: Socket, request: http.IncomingMessage) {
		// 获取url上token参数
		const token = new URLSearchParams(request.url.split('?').pop()).get('token');

		if (!token) {
			client.disconnect();
			return;
		}

		const userInfoStr = await this.redisClient.get(`token:${token}`);
		if (!userInfoStr) {
			client.send(
				JSON.stringify({
					type: SocketMessageType.TokenExpire
				})
			);
			client.disconnect();
			return;
		}

		const userInfo = JSON.parse(userInfoStr);
		this.socketService.addConnect(userInfo.userId, client);
	}

	// socket连接断开
	handleDisconnect() {
		console.log('client disconnected');
	}

	// 订阅客户端发的消息
	@SubscribeMessage('newMessage')
	handleMessage(@MessageBody() body: any) {
		console.log('body', body);
	}
}
```

#### 权限变更通知

用户权限变更目前有两个地方，第一个是用户更新角色接口，第二个是角色更新菜单接口。

1. 用户更新角色接口

2. 改造角色更新菜单接口

```ts
const oldMenuIds = roleMenus.map(menu => menu.menuId);
// 判断角色菜单是否有变化
if (oldMenuIds.length !== data.menuIds.length) {
	// 如果有变化，查询所有分配了该角色的用户，给对应所有用户发通知
	const userIds = (await this.userRoleModel.findBy({ roleId: data.id })).map(userRole => userRole.userId);

	userIds.forEach(userId => {
		this.socketService.sendMessage(userId, {
			type: SocketMessageType.PermissionChange
		});
	});
}
```
