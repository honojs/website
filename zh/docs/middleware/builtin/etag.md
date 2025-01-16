---
title: ETag 中间件
description: hono 内置的 ETag 中间件。
---

# ETag 中间件

使用此中间件，您可以轻松添加 ETag 响应头。

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
  return c.text('Hono is cool')
})
```

## 保留的响应头

304 响应必须包含等效的 200 OK 响应中会发送的响应头。默认的响应头包括：Cache-Control、Content-Location、Date、ETag、Expires 和 Vary。

如果您想添加其他需要发送的响应头，可以使用 `retainedHeaders` 选项和包含默认响应头的 `RETAINED_304_HEADERS` 字符串数组：

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

## 配置选项

### <Badge type="info" text="可选" /> weak: `boolean`

定义是否使用[弱验证](https://developer.mozilla.org/en-US/docs/Web/HTTP/Conditional_requests#weak_validation)。如果设置为 `true`，则会在值的前缀添加 `w/`。默认值为 `false`。

### <Badge type="info" text="可选" /> retainedHeaders: `string[]`

在 304 响应中需要保留的响应头列表。