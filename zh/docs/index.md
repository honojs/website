---
title: Hono - 基于 Web 标准构建的 Web 框架
description: Hono 是一个小巧、简洁且超快速的 Web 框架，基于 Web 标准构建。
---

# Hono

Hono —— _**在日语中意为"火焰🔥"**_ —— 是一个小巧、简单且超快速的 Web 框架，基于 Web 标准构建。
它可以在任何 JavaScript 运行时环境中工作：Cloudflare Workers、Fastly Compute、Deno、Bun、Vercel、Netlify、AWS Lambda、Lambda@Edge 以及 Node.js。

不仅仅是快。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()

app.get('/', (c) => c.text('Hono!'))

export default app
```

## 快速开始

只需运行：

::: code-group

```sh [npm]
npm create hono@latest
```

```sh [yarn]
yarn create hono
```

```sh [pnpm]
pnpm create hono@latest
```

```sh [bun]
bun create hono@latest
```

```sh [deno]
deno init --npm hono@latest
```

:::

## 特性

- **超快速** 🚀 - 路由器 `RegExpRouter` 速度极快。不使用线性循环。就是快。
- **轻量级** 🪶 - `hono/tiny` 预设包大小仅有 14kB。Hono 零依赖，仅使用 Web 标准。
- **多运行时** 🌍 - 支持 Cloudflare Workers、Fastly Compute、Deno、Bun、AWS Lambda 和 Node.js。相同的代码可在所有平台上运行。
- **功能齐全** 🔋 - Hono 内置中间件，支持自定义中间件、第三方中间件和辅助工具。应有尽有。
- **出色的开发体验** 😃 - 超级简洁的 API。一流的 TypeScript 支持。现在，我们有了"类型"。

## 使用场景

Hono 是一个类似于 Express 的简单 Web 应用框架，但不包含前端功能。
它可以在 CDN 边缘运行，并且通过中间件可以构建更大型的应用。
以下是一些使用场景示例：

- 构建 Web API
- 后端服务器代理
- CDN 前置服务
- 边缘应用
- 库的基础服务器
- 全栈应用

## 谁在使用 Hono？

| 项目 | 平台 | 用途 |
|------|------|------|
| [cdnjs](https://cdnjs.com) | Cloudflare Workers | 免费开源的 CDN 服务。_Hono 用于 API 服务器_。 |
| [Cloudflare D1](https://www.cloudflare.com/developer-platform/d1/) | Cloudflare Workers | 无服务器 SQL 数据库。_Hono 用于内部 API 服务器_。 |
| [BaseAI](https://baseai.dev) | Local AI Server | 具有记忆功能的无服务器 AI 代理管道。一个用于 Web 的开源智能 AI 框架。_使用 Hono 构建 API 服务器_。 |
| [Unkey](https://unkey.dev) | Cloudflare Workers | 开源的 API 认证和授权服务。_Hono 用于 API 服务器_。 |
| [OpenStatus](https://openstatus.dev) | Bun | 开源的网站和 API 监控平台。_Hono 用于 API 服务器_。 |
| [Deno Benchmarks](https://deno.com/benchmarks) | Deno | 基于 V8 构建的安全 TypeScript 运行时。_Hono 用于基准测试_。 |

以及以下项目：

- [Drivly](https://driv.ly/) - Cloudflare Workers
- [repeat.dev](https://repeat.dev/) - Cloudflare Workers

想了解更多？请查看 [谁在生产环境中使用 Hono？](https://github.com/orgs/honojs/discussions/1510)

## 1分钟了解 Hono

演示如何使用 Hono 为 Cloudflare Workers 创建应用。

![hono](/images/sc.gif)

## 超快速

**Hono 是最快的**，与其他 Cloudflare Workers 路由器相比。

```
Hono x 402,820 ops/sec ±4.78% (80 runs sampled)
itty-router x 212,598 ops/sec ±3.11% (87 runs sampled)
sunder x 297,036 ops/sec ±4.76% (77 runs sampled)
worktop x 197,345 ops/sec ±2.40% (88 runs sampled)
最快的是 Hono
✨  Done in 28.06s.
```

查看[更多基准测试](/zh/docs/concepts/benchmarks)。

## 轻量级

**Hono 非常小**。使用 `hono/tiny` 预设时，压缩后的大小仅有 **14KB**。虽然有许多中间件和适配器，但它们只在使用时才会被打包。作为参考，Express 的大小是 572KB。

```
$ npx wrangler dev --minify ./src/index.ts
 ⛅️ wrangler 2.20.0
--------------------
⬣ Listening at http://0.0.0.0:8787
- http://127.0.0.1:8787
- http://192.168.128.165:8787
总上传大小：11.47 KiB / gzip: 4.34 KiB
```

## 多种路由器

**Hono 提供多种路由器**。

**RegExpRouter** 是 JavaScript 世界中最快的路由器。它使用在分发前创建的单个大型正则表达式来匹配路由。通过 **SmartRouter**，它支持所有路由模式。

**LinearRouter** 注册路由非常快，适合每次都需要初始化应用的环境。**PatternRouter** 简单地添加和匹配模式，体积小巧。

查看[更多关于路由的信息](/zh/docs/concepts/routers)。

## Web 标准

得益于使用 **Web 标准**，Hono 可以在众多平台上运行。

- Cloudflare Workers
- Cloudflare Pages
- Fastly Compute
- Deno
- Bun
- Vercel
- AWS Lambda
- Lambda@Edge
- 其他平台

通过使用 [Node.js 适配器](https://github.com/honojs/node-server)，Hono 也可以在 Node.js 上运行。

查看[更多关于 Web 标准的信息](/zh/docs/concepts/web-standard)。

## 中间件和辅助工具

**Hono 提供众多中间件和辅助工具**。这些工具让"写得更少，做得更多"成为现实。

Hono 内置提供以下中间件和辅助工具：

- [基础认证](/zh/docs/middleware/builtin/basic-auth)
- [Bearer 认证](/zh/docs/middleware/builtin/bearer-auth)
- [请求体限制](/zh/docs/middleware/builtin/body-limit)
- [缓存](/zh/docs/middleware/builtin/cache)
- [压缩](/zh/docs/middleware/builtin/compress)
- [上下文存储](/zh/docs/middleware/builtin/context-storage)
- [Cookie](/zh/docs/helpers/cookie)
- [CORS](/zh/docs/middleware/builtin/cors)
- [ETag](/zh/docs/middleware/builtin/etag)
- [html](/zh/docs/helpers/html)
- [JSX](/zh/docs/guides/jsx)
- [JWT 认证](/zh/docs/middleware/builtin/jwt)
- [日志记录](/zh/docs/middleware/builtin/logger)
- [美化 JSON](/zh/docs/middleware/builtin/pretty-json)
- [安全头部](/zh/docs/middleware/builtin/secure-headers)
- [SSG](/zh/docs/helpers/ssg)
- [流式传输](/zh/docs/helpers/streaming)
- [GraphQL 服务器](https://github.com/honojs/middleware/tree/main/packages/graphql-server)
- [Firebase 认证](https://github.com/honojs/middleware/tree/main/packages/firebase-auth)
- [Sentry](https://github.com/honojs/middleware/tree/main/packages/sentry)
- 以及更多！

例如，使用 Hono 添加 ETag 和请求日志只需要几行代码：

```ts
import { Hono } from 'hono'
import { etag } from 'hono/etag'
import { logger } from 'hono/logger'

const app = new Hono()
app.use(etag(), logger())
```

查看[更多关于中间件的信息](/zh/docs/concepts/middleware)。

## 开发者体验

Hono 提供出色的**开发者体验**。

通过 `Context` 对象轻松访问请求/响应。
此外，Hono 使用 TypeScript 编写。Hono 拥有"**类型**"。

例如，路径参数将是字面量类型。

![hono](/images/ss.png)

而且，验证器和 Hono 客户端 `hc` 启用了 RPC 模式。在 RPC 模式下，
你可以使用你喜欢的验证器（如 Zod），轻松地在客户端和服务器之间共享 API 规范，构建类型安全的应用。

查看 [Hono 技术栈](/zh/docs/concepts/stacks)。
