---
title: Request ID 中间件
description: hono 内置的 Request ID 中间件，为每个请求生成一个唯一标识符，你可以在处理程序中使用它。
---

# Request ID 中间件

Request ID 中间件为每个请求生成一个唯一标识符，你可以在处理程序中使用它。

## 导入

```ts
import { Hono } from 'hono'
import { requestId } from 'hono/request-id'
```

## 使用方法

在应用了请求 ID 中间件的处理程序和中间件中，你可以通过 `requestId` 变量访问请求 ID。

```ts
const app = new Hono()

app.use('*', requestId())

app.get('/', (c) => {
  return c.text(`你的请求 ID 是 ${c.get('requestId')}`)
})
```

如果你想明确指定类型，可以导入 `RequestIdVariables` 并将其传入 `new Hono()` 的泛型中。

```ts
import type { RequestIdVariables } from 'hono/request-id'

const app = new Hono<{
  Variables: RequestIdVariables
}>()
```

## 配置选项

### <Badge type="info" text="可选" /> limitLength: `number`

请求 ID 的最大长度。默认值为 `255`。

### <Badge type="info" text="可选" /> headerName: `string`

用于请求 ID 的 HTTP 头名称。默认值为 `X-Request-Id`。

### <Badge type="info" text="可选" /> generator: `(c: Context) => string`

请求 ID 的生成函数。默认使用 `crypto.randomUUID()`。
