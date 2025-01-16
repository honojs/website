---
title: Accepts
description: 使用Accepts辅助函数，可以方便地处理请求中的Accept头部信息。
---

# Accepts 辅助函数

Accepts 辅助函数用于处理请求中的 Accept 头部信息。

## 导入

```ts
import { Hono } from 'hono'
import { accepts } from 'hono/accepts'
```

## `accepts()`

`accepts()` 函数用于解析 Accept 相关的头部信息（如 Accept-Encoding 和 Accept-Language），并返回适当的值。

```ts
import { accepts } from 'hono/accepts'

app.get('/', (c) => {
  const accept = accepts(c, {
    header: 'Accept-Language',
    supports: ['en', 'ja', 'zh'],
    default: 'en',
  })
  return c.json({ lang: accept })
})
```

### `AcceptHeader` 类型

`AcceptHeader` 类型定义如下：

```ts
export type AcceptHeader =
  | 'Accept'
  | 'Accept-Charset'
  | 'Accept-Encoding'
  | 'Accept-Language'
  | 'Accept-Patch'
  | 'Accept-Post'
  | 'Accept-Ranges'
```

## 配置选项

### <Badge type="danger" text="必填" /> header: `AcceptHeader`

目标 Accept 头部。

### <Badge type="danger" text="必填" /> supports: `string[]`

应用程序支持的头部值数组。

### <Badge type="danger" text="必填" /> default: `string`

默认值。

### <Badge type="info" text="可选" /> match: `(accepts: Accept[], config: acceptsConfig) => string`

自定义匹配函数。
