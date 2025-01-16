---
title: Cache 中间件
description: hono 内置的 Cache 中间件。
---

# 缓存中间件

缓存中间件使用 Web 标准的 [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache)。

该缓存中间件目前支持使用自定义域名的 Cloudflare Workers 项目和使用 [Deno 1.26+](https://github.com/denoland/deno/releases/tag/v1.26.0) 的 Deno 项目。同时也支持 Deno Deploy。

Cloudflare Workers 会遵循 `Cache-Control` 头部并返回缓存的响应。详情请参阅 [Cloudflare 文档中的缓存部分](https://developers.cloudflare.com/workers/runtime-apis/cache/)。Deno 不遵循头部信息，因此如果需要更新缓存，你需要实现自己的机制。

请参阅下方的[使用方法](#usage)了解各平台的具体使用说明。

## 导入

```ts
import { Hono } from 'hono'
import { cache } from 'hono/cache'
```

## 使用方法

::: code-group

```ts [Cloudflare Workers]
app.get(
  '*',
  cache({
    cacheName: 'my-app',
    cacheControl: 'max-age=3600',
  })
)
```

```ts [Deno]
// 在 Deno 运行时必须使用 `wait: true`
app.get(
  '*',
  cache({
    cacheName: 'my-app',
    cacheControl: 'max-age=3600',
    wait: true,
  })
)
```

:::

## 配置选项

### <Badge type="danger" text="必填" /> cacheName: `string` | `(c: Context) => string` | `Promise<string>`

缓存的名称。可用于使用不同标识符存储多个缓存。

### <Badge type="info" text="可选" /> wait: `boolean`

一个布尔值，表示 Hono 是否应该等待 `cache.put` 函数的 Promise 解析完成后再继续处理请求。_在 Deno 环境中必须设置为 true_。默认值为 `false`。

### <Badge type="info" text="可选" /> cacheControl: `string`

`Cache-Control` 头部的指令字符串。更多信息请参阅 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)。当未提供此选项时，请求中不会添加 `Cache-Control` 头部。

### <Badge type="info" text="可选" /> vary: `string` | `string[]`

在响应中设置 `Vary` 头部。如果原始响应头部已包含 `Vary` 头部，这些值将被合并，并移除重复项。将此值设置为 `*` 将导致错误。关于 Vary 头部及其对缓存策略的影响，请参阅 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary)。

### <Badge type="info" text="可选" /> keyGenerator: `(c: Context) => string | Promise<string>`

为 `cacheName` 存储中的每个请求生成键。这可用于基于请求参数或上下文参数进行数据缓存。默认值为 `c.req.url`。
