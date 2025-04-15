---
title: ETag 中间件
description: hono 内置的 ETag 中间件。
---

# ETag 中间件

使用此中间件，你可以轻松添加 ETag 头部。

## 导入

```ts
import { Hono } from 'hono'
import { etag } from 'hono/etag'
```

## 使用方法

```ts
const app = new Hono()

app.use('/etag/*', etag())
app.get('/etag/abc', (c) => {
  return c.text('Hono 很酷')
})
```

## 保留的头部

304 响应必须包含在等效的 200 OK 响应中会发送的头部。默认的头部包括 Cache-Control、Content-Location、Date、ETag、Expires 和 Vary。

如果你想添加要发送的头部，可以使用 `retainedHeaders` 选项和 `RETAINED_304_HEADERS` 字符串数组变量（其中包含默认头部）：

```ts
import { etag, RETAINED_304_HEADERS } from 'hono/etag'

// ...

app.use(
  '/etag/*',
  etag({
    retainedHeaders: ['x-message', ...RETAINED_304_HEADERS],
  })
)
```

## 选项

### <Badge type="info" text="可选" /> weak: `boolean`

定义是否使用[弱验证](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Conditional_requests#weak_validation)。如果设置为 `true`，则会在值的前缀添加 `w/`。默认值为 `false`。

### <Badge type="info" text="可选" /> retainedHeaders: `string[]`

你想在 304 响应中保留的头部。

### <Badge type="info" text="可选" /> generateDigest: `(body: Uint8Array) => ArrayBuffer | Promise<ArrayBuffer>`

自定义摘要生成函数。默认使用 `SHA-1`。此函数接收响应体作为 `Uint8Array` 参数，并应返回一个 `ArrayBuffer` 或其 Promise。
