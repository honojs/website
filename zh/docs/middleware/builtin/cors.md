---
title: CORS 中间件
description: hono 内置的 CORS 中间件。
---

# CORS 中间件

Cloudflare Workers 经常被用作 Web API，并从外部前端应用程序调用。这种情况下，我们需要实现 CORS（跨源资源共享），让我们通过中间件来实现这一功能。

## 导入

```ts
import { Hono } from 'hono'
import { cors } from 'hono/cors'
```

## 使用方法

```ts
const app = new Hono()

app.use('/api/*', cors())
app.use(
  '/api2/*',
  cors({
    origin: 'http://example.com',
    allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  })
)

app.all('/api/abc', (c) => {
  return c.json({ success: true })
})
app.all('/api2/abc', (c) => {
  return c.json({ success: true })
})
```

多源配置：

```ts
app.use(
  '/api3/*',
  cors({
    origin: ['https://example.com', 'https://example.org'],
  })
)

// 也可以使用函数形式
app.use(
  '/api4/*',
  cors({
    // `c` 是 `Context` 对象
    origin: (origin, c) => {
      return origin.endsWith('.example.com')
        ? origin
        : 'http://example.com'
    },
  })
)
```

## 配置选项

### <Badge type="info" text="可选" /> origin: `string` | `string[]` | `(origin:string, c:Context) => string`

"_Access-Control-Allow-Origin_" CORS 响应头的值。你也可以传入回调函数，如 `origin: (origin) => (origin.endsWith('.example.com') ? origin : 'http://example.com')`。默认值为 `*`。

### <Badge type="info" text="可选" /> allowMethods: `string[]`

"_Access-Control-Allow-Methods_" CORS 响应头的值。默认值为 `['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH']`。

### <Badge type="info" text="可选" /> allowHeaders: `string[]`

"_Access-Control-Allow-Headers_" CORS 响应头的值。默认值为 `[]`。

### <Badge type="info" text="可选" /> maxAge: `number`

"_Access-Control-Max-Age_" CORS 响应头的值。

### <Badge type="info" text="可选" /> credentials: `boolean`

"_Access-Control-Allow-Credentials_" CORS 响应头的值。

### <Badge type="info" text="可选" /> exposeHeaders: `string[]`

"_Access-Control-Expose-Headers_" CORS 响应头的值。默认值为 `[]`。

## 环境相关的 CORS 配置

如果你需要根据执行环境（如开发环境或生产环境）调整 CORS 配置，使用环境变量注入值是一个很好的方式，因为这样可以避免应用程序需要感知自身的执行环境。请参考以下示例：

```ts
app.use('*', async (c, next) => {
  const corsMiddlewareHandler = cors({
    origin: c.env.CORS_ORIGIN,
  })
  return corsMiddlewareHandler(c, next)
})
```