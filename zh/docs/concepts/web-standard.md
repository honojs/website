---
title: Web标准
description: Hono 基于 Web 标准 API 构建，支持多个运行时环境，包括 Cloudflare Workers、Deno、Bun等，致力于实现网络互操作性。
---
# Web 标准

Hono 仅使用 **Web 标准**（如 Fetch API）。
这些标准最初用于 `fetch` 函数，包含了处理 HTTP 请求和响应的基础对象。
除了 `Request` 和 `Response` 之外，还包括 `URL`、`URLSearchParam`、`Headers` 等对象。

Cloudflare Workers、Deno 和 Bun 也都是基于 Web 标准构建的。
例如，一个返回 "Hello World" 的服务器可以像下面这样编写，这段代码可以在 Cloudflare Workers 和 Bun 上运行。

```ts twoslash
export default {
  async fetch() {
    return new Response('Hello World')
  },
}
```

Hono 仅使用 Web 标准，这意味着 Hono 可以在任何支持这些标准的运行时环境中运行。
此外，我们还提供了 Node.js 适配器。Hono 可以在以下运行时环境中运行：

- Cloudflare Workers (`workerd`)
- Deno
- Bun
- Fastly Compute
- AWS Lambda
- Node.js
- Vercel (edge-light)

它同样可以在 Netlify 和其他平台上运行。
相同的代码可以在所有平台上运行。

Cloudflare Workers、Deno、Shopify 等公司发起了 [WinterCG](https://wintercg.org) 项目，旨在探讨使用 Web 标准实现"网络互操作性"的可能性。
Hono 将跟随他们的步伐，致力于成为 **Web 标准中的标准**。
