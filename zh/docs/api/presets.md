---
title: 预设配置
description: Hono 提供了多种路由器，每种都是为特定用途而设计的。
---
# 预设配置

Hono 提供了多种路由器，每种都是为特定用途而设计的。
你可以在 Hono 的构造函数中指定想要使用的路由器。

为了避免每次都需要指定路由器，我们为常见用例提供了**预设**。
从所有预设中导入的 `Hono` 类都是相同的，唯一的区别在于使用的路由器。
因此，这些预设可以互换使用。

## `hono`

用法：

```ts twoslash
import { Hono } from 'hono'
```

路由器配置：

```ts
this.router = new SmartRouter({
  routers: [new RegExpRouter(), new TrieRouter()],
})
```

## `hono/quick`

用法：

```ts twoslash
import { Hono } from 'hono/quick'
```

路由器配置：

```ts
this.router = new SmartRouter({
  routers: [new LinearRouter(), new TrieRouter()],
})
```

## `hono/tiny`

用法：

```ts twoslash
import { Hono } from 'hono/tiny'
```

路由器配置：

```ts
this.router = new PatternRouter()
```

## 我应该使用哪个预设？

| 预设         | 适用平台                                                                                                                                                                                                                                                                                     |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hono`       | 这是最推荐的预设，适用于大多数场景。虽然在注册阶段可能比 `hono/quick` 慢，但启动后性能表现出色。特别适合使用 **Deno**、**Bun** 或 **Node.js** 构建的长期运行服务器。对于使用 v8 隔离环境的 **Cloudflare Workers**、**Deno Deploy** 等平台也很合适，因为这些隔离环境在启动后会持续一段时间。 |
| `hono/quick` | 这个预设专为每个请求都需要初始化应用程序的环境而设计。**Fastly Compute** 就是这样运作的，因此推荐在这类环境中使用此预设。                                                                                                                                                                   |
| `hono/tiny`  | 这是最小的路由器包，适用于资源受限的环境。                                                                                                                                                                                                                                                   |
