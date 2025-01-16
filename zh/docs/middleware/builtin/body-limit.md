---
title: Body Limit 中间件
description: hono 内置的 Body Size Limit 中间件。
---

# Body Limit 中间件

Body Limit 中间件用于限制请求体的文件大小。

该中间件首先会检查请求中的 `Content-Length` 头部值（如果存在）。
如果该头部未设置，中间件会以流的方式读取请求体，当大小超过指定限制时触发错误处理程序。

## 导入

```ts
import { Hono } from 'hono'
import { bodyLimit } from 'hono/body-limit'
```

## 使用方法

```ts
const app = new Hono()

app.post(
  '/upload',
  bodyLimit({
    maxSize: 50 * 1024, // 50kb
    onError: (c) => {
      return c.text('超出限制 :(', 413)
    },
  }),
  async (c) => {
    const body = await c.req.parseBody()
    if (body['file'] instanceof File) {
      console.log(`收到文件大小：${body['file'].size}`)
    }
    return c.text('通过 :)')
  }
)
```

## 配置选项

### <Badge type="danger" text="必填" /> maxSize: `number`

要限制的文件最大大小。默认值为 `100 * 1024` - `100kb`。

### <Badge type="info" text="可选" /> onError: `OnError`

当超过指定文件大小时要调用的错误处理函数。

## 在 Bun 中处理大型请求

如果 Body Limit 中间件被显式配置为允许超过默认大小的请求体，可能需要相应地调整 `Bun.serve` 的配置。[在撰写本文时](https://github.com/oven-sh/bun/blob/f2cfa15e4ef9d730fc6842ad8b79fb7ab4c71cb9/packages/bun-types/bun.d.ts#L2191)，`Bun.serve` 的默认请求体大小限制为 128MiB。如果你将 Hono 的 Body Limit 中间件设置为大于该值，请求仍会失败，而且中间件中指定的 `onError` 处理程序也不会被调用。这是因为 `Bun.serve()` 会在请求传递给 Hono 之前将状态码设置为 `413` 并终止连接。

如果你想在 Hono 和 Bun 中接受大于 128MiB 的请求，你需要同时设置 Bun 的限制：

```ts
export default {
  port: process.env['PORT'] || 3000,
  fetch: app.fetch,
  maxRequestBodySize: 1024 * 1024 * 200, // 在此设置你的值
}
```

或者，根据你的设置：

```ts
Bun.serve({
  fetch(req, server) {
    return app.fetch(req, { ip: server.requestIP(req) })
  },
  maxRequestBodySize: 1024 * 1024 * 200, // 在此设置你的值
})
```