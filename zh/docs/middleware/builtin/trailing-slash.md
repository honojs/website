---
title: 尾斜杠中间件
description: hono 内置的尾斜杠中间件，提供处理 GET 请求 URL 中的尾斜杠功能。
---

# 尾斜杠中间件

此中间件用于处理 GET 请求 URL 中的尾斜杠。

`appendTrailingSlash` 会在内容未找到时重定向到添加了尾斜杠的 URL。同时，`trimTrailingSlash` 将移除尾斜杠。

## 导入

```ts
import { Hono } from 'hono'
import {
  appendTrailingSlash,
  trimTrailingSlash,
} from 'hono/trailing-slash'
```

## 用法

将 GET 请求 `/about/me` 重定向到 `/about/me/` 的示例。

```ts
import { Hono } from 'hono'
import { appendTrailingSlash } from 'hono/trailing-slash'

const app = new Hono({ strict: true })

app.use(appendTrailingSlash())
app.get('/about/me/', (c) => c.text('带尾斜杠'))
```

将 GET 请求 `/about/me/` 重定向到 `/about/me` 的示例。

```ts
import { Hono } from 'hono'
import { trimTrailingSlash } from 'hono/trailing-slash'

const app = new Hono({ strict: true })

app.use(trimTrailingSlash())
app.get('/about/me', (c) => c.text('不带尾斜杠'))
```

## 注意

当请求方法为 `GET` 且响应状态为 `404` 时，此功能将启用。
