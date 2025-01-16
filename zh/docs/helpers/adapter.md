---
title: 适配器
description: 使用适配器工具类，hono可以方便地与各种平台env交互。
---

# 适配器工具类

适配器提供了一种通过统一接口与各种平台交互的无缝方式。

## 导入

```ts
import { Hono } from 'hono'
import { env, getRuntimeKey } from 'hono/adapter'
```

## `env()`

`env()` 函数可以跨不同运行时环境获取环境变量，其功能不仅限于 Cloudflare Workers 的绑定。通过 `env(c)` 获取的值可能因运行时环境而异。

```ts
import { env } from 'hono/adapter'

app.get('/env', (c) => {
  // 在 Node.js 或 Bun 中，NAME 是 process.env.NAME
  // 在 Cloudflare 中，NAME 是写在 `wrangler.toml` 中的值
  const { NAME } = env<{ NAME: string }>(c)
  return c.text(NAME)
})
```

支持的运行时、无服务器平台和云服务：

- Cloudflare Workers
  - `wrangler.toml`
- Deno
  - [`Deno.env`](https://docs.deno.com/runtime/manual/basics/env_variables)
  - `.env` 文件
- Bun
  - [`Bun.env`](https://bun.sh/guides/runtime/set-env)
  - `process.env`
- Node.js
  - `process.env`
- Vercel
  - [Vercel 上的环境变量](https://vercel.com/docs/projects/environment-variables)
- AWS Lambda
  - [AWS Lambda 上的环境变量](https://docs.aws.amazon.com/lambda/latest/dg/samples-blank.html#samples-blank-architecture)
- Lambda@Edge\
  Lambda@Edge 不[支持](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/add-origin-custom-headers.html)环境变量，需要使用 [Lamdba@Edge 事件](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-event-structure.html)作为替代方案。
- Fastly Compute\
  在 Fastly Compute 上，你可以使用 ConfigStore 来管理用户定义的数据。
- Netlify\
  在 Netlify 上，你可以使用 [Netlify Contexts](https://docs.netlify.com/site-deploys/overview/#deploy-contexts) 来管理用户定义的数据。

### 指定运行时

你可以通过传递运行时键作为第二个参数来指定获取环境变量的运行时。

```ts
app.get('/env', (c) => {
  const { NAME } = env<{ NAME: string }>(c, 'workerd')
  return c.text(NAME)
})
```

## `getRuntimeKey()`

`getRuntimeKey()` 函数返回当前运行时的标识符。

```ts
app.get('/', (c) => {
  if (getRuntimeKey() === 'workerd') {
    return c.text('你正在 Cloudflare 上运行')
  } else if (getRuntimeKey() === 'bun') {
    return c.text('你正在 Bun 上运行')
  }
  ...
})
```

### 可用的运行时键

以下是可用的运行时键，部分灵感来自 [WinterCG 的运行时键](https://runtime-keys.proposal.wintercg.org/)。未列出的运行时可能也受支持，但会被标记为 `other`：

- `workerd` - Cloudflare Workers
- `deno`
- `bun`
- `node`
- `edge-light` - Vercel Edge Functions
- `fastly` - Fastly Compute
- `other` - 其他未知的运行时键
