---
title: Compress 中间件
description: hono 内置的 Compress 中间件。
---

# Compress Middleware

该中间件根据请求头 `Accept-Encoding` 对响应体进行压缩。

::: info
**注意**：在 Cloudflare Workers 和 Deno Deploy 环境中，响应体会自动压缩，因此无需使用此中间件。

**Bun**：该中间件使用的 `CompressionStream` 目前在 Bun 中尚未支持。
:::

## 导入

```ts
import { Hono } from 'hono'
import { compress } from 'hono/compress'
```

## 使用方法

```ts
const app = new Hono()

app.use(compress())
```

## 配置选项

### <Badge type="info" text="可选" /> encoding: `'gzip'` | `'deflate'`

指定响应压缩采用的压缩方案，可选值为 `gzip` 或 `deflate`。若未指定，则两种方案都会被允许，具体使用哪种将基于请求的 `Accept-Encoding` 头部决定。当该选项未设置且客户端在 `Accept-Encoding` 头部同时支持两种方案时，将优先使用 `gzip`。

### <Badge type="info" text="可选" /> threshold: `number`

进行压缩的最小字节数阈值。默认为 1024 字节。
